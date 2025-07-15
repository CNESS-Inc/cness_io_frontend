import React from "react";
import {LazyLoadComponent } from "react-lazy-load-image-component";

interface CustomVideoPlayerProps {
  videoSrc: string;
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({ videoSrc }) => {
  console.log("🚀 ~ videoSrc:", videoSrc)
  // const [banner, setBanner] = useState<string>("");
  return (
    <>
    <LazyLoadComponent>
      {/* {banner && ( */}
      <div className="relative w-full">
        {/* Video element */}
        {/* <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-auto"
        controls={false}
        onClick={handlePlayPause}
      /> */}
        <video
          className="w-full max-h-[500px] rounded-lg"
          // controls
          autoPlay
          loop
        >
          <source src={`consciousness_social_media.mp4`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* <img src={banner} alt="Banner" /> */}

        {/* Play/Pause button */}
        {/* {!isPlaying && (
        <button
          onClick={handlePlayPause}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-4xl"
        >
          <FaPlay />
        </button>
      )}

      {isPlaying && (
        <button
          onClick={handlePlayPause}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-4xl"
        >
          <FaPause />
        </button>
      )} */}
      </div>
      {/* )} */}
      </LazyLoadComponent>
    </>
  );
};

export default CustomVideoPlayer;
