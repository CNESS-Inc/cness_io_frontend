import { MapPin, Phone, Mail, Globe, Clock4, Music, BookOpen, Star, MessageSquareMoreIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import EnquiryModal from "../components/directory/Enquire";
import { GetDirectoryProfileByUserId } from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";

const DirectoryProfile = () => {
  const [expanded, setExpanded] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [expandedPractices, setExpandedPractices] = useState<Set<string>>(new Set());
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  // Get user_id from URL params, search params, or localStorage
  const userId = id || searchParams.get("user_id") || localStorage.getItem("Id") || "";

  useEffect(() => {
    const fetchDirectoryProfile = async () => {
      if (!userId) {
        showToast({
          message: "User ID is required",
          type: "error",
          duration: 3000,
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await GetDirectoryProfileByUserId(userId);
        if (response?.success?.status && response?.data?.data) {
          setProfileData(response.data.data);
        } else {
          showToast({
            message: response?.error?.message || "Failed to load directory profile",
            type: "error",
            duration: 3000,
          });
        }
      } catch (error: any) {
        showToast({
          message: error?.response?.data?.error?.message || "Failed to load directory profile",
          type: "error",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDirectoryProfile();
  }, [userId]);

  if (loading) {
    return (
      <main className="flex-1 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-[#64748B]">Loading...</div>
        </div>
      </main>
    );
  }

  if (!profileData) {
    return (
      <main className="flex-1 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-[#64748B]">No profile data available</div>
        </div>
      </main>
    );
  }

  const businessProfile = profileData.bussiness_profile || {};
  const userProfile = profileData.user_profile || {};
  const contactInfo = profileData.contact_information || {};
  const businessHours = contactInfo.business_hours || {};
  const photos = profileData.photos || [];
  const services = profileData.service_offered || [];
  const bestPractices = profileData.best_practies || [];
  const products = profileData.products || [];

  // Format business hours based on business_status
  const formatBusinessHours = () => {
    if (businessHours.business_status === 1 && businessHours.weekly_hours) {
      // Type 1: Regular hours with weekly schedule
      const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      const displayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

      return (
        <div className="grid grid-cols-2 gap-x-8 w-max">
          {displayNames.map((displayName, idx) => {
            const day = dayNames[idx];
            const dayHours = businessHours.weekly_hours.find((h: any) => h.day === day);
            let timeContent;
            if (dayHours && dayHours.is_open) {
              const openTime = new Date(`2000-01-01T${dayHours.open_time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
              const closeTime = new Date(`2000-01-01T${dayHours.close_time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
              timeContent = `${openTime} - ${closeTime}`;
            } else {
              timeContent = 'Closed';
            }
            return (
              <React.Fragment key={day}>
                <div className="font-['open_sans'] text-[14px] text-[#64748B] mb-1">{displayName}</div>
                <div className="font-['open_sans'] text-[14px] text-[#64748B] mb-1">{timeContent}</div>
              </React.Fragment>
            );
          })}
        </div>
      );
    } else if (businessHours.business_status === 2) {
      // Type 2: Temporarily closed with dates
      const startDate = businessHours.temporary_close_start_date
        ? new Date(businessHours.temporary_close_start_date).toLocaleDateString()
        : "";
      const endDate = businessHours.temporary_close_end_date
        ? new Date(businessHours.temporary_close_end_date).toLocaleDateString()
        : "";
      return (
        <div className="text-[#64748B]">
          <p className="font-['open_sans'] text-[14px]">Temporarily closed</p>
          {startDate && endDate && (
            <p className="font-['open_sans'] text-[14px] mt-1">
              From {startDate} to {endDate}
            </p>
          )}
        </div>
      );
    } else if (businessHours.business_status === 3) {
      // Type 3: Permanently closed
      return (
        <div className="text-[#64748B]">
          <p className="font-['open_sans'] text-[14px]">Permanently closed</p>
        </div>
      );
    }
    return null;
  };

  const aboutText = businessProfile.about || "";
  const shortText = aboutText.length > 140 ? aboutText.slice(0, 140) + "..." : aboutText;
  const fullText = aboutText;

  const directoryData = {
    name: businessProfile.bussiness_name || "",
    logo_url: businessProfile.logo_url || "",
    city: userProfile.state?.name || "",
    country: userProfile.country?.name || "",
    directory_info_id: businessProfile.id || ""
  };

  // Format phone number
  const formatPhone = () => {
    if (contactInfo.mobile_code && contactInfo.mobile_no) {
      return `+${contactInfo.mobile_code} ${contactInfo.mobile_no}`;
    }
    return "N/A";
  };

  // Format member since date
  const formatMemberSince = () => {
    if (userProfile.createdAt) {
      const date = new Date(userProfile.createdAt);
      return date.getFullYear().toString();
    }
    return "";
  };
  return (

    <>
      {/* Profile Section */}
      <main className="flex-1 p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <section className="bg-white rounded-xl p-4">
            <div className="flex items-start space-x-4">
              <img
                src={businessProfile.logo_url || "https://static.codia.ai/image/2025-12-04/DUvvvgriSA.png"}
                alt="Profile"
                className="w-20 h-20 rounded-full border border-[#ECEEF2] object-cover"
              />

              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-[Poppins] font-semibold text-[#081021]">
                    {businessProfile.bussiness_name || "Business Name"}
                  </h2>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      {/* Filled stars */}
                      {Array.from({ length: Math.floor(parseFloat(businessProfile.rating_average || "0")) }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-[#FACC15] fill-[#FACC15]"
                          strokeWidth={1.5}
                        />
                      ))}

                      {/* Empty stars */}
                      {Array.from({ length: 5 - Math.floor(parseFloat(businessProfile.rating_average || "0")) }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-[#94A3B8]"
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>
                    <span className="text-black">{businessProfile.rating_average || "0"}</span>
                  </div>

                  <p className="text-[#64748B] leading-6 font-['open_sans']">
                    {expanded ? fullText : shortText}

                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="text-[#F07EFF] font-['open_sans'] font-semibold ml-2"
                    >
                      {expanded ? "Read less" : "Read more"}
                    </button>        </p>
                </div>

                <button
                  onClick={() => setShowEnquiry(true)}
                  className="bg-[#7077FE] text-white px-5 py-2 rounded-full font-semibold text-sm"
                >
                  Enquire now
                </button>


              </div>
            </div>
          </section>
          {/* User Information Section */}
          <section className="bg-white rounded-xl p-4 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-white">
                <img
                  src={userProfile.profile_picture || "https://static.codia.ai/image/2025-12-04/s7mmhLwgmO.png"}
                  alt={`${userProfile.first_name || ""} ${userProfile.last_name || ""}`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-[Poppins] font-semibold text-[#081021]">
                  {`${userProfile.first_name || ""} ${userProfile.last_name || ""}`.trim() || "User Name"}
                </h3>

                <div className="flex items-center space-x-2 text-[#64748B] font-['open_sans']">
                  {userProfile.state?.name && userProfile.country?.name && (
                    <>
                      <span>{userProfile.state.name}, {userProfile.country.name}</span>
                      {formatMemberSince() && (
                        <>
                          <div className="w-1 h-1 bg-[#94A3B8] rounded-full font-['open_sans']" />
                          <span>Member since {formatMemberSince()}</span>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <div className="flex-1 space-y-1.5">
                <h4 className="font-[Poppins] font-medium text-black">Interests</h4>

                <div className="flex flex-wrap gap-1">
                  {userProfile.interests && userProfile.interests.length > 0 ? (
                    userProfile.interests.map((interest: any) => (
                      <span
                        key={interest.id}
                        className="px-3 py-1.5 bg-[#F7F7F7] border border-[#ECEEF2] rounded-full text-xs text-[#64748B]"
                      >
                        {interest.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-[#64748B] text-xs">No interests</span>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-1.5">
                <h4 className="font-[Poppins] font-medium text-black">Profession</h4>

                <div className="flex gap-2">
                  {userProfile.professions && userProfile.professions.length > 0 ? (
                    userProfile.professions.map((profession: any) => (
                      <span
                        key={profession.id}
                        className="px-5 py-1 bg-[#F7F7F7] border border-[#ECEEF2] rounded-full text-xs text-[#64748B]"
                      >
                        {profession.title}
                      </span>
                    ))
                  ) : (
                    <span className="text-[#64748B] text-xs">No professions</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center -space-x-2">
                {profileData.friend_profile_pics && profileData.friend_profile_pics.length > 0 ? (
                  <>
                    {profileData.friend_profile_pics.slice(0, 3).map((pic: string, i: number) => (
                      <img
                        key={i}
                        src={pic}
                        className="w-10 h-10 rounded-full border-2 border-white object-cover"
                        alt={`Friend ${i + 1}`}
                      />
                    ))}
                    {profileData.friend_count > 3 && (
                      <div className="w-10 h-10 bg-[#FFE4F5] rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-[#F07EFF] font-bold text-sm">{profileData.friend_count - 3}+</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-10 h-10 bg-[#FFE4F5] rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-[#F07EFF] font-bold text-sm">{profileData.friend_count || 0}</span>
                  </div>
                )}
              </div>

              <button className="bg-[#7077FE] text-white px-5 py-2 rounded-full font-semibold text-sm">
                {profileData.is_friend ? "Connected" : "Connect now"}
              </button>
            </div>
          </section>
        </div>
        {/* Services Offered Section */}
        <section className="bg-white rounded-xl p-4 space-y-4">
          <h3 className="text-xl font-[Poppins] font-semibold text-[#081021]">
            Services Offered
          </h3>

          <div className="flex items-center space-x-7 flex-wrap gap-2">
            {services.length > 0 ? (
              services.map((service: any) => (
                <span key={service.id} className="font-['open_sans'] font-semibold text-[#081021]">
                  {service.name}
                </span>
              ))
            ) : (
              <span className="text-[#64748B]">No services offered</span>
            )}
          </div>
        </section>
        {/* Photos Section */}
        <section className="bg-white border border-[#F7F7F7] rounded-xl p-4 space-y-4">
          <div className="flex items-end justify-between">
            <h3 className="text-xl font-[Poppins] font-semibold text-[#081021]">
              Photos
            </h3>

            {photos.length > 4 && (
              <div className="flex items-center space-x-1.5 text-[#7077FE]">
                <span className="font-[Poppins] font-medium cursor-pointer">See all {photos.length} photos</span>
                <svg className="w-3 h-2" viewBox="0 0 13 10" fill="currentColor">
                  <path d="M8 1L12 5L8 9M12 5H1" />
                </svg>
              </div>
            )}
          </div>

          {photos.length > 0 ? (
            <div className="grid grid-cols-4 gap-3">
              {photos.slice(0, 4).map((photo: any) => (
                <div key={photo.id} className="aspect-square bg-[#FFE4F5] rounded-lg overflow-hidden">
                  <img
                    src={photo.file}
                    alt={`Photo ${photo.id}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[#64748B] text-center py-8">No photos available</div>
          )}
        </section>
        {/* Contact Information Section */}
        <section className="bg-white rounded-xl p-4 space-y-4">
          <h3 className="text-xl font-[Poppins] font-semibold text-[#081021]">
            Contact Information
          </h3>

          <div className="space-y-4">

            {/* Address */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">

                <MapPin className="w-4 h-4 text-[#D1D5DB]" />
                <span className="font-['open_sans'] font-semibold text-[#081021]">Address</span>
              </div>
              <p className="font-['open_sans'] text-[14px] text-[#64748B]">
                {contactInfo.address || userProfile.address || "No address provided"}
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#D1D5DB] fill-[#D1D5DB]" />
                <span className="font-['open_sans'] font-semibold text-[#081021]">Phone</span>
              </div>
              <p className="font-['open_sans'] text-[14px] text-[#64748B]">{formatPhone()}</p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#D1D5DB]" />
                <span className="font-['open_sans'] font-semibold text-[#081021]">Email</span>
              </div>
              <p className="font-['open_sans'] text-[14px] text-[#64748B]">{contactInfo.email || "N/A"}</p>
            </div>

            {/* Website */}
            {contactInfo.website && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-[#D1D5DB]" />
                  <span className="font-['open_sans'] font-semibold text-[#081021]">Website</span>
                </div>
                <p className="font-['open_sans'] text-[14px] text-[#64748B]">
                  <a href={contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-[#7077FE] hover:underline">
                    {contactInfo.website}
                  </a>
                </p>
              </div>
            )}

            {/* Business Timings */}
            {businessHours.business_status && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-[#D1D5DB] flex items-center justify-center">
                    <Clock4 className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-['open_sans'] font-semibold text-[#081021]">Bussiness timings</span>
                </div>
                {formatBusinessHours()}
              </div>
            )}

          </div>
        </section>
        {/* Best Practice Section */}

        <div className="grid grid-cols-2 gap-4">
          {bestPractices.length > 0 &&
            <section className="bg-white rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-[Poppins] font-semibold text-[#081021]">
                  Best practice
                </h3>

                <span className="text-[#F07EFF] font-semibold text-xs cursor-pointer">
                  View all
                </span>
              </div>

              <div className="space-y-3">
                {bestPractices.length > 0 ? (
                  bestPractices.map((item: any) => {
                    const description = item.description || "";
                    const isExpanded = expandedPractices.has(item.id);
                    const shouldTruncate = description.length >= 100;
                    const displayText = shouldTruncate && !isExpanded 
                      ? description.slice(0, 100) + "..."
                      : description;

                    const toggleExpand = () => {
                      setExpandedPractices(prev => {
                        const newSet = new Set(prev);
                        if (newSet.has(item.id)) {
                          newSet.delete(item.id);
                        } else {
                          newSet.add(item.id);
                        }
                        return newSet;
                      });
                    };

                    return (
                      <div
                        key={item.id}
                        className="bg-white border border-[#ECEEF2] rounded-xl p-3 flex space-x-2"
                      >
                        <img
                          src={item.file}
                          alt="Practice"
                          className="w-[216px] h-[150px] rounded-lg object-cover"
                        />

                        <div className="flex-1 space-y-4">
                          <div className="space-y-1">
                            <h4 className="font-[Poppins] font-semibold text-[#1F2937]">
                              {item.title}
                            </h4>

                            <p className="font-['open_sans'] font-normal text-[14px] text-[#1F2937] leading-relaxed">
                              {displayText}
                              {shouldTruncate && (
                                <>
                                  {" "}
                                  <button
                                    onClick={toggleExpand}
                                    className="text-[#F07EFF] font-['open_sans'] font-semibold hover:underline"
                                  >
                                    {isExpanded ? "Read Less" : "Read More"}
                                  </button>
                                </>
                              )}
                            </p>
                          </div>

                          <button className="bg-[#7077FE] text-white px-6 py-3 rounded-full font-Rubik font-normal text-[14px] leading-[100%] tracking-[0px] text-center capitalize">
                            {item.is_following ? "Following" : "Follow"}
                          </button>

                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-[#64748B] text-center py-8">No best practices available</div>
                )}
              </div>
            </section>
          }

          {/* Products Section */}
          {products.length > 0 &&
            <section className="bg-white rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-[Poppins] font-semibold text-[#081021]">
                  Products
                </h3>

                <span className="text-[#F07EFF] font-semibold text-xs cursor-pointer">
                  View all
                </span>
              </div>

              <div className="space-y-3">
                {products.length > 0 ? (
                  products.slice(0, 3).map((product: any, index: number) => (
                    <div
                      key={index}
                      className="bg-gradient-to-b from-[#F1F3FF] to-white border border-[#ECEEF2] rounded-xl p-4 flex space-x-4"
                    >
                      {/* IMAGE + HEART WRAPPER */}
                      <div className="relative">
                        <img
                          src={product.thumbnail_url || "https://static.codia.ai/image/2025-12-04/LfjsJkrBT4.png"}
                          alt={product.title}
                          className="w-[196px] h-[156px] rounded-3xl object-cover"
                        />

                        {/* Heart Button Over Image */}
                        <button className="absolute top-3 right-3 w-10 h-10 bg-[#1F2937] bg-opacity-90 rounded-full flex items-center justify-center shadow-md">
                          <svg className="w-5 h-5 " viewBox="0 0 20 20" stroke="white">
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                          </svg>
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-2">
                        <div className="space-y-1">

                          {/* Category Badge */}
                          <div className="inline-flex items-center space-x-3 bg-opacity-10 rounded-full px-3 py-1">
                            <span
                              className={`text-xs font-[Poppins] ${product.category === "Music" ? "text-[#F07EFF]" : "text-[#7077FE]"
                                }`}
                            >
                              {product.category}
                            </span>

                            {/* ICONS BASED ON CATEGORY */}
                            {product.category === "Music" ? (
                              <Music
                                className="w-4 h-4 text-[#F07EFF]"
                                strokeWidth={2}
                              />
                            ) : (
                              <BookOpen
                                className="w-4 h-4 text-[#7077FE]"
                                strokeWidth={2}
                              />
                            )}
                          </div>

                          {/* Title */}
                          <h4 className="font-[Poppins] font-semibold text-[#1F2937]">
                            {product.title}
                          </h4>

                          {/* Rating Section */}
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              {Array.from({ length: Math.floor(product.rating_average || 0) }).map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 text-[#FACC15] fill-[#FACC15]"
                                  strokeWidth={1.2}
                                />
                              ))}
                              {Array.from({ length: 5 - Math.floor(product.rating_average || 0) }).map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 text-[#94A3B8]"
                                  strokeWidth={1.2}
                                />
                              ))}
                            </div>

                            <div className="flex items-center space-x-1">
                              <MessageSquareMoreIcon className="w-4 h-4 text-[#9CA3AF]" />
                              <span className="text-[#9CA3AF] font-[Poppins] font-medium">{product.review_count || 0}</span>
                            </div>
                          </div>

                          {/* Author */}
                          {product.profile && (
                            <div className="flex items-center space-x-2">
                              <img
                                src={product.profile.profile_picture || "https://static.codia.ai/image/2025-12-04/EKAU1ouAu0.png"}
                                alt={`${product.profile.first_name} ${product.profile.last_name}`}
                                className="w-5 h-6 rounded-lg object-cover"
                              />
                              <span className="font-['open_sans'] font-semibold text-xs text-[#1F2937]">
                                {`${product.profile.first_name || ""} ${product.profile.last_name || ""}`.trim()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Price + Button */}
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            {product.discount_percentage && parseFloat(product.discount_percentage) > 0 && (
                              <div className="flex items-center space-x-3">
                                <span className="text-[#9CA3AF] font-[Poppins] font-medium line-through">
                                  ${product.price}
                                </span>
                                <div className="bg-[#EBF2FF] px-2 py-1 rounded text-xs font-Inter font-medium text-[#1E3A8A]">
                                  -{product.discount_percentage}%
                                </div>
                              </div>
                            )}
                            <div className="text-xl font-[Poppins] font-semibold text-[#1F2937]">
                              ${product.final_price || product.price}
                            </div>
                          </div>

                          <button className="bg-[#7077FE] text-white px-8 py-3 rounded-full font-Rubik font-normal text-[14px] leading-[100%] capitalize">
                            Buy
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-[#64748B] text-center py-8">No products available</div>
                )}
              </div>
            </section>
          }
        </div>
        <section className="bg-white rounded-xl p-4 space-y-4">

          {/* Post Review Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-[Poppins] font-semibold text-[#081021]">
              Post your review
            </h3>

            {/* Star Rating */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                {/* Filled stars */}
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 text-[#FACC15] fill-[#FACC15]"
                    strokeWidth={1.5}
                  />
                ))}

                {/* Outlined stars */}
                {[4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 text-[#9CA3AF]"
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <span className="text-black text-sm">3</span>
            </div>

            {/* Comment Box */}
            <div className="space-y-2">
              <div className="border border-[#D1D5DB] rounded-2xl p-5 min-h-[170px] flex flex-col justify-between">
                <p className="font-['open_sans'] text-[#9CA3AF]">Post a comment...</p>

                <div className="flex justify-end items-end space-x-3">
                  <div className="bg-white px-3 py-2 rounded-full">
                    <span className="font-['open_sans'] text-[#9CA3AF] text-[12px]">
                      2000 Characters remaining
                    </span>
                  </div>

                  <button className="bg-gradient-to-r from-[#7077FE] to-[#F07EFF] text-white px-5 py-3 rounded-full font-[Poppins] font-semibold text-sm">
                    Submit
                  </button>
                </div>
              </div>

              <p className="font-['open_sans'] text-sm text-[#1F2937] leading-relaxed">
                Please note that this community is actively moderated according to
                <span className="text-[#6B21A8]"> CNESS community rules</span>
              </p>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            <h3 className="text-lg font-[Poppins] font-semibold text-[#081021]">
              All Reviews
            </h3>

            <div className="space-y-5">
              {[1, 2].map((review) => (
                <div key={review} className="bg-[#F9FAFB] rounded-lg p-4 space-y-5">

                  {/* Reviewer + Comment */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-[Poppins] font-semibold text-black">
                        John Doe
                      </span>
                      <div className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full"></div>
                      <span className="font-['open_sans']  text-[#9CA3AF] text-xs">Today</span>
                    </div>

                    <p className="font-['open_sans'] text-xs text-[#1F2937] leading-relaxed">
                      We should also take into consideration other factors in detecting hate
                      speech. In case the algorithm mistakenly flags a comment as hate speech.
                    </p>
                  </div>

                  {/* Like / Reply Section */}
                  <div className="flex items-center space-x-2 p-2">

                    {/* Like Icon */}
                    <svg className="w-6 h-6 text-[#1F2937]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558-.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777z" />
                    </svg>

                    {/* Divider */}
                    <div className="w-px h-5 bg-[#D1D5DB]"></div>

                    {/* Reply Button */}
                    <div className="flex items-center space-x-1 bg-transparent px-2 py-1 rounded-full">
                      <svg className="w-6 h-6 text-[#1F2937]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.73 5.5h1.035A7.465 7.465 0 0118 9.625a7.465 7.465 0 01-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 01-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322 1.672V21a.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25c0-1.152.26-2.243.723-3.218C7.74 15.724 7.366 15 6.748 15H3.622c-1.026 0-1.945-.694-2.054-1.715A12.134 12.134 0 011.5 12c0-2.848.992-5.464 2.649-7.521C4.537 3.997 5.136 3.75 5.754 3.75h1.616c.483 0 .964.078 1.423.23l3.114 1.04a4.5 4.5 0 001.423.23h2.394z" />
                      </svg>
                      <span className="font-['open_sans'] text-[#1F2937] text-xs">Reply</span>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          </div>

        </section>
      </main>
      <EnquiryModal
        open={showEnquiry}
        onClose={() => setShowEnquiry(false)}
        directory={directoryData}
      />
    </>
  )
}

export default DirectoryProfile
