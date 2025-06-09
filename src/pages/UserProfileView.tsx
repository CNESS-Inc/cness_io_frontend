import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Header from "../layout/Header/Header";
import Footer from "../layout/Footer/Footer";
import inspiredbadge from "../assets/Inspired _ Badge.png";
import bestprac from "../assets/bestprac.png";
import bcard1 from "../assets/Bcard1.png";
import bcard2 from "../assets/Bcard2.png";
import bcard3 from "../assets/Bcard3.png";
import bcard4 from "../assets/Bcard4.png";
import overallrating from "../assets/overallratings.png";
import john from "../assets/john.png";
import smith from "../assets/smith.png";
import aboutus from "../assets/aboutus.png";
import tag from "../assets/tags.png";
import work from "../assets/work.png";
import msc from "../assets/msc.png";
import education from "../assets/education.png";
import google from "../assets/google.png";
import review from "../assets/review.png";
import { useEffect, useState } from "react";
import { GetUserProfileDetails } from "../Common/ServerAPI";
import { useParams } from "react-router-dom";
import { useToast } from "../components/ui/Toast/ToastProvider";

export default function UserProfileView() {
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState<any>();
  console.log("🚀 ~ UserProfileView ~ userDetails:", userDetails);

  const { showToast } = useToast()

  const fetchUserDetails = async () => {
    try {
      const res = await GetUserProfileDetails(id);
      setUserDetails(res?.data?.data);
    } catch (error:any) {
      showToast({
        message:error?.response?.data?.error?.message,
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
        <p className="text-sm text-gray-500">Stella Innovation</p>
      </div>

      <div className="border-t my-4" style={{ borderColor: "#0000001A" }} />

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
          <p className="text-xs text-gray-400">Official Contact Number</p>
        </div>
        <div>
          <p className="font-medium">{userDetails?.address}</p>
          <p className="text-xs text-gray-400">Address</p>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="flex flex-col items-start space-y-2 mt-6">
        <div className="flex space-x-4 text-gray-800 text-xl">
          <span className="fab fa-facebook-f"></span>
          <span className="fab fa-twitter"></span>
          <span className="fab fa-instagram"></span>
        </div>
        <p className="text-xs text-gray-500">Social Media</p>
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
                {userDetails?.bio}
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
                      <p className="text-xs text-gray-500">{edu.institution}</p>
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
                  {userDetails?.work_experience.map((job:any) => (
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
                  <span className="bg-[#EEF3FF] text-[#7077FE] text-xs font-medium px-7 py-2 semi rounded">
                    Tag 1
                  </span>
                  <span className="bg-[#EEF3FF] text-[#7077FE] text-xs font-medium px-7 py-2 semi rounded">
                    Tag 2
                  </span>
                  <span className="bg-[#EEF3FF] text-[#7077FE] text-xs font-medium px-7 py-2 semi rounded">
                    Tag 3
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full px-6 md:px-5 mt-2">
          {/* Section Title */}
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

            {/* Card Grid */}
<div className="grid grid-cols-2 2xl:grid-cols-4 gap-4">
              {/* Card 1 */}
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

              {/* Card 2 */}
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

              {/* Card 3 */}
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

              {/* Card 4 */}
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
        </div>

        {/* Overall Ratings */}

<div className="w-full px-6 md:px-5 mt-2">
  <div className="bg-white rounded-xl shadow-sm px-6 py-8">
            {/* Title */}
    <h3 className="text-lg font-semibold text-[#000000] mb-4 flex items-center gap-2">
              <span className="bg-[#F5EDFF] p-2 rounded-full">
                <img
                  src={overallrating}
                  alt="overallrating Icon"
                  className="w-5 h-5 object-contain"
                />
              </span>
              Overall Ratings
            </h3>

            <div
              className="border-t my-4"
              style={{ borderColor: "#0000001A" }}
            />

            {/* Grid Layout */}
<div className="flex flex-col 2xl:flex-row 2xl:gap-0 gap-6 w-full mt-5">
      {/* Left: Score + Bars */}
      <div className="flex flex-col items-center xl:items-start w-full lg:w-1/2 gap-4">
        <div className="flex flex-col items-center xl:items-start">
          <p className="text-4xl font-bold text-purple-500">4.5</p>
          <div className="text-yellow-500 text-sm">★★★★★</div>
          <p className="text-sm text-gray-500">2,256,896</p>
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
              {/* Right: Ratings Breakdown */}
      <div className="w-full xl:w-1/2 text-sm text-gray-800">
                <p className="text-[#E57CFF] font-semibold mb-5 mt-5">
                  Ratings Break down
                </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10  w-full max-w-[400px]">
                  {[
                    { label: "Breakdown 1", score: 4.1 },
                    { label: "Breakdown 2", score: 4.0 },
                    { label: "Breakdown 3", score: 3.9 },
                    { label: "Breakdown 4", score: 4.0 },
                    { label: "Breakdown 5", score: 4.0 },
                  ].map((item, i) => (
                    <div
                      key={i}
className="flex justify-between items-center w-full gap-1"
                    >
                      <span>{item.label}</span>
              <span className="flex items-center gap-2 text-sm text-gray-800 font-medium">
                        <span className="text-yellow-500">⭐</span>
                        {item.score.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews & Ratings */}
        <div className="w-full px-10 md:px-5  bg-[#ECEEF2]  rounded-xl shadow-sm p-2 mt-2">
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

          {/* Review 1 */}
          <div className="bg-white border border-gray-100 rounded-lg p-6 mb-1 shadow-sm  ">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <img
                  src={smith}
                  alt="Smith"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium">Smith</p>
                  <p className="text-xs text-gray-400">25, Nov 2025</p>
                </div>
              </div>
              <div className="text-sm font-medium">
                Rating: 3.0
                <span className="ml-2 text-yellow-500">⭐⭐⭐☆☆</span>
              </div>
            </div>
            <p className="font-semibold text-sm text-gray-800 mb-1">
              Your Enthusiasm For This Product Is Fantastic! Keep Up That
              Positive Energy!
            </p>
            <p className="text-sm text-gray-600">
              Your project demonstrates a strong understanding of the concepts
              we've discussed. The structure is clear, and your attention to
              detail is commendable. I encourage you to explore further how
              these elements interact in real-world applications. Great job!
            </p>
          </div>

          {/* Review 2 */}
          <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm ">
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-3">
                <img src={john} alt="John" className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-medium">John</p>
                  <p className="text-xs text-gray-400">25, Nov 2025</p>
                </div>
              </div>
              <div className="text-sm font-medium">
                Rating: 4.0
                <span className="ml-2 text-yellow-500">⭐⭐⭐⭐☆</span>
              </div>
            </div>
            <p className="font-semibold text-sm text-gray-800 mb-1">
              It's Fantastic To See Your Enthusiasm For This Product! Keep That
              Energy Going!
            </p>
            <p className="text-sm text-gray-600">
              You've done a great job on your project! The clarity of your ideas
              is commendable, and your attention to detail stands out. I
              encourage you to explore how these elements apply in practical
              situations. Great work!
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
