// TopicModal.tsx
import { useState } from "react";

export interface Topic {
  id: string;
  topic_name: string;   // ← expected by the modal
  slug?: string;
}

export interface TopicModalProps {
  topics: Topic[];
  onSelect: (selected: string[]) => void;
  onClose?: () => void;
}

export default function TopicModal({ topics, onSelect, onClose }: TopicModalProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const handleToggle = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    onSelect(selectedTopics);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-lg p-6 relative">
        {/* Close (X) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl leading-none"
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold text-center mb-3 text-purple-700">
          Choose Your Conscious Topics
        </h2>
        <p className="text-gray-600 text-center mb-6">
         What’s on your mind? Pick topics to share and explore.
        </p>

        <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleToggle(topic.id)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
                selectedTopics.includes(topic.id)
                  ? "bg-purple-600 text-white border-purple-600"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {topic.topic_name}
            </button>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            disabled={selectedTopics.length === 0}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg shadow-md disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
