import React, { useState } from "react";
import DashboardLayout from "../layout/Dashboard/dashboardlayout";
import Button from "../components/ui/Button";

interface Section {
  name: string;
  checkboxes: string[];
  purposePauseQuestions: string[];
  bestPracticePrompt: string;
  suggestedUploads: { label: string; acceptedTypes: string }[];
}

const sections: Section[] = [
  {
    name: "Mission & Vision",
    checkboxes: [
      "Our mission is clearly defined and grounded in values.",
      "We revisit and refine our mission as our work evolves.",
      "Our communications reflect our mission and purpose consistently.",
      "We envision greater good in all that we do.",
      "Our mission and vision is foundations for the very long term",
      "We are inspired by our vision and mission in our daily and strategic thinking and action.",
    ],
    purposePauseQuestions: [
      "Your mission and vision statement",
      "What inspires your mission & vision?",
      "What do you do?",
      "What makes what you do exemplary?",
    ],
    bestPracticePrompt:
      "In alignment with your mission and vision, what are your best practice/s and your organization goals?",
    suggestedUploads: [
      {
        label: "Mission statement document",
        acceptedTypes: ".pdf,.doc,.docx,.jpg,.png,.jpeg",
      },
      {
        label: "Screenshot of website or social post featuring your values",
        acceptedTypes: ".jpg,.png,.jpeg",
      },
    ],
  },
  {
    name: "Team Spirit",
    checkboxes: [
      "We promote and safeguard all our team’s wellbeing and health care with health insurance cover.",
      "We inspire learning, growth and greater potentials for all our team members.",
      "We work together as family",
      "We are inclusive and merit based.",
      "We prioritize strategies, innovation and decision making together as team",
      "We recognize each other in our unique strength and capabilities to work together.",
    ],
    purposePauseQuestions: [
      "Why is your organization the ideal workplace?",
      "How do you foster the culture of team strategy, dynamic action and innovation?",
    ],
    bestPracticePrompt:
      "What are your best practices for your winning team spirit?",
    suggestedUploads: [
      { label: "Internal values slide", acceptedTypes: ".pdf,.doc,.jpg,.png" },
      {
        label: "Team retreat or wellness initiative photo",
        acceptedTypes: ".jpg,.png",
      },
    ],
  },
  {
    name: "Client / Customer / Consumer",
    checkboxes: [
      "Our customers/clients are satisfied and are repeat",
      "We pride in our customer service.",
      "We are recommended to others by our customers/ clients",
      "We are guided by the needs, requests and suggestions by our customers/ clients",
      "We treat our customers/ clients as our partners",
    ],
    purposePauseQuestions: [
      "What features of value do customers/ clients see in you?",
      "What is your message to your potential and current customers/ clients?",
    ],
    bestPracticePrompt:
      "What are your best practices that is valued by your customers/ clients?",
    suggestedUploads: [
      {
        label: "Pricing or service explainer",
        acceptedTypes: ".pdf,.jpg,.png,.doc",
      },
      { label: "Client feedback or review", acceptedTypes: ".jpg,.png,.pdf" },
    ],
  },
  {
    name: "Communities & Charities",
    checkboxes: [
      "Our daily operations is mindful and uplifting to all parties engaging with us.",
      "We donate a portion of our sales/ profit for charities and conscious causes.",
      "We engage with local and global community to promote conscious needs and causes.",
    ],
    purposePauseQuestions: [
      "How does your organization give back or create impact outside of business goals?",
    ],
    bestPracticePrompt:
      "Describe one best practice for a cause or community you've meaningfully supported.",
    suggestedUploads: [
      {
        label: "Photo of a collaboration or event",
        acceptedTypes: ".jpg,.png",
      },
      {
        label: "Donation screenshot or partner mention",
        acceptedTypes: ".jpg,.png,.pdf",
      },
    ],
  },
  {
    name: "Vision & Legacy – Long-Term Contribution",
    checkboxes: [
      "We are building a legacy each day in intent, operations and planning",
      "Our legacy uplifts everyone engaging with us- from our team, suppliers/ vendors, customers/clients and all associated with us.",
      "Our legacy will leave a better world for future generations",
      "Our success is from the values we create for all",
    ],
    purposePauseQuestions: [
      "What legacy would you like to be known as?",
      "What is are your dreams for humanity?",
    ],
    bestPracticePrompt:
      "Describe your higher purpose in what you do as the legacy you are creating?",
    suggestedUploads: [
      { label: "Vision statement", acceptedTypes: ".pdf,.doc" },
      {
        label: "Example of a system or cultural shift initiated by your work",
        acceptedTypes: ".pdf,.doc,.jpg",
      },
    ],
  },
  {
    name: "Leadership Best Practices",
    checkboxes: [
      "Our conscious leadership inspires all to be a greater version of themselves",
      "We are the change and transformation of our industry",
      "We lead by human values",
      "Our leadership inspires other organizations",
      "We collaborate, strategize and partner with other conscious organizations",
    ],
    purposePauseQuestions: [
      "What is your aspiration as a leader?",
      "Please quote your leadership wisdom!",
    ],
    bestPracticePrompt:
      "What are your leadership best practices that depict your organization/s?",
    suggestedUploads: [
      { label: "Blog or social post", acceptedTypes: ".pdf,.jpg,.png" },
      {
        label: "Panel event screenshot or internal leadership guide",
        acceptedTypes: ".pdf,.jpg,.png",
      },
    ],
  },
];

interface FormValues {
  checkboxes: boolean[];
  purposePauseAnswers: string[];
  bestPracticeAnswer: string;
  uploads: (File | null)[];
  referenceLink: string;
}

const AssessmentQuestion: React.FC = () => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [toggles, setToggles] = useState<boolean[]>(
    Array(sections.length).fill(true)
  );
  const [formData, setFormData] = useState<FormValues[]>(
    sections.map(section => ({
      checkboxes: Array(section.checkboxes.length).fill(false),
      purposePauseAnswers: Array(section.purposePauseQuestions.length).fill(""),
      bestPracticeAnswer: "",
      uploads: Array(section.suggestedUploads.length).fill(null),
      referenceLink: ""
    }))
  );
  console.log("🚀 ~ formData:", formData)

  const handleToggleChange = (index: number) => {
    setToggles((prev) => {
      const newToggles = [...prev];
      newToggles[index] = !newToggles[index];
      return newToggles;
    });
  };

  const handleCheckboxChange = (sectionIndex: number, checkboxIndex: number, checked: boolean) => {
    setFormData(prev => {
      const newData = [...prev];
      newData[sectionIndex].checkboxes[checkboxIndex] = checked;
      return newData;
    });
  };

  const handlePurposePauseChange = (sectionIndex: number, questionIndex: number, value: string) => {
    setFormData(prev => {
      const newData = [...prev];
      newData[sectionIndex].purposePauseAnswers[questionIndex] = value;
      return newData;
    });
  };

  const handleBestPracticeChange = (sectionIndex: number, value: string) => {
    setFormData(prev => {
      const newData = [...prev];
      newData[sectionIndex].bestPracticeAnswer = value;
      return newData;
    });
  };

  const handleFileUpload = (sectionIndex: number, uploadIndex: number, file: File | null) => {
    setFormData(prev => {
      const newData = [...prev];
      newData[sectionIndex].uploads[uploadIndex] = file;
      return newData;
    });
  };

  const handleReferenceLinkChange = (sectionIndex: number, value: string) => {
    setFormData(prev => {
      const newData = [...prev];
      newData[sectionIndex].referenceLink = value;
      return newData;
    });
  };

  const handleNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
    console.log("Current form data:", formData);
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const section = sections[currentSectionIndex];
  const currentSectionData = formData[currentSectionIndex];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-10">
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <h2 className="text-2xl font-bold mb-4">{section.name}</h2>
          <div className="space-y-2 mb-6">
            {section.checkboxes.map((label, i) => (
              <label key={i} className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  className="mt-1" 
                  checked={currentSectionData.checkboxes[i] || false}
                  onChange={(e) => handleCheckboxChange(currentSectionIndex, i, e.target.checked)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold">Purpose Pause</h3>
            {section.purposePauseQuestions.map((question, i) => (
              <div key={i}>
                <label className="block text-[14px] font-normal leading-normal text-[#222224] font-sans mb-1">
                  {question}
                </label>
                <textarea
                  className={`w-full px-3 py-2 rounded-[12px] border border-[#CBD5E1] border-opacity-100 bg-white placeholder-[#AFB1B3] focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  rows={3}
                  value={currentSectionData.purposePauseAnswers[i] || ""}
                  onChange={(e) => handlePurposePauseChange(currentSectionIndex, i, e.target.value)}
                ></textarea>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-lg font-semibold">Best Practice</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Show on public profile
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={toggles[currentSectionIndex]}
                    onChange={() => handleToggleChange(currentSectionIndex)}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r from-[#7077FE] to-[#9747FF]"></div>
                </label>
              </div>
            </div>
            <textarea
              className={`w-full px-3 py-2 rounded-[12px] border border-[#CBD5E1] border-opacity-100 bg-white placeholder-[#AFB1B3] focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
              rows={3}
              placeholder={section.bestPracticePrompt}
              value={currentSectionData.bestPracticeAnswer || ""}
              onChange={(e) => handleBestPracticeChange(currentSectionIndex, e.target.value)}
            ></textarea>
          </div>

          <div className="mb-6 space-y-4">
            <h3 className="text-lg font-semibold">Suggested Uploads</h3>
            {section.suggestedUploads.map((upload, i) => (
              <div key={i}>
                <label className="block font-medium mb-1">{upload.label}</label>
                <input
                  type="file"
                  accept={upload.acceptedTypes}
                  className={`w-full px-3 py-2 rounded-[12px] border border-[#CBD5E1] border-opacity-100 bg-white placeholder-[#AFB1B3] focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  onChange={(e) => handleFileUpload(currentSectionIndex, i, e.target.files?.[0] || null)}
                />
              </div>
            ))}
            <div>
              <label className="block font-medium mb-1">
                Link for Reference
              </label>
              <input
                type="url"
                className={`w-full px-3 py-2 rounded-[12px] border border-[#CBD5E1] border-opacity-100 bg-white placeholder-[#AFB1B3] focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                placeholder="https://example.com"
                value={currentSectionData.referenceLink || ""}
                onChange={(e) => handleReferenceLinkChange(currentSectionIndex, e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="gradient-primary"
              onClick={handlePrevious}
              disabled={currentSectionIndex === 0}
              className={`rounded-[100px] py-3 px-8 self-stretch transition-colors duration-500 ease-in-out ${
                currentSectionIndex === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : ""
              }`}
            >
              Previous
            </Button>
            <Button
              variant="gradient-primary"
              onClick={handleNext}
              disabled={currentSectionIndex === sections.length - 1}
              className={`rounded-[100px] py-3 px-8 self-stretch transition-colors duration-500 ease-in-out ${
                currentSectionIndex === sections.length - 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : ""
              }`}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssessmentQuestion;