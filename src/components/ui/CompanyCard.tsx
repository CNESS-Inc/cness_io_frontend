import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  // CardFooter,
} from "../ui/DashboardCard";

import { iconMap } from "../../assets/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import indv_aspiring from "../../assets/indv_aspiring.svg";
import indv_inspried from "../../assets/indv_inspired.svg";
import indv_leader from "../../assets/indv_leader.svg";
import Modal from "./Modal";

interface CompanyCardProps {
  id: string;
  name: string;
  domain: string;
  logoUrl: string;
  bannerUrl: string;
  location: string;
  description: string;
  tags: string[];
  rating?: number;
  isCertified?: boolean;
  is_person?: boolean;
  is_organization?: boolean;
  level?: any;
  routeKey?: string;
  interest?: any;
  profession?: any;
}

// const StarRating = ({ rating }: { rating: number }) => {
//   const totalStars = 5;

//   return (
//     <div className="flex items-center gap-[2px]">
//       {[...Array(totalStars)].map((_, i) => (
//         <svg
//           key={i}
//           xmlns="http://www.w3.org/2000/svg"
//           fill={i < rating ? "#FFA500" : "none"}
//           stroke="#FFA500"
//           viewBox="0 0 24 24"
//           className="w-4 h-4"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M12 17.25l-6.16 3.88 1.64-7.03-5.48-4.73 7.19-.61L12 2.25l2.81 6.51 7.19.61-5.48 4.73 1.64 7.03L12 17.25z"
//           />
//         </svg>
//       ))}
//     </div>
//   );
// };

export default function CompanyCard({
  id,
  name,
  location,
  logoUrl,
  bannerUrl,
  description,
  tags,
  // rating,
  level,
  routeKey,
  interest,
  profession,
}: CompanyCardProps) {
  console.log("🚀 ~ CompanyCard111111 ~ profession:", profession);
  console.log("🚀 ~ CompanyCard ~ interest:", interest);
  const navigate = useNavigate();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const handleCardClick = () => {
    const Id = localStorage.getItem("Id");
    if (routeKey) {
      // Special case (dashboard route)
      navigate(`/dashboard/userprofile/${id}`);
    } else {
      if (Id && Id !== "undefined") {
        // User is logged in → proceed
        navigate(`/directory/user-profile/${id}`);
      } else {
        // User is not logged in → store the intended path and show modal
        setTargetPath(`/directory/user-profile/${id}`);
        setShowLoginPrompt(true);
      }
    }
  };

  const maxDescriptionLength = 100;
  const truncatedDescription =
    description.length > maxDescriptionLength
      ? description.substring(0, maxDescriptionLength) + "..."
      : description;

  const toggleDescription = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFullDescription(!showFullDescription);
  };

  const handleModalClose = () => {
    setShowLoginPrompt(false);
    if (targetPath) {
      navigate(targetPath);
      setTargetPath(null);
    }
  };
  return (
    <>
      <Card
        className="relative bg-white  cursor-pointer rounded-2xl border border-gray-200 shadow-md overflow-hidden transition-all duration-300 hover:shadow-sm hover:ring-[1.5px] hover:ring-[#F07EFF]/40"
        onClick={handleCardClick}
      >
        {/* Absolute Badge Logo */}
        {/* <img
        src={iconMap["inslogo"]}
        alt="CNESS Logo"
        className="absolute top-3 right-3 w-8 sm:w-10 h-auto object-contain z-10"
      /> */}
        {level && (
          <img
            src={
              level == "Aspiring"
                ? indv_aspiring
                : level == "Inspiring"
                ? indv_inspried
                : level == "Leader"
                ? indv_leader
                : indv_inspried // fallback if no level
            }
            alt={`${level || "CNESS"} Badge`}
            className="absolute top-3 right-3 w-8 sm:w-[58px] h-8 object-contain z-1"
          />
        )}

        <CardHeader className="px-4 pt-4 pb-0 relative z-0">
          <div className="flex items-start gap-1 pr-12">
            <img
              src={
                !logoUrl ||
                logoUrl === "null" ||
                logoUrl === "undefined" ||
                !logoUrl.startsWith("http") ||
                logoUrl === "http://localhost:5026/file/"
                  ? "/profile.jpg"
                  : logoUrl
              }
              alt={`${name} logo`}
              className="h-8 w-8 rounded-full"
              onError={(e) => {
                // Fallback if the image fails to load
                const target = e.target as HTMLImageElement;
                target.src = "/profile.png";
              }}
            />
            <div>
              <CardTitle className="text-sm font-semibold">{name}</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                {location}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-4 pt-2 pb-4">
          <div className="relative rounded-xl overflow-hidden mb-3">
            <img
              src={
                !bannerUrl ||
                bannerUrl === "null" ||
                bannerUrl === "undefined" ||
                !bannerUrl.startsWith("http") ||
                bannerUrl === "http://localhost:5026/file/"
                  ? iconMap["companycard1"]
                  : bannerUrl
              }
              alt={`${name} banner`}
              className="w-full h-36 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = iconMap["companycard1"];
              }}
            />

            <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
              {(Array.isArray(profession)
                ? profession
                : [interest || profession]
              ).map((item, i) => (
                <span
                  key={i}
                  className="text-[12px] inline-flex items-center justify-center rounded-full px-3 py-2 leading-none font-medium bg-[#F3F3F3] text-[#8A8A8A]"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Show section only if real description OR rating > 0 */}
          {description && description !== "No description available" && (
            <>
              <p className="text-sm font-semibold text-gray-800 mb-1">
                Overview
              </p>
              <p className="text-sm text-gray-600 leading-snug mb-2">
                {showFullDescription ? description : truncatedDescription}
                {description.length > maxDescriptionLength && (
                  <span
                    className="text-purple-600 underline cursor-pointer ml-1"
                    onClick={toggleDescription}
                  >
                    {showFullDescription ? "Read Less" : "Read More"}
                  </span>
                )}
              </p>
            </>
          )}

          {/* Rating aligned right 
            <div className="flex justify-end mb-2">
              {typeof rating === "number" && rating > 0 && (
                <div className="flex items-center text-yellow-500 text-sm">
                  {"★".repeat(rating)}
                  {"☆".repeat(5 - rating)}
                </div>
              )}
            </div>*/}

          {/* Tags only if available */}
          {tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-[#7077FE1A] text-[#7077FE] px-[26px] py-1.5 rounded-lg text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>

        {/* <CardFooter className="flex justify-between items-center px-4 py-3">
          Optional footer content
        </CardFooter> */}
      </Card>
      <Modal isOpen={showLoginPrompt} onClose={handleModalClose}>
        <div className="text-center space-y-6 p-8 w-full max-w-2xl">
          {" "}
          {/* Increased max-width and padding */}
          <h2 className="text-2xl font-semibold text-gray-800">
            {" "}
            {/* Larger text */}
            Login Required
          </h2>
          <p className="text-base text-gray-600">
            {" "}
            {/* Larger text */}
            Please log in to your account to access this feature.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            {" "}
            {/* Better button spacing */}
            <button
              className="bg-[#7077FE] hover:bg-[#5a62d4] text-white px-6 py-3 rounded-full text-base font-medium transition-colors" /* Larger button */
              onClick={() => {
                navigate("/log-in");
              }}
            >
              Go to Login
            </button>
            <button
              className="px-6 py-3 rounded-full text-base font-medium text-gray-600 hover:bg-gray-100 transition-colors" /* Secondary button style */
              onClick={() => setShowLoginPrompt(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
