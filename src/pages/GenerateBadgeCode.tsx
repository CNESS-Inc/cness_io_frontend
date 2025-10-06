import { useState, useEffect } from "react";
import { getUserBadgeDetails } from "../Common/ServerAPI";
import indv_aspiring from "../assets/indv_aspiring.svg";
import indv_inspired from "../assets/indv_inspired.svg";
import indv_leader from "../assets/indv_leader.svg";

const GenerateBadgeCode = () => {
  const [embedCodes, setEmbedCodes] = useState<string[]>([]);
  const [staticImageURL, setStaticImageURL] = useState<string>("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fetchUserBadge = async () => {
    try {
      const res = await getUserBadgeDetails();
      const level = res.data.data.level;
      
      // Set image based on user level
      switch (level.toLowerCase()) {
        case "aspiring":
          setStaticImageURL(indv_aspiring);
          break;
        case "inspired":
          setStaticImageURL(indv_inspired);
          break;
        case "leader":
          setStaticImageURL(indv_leader);
          break;
        default:
          setStaticImageURL(indv_aspiring); 
      }
    } catch (error) {
      console.error("Error fetching badge details:", error);
      setStaticImageURL(indv_aspiring); 
    }
  };

useEffect(() => {
  if (!staticImageURL) return; 
  
  const uniqueKey = Math.random().toString(36).substring(2, 15);
  const securedImageURL = `${staticImageURL}?authKey=${uniqueKey}`;
  const currentDomain = window.location.origin;

  // const rawHTML = `
  //   <div style='display: flex; align-items: center; font-family: sans-serif;'>
  //     <img src='${securedImageURL}' alt='Badge' style='width: 40px; height: 40px; border-radius: 50%;' />
  //   </div>
  // `;
  const rawHTML = `
    <div style="display: flex; align-items: center; font-family: sans-serif;">
      <img src="${currentDomain}${securedImageURL}" alt="Badge" style="width: 40px; height: 40px; border-radius: 50%;" />
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
          src="${currentDomain}${securedImageURL}"
          alt="Badge" 
          style="width: 40px; height: 40px; border-radius: 50%;" 
      />
      </div>`.trim();

  const scriptEmbedCode = `
      <div id="badge-container"></div>
      <script>
      (function () {
          var img = document.createElement("img");
          img.src = "${currentDomain}${securedImageURL}";
          img.alt = "Badge";
          img.style.width = "40px";
          img.style.height = "40px";
          img.style.borderRadius = "50%";
          document.getElementById("badge-container").appendChild(img);
      })();
      </script>`.trim();

  setEmbedCodes([iframeCode, directHTMLCode, scriptEmbedCode]);
}, [staticImageURL]);

  useEffect(() => {
    fetchUserBadge();
  }, []);

const copyToClipboard = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000); // reset after 2s
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };
  

  return (
    <>
      <div className="max-w-6xl mx-auto my-10 p-10 bg-white rounded-xl shadow-md min-h-[750px]">
        {embedCodes.length > 0 && (
          <div className="space-y-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="font-medium">Iframe Embed Code:</label>
              <textarea
                value={embedCodes[0]}
                readOnly
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
             <button
                    onClick={() => copyToClipboard(embedCodes[0], 0)}
                    className={`mt-2 px-4 py-2 rounded cursor-pointer transition-colors ${
                      copiedIndex === 0
                        ? "bg-gray-500 text-white"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {copiedIndex === 0 ? "Copied!" : "Copy to Clipboard"}
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
                    onClick={() => copyToClipboard(embedCodes[1], 1)}
                    className={`mt-2 px-4 py-2 rounded cursor-pointer transition-colors ${
                      copiedIndex === 1
                        ? "bg-gray-500 text-white"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {copiedIndex === 1 ? "Copied!" : "Copy to Clipboard"}
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
                    onClick={() => copyToClipboard(embedCodes[2], 2)}
                    className={`mt-2 px-4 py-2 rounded cursor-pointer transition-colors ${
                      copiedIndex === 2
                        ? "bg-gray-500 text-white"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {copiedIndex === 2 ? "Copied!" : "Copy to Clipboard"}
                  </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GenerateBadgeCode;