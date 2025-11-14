import React, { useState } from "react";
import { ChevronDown, ChevronUp, Play, Music, CheckCircle } from "lucide-react";

interface FileItem {
  file_id: string;
  title: string;
  file_type: "audio" | "video" | "pdf" | "image";
  file_url: string;
  duration?: string;
  format?: string;
  is_free: boolean;
  progress: any;
}

interface ContentItem {
  content_id: string;
  title: string;
  content_type: string;
  description?: string;
  order_number: number;
  duration?: string;
  is_free: boolean;
  files: FileItem[];
}

interface ContentListProps {
  contents: ContentItem[];
  onTrackSelect: (file: FileItem, content: ContentItem) => void;
  activeFileId?: string;
  productProgress?: any;
}

const ContentList: React.FC<ContentListProps> = ({
  contents,
  onTrackSelect,
  activeFileId,
  productProgress,
}) => {
  const [openChapter, setOpenChapter] = useState<number>(0);

  const getProgressForFile = (fileId: string) => {
    if (!productProgress?.content_progress) return null;
    return productProgress.content_progress.find(
      (p: any) => p.file_id === fileId
    );
  };

  return (
    <aside className="bg-white rounded-xl border border-slate-200 lg:sticky lg:top-4 h-max">
      <div className="space-y-2">
        <div className="bg-gray-100 px-3 py-2 rounded-md">
          <h3 className="text-[20px] font-[Poppins] p-4 font-semibold">
            Course Content
          </h3>
        </div>

        {contents.map((content, index) => {
          const isOpen = openChapter === index;
          const totalFiles = content.files.length;

          return (
            <div
              key={content.content_id}
              className="border border-slate-200 rounded-lg overflow-hidden mb-2"
            >
              <button
                className="w-full flex items-center justify-between px-4 py-3 focus:outline-none bg-white hover:bg-gray-50 transition"
                onClick={() => setOpenChapter(isOpen ? -1 : index)}
              >
                <div>
                  <div className="text-[15px] font-[Poppins] font-medium text-slate-800">
                    {content.title}
                  </div>
                  <div className="text-[12px] font-[Poppins] text-slate-500">
                    {totalFiles} {totalFiles === 1 ? "Track" : "Tracks"}
                    {content.duration && ` • ${content.duration}`}
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {isOpen && content.files.length > 0 && (
                <div className="bg-slate-50 px-2 pb-3 space-y-1">
                  {content.files.map((file) => {
                    const isActive = activeFileId === file.file_id;
                    const progress = getProgressForFile(file.file_id);
                    const isCompleted = progress?.is_completed;
                    const progressPercentage = progress?.progress_percentage || 0;

                    return (
                      <div
                        key={file.file_id}
                        onClick={() => onTrackSelect(file, content)}
                        className={`flex gap-3 items-center p-2 rounded-lg cursor-pointer border-l-4 transition-all ${
                          isActive
                            ? "bg-violet-100 border-violet-500"
                            : "border-transparent hover:bg-slate-100"
                        }`}
                      >
                        <span className="text-[16px] text-slate-400">
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : isActive ? (
                            <Play className="w-5 h-5 text-violet-600 fill-violet-600" />
                          ) : (
                            <Music className="w-5 h-5" />
                          )}
                        </span>
                        <div className="flex-1">
                          <div
                            className={`text-[13px] font-medium leading-5 ${
                              isActive
                                ? "text-violet-800"
                                : "text-slate-800"
                            }`}
                          >
                            {file.title}
                          </div>
                          {progressPercentage > 0 && !isCompleted && (
                            <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                              <div
                                className="bg-violet-500 h-1 rounded-full transition-all"
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                          )}
                        </div>
                        {file.duration && (
                          <span className="text-[12px] text-slate-400">
                            {file.duration}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default ContentList;