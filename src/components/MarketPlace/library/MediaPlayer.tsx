import React from "react";
import { Maximize } from "lucide-react";

interface MediaPlayerProps {
  type: "video" | "audio" | "image" | "pdf";
  url: string;
  thumbnail?: string;
  title: string;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({
  type,
  url,
  thumbnail,
  title,
}) => {

  const renderPlayer = () => {
    switch (type) {
      case "video":
        return (
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            <video
              src={url}
              poster={thumbnail}
              controls
              className="w-full h-full"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );

      case "audio":
        return (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={thumbnail || "https://via.placeholder.com/100"}
                alt={title}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
                <p className="text-sm text-gray-600">Now Playing</p>
              </div>
            </div>
            <audio src={url} controls className="w-full">
              Your browser does not support the audio tag.
            </audio>
          </div>
        );

      case "image":
        return (
          <div className="relative w-full rounded-lg overflow-hidden">
            <img
              src={url}
              alt={title}
              className="w-full h-auto object-contain max-h-[600px]"
            />
          </div>
        );

      case "pdf":
        return (
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
              <p className="text-sm text-gray-600 mb-4">PDF Document</p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#7077FE] text-white rounded-lg hover:bg-[#5E65F6] transition"
              >
                <Maximize size={16} />
                Open in New Tab
              </a>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="w-full">{renderPlayer()}</div>;
};

export default MediaPlayer;