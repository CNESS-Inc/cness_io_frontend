import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import Button from "./Button";

interface CropProps {
  imageSrc: string;
  type: "banner" | "profile";
  onClose: () => void;
  onSave: (blob: Blob, previewUrl: string) => void;
}

interface CroppedArea {
  width: number;
  height: number;
  x: number;
  y: number;
}

const LinkedInCropper: React.FC<CropProps> = ({
  imageSrc,
  type,
  onClose,
  onSave,
}) => {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedPixels, setCroppedPixels] = useState<CroppedArea | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_: unknown, area: CroppedArea) => {
    setCroppedPixels(area);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
    });

  const saveCropped = async () => {
    if (!croppedPixels) return;

    setSaving(true);

    const img = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = croppedPixels.width;
    canvas.height = croppedPixels.height;

    ctx.drawImage(
      img,
      croppedPixels.x,
      croppedPixels.y,
      croppedPixels.width,
      croppedPixels.height,
      0,
      0,
      croppedPixels.width,
      croppedPixels.height
    );

    canvas.toBlob((blob) => {
      if (!blob) return;
      const preview = URL.createObjectURL(blob);
      onSave(blob, preview);
      setSaving(false);
    }, "image/jpeg");
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-99999 animate-fadeIn">
      <div className="bg-white rounded-xl overflow-hidden w-[90%] md:w-[600px] shadow-2xl border border-gray-200">

        {/* Crop area */}
        <div className="relative h-[360px] sm:h-[420px] bg-black/40 backdrop-blur-lg">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={type === "banner" ? 3.75 : 1}
            cropShape={type === "profile" ? "round" : "rect"}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            showGrid={false}
          />

          {/* Circular frame for profile */}
          {type === "profile" && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="w-[60%] h-[60%] rounded-full border-[3px] border-white/40"></div>
            </div>
          )}
        </div>

        {/* Bottom Panel */}
        <div className="px-6 py-4 border-t bg-white">
          <p className="text-sm font-medium mb-2 text-gray-700">Zoom</p>

          {/* Slider */}
          <input
            type="range"
            min={1}
            max={4}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer"
          />

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="white-outline"
              className="w-[104px] h-[39px] rounded-[100px] text-[12px] font-medium flex items-center justify-center border border-[#CBD0DC] text-[#54575C] hover:bg-gray-50"
            >
              Close
            </Button>
            <Button
              type="submit"
              variant="gradient-primary"
              className="w-[104px] h-[39px] rounded-[100px] text-[12px] font-medium flex items-center justify-center"
              disabled={saving}
              onClick={saveCropped}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

      </div>

      {/* Animation CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LinkedInCropper;
