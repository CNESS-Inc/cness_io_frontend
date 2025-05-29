import { useState } from "react";
import DashboardLayout from "../layout/Dashboard/dashboardlayout";

const GenerateBadgeCode = () => {
  const [imageURL, setImageURL] = useState("");
  const [embedCode, setEmbedCode] = useState("");

  const generateEmbedCode = () => {
    const uniqueKey = Math.random().toString(36).substring(2, 15);
    const securedImageURL = `${imageURL}?authKey=${uniqueKey}`;

    const rawHTML = `
      <div style='display: flex; align-items: center; font-family: sans-serif;'>
        <img src='${securedImageURL}' alt='Badge' style='width: 40px; height: 40px; border-radius: 50%;' />
      </div>
    `;

    const base64HTML = btoa(unescape(encodeURIComponent(rawHTML)));

    const iframeHTML = `
<iframe 
  srcdoc="<script>
    document.write(decodeURIComponent(escape(atob('${base64HTML}'))))
  </script>" 
  style="border: none; width: 60px; height: 60px;"
></iframe>`.trim();

    setEmbedCode(iframeHTML);
  };

  return (
    <>
      <DashboardLayout>
        <div className="p-4 max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Embed Code Generator</h2>

          <input
            type="text"
            placeholder="Enter image URL"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
            className={`w-full px-3 py-2 mb-3 border-[#CBD5E1] rounded-[12px] border border-opacity-100 bg-white placeholder-[#AFB1B3] focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
          />

          <button
            onClick={generateEmbedCode}
            className="px-4 py-3 text-white font-semibold rounded-full shadow-md transition duration-300 
               bg-gradient-to-r from-blue-500 to-purple-500 
               hover:blue-500 hover:to-blue-500 mb-3 "
          >
            Generate Embed Code
          </button>

          {embedCode && (
            <>
              <label className="block font-medium mb-2">Preview:</label>
              <div
                className="mb-4"
                dangerouslySetInnerHTML={{
                  __html: `<div style='display: flex; align-items: center;'>
                            <img src='${imageURL}' alt='Badge' style='width: 40px; height: 40px; border-radius: 50%;' />
                          </div>`,
                }}
              />

              <label className="block font-medium mb-2">Embed Code:</label>
              <textarea
                value={embedCode}
                readOnly
                className="w-full h-32 p-2 border rounded mb-2"
              />

              <button
                onClick={() => navigator.clipboard.writeText(embedCode)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Copy to Clipboard
              </button>
            </>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default GenerateBadgeCode;
