import { useEffect, useRef, useState } from "react";
import { Reels } from "@sayings/react-reels";
import '@sayings/react-reels/dist/index.css'
import { useNavigate } from "react-router-dom";
import ReelComment from "./ReelComment";
import { GetStory, LikeStory } from "../../../Common/ServerAPI";
import ReelShare from "./ReelShare";

declare global {
  interface Element {
    swiper?: any;
  }
}

const ReelsCard = () => {
  const [storyData, setstoryData] = useState<any>([]);
  const [selectedReelId, setSelectedReelId] = useState<string | null>(null);
  const reelsContainerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();


  const GetStoryData = async () => {
    try {
      const res = await GetStory();
      const resData = res?.data?.data;
      let tempData: any = [];

      for (let element of resData) {
        tempData.push({
          id: element?.id,
          isLiked: element?.is_liked, // Ensure API provides this
          reelInfo: {
            url: element?.video_file,
            type: "video/mp4",
            description: element?.description,
            postedBy: {
              avatar:
                element?.storyuser?.profile?.profile_picture ||
                dummyProfilePicture,
              name: element?.storyuser?.profile?.first_name,
            },
            likes: { count: element?.likes_count },
            comments: { count: element?.comments_count },
            shares: {},
          },
        });
      }

      setstoryData(tempData);
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  useEffect(() => {
    GetStoryData();
  }, []);

  // Function to handle like click
  const handleLikeClick = async (reel: any) => {
    try {
      const updatedStoryData = storyData.map((item: any) => {
        if (item.id === reel.id) {
          return {
            ...item,
            isLiked: !item.isLiked,
            reelInfo: {
              ...item.reelInfo,
              likes: {
                count: item.isLiked
                  ? item.reelInfo.likes.count - 1
                  : item.reelInfo.likes.count + 1,
              },
            },
          };
        }
        return item;
      });

      setstoryData(updatedStoryData);

      await LikeStory(reel.id)
    } catch (error) {
      console.error("Error submitting like:", error);
    }
  };

  // Function to handle comment click
  const handleCommentClick = (reel: any) => {
    setOpenMenuReelId(null)
    setSelectedReelId(reel.id);
  };

  // Function to submit comment
  // const handleCommentSubmit = async () => {
  //   if (!selectedReelId || !commentText.trim()) return;

  //   try {
  //     // await dispatch(
  //     //   apiCall("POST", `/story/${selectedReelId}/comment`, "data", {
  //     //     comment: commentText,
  //     //   })
  //     // );
  //     setCommentText(""); // Clear input after submitting
  //     setSelectedReelId(null); // Close input box after submitting
  //     GetStoryData(); // Refresh comments
  //   } catch (error) {
  //     console.error("Error submitting comment:", error);
  //   }
  // };

  const reelMetaInfo = {
    videoDimensions: {
      height: 600,
      width: 400,
    },
    backGroundColor: "#000000",
    borderRadius: 10,
    likeActiveColor: "#ff0000",
    dislikeActiveColor: "#0000ff",
  };

  const dummyProfilePicture =
    "data:image/jpeg;base64,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";

  useEffect(() => {
    const swiperInstance = document.querySelector(".swiper")?.swiper;
    if (!swiperInstance) return;

    const handleSlideChange = () => {
      const activeIndex = swiperInstance.activeIndex;

      const activePost = storyData[activeIndex];

      if (selectedReelId !== activePost?.id) {
        setSelectedReelId(null);
        setOpenMenuReelId(null)
      }

      // // ✅ If last index, append more stories
      // if (activeIndex === storyData.length - 1) {
      //   setstoryData((prevData:any) => [...prevData, ...prevData]);
      // }
    };

    swiperInstance.on("slideChange", handleSlideChange);

    return () => {
      swiperInstance.off("slideChange", handleSlideChange);
    };
  }, [storyData]); // ✅ Depend on storyData to update when new data is added

  // const { reelId } = useParams(); // Get reel ID from URL

  useEffect(() => {
    const swiperInstance = document.querySelector(".swiper")?.swiper;
    if (!swiperInstance) return;

    const handleSlideChange = () => {
      const activeIndex = swiperInstance.activeIndex;
      const activePost = storyData[activeIndex];

      if (activePost?.id) {
        navigate(`/social/reel/${activePost.id}`, { replace: true });
      }
    };

    swiperInstance.on("slideChange", handleSlideChange);

    return () => {
      swiperInstance.off("slideChange", handleSlideChange);
    };
  }, [storyData, navigate]);

  const urldata = window.location.href;
  const [openMenuReelId, setOpenMenuReelId] = useState<string | null>(null);

  const toggleMenu = (reelId: string) => {
    setSelectedReelId(null)
    setOpenMenuReelId((prev) => (prev === reelId ? null : reelId));
  };



  return (
    <>
      <button
        onClick={() => navigate(-1)} // Go one step back
        className="fixed top-4 left-4 bg-gradient-to-r from-indigo-500 to-purple-500 font-medium text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-700 z-10"
      >
        ← Back
      </button>
      <div ref={reelsContainerRef} style={{ width: "100%", height: "600px" }}>
        {storyData?.length > 0 && (
          <Reels
            reels={storyData}
            reelMetaInfo={reelMetaInfo}
            onMenuItemClicked={(event) => console.log(event.value)}
            onLikeClicked={handleLikeClick}
            onCommentClicked={handleCommentClick} // Trigger input on comment click
            //@ts-ignore
            onShareClicked={(reel: any, event: any) => {
              toggleMenu(reel.id);
              setSelectedReelId(null)
            }}
            onAvatarClicked={(reel) => console.log("Avatar Clicked:", reel)}
          />
        )}

        {/* Comment Input Box */}
        {selectedReelId && (
          <>
            <ReelComment
              selectedReelId={selectedReelId}
              setSelectedReelId={setSelectedReelId}
              GetStoryData={GetStoryData}
            />
          </>
        )}

        {openMenuReelId && (
          <ReelShare setOpenMenuReelId={setOpenMenuReelId} urldata={urldata}/>
        )}
      </div>
    </>
  );
};

export default ReelsCard;
