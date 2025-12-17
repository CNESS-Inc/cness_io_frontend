import React, { useState, useRef,forwardRef, useImperativeHandle } from "react";
import { X, HelpCircle } from "lucide-react";
import uploadimg from "../../assets/upload1.svg";
import { useToast } from "../ui/Toast/ToastProvider";
import { UploadProductDocument } from "../../Common/ServerAPI";
import { UploadArtSampleImage } from "../../Common/ServerAPI";

interface SampleTrackUploadProps {
    productType: "video" | "music" | "course" | "podcast" | "ebook" | "art";
    onUploadSuccess: (sampleId: string, sampleUrl: string, sampleThumbnail?: string) => void;
    onRemove: () => void;
    onDonationChange?:(value:boolean)=> void;
    defaultValue?: string;
    error?: string;
  
}

const SampleTrackUpload = forwardRef<unknown, SampleTrackUploadProps>((
    { productType, onUploadSuccess, onRemove,onDonationChange, defaultValue, error },
    ref
) => {
    const { showToast } = useToast();
    const [uploadedFile, setUploadedFile] = useState<string | null>(defaultValue || null);
    const [isUploading, setIsUploading] = useState(false);
    const [showDonateModal, setShowDonateModal] = useState(false);
    const [showAriomeModal, setShowAriomeModal] = useState(false);
    const [isDonated, setIsDonated] = useState(false);
    const fileRef = useRef<HTMLInputElement | null>(null);
   useImperativeHandle(ref, () => ({
        openPicker: () => {
            fileRef.current?.click();
        }
    }));
  const getAcceptTypes = () => {
    switch (productType) {
        case "course":
            return "video/*";
        case "music":
        case "podcast":
            return "audio/*";
        case "art":
            return "image/*"; 
        default:
            return "*";
    }
};


    const getFileTypeName = () => {
        switch (productType) {
            case "music":
                return "audio";
            case "podcast":
                return "audio";
            default:
                return "file";
        }
    };

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
        showToast({
            message: "Sample file size should be less than 50MB",
            type: "error",
            duration: 3000,
        });
        return;
    }

    setIsUploading(true);

    try {
        let fd = new FormData();
        let apiKey = "";
        let sampleUrl = "";

        // 🎨 ART SAMPLE
        if (productType === "art") {
            fd.append("sample_image", file);

            const res = await UploadArtSampleImage(fd);
            sampleUrl = res?.data?.data?.sample_image_url;

            onUploadSuccess(sampleUrl, sampleUrl, sampleUrl);
            setUploadedFile(file.name);

            showToast({ message: "Sample image uploaded!", type: "success" });
            return;
        }

        // 🎥 VIDEO / COURSE SAMPLE
        if (productType === "video" || productType === "course") {
            fd.append("sample_video", file);
            apiKey = "video-sample";

            const res = await UploadProductDocument(apiKey, fd);
            sampleUrl = res?.data?.data?.sample_video_url;

            onUploadSuccess(sampleUrl, sampleUrl, sampleUrl);
            setUploadedFile(file.name);

            showToast({ message: "Sample video uploaded!", type: "success" });
            return;
        }

        // 🎵 MUSIC / PODCAST SAMPLE (audio)
        if (productType === "music") {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
        const fd = new FormData();
        fd.append("sample_track", file);

        const res = await UploadProductDocument("sample-track", fd);

        onUploadSuccess(
            res?.data?.data?.sample_track_public_id,   // public id
            res?.data?.data?.sample_track_url,         // url
            file.name
        );
    }

    setUploadedFile(`${files.length} files uploaded`);
    showToast({ message: "Sample audio uploaded!", type: "success" });
    setIsUploading(false);
    return;
}

    } catch (error) {
        showToast({
            message: "Failed to upload sample",
            type: "error",
            duration: 3000,
        });
    } finally {
        setIsUploading(false);
        if (fileRef.current) fileRef.current.value = "";
    }
};
  const handleRemove = () => {
  setUploadedFile(null);
  setIsDonated(false);
  onDonationChange?.(false);  // ⭐ send reset to parent
  onRemove();
  if (fileRef.current) fileRef.current.value = "";
};

    const handleDonate = () => {
        if (!uploadedFile) {
            showToast({
                message: "Please upload a sample track first",
                type: "error",
                duration: 2000,
            });
            return;
        }
        setShowDonateModal(true);
    };

  const confirmDonation = () => {
  setIsDonated(true);
  onDonationChange?.(true);  
  setShowDonateModal(false);

  showToast({
    message: "Thank you for your generous contribution! 💙",
    type: "success",
    duration: 4000,
  });
};
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A]">
                    Sample File (Optional)
                </label>
            </div>

            <div
                onClick={() => !isUploading && fileRef.current?.click()}
                className={`relative rounded-lg p-6 text-center cursor-pointer transition-all ${error ? "bg-red-50" : "bg-[#F9FAFB] hover:bg-[#EEF3FF]"
                    } ${isUploading ? "pointer-events-none opacity-70" : ""}`}
            >
                <svg className="absolute top-0 left-0 w-full h-full rounded-lg pointer-events-none">
                    <rect
                        x="1"
                        y="1"
                        width="calc(100% - 2px)"
                        height="calc(100% - 2px)"
                        rx="12"
                        ry="12"
                        stroke={error ? "#EF4444" : "#CBD5E1"}
                        strokeWidth="2"
                        strokeDasharray="6,6"
                        fill="none"
                    />
                </svg>

     <input
  ref={fileRef}
  type="file"
  accept={getAcceptTypes()}
  onChange={handleFileChange}
  className="hidden"
  disabled={isUploading}
  multiple={productType === "music"}   
/>

                {uploadedFile ? (
                    <div className="relative">
                        <div className="flex items-center justify-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                            <svg
                                className="w-8 h-8 text-green-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-sm text-gray-700 truncate max-w-xs">
                                {uploadedFile}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove();
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <img src={uploadimg} alt="upload" className="w-10 h-10 mt-6" />
                        {isUploading ? (
                            <div className="flex flex-col items-center space-y-2">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7077FE]"></div>
                                <p className="font-[poppins] text-[16px] text-[#7077FE]">
                                    Uploading...
                                </p>
                            </div>
                        ) : (
                            <>
                                <p className="font-[poppins] text-[16px] text-[#242E3A]">
                                    Drag & drop or click to upload sample {getFileTypeName()}
                                </p>
                                <p className="text-xs text-gray-500">Max size: 50MB</p>
                            </>
                        )}
                    </div>
                )}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {uploadedFile && (
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleDonate}
                            disabled={isDonated}
                            className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${isDonated
                                ? "bg-green-50 text-green-700 border-2 border-green-200 cursor-not-allowed"
                                : "bg-linear-to-r from-[#7077FE] to-[#5E65F6] text-white hover:shadow-lg"
                                }`}
                        >
                            {isDonated ? (
                                <>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Donated to Ariome ✨
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                    Donate Sample Track to Ariome
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowAriomeModal(true)}
                            className="px-4 py-3 border-2 border-[#7077FE] text-[#7077FE] hover:bg-[#7077FE] hover:text-white rounded-lg transition-all flex items-center gap-2 font-medium whitespace-nowrap"
                            title="Learn about Ariome"
                        >
                            <HelpCircle className="w-5 h-5" />
                            What is Ariome?
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 font-['Open_Sans'] text-center">
                        Upload a sample preview so buyers can experience your {productType} before purchasing. This helps increase sales!
                    </p>
                </div>
            )}

            {showDonateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowDonateModal(false)}
                    ></div>
                    <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-linear-to-r from-[#7077FE] to-[#5E65F6] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="font-['Poppins'] font-bold text-[20px] text-[#242E3A] mb-2">
                                Thank You for Your Generosity! 🎉
                            </h3>
                            <p className="text-gray-600 font-['Open_Sans'] text-[14px] mb-6">
                                Your sample track will be donated to Ariome, helping us create a
                                better community. Your contribution makes a real difference!
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDonateModal(false)}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDonation}
                                    className="flex-1 px-4 py-2.5 bg-linear-to-r from-[#7077FE] to-[#5E65F6] text-white rounded-lg hover:shadow-lg transition"
                                >
                                    Confirm Donation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showAriomeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowAriomeModal(false)}
                    ></div>
                    <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="font-['Poppins'] font-bold text-[20px] text-[#242E3A]">
                                What is Ariome?
                            </h3>
                            <button
                                onClick={() => setShowAriomeModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-full transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <p className="text-gray-700 font-['Open_Sans'] text-[14px] leading-relaxed">
                                <strong>Ariome</strong> is our community-driven initiative that
                                supports emerging creators and provides free educational content to
                                those who need it most.
                            </p>
                            <div className="bg-blue-50 border-l-4 border-[#7077FE] p-4 rounded">
                                <p className="text-sm text-gray-700 font-['Open_Sans']">
                                    When you donate your sample track, it becomes part of our free
                                    resource library, helping students, aspiring creators, and
                                    communities worldwide access quality content.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold text-[#242E3A] font-['Poppins']">
                                    Benefits of Donating:
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-700 font-['Open_Sans']">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#7077FE] mt-1">✓</span>
                                        <span>Increase your visibility and reach</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#7077FE] mt-1">✓</span>
                                        <span>Build your reputation as a community contributor</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#7077FE] mt-1">✓</span>
                                        <span>Earn special Karma Credits and badges</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#7077FE] mt-1">✓</span>
                                        <span>Help democratize access to quality content</span>
                                    </li>
                                </ul>
                            </div>
                            <button
                                onClick={() => setShowAriomeModal(false)}
                                className="w-full px-4 py-2.5 bg-linear-to-r from-[#7077FE] to-[#5E65F6] text-white rounded-lg hover:shadow-lg transition"
                            >
                                Got It!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});;

export default SampleTrackUpload;