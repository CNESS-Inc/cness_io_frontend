import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Header from "../layout/Header/Header";
import Footer from "../layout/Footer/Footer";
import inspiredbadge from "../assets/Inspired _ Badge.png";
// import bestprac from "../assets/bestprac.png";
// import bcard1 from "../assets/Bcard1.png";
// import bcard2 from "../assets/Bcard2.png";
// import bcard3 from "../assets/Bcard3.png";
// import bcard4 from "../assets/Bcard4.png";
import overallrating from "../assets/overallratings.png";
import aboutus from "../assets/aboutus.png";
import tag from "../assets/tags.png";
import work from "../assets/work.png";
import msc from "../assets/msc.png";
import education from "../assets/education.png";
import google from "../assets/google.png";
import review from "../assets/review.png";
import { useEffect, useState } from "react";
import {
  AddUserRating,
  GetUserProfileDetails,
  GetUserRating,
} from "../Common/ServerAPI";
import { useParams } from "react-router-dom";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { StarRating } from "../components/ui/Rating";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { FacebookIcon, LinkedinIcon, TwitterIcon } from "react-share";
import { Instagram } from "lucide-react";

export default function UserProfileView() {
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState<any>();
  const [activeModal, setActiveModal] = useState<"rating" | null>(null);

  const { showToast } = useToast();

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
  const [userReviewData, setUserReviewData] = useState<any>([]);

  const [breakdowns, setBreakdowns] = useState({
    one: 0,
    two: 0,
    three: 0,
    four: 0,
    five: 0,
    six: 0,
  });

  // State for errors
  const [errors, setErrors] = useState({
    reviewText: "",
    breakdowns: {
      one: "",
      two: "",
      three: "",
      four: "",
      five: "",
      six: "",
    },
  });

  // Validate form function
  const validateForm = (): boolean => {
    let valid = true;
    const newErrors = {
      reviewText: "",
      breakdowns: {
        one: "",
        two: "",
        three: "",
        four: "",
        five: "",
        six: "",
      },
    };

    // Validate each breakdown rating
    (Object.keys(breakdowns) as Array<keyof typeof breakdowns>).forEach(
      (key) => {
        if (breakdowns[key] === 0) {
          newErrors.breakdowns[key] = "Please select a rating";
          valid = false;
        }
      }
    );

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

  // Handle form submission
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const payload = {
          review: reviewText,
          user_type: "1",
          profile_id: id,
          breakdown_one: breakdowns.one.toString(),
          breakdown_two: breakdowns.two.toString(),
          breakdown_three: breakdowns.three.toString(),
          breakdown_four: breakdowns.four.toString(),
          breakdown_five: breakdowns.five.toString(),
          breakdown_six: breakdowns.six.toString(),
        };
        await AddUserRating(payload);
        setActiveModal(null);
        // Reset form on success
        setReviewText("");
        setBreakdowns({
          one: 0,
          two: 0,
          three: 0,
          four: 0,
          five: 0,
          six: 0,
        });
        await fetchRatingDetails();
      } catch (error: any) {
        setReviewText("");
        setBreakdowns({
          one: 0,
          two: 0,
          three: 0,
          four: 0,
          five: 0,
          six: 0,
        });
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
        six: "",
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

  return (
    <>
      <Header />

      <div className="min-h-screen bg-[#ECEEF2]">
        {/* Header Banner */}
        <div
          className="relative w-full h-[150px] mt-[1px] bg-cover bg-center"
          style={{ backgroundImage: `url(${userDetails?.profile_banner})` }}
        >
          <button
            onClick={() => window.history.back()}
            className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md"
          >
            <ArrowLeftIcon className="h-5 w-5 text-[#7077FE]" />
          </button>

          <button className="absolute top-4 right-4 bg-white text-sm px-4 py-1 rounded-full shadow-md">
            Enquire with us
          </button>
        </div>

        {/* Overlapping Logo - Left Aligned */}

        <div className="w-full md:w-1/3 space-y-6 relative">
          {/* Overlapping Logo */}
          <div className="absolute -top-25 left-1/2 -translate-x-1/2 sm:-translate-x-[45%] z-20">
            <div className="w-40 h-40 md:w-52 md:h-52 rounded-full border-8 border-white shadow-lg bg-white overflow-hidden">
              <img
                src={userDetails?.profile_picture}
                alt="Logo"
                className="w-full h-full object-cover"
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
                  <p className="font-medium">
                    {userDetails?.first_name} {userDetails?.last_name}
                  </p>
                  <p className="text-xs text-gray-400">User Name</p>
                </div>
                <div>
                  <p className="font-medium">{userDetails?.email}</p>
                  <p className="text-xs text-gray-400">Official mail</p>
                </div>
                <div>
                  <p className="font-medium">{userDetails?.phone_no}</p>
                  <p className="text-xs text-gray-400">
                    Official Contact Number
                  </p>
                </div>
                <div>
                  <p className="font-medium">{userDetails?.address}</p>
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
            <div className="bg-white rounded-xl shadow-sm px-4 py-4 md:py-6">
              <div className="flex items-center justify-center gap-4 text-center">
                <p className="text-sm font-medium">CNESS Badge:</p>
                <img
                  src={inspiredbadge}
                  alt="CNESS Badge"
                  className="w-[120px] md:w-[150px] object-contain"
                />
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
                      <img
                        src={msc}
                        alt="Education Icon"
                        className="w-5 h-5 object-contain"
                      />
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
                      <img
                        src={google}
                        alt={`${job.company} Icon`}
                        className="w-5 h-5 object-contain"
                      />
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

            <div className=" flex flex-col  mt-4">
              <div className="bg-white rounded-xl shadow-sm p-5">
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
                  className="border-t my-4"
                  style={{ borderColor: "#0000001A" }}
                />
                <div className="flex flex-wrap gap-5">
                  {userDetails?.person_tags?.map((tag: any, index: any) => (
                    <span
                      key={index}
                      className="bg-[#EEF3FF] text-[#7077FE] text-xs font-medium px-7 py-2 semi rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="w-full px-6 md:px-5 mt-2">
          <div className="bg-white rounded-xl shadow-sm px-6 py-8">
            <h3 className="text-lg font-semibold text-black-700 mb-4 flex items-center gap-2">
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
              className="border-t my-4"
              style={{ borderColor: "#0000001A" }}
            />

            <div className="grid grid-cols-2 2xl:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow border border-gray-100 p-3">
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={bcard1}
                    alt="Module 1"
                    className="w-full h-[150px] object-cover"
                  />
                </div>
                <p className="text-xs text-pink-500 font-medium mt-2 text-right">
                  12.00 hrs
                </p>

                <div className="mt-2">
                  <h4 className="text-sm font-semibold">
                    Module 1: Intermediate
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">
                    Exploring Advanced Techniques
                  </p>
                  <button className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    Read More
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow border border-gray-100 p-3">
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={bcard2}
                    alt="Module 1"
                    className="w-full h-[150px] object-cover"
                  />
                </div>
                <p className="text-xs text-pink-500 font-medium mt-2 text-right">
                  12.00 hrs
                </p>

                <div className="mt-2">
                  <h4 className="text-sm font-semibold">Module 3: Expert</h4>
                  <p className="text-xs text-gray-500 mb-2">
                    Mastering Complex Concepts
                  </p>
                  <button className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    Read More
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow border border-gray-100 p-3">
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={bcard3}
                    alt="Module 1"
                    className="w-full h-[150px] object-cover"
                  />
                </div>
                <p className="text-xs text-pink-500 font-medium mt-2 text-right">
                  12.00 hrs
                </p>
                <div className="mt-2">
                  <h4 className="text-sm font-semibold">
                    Module 4: Applications
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">
                    Real-World Case Studies
                  </p>
                  <button className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    Read More
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow border border-gray-100 p-3">
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={bcard4}
                    alt="Module 1"
                    className="w-full h-[150px] object-cover"
                  />
                </div>
                <p className="text-xs text-pink-500 font-medium mt-2 text-right">
                  12.00 hrs
                </p>

                <div className="mt-2">
                  <h4 className="text-sm font-semibold">Module 1: Basic</h4>
                  <p className="text-xs text-gray-500 mb-2">
                    Introduction to Fundamentals
                  </p>
                  <button className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    Read More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Overall Ratings */}

        <div className="w-full px-6 md:px-5 mt-2">
          <div className="bg-white rounded-xl shadow-sm px-6 py-8">
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
              <div className="ms-3">
                <Button
                  variant="gradient-primary"
                  className="rounded-[100px] cursor-pointer py-2 px-4 transition-colors duration-500 ease-in-out"
                  type="button"
                  onClick={() => setActiveModal("rating")}
                >
                  wite Review
                </Button>
              </div>
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
                      <p className="text-4xl font-bold text-purple-500">
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
                              (star === 5 && 85) ||
                              (star === 4 && 55) ||
                              (star === 3 && 15) ||
                              (star === 2 && 5) ||
                              3
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10  w-full max-w-[400px]">
                  {breakDown?.map((item:any, i:any) => (
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
        </div>

        {/* Reviews & Ratings */}
        <div className="w-full px-10 md:px-5 bg-[#ECEEF2] rounded-xl shadow-sm p-2 mt-2">
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
          <div className="border-t my-4" style={{ borderColor: "#0000001A" }} />

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
                        reviewItem.profile.profile_picture || "default-user.png"
                      } // fallback image
                      alt={reviewItem.profile.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{reviewItem.profile.name}</p>
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
                    <p className="font-semibold text-sm text-gray-800 mb-1">
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

      <Footer />

      <Modal isOpen={activeModal === "rating"} onClose={closeModal}>
        <div className="text-center p-6 max-w-md">
          <h2 className="text-4xl font-bold text-purple-500 mb-5">
            Leave a Review
          </h2>
          <form onSubmit={handleSubmit}>
            <div>
              {/* Breakdown Ratings */}
              <div className="mb-4">
                <label className="text-[#E57CFF] font-semibold mb-2 block">
                  Breakdown One:
                </label>
                <div className="flex justify-center">
                  <StarRating
                    initialRating={breakdowns.one}
                    allowHalfStars={true}
                    size="4xl"
                    onRatingChange={(newRating: number) => {
                      setBreakdowns((prev) => ({ ...prev, one: newRating }));
                      if (errors.breakdowns.one) {
                        setErrors((prev) => ({
                          ...prev,
                          breakdowns: { ...prev.breakdowns, one: "" },
                        }));
                      }
                    }}
                  />
                </div>
                {errors.breakdowns.one && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.breakdowns.one}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="text-[#E57CFF] font-semibold mb-2 block">
                  Breakdown Two:
                </label>
                <div className="flex justify-center">
                  <StarRating
                    initialRating={breakdowns.two}
                    allowHalfStars={true}
                    size="4xl"
                    onRatingChange={(newRating: number) => {
                      setBreakdowns((prev) => ({ ...prev, two: newRating }));
                      if (errors.breakdowns.two) {
                        setErrors((prev) => ({
                          ...prev,
                          breakdowns: { ...prev.breakdowns, two: "" },
                        }));
                      }
                    }}
                  />
                </div>
                {errors.breakdowns.two && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.breakdowns.two}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="text-[#E57CFF] font-semibold mb-2 block">
                  Breakdown Three:
                </label>
                <div className="flex justify-center">
                  <StarRating
                    initialRating={breakdowns.three}
                    allowHalfStars={true}
                    size="4xl"
                    onRatingChange={(newRating: number) => {
                      setBreakdowns((prev) => ({ ...prev, three: newRating }));
                      if (errors.breakdowns.three) {
                        setErrors((prev) => ({
                          ...prev,
                          breakdowns: { ...prev.breakdowns, three: "" },
                        }));
                      }
                    }}
                  />
                </div>
                {errors.breakdowns.three && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.breakdowns.three}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="text-[#E57CFF] font-semibold mb-2 block">
                  Breakdown Four:
                </label>
                <div className="flex justify-center">
                  <StarRating
                    initialRating={breakdowns.four}
                    allowHalfStars={true}
                    size="4xl"
                    onRatingChange={(newRating: number) => {
                      setBreakdowns((prev) => ({ ...prev, four: newRating }));
                      if (errors.breakdowns.four) {
                        setErrors((prev) => ({
                          ...prev,
                          breakdowns: { ...prev.breakdowns, four: "" },
                        }));
                      }
                    }}
                  />
                </div>
                {errors.breakdowns.four && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.breakdowns.four}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="text-[#E57CFF] font-semibold mb-2 block">
                  Breakdown Five:
                </label>
                <div className="flex justify-center">
                  <StarRating
                    initialRating={breakdowns.five}
                    allowHalfStars={true}
                    size="4xl"
                    onRatingChange={(newRating: number) => {
                      setBreakdowns((prev) => ({ ...prev, five: newRating }));
                      if (errors.breakdowns.five) {
                        setErrors((prev) => ({
                          ...prev,
                          breakdowns: { ...prev.breakdowns, five: "" },
                        }));
                      }
                    }}
                  />
                </div>
                {errors.breakdowns.five && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.breakdowns.five}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="text-[#E57CFF] font-semibold mb-2 block">
                  Breakdown Six:
                </label>
                <div className="flex justify-center">
                  <StarRating
                    initialRating={breakdowns.six}
                    allowHalfStars={true}
                    size="4xl"
                    onRatingChange={(newRating: number) => {
                      setBreakdowns((prev) => ({ ...prev, six: newRating }));
                      if (errors.breakdowns.six) {
                        setErrors((prev) => ({
                          ...prev,
                          breakdowns: { ...prev.breakdowns, six: "" },
                        }));
                      }
                    }}
                  />
                </div>
                {errors.breakdowns.six && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.breakdowns.six}
                  </p>
                )}
              </div>

              {/* Review Text */}
              <div className="mb-4">
                <label
                  className="text-[#E57CFF] font-semibold mt-5"
                  htmlFor="review"
                >
                  Your Review:
                </label>
                <textarea
                  id="review"
                  className={`w-full mt-3 px-4 py-2 border ${
                    errors.reviewText ? "border-red-500" : "border-gray-300"
                  } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.reviewText}
                  </p>
                )}
              </div>
            </div>
            <div className="">
              <Button
                variant="gradient-primary"
                className="rounded-[100px] cursor-pointer py-3 px-8 transition-colors duration-500 ease-in-out"
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
