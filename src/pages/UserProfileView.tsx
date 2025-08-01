import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Header from "../layout/Header/Header";
import Footer from "../layout/Footer/Footer";
import inspiredbadge from "../assets/Inspired _ Badge.png";
import bestprac from "../assets/bestprac.png";
import tag from "../assets/tags.png";
import bcard1 from "../assets/Bcard1.png";
import bcard2 from "../assets/Bcard2.png";
import bcard3 from "../assets/Bcard3.png";
import bcard4 from "../assets/Bcard4.png";
import overallrating from "../assets/overallratings.png";
import aboutus from "../assets/aboutus.png";
import work from "../assets/work.png";
import education from "../assets/education.png";
import review from "../assets/review.png";
import { useEffect, useState } from "react";
import {
  AddUserRating,
  GetUserProfileDetails,
  GetUserRating,
} from "../Common/ServerAPI";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { StarRating } from "../components/ui/Rating";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { FacebookIcon, LinkedinIcon, TwitterIcon } from "react-share";
import { Briefcase, Instagram } from "lucide-react";
import banner2 from "../assets/banner2.png";
import indv_aspiring from "../assets/indv_aspiring.svg";
import indv_inspried from "../assets/indv_inspired.svg";
import indv_leader from "../assets/indv_leader.svg";

interface Errors {
  reviewText: string;
  breakdowns: Record<string, string>; // Changed from fixed properties to dynamic
}

export default function UserProfileView() {
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState<any>();
  console.log("🚀 ~ UserProfileView ~ userDetails:", userDetails);
  const [activeModal, setActiveModal] = useState<"rating" | null>(null);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    try {
      const res = await GetUserProfileDetails(id);
      setUserDetails(res?.data?.data);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);
  // const BackArrow = () => (
  //   <button
  //     onClick={() => window.history.back()}
  //     className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
  //   >
  //     <ArrowLeftIcon className="h-5 w-5 text-[#7077FE]" />
  //   </button>
  // );

  const [reviewText, setReviewText] = useState<string>("");
  const [avgrating, setAvgRating] = useState<number>();
  const [totalrate, setTotalRate] = useState<number>();
  const [breakDown, setBreakDown] = useState<any>();
  const [ratingPercentage, setratingPercentage] = useState<any>();
  const [userReviewData, setUserReviewData] = useState<any>([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  console.log("🚀 ~ UserProfileView ~ showLoginPrompt:", showLoginPrompt);

  const [breakdowns, setBreakdowns] = useState<Record<string, number>>({});

  // State for errors
  const [errors, setErrors] = useState<Errors>({
    reviewText: "",
    breakdowns: {},
  });

  // Validate form function
  const validateForm = (): boolean => {
    let valid = true;
    const newErrors = {
      reviewText: "",
      breakdowns: {} as Record<string, string>,
    };

    // Validate each breakdown rating
    breakDown?.forEach((item: any) => {
      const key = item.breakdown_name;
      if (!breakdowns[key] || breakdowns[key] === 0) {
        newErrors.breakdowns[key] = "Please select a rating";
        valid = false;
      }
    });

    if (!reviewText.trim()) {
      newErrors.reviewText = "Review cannot be empty";
      valid = false;
    } else if (reviewText.length < 10) {
      newErrors.reviewText = "Review should be at least 10 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const getNumberWord = (num: number): string => {
    const numberWords = ["one", "two", "three", "four", "five"];
    return numberWords[num - 1] || num.toString();
  };
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Create the base payload
        const payload: any = {
          review: reviewText,
          user_type: "1",
          profile_id: id,
        };

        breakDown?.forEach((item: any, index: number) => {
          const formattedKey = `breakdown_${getNumberWord(index + 1)}`;
          payload[formattedKey] =
            breakdowns[item.breakdown_name]?.toString() || "0";
        });

        await AddUserRating(payload);
        setActiveModal(null);
        // Reset form on success
        setReviewText("");
        setBreakdowns({});
        await fetchRatingDetails();
      } catch (error: any) {
        setReviewText("");
        setBreakdowns({});
        setActiveModal(null);
        showToast({
          message: error?.response?.data?.error?.message,
          type: "error",
          duration: 5000,
        });
      }
    }
  };

  const fetchRatingDetails = async () => {
    try {
      const payload = {
        user_type: 1,
        profile_id: id,
      };
      const res = await GetUserRating(payload);
      setAvgRating(parseFloat(res?.data?.data?.average));
      setUserReviewData(res?.data?.data?.user_data);
      setTotalRate(res?.data?.data?.total_user_rated);
      setBreakDown(res?.data?.data?.breakdown);
      setratingPercentage(res?.data?.data?.rating_start_percentage);
    } catch (error: any) {
      setAvgRating(0);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    fetchRatingDetails();
  }, []);

  const closeModal = () => {
    setActiveModal(null);
    setReviewText("");
    setErrors({
      reviewText: "",
      breakdowns: {
        one: "",
        two: "",
        three: "",
        four: "",
        five: "",
      },
    });
  };

  const formatBreakdownName = (name: string) => {
    // Split by underscore, capitalize each word, and join with space
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  const slugify = (str: string) => {
    return str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-[#ECEEF2]">
        {/* Header Banner */}
        <div
          className="relative w-full h-[150px] mt-[1px] bg-cover bg-center"
          style={{
            backgroundImage: `url(${userDetails?.profile_banner || banner2})`,
          }}
        >
          <button
            onClick={() => window.history.back()}
            className="absolute cursor-pointer top-4 left-4 bg-white rounded-full p-2 shadow-md"
          >
            <ArrowLeftIcon className="h-5 w-5 text-[#7077FE]" />
          </button>
        </div>

        {/* Overlapping Logo - Left Aligned */}

        <div className="w-full md:w-1/3 space-y-6 relative">
          {/* Overlapping Logo */}
          <div className="absolute -top-25 left-1/2 -translate-x-1/2 sm:-translate-x-[45%] z-20">
            <div className="w-40 h-40 md:w-52 md:h-52 rounded-full border-8 border-white shadow-lg bg-white overflow-hidden">
              <img
                src={
                  userDetails?.profile_picture &&
                  userDetails?.profile_picture !== "http://localhost:5026/file/"
                    ? userDetails?.profile_picture
                    : "/profile.png"
                }
                alt="userlogo1"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if the image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = "/profile.png";
                }}
              />
            </div>
          </div>
        </div>
        {/* Content Body – Centered and aligned */}
        <div className="w-full px-6 md:px-5 mt-6 flex flex-col md:flex-row gap-4">
          {/* LEFT COLUMN */}
          <div className="md:w-1/3 flex flex-col space-y-4">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 pt-40 relative">
              <div className="text-center -mt-13">
                <h2 className="text-lg font-semibold text-gray-800">
                  {userDetails?.first_name} {userDetails?.last_name}
                </h2>
                {/* <p className="text-sm text-gray-500">Stella Innovation</p> */}
              </div>

              <div
                className="border-t my-4"
                style={{ borderColor: "#0000001A" }}
              />

              {/* Contact Info Block */}
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-6 mt-6 text-sm text-gray-800">
                <div>
                  <p className="font-medium break-all">
                    {userDetails?.first_name} {userDetails?.last_name}
                  </p>
                  <p className="text-xs text-gray-400">User Name</p>
                </div>
                <div>
                  <p className="font-medium break-all">{userDetails?.email}</p>
                  <p className="text-xs text-gray-400">Official mail</p>
                </div>
                <div>
                  <p className="font-medium break-all">
                    {userDetails?.phone_no}
                  </p>
                  <p className="text-xs text-gray-400">
                    Official Contact Number
                  </p>
                </div>
                <div>
                  <p className="font-medium break-all">
                    {userDetails?.address}
                  </p>
                  <p className="text-xs text-gray-400">Address</p>
                </div>
              </div>

              {/* Social Media Section */}
              <div className="flex flex-col items-start space-y-2 mt-6">
                <p className="text-xs text-gray-500">Social Media</p>
                <div className="flex space-x-4 text-gray-800 text-xl">
                  {userDetails?.social_links?.facebook && (
                    <a
                      href={userDetails?.social_links?.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FacebookIcon size={24} />
                    </a>
                  )}
                  {userDetails?.social_links?.twitter && (
                    <a
                      href={userDetails?.social_links?.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <TwitterIcon size={24} />
                    </a>
                  )}
                  {userDetails?.social_links?.instagram && (
                    <a
                      href={userDetails?.social_links?.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram size={24} />
                    </a>
                  )}
                  {userDetails?.social_links?.linkedin && (
                    <a
                      href={userDetails?.social_links?.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkedinIcon size={24} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Badge Card */}
            <div className="sticky top-30">
              <div className="bg-white rounded-xl shadow-sm px-4 py-4 md:py-6">
                <div className="flex items-center justify-center gap-4 text-center">
                  <p className="text-sm font-medium">CNESS Badge:</p>
                  <img
                    src={
                      userDetails?.level?.level == "Aspiring"
                        ? indv_aspiring
                        : userDetails?.level?.level == "Inspired"
                        ? indv_inspried
                        : userDetails?.level?.level == "Leader"
                        ? indv_leader
                        : inspiredbadge // fallback if no level
                    }
                    alt={`${userDetails?.badge?.level || "CNESS"} Badge`}
                    className="w-[159px] md:w-[180px] h-auto object-contain mt-[-10px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="md:w-2/3 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm px-6 py-8">
              <h3 className="text-lg font-semibold text-[#000000] mb-2 flex items-center gap-2">
                <span className="bg-[#EEF3FF] p-2 rounded-full">
                  <img
                    src={aboutus}
                    alt="aboutus Icon"
                    className="w-5 h-5 object-contain"
                  />
                </span>{" "}
                About
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {userDetails?.about_us}
              </p>
            </div>

            <div className="flex flex-col mt-[-15px]">
              {/* Education Section */}
              <div className="bg-white rounded-xl shadow-sm px-6 py-6 mb-2">
                <h3 className="text-base font-semibold text-black-600 mb-4 flex items-center gap-2">
                  <span className="bg-green-50 p-2 rounded-full">
                    <img
                      src={education}
                      alt="education Icon"
                      className="w-6 h-6 object-contain"
                    />
                  </span>
                  Education
                </h3>
                <div
                  className="border-t my-4"
                  style={{ borderColor: "#0000001A" }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {userDetails?.education?.map((edu: any) => (
                    <div key={edu.id} className="flex items-center gap-4">
                      {/* <img
                        src={msc}
                        alt="Education Icon"
                        className="w-5 h-5 object-contain"
                      /> */}
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {edu.degree}
                        </p>
                        <p className="text-xs text-gray-500">
                          {edu.institution}
                        </p>
                        {/* Optional: Display dates if available */}
                        {(edu.start_date || edu.end_date) && (
                          <p className="text-xs text-gray-400 mt-1">
                            {edu.start_date} -{" "}
                            {edu.currently_studying ? "Present" : edu.end_date}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Experience Section */}
              <div className="bg-white rounded-xl shadow-sm px-6 py-6">
                <h3 className="text-base font-semibold text-black-600 mb-4 flex items-center gap-2">
                  <span className="bg-orange-50 p-2 rounded-full">
                    <img
                      src={work}
                      alt="work Icon"
                      className="w-5 h-5 object-contain"
                    />
                  </span>
                  Work Experience
                </h3>
                <div
                  className="border-t my-4"
                  style={{ borderColor: "#0000001A" }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {userDetails?.work_experience.map((job: any) => (
                    <div key={job.id} className="flex items-center gap-4">
                      {/* <img
                        src={google}
                        alt={`${job.company} Icon`}
                        className="w-5 h-5 object-contain"
                      /> */}
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {job.position}
                        </p>
                        <p className="text-xs text-gray-500">{job.company}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {job.start_date} -{" "}
                          {job.currently_working ? "Present" : job.end_date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm px-6 py-6 -mt-4">
              <h3 className="text-base font-semibold text-black mb-2 flex items-center gap-2">
                <span className="bg-purple-50 p-2 rounded-full">
                  <Briefcase className="w-4 h-4 text-purple-500" />
                </span>
                Services
              </h3>
              <div
                className="border-t my-2"
                style={{ borderColor: "#0000001A" }}
              />
              <div className="grid grid-cols-2 gap-4">
                {userDetails?.person_services?.map(
                  (service: any, index: any) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-gray-500">•</span>
                      <span>{service?.name}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm px-6 py-6 -mt-4">
              <h3 className="text-base font-semibold text-black mb-2 flex items-center gap-2">
                <span className="bg-purple-50 p-2 rounded-full">
                  <img
                    src={tag}
                    alt="tags Icon"
                    className="w-5 h-5 object-contain"
                  />
                </span>
                Tags
              </h3>
              <div
                className="border-t my-2"
                style={{ borderColor: "#0000001A" }}
              />
              <div className="flex flex-wrap gap-5">
                {userDetails?.person_tags?.map((tag: any, index: any) => (
                  <span
                    key={index}
                    className="bg-[#EEF3FF] text-[#7077FE] text-xs font-medium px-7 py-2 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* <div className="bg-white rounded-xl shadow-sm px-6 py-6 -mt-4">
              <h3 className="text-base font-semibold text-black mb-2 flex items-center gap-2">
                <span className="bg-green-50 p-2 rounded-full">
                  <img
                    src={bestprac}
                    alt="Best Practices Icon"
                    className="w-5 h-5 object-contain"
                  />
                </span>{" "}
                Best Practices
              </h3>
              <div
                className="border-t my-2"
                style={{ borderColor: "#0000001A" }}
              />
              <div className="flex flex-wrap gap-5"></div>
            </div> */}

            {userDetails?.best_practices_questions?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm px-6 py-8">
                <h3 className="text-lg font-semibold text-black-700 mb-4 flex items-center gap-2">
                  <span className="bg-green-50 p-2 rounded-full">
                    <img
                      src={bestprac}
                      alt="Best Practices Icon"
                      className="w-5 h-5 object-contain"
                    />
                  </span>{" "}
                  Best Practices Aligned CNESS
                </h3>
                <div
                  className="border-t my-4"
                  style={{ borderColor: "#0000001A" }}
                />

                {userDetails?.best_practices_questions?.length > 0 ? (
                  <div className="grid grid-cols-2 2xl:grid-cols-4 gap-4">
                    {userDetails?.best_practices_questions?.map(
                      (practice: any, index: any) => {
                        const cardImages = [bcard1, bcard2, bcard3, bcard4];
                        const randomImage =
                          cardImages[index % cardImages.length];

                        return (
                          <div
                            key={practice.id}
                            className="bg-white rounded-xl shadow border border-gray-100 p-3"
                          >
                            <div className="rounded-lg overflow-hidden">
                              <img
                                src={randomImage}
                                alt={`Best Practice ${index + 1}`}
                                className="w-full h-[150px] object-cover"
                              />
                            </div>
                            <p className="text-xs text-pink-500 font-medium mt-2 text-right">
                              {/* You can add time if available or remove this line */}
                            </p>

                            <div className="mt-2">
                              <h4 className="text-sm font-semibold">
                                {practice?.question?.length > 50
                                  ? `${practice.question}`
                                  : practice.question}
                              </h4>
                              {practice.answer && (
                                <>
                                  <p className="text-xs text-gray-500 mb-2">
                                    {practice.answer.answer.length > 80
                                      ? `${practice.answer.answer.substring(
                                          0,
                                          80
                                        )}...`
                                      : practice.answer.answer}
                                  </p>
                                  {practice.answer.show_answer_in_public && (
                                    <button className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                                      Read More
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No best practices available
                  </p>
                )}
              </div>
            )}

            {userDetails?.public_best_practices?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm px-6 py-8">
                <h3 className="text-lg font-semibold text-black-700 mb-4 flex items-center gap-2">
                  <span className="bg-green-50 p-2 rounded-full">
                    <img
                      src={bestprac}
                      alt="Best Practices Icon"
                      className="w-5 h-5 object-contain"
                    />
                  </span>{" "}
                  Best Practices Aligned Professions
                </h3>
                <div
                  className="border-t my-4"
                  style={{ borderColor: "#0000001A" }}
                />

                {userDetails?.public_best_practices?.length > 0 ? (
                  <div className="grid grid-cols-2 2xl:grid-cols-4 gap-4 mt-4">
                    {userDetails?.public_best_practices?.map(
                      (practice: any, index: any) => {
                        return (
                          <div
                            key={practice?.id}
                            className="bg-white rounded-xl shadow border border-gray-100 p-3 cursor-pointer"
                            onClick={() => {
                              const Id = localStorage.getItem("Id");
                              if (Id !== "undefined") {
                                navigate(
                                  `/dashboard/bestpractices/${
                                    practice.id
                                  }/${slugify(practice.title)}`,
                                  {
                                    state: {
                                      likesCount: practice.likesCount,
                                      isLiked: practice.isLiked,
                                    },
                                  }
                                );
                              } else {
                                setShowLoginPrompt(true); // Show the login prompt modal
                              }
                            }}
                          >
                            <div className="rounded-lg overflow-hidden">
                              <img
                                src={practice?.file}
                                alt={`Best Practice ${index + 1}`}
                                className="w-full h-[150px] object-cover"
                                onError={(e) => {
                                  // Fallback if the image fails to load
                                  const target = e.target as HTMLImageElement;
                                  target.src = bcard1;
                                }}
                              />
                            </div>
                            <p className="text-xs text-pink-500 font-medium mt-2 text-right"></p>

                            <div className="mt-2">
                              <h4 className="text-sm font-semibold">
                                {practice.title
                                  ? `${practice.title}`
                                  : practice.question}
                              </h4>
                              {practice.description && (
                                <>
                                  <p className="text-xs text-gray-500 mb-2">
                                    {practice.description > 80
                                      ? `${practice.description.substring(
                                          0,
                                          80
                                        )}...`
                                      : practice.description}
                                  </p>
                                  <button className="text-xs cursor-pointer px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                                    Read More
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            )}

            {/* Overall Ratings */}

            <div className="bg-white rounded-xl shadow-sm px-6 py-6 -mt-4">
              {/* Title */}
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-[#000000] flex items-center gap-2">
                  <span className="bg-[#F5EDFF] p-2 rounded-full">
                    <img
                      src={overallrating}
                      alt="overallrating Icon"
                      className="w-5 h-5 object-contain"
                    />
                  </span>
                  Overall Ratings
                </h3>
                {!userDetails?.is_rated && (
                  <div className="ms-3">
                    <Button
                      variant="gradient-primary"
                      className="rounded-[100px] cursor-pointer py-2 px-4 transition-colors duration-500 ease-in-out"
                      type="button"
                      onClick={() => {
                        const Id = localStorage.getItem("Id");
                        if (Id !== "undefined") {
                          setActiveModal("rating");
                        } else {
                          setShowLoginPrompt(true);
                        }
                      }}
                    >
                      Write Review
                    </Button>
                  </div>
                )}
              </div>

              <div
                className="border-t my-4"
                style={{ borderColor: "#0000001A" }}
              />
              {/* Grid Layout */}
              <div className="flex flex-col md:flex-row 2xl:gap-0 gap-6 w-full mt-5">
                {/* Left: Score + Bars */}
                <div className="flex flex-col items-center xl:items-start w-full md:w-1/2 gap-4">
                  <div className="flex flex-col items-center xl:items-start">
                    {typeof avgrating === "number" && !isNaN(avgrating) && (
                      <>
                        <p className="text-4xl font-bold text-purple-500 ">
                          {avgrating}
                        </p>
                        <StarRating
                          initialRating={avgrating}
                          allowHalfStars={true}
                          size="4xl"
                          readOnly
                        />
                      </>
                    )}
                    <p className="text-sm text-gray-500">{totalrate}</p>
                  </div>

                  {/* Center: Rating Bars */}

                  <div className="flex flex-col gap-2 w-full max-w-md">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 w-4 text-right">
                          {star}
                        </span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500"
                            style={{
                              width: `${
                                ratingPercentage?.[
                                  star === 5
                                    ? "five"
                                    : star === 4
                                    ? "four"
                                    : star === 3
                                    ? "three"
                                    : star === 2
                                    ? "two"
                                    : "one"
                                ] || 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Breakdown */}
                <div className="w-full xl:w-1/2 text-sm text-gray-800">
                  <p className="text-[#E57CFF] font-semibold mb-5 mt-5">
                    Ratings Breakdown
                  </p>
                  <div className="grid grid-cols-1 gap-y-2 gap-x-10  w-full max-w-[400px]">
                    {breakDown?.map((item: any, i: any) => (
                      <div
                        key={i}
                        className="flex justify-between items-center w-full gap-1"
                      >
                        <span>{formatBreakdownName(item.breakdown_name)}</span>
                        <span className="flex items-center gap-2 text-sm text-gray-800 font-medium">
                          <span className="text-yellow-500">⭐</span>
                          {item?.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews & Ratings */}
            <div className="bg-[#fff] rounded-xl shadow-sm px-6 py-6 -mt-3 mb-3">
              {/* Title */}
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                <span className="bg-[#F5EDFF] p-2 rounded-full">
                  <img
                    src={review}
                    alt="overallrating Icon"
                    className="w-5 h-5 object-contain"
                  />
                </span>{" "}
                Reviews & Ratings
              </h3>
              <div
                className="border-t my-4"
                style={{ borderColor: "#0000001A" }}
              />

              {/* Reviews List */}
              {userReviewData.length > 0 ? (
                userReviewData.map((reviewItem: any) => (
                  <div
                    key={reviewItem.id}
                    className="bg-white border border-gray-100 rounded-lg p-6 mb-1 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            reviewItem.profile.profile_picture &&
                            reviewItem.profile.profile_picture !==
                              "http://localhost:5026/file/"
                              ? reviewItem.profile.profile_picture
                              : "/profile.png"
                          }
                          alt={reviewItem.profile.name}
                          className="w-10 h-10 rounded-full"
                          onError={(e) => {
                            // Fallback if the image fails to load
                            const target = e.target as HTMLImageElement;
                            target.src = "/profile.png";
                          }}
                        />
                        <div>
                          <p className="font-medium">
                            {reviewItem.profile.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(reviewItem.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        Rating: {reviewItem.average}
                        <span className="ml-2 text-yellow-500">
                          {/* {renderStars(parseFloat(reviewItem.rating))} */}
                          <StarRating
                            initialRating={parseFloat(reviewItem.average)}
                            allowHalfStars={true}
                            size="sm"
                            readOnly
                          />
                        </span>
                      </div>
                    </div>
                    {reviewItem.review && (
                      <>
                        <p className="font-semibold text-sm text-gray-800 mb-1 break-all">
                          {reviewItem.review}
                          {/* Add a fallback if no title */}
                        </p>
                        {/* <p className="text-sm text-gray-600">
                      {reviewItem.review.description ||
                        "No detailed review provided."}
                    </p> */}
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm text-center">
                  <p className="text-gray-600">No reviews yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <Modal isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)}>
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

      <Modal isOpen={activeModal === "rating"} onClose={closeModal}>
        <div className="p-6 max-w-xl w-full mx-auto bg-white rounded-xl">
          <h2 className="text-3xl font-bold text-center text-purple-600 mb-8">
            Leave a Review
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating Sections - Now Dynamic */}
            <div className="space-y-5">
              {breakDown?.map((item: any, index: number) => {
                const breakdownKey =
                  item.breakdown_name as keyof typeof breakdowns;
                const errorKey =
                  item.breakdown_name as keyof typeof errors.breakdowns;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 mb-4"
                  >
                    <label className="w-1/2 text-sm font-medium text-purple-800">
                      <span className="font-semibold">
                        {formatBreakdownName(item.breakdown_name)}:
                      </span>
                    </label>
                    <div className="w-1/2 flex justify-start">
                      <StarRating
                        initialRating={breakdowns[breakdownKey]}
                        allowHalfStars={true}
                        size="4xl"
                        onRatingChange={(newRating: number) => {
                          setBreakdowns((prev) => ({
                            ...prev,
                            [breakdownKey]: newRating,
                          }));
                          if (errors.breakdowns[errorKey]) {
                            setErrors((prev) => ({
                              ...prev,
                              breakdowns: {
                                ...prev.breakdowns,
                                [errorKey]: "",
                              },
                            }));
                          }
                        }}
                      />
                    </div>
                    {errors.breakdowns[errorKey] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.breakdowns[errorKey]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Review Text */}
            <div>
              <label
                htmlFor="review"
                className="block text-sm font-semibold text-purple-800 mb-1"
              >
                Your Review:
              </label>
              <textarea
                id="review"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.reviewText ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm resize-none`}
                rows={4}
                placeholder="Share your experience..."
                value={reviewText}
                onChange={(e) => {
                  setReviewText(e.target.value);
                  if (errors.reviewText) {
                    setErrors((prev) => ({ ...prev, reviewText: "" }));
                  }
                }}
              />
              {errors.reviewText && (
                <p className="text-red-500 text-xs mt-1">{errors.reviewText}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-center pt-4">
              <Button
                variant="gradient-primary"
                className="rounded-full py-3 px-8 text-white font-medium shadow-md hover:shadow-lg transition"
                type="submit"
              >
                Submit Review
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
