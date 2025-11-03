import React, { useState } from "react";
import uploadimg from "../assets/upload1.svg";
import Breadcrumb from "../components/MarketPlace/Breadcrumb";
import CategoryModel from "../components/MarketPlace/CategoryModel";
import { useNavigate } from "react-router-dom";
import { Image, SquarePen, Trash2 } from "lucide-react";

interface FormSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
}) => (
  <section className="space-y-5">
    <div>
      <h2 className="font-[poppins] font-semibold text-[18px] text-[#242E3A] mb-1">
        {title}
      </h2>
      <p className="font-['Open_Sans'] text-[14px] text-[#665B5B]">{description}</p>
    </div>
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {children}
    </div>
  </section>
);

interface InputFieldProps {
  label: string;
  placeholder: string;
  required?: boolean;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  required = false,
  type = "text",
}) => (
  <div className="flex flex-col">
    <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
    />
  </div>
);

const AddArtsForm: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Breadcrumb category navigation
  const handleSelectCategory = (category: string) => {
    const routes: Record<string, string> = {
      Video: "/dashboard/products/add-video",
      Music: "/dashboard/products/add-music",
      Course: "/dashboard/products/add-course",
      Podcasts: "/dashboard/products/add-podcast",
      Ebook: "/dashboard/products/add-ebook",
      Arts: "/dashboard/products/add-arts",
    };
    const path = routes[category];
    if (path) navigate(path);
  };

  // ---------- Upload Logic ----------
  interface ArtFile {
    id: number;
    name: string;
    tempName: string;
    progress: number;
    isEditing: boolean;
    size: number;
  }

  interface Collection {
    id: number;
    name: string;
    files: ArtFile[];
  }

  const [collections, setCollections] = useState<Collection[]>([
    { id: 1, name: "Content", files: [] },
  ]);

  // Simulate upload progress
  const simulateUpload = (collectionId: number, fileId: number) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setCollections((prev) =>
        prev.map((col) =>
          col.id === collectionId
            ? {
                ...col,
                files: col.files.map((f) =>
                  f.id === fileId ? { ...f, progress } : f
                ),
              }
            : col
        )
      );
      if (progress >= 100) clearInterval(interval);
    }, 300);
  };

  // Add files
  const handleAddFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    collectionId: number
  ) => {
    const files = Array.from(e.target.files || []);
    const MAX_SIZE = 100 * 1024 * 1024; // 100 MB limit

    const validFiles = files.filter((file) => {
      if (file.size > MAX_SIZE) {
        alert(`${file.name} exceeds 100 MB and was skipped.`);
        return false;
      }
      return true;
    });

    setCollections((prev) =>
      prev.map((col) =>
        col.id === collectionId
          ? {
              ...col,
              files: [
                ...col.files,
                ...validFiles.map((file, i) => ({
                  id: Date.now() + i,
                  name: file.name,
                  tempName: file.name,
                  size: file.size,
                  progress: 0,
                  isEditing: false,
                })),
              ],
            }
          : col
      )
    );

    validFiles.forEach((_, i) => simulateUpload(collectionId, Date.now() + i));
  };

  // Add new collection
  const handleAddCollection = () => {
    setCollections((prev) => [
      ...prev,
      { id: prev.length + 1, name: `Collection ${prev.length + 1}`, files: [] },
    ]);
  };

  const toggleEditFile = (collectionId: number, fileId: number) => {
    setCollections((prev) =>
      prev.map((col) =>
        col.id === collectionId
          ? {
              ...col,
              files: col.files.map((f) =>
                f.id === fileId ? { ...f, isEditing: !f.isEditing } : f
              ),
            }
          : col
      )
    );
  };

  const handleEditFileName = (
    collectionId: number,
    fileId: number,
    newName: string
  ) => {
    setCollections((prev) =>
      prev.map((col) =>
        col.id === collectionId
          ? {
              ...col,
              files: col.files.map((f) =>
                f.id === fileId ? { ...f, tempName: newName } : f
              ),
            }
          : col
      )
    );
  };

  const saveFileName = (collectionId: number, fileId: number) => {
    setCollections((prev) =>
      prev.map((col) =>
        col.id === collectionId
          ? {
              ...col,
              files: col.files.map((f) =>
                f.id === fileId
                  ? { ...f, name: f.tempName, isEditing: false }
                  : f
              ),
            }
          : col
      )
    );
  };

  const deleteFile = (collectionId: number, fileId: number) => {
    setCollections((prev) =>
      prev.map((col) =>
        col.id === collectionId
          ? { ...col, files: col.files.filter((f) => f.id !== fileId) }
          : col
      )
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // ---------- UI ----------
  return (
    <>
      <Breadcrumb
        onAddProductClick={() => setShowModal(true)}
        onSelectCategory={handleSelectCategory}
      />

      <div className="max-w-9xl mx-auto px-2 py-1 space-y-10">
        {/* Add Arts Section */}
        <FormSection
          title="Add Arts"
          description="Upload your digital product details, set pricing, and make it available for buyers on the marketplace."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InputField label="Product Title *" placeholder="Enter Product title" required />
            <InputField label="Price" placeholder="Enter price ($)" />
            <InputField label="Discount (%)" placeholder="Enter discount if any" />
             <div>
              <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                Mood
              </label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-[#242E3A] focus:outline-none focus:ring-2 focus:ring-[#7077FE] focus:border-transparent cursor-pointer">
                <option>Calm</option>
                <option>Energetic</option>
                <option>Inspiring</option>
                <option>Romantic</option>
              </select>
            </div>
          </div>
          
        </FormSection>

        {/* Details Section */}
        <FormSection title="Details" description="">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label className="block font-semibold text-[16px] text-[#242E3A] mb-2">
                OverView
              </label>
              <textarea
                placeholder="Write about your artwork, inspiration, and techniques"
                className="w-full h-32 px-3 py-2 border border-gray-200 rounded-md resize-none focus:ring-2 focus:ring-[#7077FE]"
              />

              
            </div>
             <div>
              <label className="block font-semibold text-[16px] text-[#242E3A] mb-2">
                Highlights
              </label>
              <textarea
                placeholder="What will students learn from this course?"
                className="w-full h-32 px-3 py-2 border border-gray-200 rounded-md resize-none focus:ring-2 focus:ring-[#7077FE]"
              />
            </div>

            <InputField label="Theme" placeholder="Describe the art Theme" />
            <InputField label="Medium" placeholder="Describe the art creation mediums like oils, digital tools" />
            <InputField label="Image Size" placeholder="Enter size or resolution" />
            <InputField label="Modern Trends" placeholder="Enter your art trends" />

           
          </div>
        </FormSection>

        {/* Upload Section */}
        <FormSection title="Uploads" description="">
          <div className="space-y-6">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
              >
                <h3 className="text-[16px] font-semibold text-[#242E3A] mb-2">
                  {collection.name}
                </h3>
                <p className="text-sm text-[#665B5B] mb-4">
                  Upload your artwork files
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Upload Area */}
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#CBD5E1] rounded-lg h-40 cursor-pointer hover:border-[#7077FE] transition-all bg-[#EEF3FF]">
                    <input
                      type="file"
                      accept="image/*,.zip"
                      className="hidden"
                      onChange={(e) => handleAddFile(e, collection.id)}
                      multiple
                    />
                    <div className="text-center space-y-2">
                      <div className="w-10 h-10 mx-auto rounded-full bg-[#7077FE]/10 flex items-center justify-center text-[#7077FE]">
                        <img src={uploadimg} alt="Upload" className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-[poppins] text-[#242E3A]">
                        Drag & drop or click to upload
                      </p>
                      <p className="text-xs text-[#665B5B]">
                        JPG, PNG, SVG, WEBP, ZIP (max 100 MB each)
                      </p>
                    </div>
                  </label>

                  {/* Uploaded Files */}
                  <div className="space-y-3">
                    {collection.files.length === 0 ? (
                      <div className="text-sm text-gray-500 border border-gray-100 rounded-lg p-4 bg-gray-50">
                        No files uploaded yet
                      </div>
                    ) : (
                      collection.files.map((file) => (
                        <div
                          key={file.id}
                          className="border border-gray-200 rounded-lg p-3 bg-white"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Image className="w-5 h-5 text-[#242E3A] " />
                              {file.isEditing ? (
                                <input
                                  type="text"
                                  value={file.tempName}
                                  onChange={(e) =>
                                    handleEditFileName(
                                      collection.id,
                                      file.id,
                                      e.target.value
                                    )
                                  }
                                  className="border border-gray-300 rounded-md px-2 py-[2px] text-sm"
                                />
                              ) : (
                                <p className="text-sm font-medium text-[#242E3A]">
                                  {file.name}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              {file.isEditing ? (
                                <button
                                  onClick={() => saveFileName(collection.id, file.id)}
                                  className="text-[#7077FE] text-sm font-semibold"
                                >
                                  Save
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() => toggleEditFile(collection.id, file.id)}
                                    className="text-gray-500 hover:text-[#7077FE]"
                                  >
                                    <SquarePen className="w-4 h-4" stroke="black" />
                                  </button>
                                  <button
                                    onClick={() => deleteFile(collection.id, file.id)}
                                    className="text-gray-500 hover:text-red-500"
                                  >
                                    <Trash2 className="w-4 h-4" stroke="black" />
                                  </button>
                                </>
                              )}
                              <input
                                type="checkbox"
                                checked={file.progress === 100}
                                readOnly
                                className="accent-[#7077FE]"
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>{formatFileSize(file.size)}</span>
                            <span>{file.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[#7077FE] h-2 rounded-full"
                              style={{ width: `${file.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Add Collection Button */}
            <button
              onClick={handleAddCollection}
              className="w-full border-2 border-dashed border-[#CBD5E1] rounded-lg py-4 text-[#7077FE] font-medium hover:border-[#7077FE] transition-all"
            >
              + Add Collection
            </button>
          </div>
        </FormSection>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button className="px-5 py-3 text-[#7077FE] rounded-lg font-medium hover:text-blue-500 transition">
            Discard
          </button>
          <button className="px-5 py-3 bg-white text-[#7077FE] border border-[#7077FE] rounded-lg font-medium hover:bg-gray-300 transition">
            Preview
          </button>
          <button className="px-5 py-3 bg-[#7077FE] text-white rounded-lg font-medium hover:bg-[#5a60ea] transition">
            Submit
          </button>
        </div>
      </div>

      {showModal && (
        <CategoryModel
          open={showModal}
          onClose={() => setShowModal(false)}
          onSelect={handleSelectCategory}
        />
      )}
    </>
  );
};

export default AddArtsForm;
