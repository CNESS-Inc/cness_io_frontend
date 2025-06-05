import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GetEvent } from "../../Common/ServerAPI";
import PostForSocialMedia from "./PostForSocialMedia.tsx";
import NominateForSocialMedia from "./NominateForSocialMedia.tsx";
import mediaImg from "../../../public/images/media.png";
import nominateImg from "../../../public/images/conciousjuorney.png";
import eventImg from "../../../public/images/dreamproject.png";

interface Contributor {
  name: string;
  image: string;
  award: string;
  points: string;
}

const LeftSocial: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [eventsData, setEventsData] = useState<any[]>([]);
  console.log("🚀 ~ eventsData:", eventsData)


  const GetPendingRequest = async () => {
    setLoading(true);
    try {

      const res = await GetEvent()
      setEventsData(res?.data?.data);

    } catch (error) {
      console.error("Error fetching selection details:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    GetPendingRequest();
  }, []);

  const [activeTab, setActiveTab] = useState<string>("Events");
  const navigate = useNavigate();

  const handleViewDetails = (eventId: string) => {
    navigate(`/events/details/${eventId}`);
  };

  const renderTabContent = ()=> {
    switch (activeTab) {
      case "Events":
        return (
          <div className="flex flex-col bg-[#f6f6f6] p-3">
            <div className="flex flex-row justify-between items-center mb-5">
              <h2 className="size-4 text-nowrap text-[#7077FE]">Trending</h2>
            </div>
            <ul className="space-y-4 mb-4">
              {eventsData && eventsData?.map((event, index) => (
                <li key={index}>
                  <div>
                    <span className="text-black size-4 cursor-pointer" onClick={()=>handleViewDetails(event.id)} >{event?.date !== 'Invalid date' ? event?.date : ''} {event?.title}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex">
              <Link to="#see-all" className="text-nowrap text-[#7077FE] text-xs">
                Refresh
              </Link>
            </div>
          </div>
        );
      case "Posts":
        return <PostForSocialMedia />;
      case "Nominate":
        return <NominateForSocialMedia />;
      case "Media":
        return <p>Content for Media</p>;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex flex-col bg-[#F6F6F6] p-4 rounded-md shadow-md">
        <div className="flex flex-row items-center justify-between mb-5">
          <h2 className="size-4 text-nowrap text-[#7077FE]">My Social</h2>
        </div>
        <ul className="space-y-4">
          <li className="flex items-center">
            <img className="w-auto h-auto" src={mediaImg} alt="Media" />
            <Link to="" className="px-2 ml-2 text-black">Community</Link>
          </li>
          <li className="flex items-center">
            <img className="w-auto h-auto" src={nominateImg} alt="Conscious Journey" />
            <Link to="/contribute" className="px-2 ml-2 text-black">Nominate</Link>
          </li>
          <li className="flex items-center">
            <img className="w-auto h-auto" src={eventImg} alt="Conscious Journey" />
            <Link to="/events/list" className="px-2 ml-2 text-black">Events</Link>
          </li>
        </ul>
      </div>
      <div className="flex flex-col mt-4">
        <div className="flex flex-row items-start justify-start gap-2">
          {["Events", "Posts", "Nominate"].map((tab) => (
            <div
              key={tab}
              className={`p-2 ${activeTab === tab ? "rounded-t-lg bg-gradient-to-r from-indigo-500 to-purple-500" : ""}`}
              onClick={() => setActiveTab(tab)}
              style={{ cursor: "pointer" }}
            >
              <p className={`font-medium text-xs ${activeTab === tab ? "text-[#fff]" : "text-gray-400"}`}>{tab}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">{renderTabContent()}</div>
      </div>
    </>
  );
};

export default LeftSocial;
