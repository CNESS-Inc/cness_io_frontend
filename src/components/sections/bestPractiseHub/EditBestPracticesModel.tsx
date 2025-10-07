import cloud from "../../../assets/cloud-add.svg";
import Button from "../../ui/Button";
import { useToast } from "../../ui/Toast/ToastProvider";

interface EditBestPracticeModalProps {
  open: boolean;
  onClose: () => void;
  currentPractice: any;
  setCurrentPractice: (value: any) => void;
  profession: Array<{ id: string; title: string }>;
  interest: Array<{ id: string; name: string }>;
  tags: string[];
  editInputValue: string;
  setEditInputValue: React.Dispatch<React.SetStateAction<string>>;
  removeTag: (idx: number) => void;
  handleTagKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}

export default function EditBestPracticeModal({
  open,
  onClose,
  currentPractice,
  setCurrentPractice,
  profession,
  interest,
  tags,
  editInputValue,
  setEditInputValue,
  removeTag,
  handleTagKeyDown,
  handleSubmit,
  isSubmitting,
}: EditBestPracticeModalProps) {
  const { showToast } = useToast();

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      e.target.value = '';

      showToast?.({
        message: "Please select only JPG, JPEG or PNG files.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    setCurrentPractice({
      ...currentPractice,
      file: file,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative z-10 w-full max-w-3xl bg-white rounded-[25px] shadow-lg px-[45px] py-[30px] max-h-[95vh] overflow-y-auto scrollbar-hide">
        {/* Close Button */}
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-1/2 right-0 -translate-y-1/2 text-2xl text-[#9EA8B6] hover:text-gray-800"
          >
            ✕
          </button>
          <h2 className="text-2xl font-medium text-[32px] text-center mb-6">
            Edit Best Practice
          </h2>
        </div>

        {/* Upload Section */}
        <div className="mt-2 text-center py-6 px-4 rounded-[26px] border-2 border-[#CBD0DC] border-dashed flex flex-col items-center justify-center cursor-pointer mb-6">
          <div className="pb-4 flex flex-col items-center">
            <img src={cloud} alt="Upload" className="w-12" />
            <h4 className="pt-2 text-base font-medium text-[#292D32]">
              Change your image <span className="text-red-600">*</span>
            </h4>
            <h4 className="pt-2 font-normal text-sm text-[#A9ACB4]">
              JPEG, PNG formats, up to 2MB
            </h4>
          </div>

          <div>
            <input
              type="file"
              id="editUploadFile"
              className="hidden"
              accept="image/*"
              onChange={handleEditFileChange}
            />
            <label
              htmlFor="editUploadFile"
              className="block px-[33px] py-4 rounded-full text-[#54575C] text-base tracking-wider font-medium border border-[#CBD0DC] outline-none cursor-pointer"
            >
              Browse Files
            </label>
            {currentPractice?.file && (
              <p className="mt-2 text-sm text-gray-700 break-all">
                Selected:{" "}
                {typeof currentPractice.file === "string"
                  ? currentPractice.file.split("/").pop()
                  : currentPractice.file.name}
              </p>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="flex flex-col gap-[5px]">
              <label
                htmlFor="title"
                className="block text-[15px] font-normal text-black"
              >
                Title of Best Practice <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={currentPractice?.title || ""}
                onChange={(e) =>
                  setCurrentPractice({
                    ...currentPractice,
                    title: e.target.value,
                  })
                }
                placeholder="Enter Title"
                className="w-full px-[10px] py-3 border border-[#CBD0DC] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder:text-[#6E7179] placeholder:text-xs placeholder:font-normal"
                required
              />
            </div>

            {/* Category (Interest) */}
            <div className="flex flex-col gap-[5px]">
              <label
                htmlFor="interest"
                className="block text-[15px] font-normal text-black"
              >
                Interest
              </label>
              <select
                id="interest"
                // value={currentPractice?.interest || ""}
                value={currentPractice?.interest || ""}
                onChange={(e) =>
                  setCurrentPractice({
                    ...currentPractice,
                    interest: e.target.value,
                  })
                }
                className={`w-full px-[10px] py-3 border border-[#CBD0DC] rounded-[4px] focus:outline-none 
                focus:ring-2 focus:ring-indigo-500 text-sm font-normal
                ${currentPractice?.interest ? "text-black" : "text-[#6E7179]"}`}
              >
                <option value="">Select your Interest</option>
                {interest.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Profession */}
            {/* Profession */}
            <div className="flex flex-col gap-[5px]">
              <label
                htmlFor="profession"
                className="block text-[15px] font-normal text-black"
              >
                Profession
              </label>

              <div className="relative">
                <select
                  id="profession"
                  value={currentPractice?.profession_data?.id || ""}
                  onChange={(e) =>
                    setCurrentPractice({
                      ...currentPractice,
                      profession: e.target.value,
                    })
                  }
                  className={`w-full appearance-none px-[10px] py-3 border border-[#CBD0DC] rounded-[4px] focus:outline-none 
         focus:ring-2 focus:ring-indigo-500 text-sm font-normal
         ${currentPractice?.profession_data ? "text-black" : "text-[#6E7179]"}`}
                >
                  <option value="">Select your Profession</option>
                  {profession.map((prof) => (
                    <option key={prof.id} value={prof.id}>
                      {prof.title}
                    </option>
                  ))}
                </select>

                {/* custom arrow to match design and keep select box height */}
                <svg
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E7179]"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M6 8l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-[5px]">
              <label
                htmlFor="tags"
                className="block text-[15px] font-normal text-black"
              >
                Tags
              </label>
              <div className="w-full border border-gray-300 bg-white px-3 py-2">
                <div className="flex flex-wrap gap-2 mb-1">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="flex items-center bg-[#f3f1ff] text-[#6269FF] px-3 py-1 rounded-full text-[13px]"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(idx)}
                        className="ml-1 text-[#6269FF] hover:text-red-500 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  id="tags"
                  type="text"
                  className="w-full text-sm bg-white focus:outline-none placeholder-gray-400"
                  placeholder="Add tags (e.g. therapy, online, free-consult)"
                  value={editInputValue}
                  onChange={(e) => setEditInputValue(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
              </div>
            </div>
          </div>

          {/* Objective / Purpose */}
          <div className="flex flex-col gap-[5px]">
            <label
              htmlFor="objective"
              className="block text-[15px] font-normal text-black"
            >
              Objective / Purpose
            </label>
            <textarea
              id="objective"
              rows={3}
              value={currentPractice?.objective || ""}
              onChange={(e) =>
                setCurrentPractice({
                  ...currentPractice,
                  objective: e.target.value,
                })
              }
              className="w-full px-[10px] py-3 border border-[#CBD0DC] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder:text-[#6E7179] placeholder:text-xs placeholder:font-normal"
              placeholder="Add Notes..."
            ></textarea>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-[5px]">
            <label
              htmlFor="description"
              className="block text-[15px] font-normal text-black"
            >
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              id="description"
              rows={3}
              value={currentPractice?.description || ""}
              onChange={(e) =>
                setCurrentPractice({
                  ...currentPractice,
                  description: e.target.value,
                })
              }
              required
              className="w-full px-[10px] py-3 border border-[#CBD0DC] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder:text-[#6E7179] placeholder:text-xs placeholder:font-normal"
              placeholder="Add Notes..."
            ></textarea>
          </div>

          {/* Submit */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              variant="gradient-primary"
              className="w-[104px] h-[39px] rounded-[100px] p-0 font-['Plus Jakarta Sans'] font-medium text-[12px] leading-none flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
