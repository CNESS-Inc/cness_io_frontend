// TopicModal.tsx
import { useEffect, useState } from "react";

export interface Topic {
  id: string;
  topic_name: string; // ← expected by the modal
  slug?: string;
}

export interface TopicModalProps {
  topics: Topic[];
  userSelectedTopics: Topic[];
  onSelect: (selected: string[]) => void;
  onClose?: () => void;
}

export default function TopicModal({
  topics,
  userSelectedTopics,
  onSelect,
  onClose,
}: TopicModalProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (userSelectedTopics && userSelectedTopics.length > 0) {
      setSelectedTopics(userSelectedTopics.map((t) => t.id));
    }
  }, [userSelectedTopics]);

  const handleToggle = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
    if (selectedTopics) {
      setErrorMessage("");
    }
  };

  const handleSubmit = () => {
    if (selectedTopics.length === 0) {
      setErrorMessage("Please choose atleast a topic."); // set error message
      if (onClose) onClose();
      return;
    }
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
        <p className="text-gray-600 text-center">
          What’s on your mind? Pick topics to share and explore.
        </p>
        {errorMessage && (
          <p className="text-center text-red-600 text-xs mt-1">
            {errorMessage}
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
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
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg shadow-md disabled:opacity-50"
          >
            {userSelectedTopics && userSelectedTopics.length > 0
              ? "Update"
              : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
