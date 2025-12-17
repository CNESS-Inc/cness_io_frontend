import React, { useRef, useState } from 'react'
import { BsXLg } from 'react-icons/bs';
import { FaFacebook, FaLinkedin, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { MdContentCopy } from 'react-icons/md';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton } from 'react-share';

interface ReelShareProps {
  urldata: string;
  setOpenMenuReelId: any;
}

const ReelShare: React.FC<ReelShareProps> = ({ urldata, setOpenMenuReelId }) => {

  const [copy, setCopy] = useState<Boolean>(false)
  const menuRef = useRef<HTMLDivElement | null>(null);

  return (
    <>

      <div
        className="fixed left-1/2 transform -translate-x-1/2 bg-white rounded-t-lg shadow-md w-[400px]"
        style={{ bottom: "0px" }}
      >
        <div className="flex items-center">
          <BsXLg
            className="text-lg ms-3 cursor-pointer"
            onClick={() => setOpenMenuReelId(null)}
          />
          <p className="mt-2 mb-2 w-full text-center text-lg">Share</p>
        </div>
        <div
          className="flex flex-col p-3 min-h-[100px]"
        >
          <div className='relative'>
            <div
              className="bg-white p-3 z-10"
              ref={menuRef}
            >
              <ul className="flex items-center justify-between mt-2">
                <li>
                  <FacebookShareButton url={urldata}>
                    <FaFacebook size={32} color="#4267B2" />
                  </FacebookShareButton>
                </li>
                <li>
                  <LinkedinShareButton url={urldata}>
                    <FaLinkedin size={32} color="#0077B5" />
                  </LinkedinShareButton>
                </li>
                <li>
                  <TwitterShareButton url={urldata}>
                    <FaTwitter size={32} color="#1DA1F2" />
                  </TwitterShareButton>
                </li>
                <li>
                  <WhatsappShareButton url={urldata}>
                    <FaWhatsapp size={32} color="#1DA1F2" />
                  </WhatsappShareButton>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(urldata);
                      setCopy(true);
                      setTimeout(() => setCopy(false), 1500);
                    }}
                    className="flex items-center relative"
                    title="Copy link"
                  >
                    <MdContentCopy size={30} className="text-gray-600" />
                    {copy &&
                      <div className="absolute z-9999999999 w-[100px] top-10 left-1/2 -translate-x-1/2 bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-semibold shadow transition-all">
                        Link Copied!
                      </div>
                    }
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ReelShare