import { useState, useEffect } from "react";

const GenerateBadgeCode = () => {
  const staticImageURL = "https://dev.cness.io/logo.png";
  const [embedCodes, setEmbedCodes] = useState<string[]>([]);

  useEffect(() => {
    const uniqueKey = Math.random().toString(36).substring(2, 15);
    const securedImageURL = `${staticImageURL}?authKey=${uniqueKey}`;

    const rawHTML = `
      <div style='display: flex; align-items: center; font-family: sans-serif;'>
        <img src='${securedImageURL}' alt='Badge' style='width: 40px; height: 40px; border-radius: 50%;' />
      </div>
    `;

    const base64HTML = btoa(unescape(encodeURIComponent(rawHTML)));

    const iframeCode = `
        <iframe 
        srcdoc="<script>document.write(decodeURIComponent(escape(atob('${base64HTML}'))))</script>" 
        style="border: none; width: 60px; height: 60px;"></iframe>`.trim();

    const directHTMLCode = `
        <div style="display: flex; align-items: center; font-family: sans-serif;">
        <img 
            src="${securedImageURL}"
            alt="Badge" 
            style="width: 40px; height: 40px; border-radius: 50%;" 
        />
        </div>`.trim();

    const scriptEmbedCode = `
        <div id="badge-container"></div>
        <script>
        (function () {
            var img = document.createElement("img");
            img.src = "${securedImageURL}";
            img.alt = "Badge";
            img.style.width = "40px";
            img.style.height = "40px";
            img.style.borderRadius = "50%";
            document.getElementById("badge-container").appendChild(img);
        })();
        </script>`.trim();

    setEmbedCodes([iframeCode, directHTMLCode, scriptEmbedCode]);
  }, []);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <>
<div className="max-w-6xl mx-auto my-10 p-10 bg-white rounded-xl shadow-md min-h-[750px]">
        {/* <h2 className="text-xl font-bold mb-4">Embed Code Generator</h2>

        <div className="flex items-center space-x-4 mb-4">
          <img
            src={staticImageURL}
            alt="Badge Preview"
            className="w-12 h-12 rounded-full border"
          />
          <span className="text-sm text-gray-600">{staticImageURL}</span>
        </div> */}

        {embedCodes.length > 0 && (
          <div className="space-y-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              {/* <label className="font-medium">Iframe Embed Preview:</label>
              <div
                className="my-2"
                dangerouslySetInnerHTML={{
                  __html: embedCodes[0],
                }}
              /> */}
              <label className="font-medium">Iframe Embed Code:</label>
              <textarea
                value={embedCodes[0]}
                readOnly
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={() => copyToClipboard(embedCodes[0])}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
              >
                Copy to Clipboard
              </button>
            </div>

            <div>
              <label className="font-medium">Direct HTML Code:</label>
              <textarea
                value={embedCodes[1]}
                readOnly
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={() => copyToClipboard(embedCodes[1])}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
              >
                Copy to Clipboard
              </button>
            </div>

            <div>
              <label className="font-medium">Script Embed Code:</label>
              <textarea
                value={embedCodes[2]}
                readOnly
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={() => copyToClipboard(embedCodes[2])}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GenerateBadgeCode;
