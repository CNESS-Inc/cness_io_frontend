import React, { useEffect, useState } from "react";

import {
  GetAllPlanDetails,
  getSubscriptionDetails,
  MeDetails,
  UpdatePasswordDetails,
} from "../Common/ServerAPI";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Button from "../components/ui/Button";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { FaArrowUp, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface SubscriptionData {
  plan_active: boolean;
  is_badge_active: boolean;
  id: string;
  user_id: string;
  plan_type: string;
  start_date: string;
  end_date: string;
  createdAt: string;
  updatedAt: string;
  level: {
    id: string;
    level: string;
    user_type: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
  };
}

type BasicInfoData = {
  id: string;
  email: string;
  name: string;
  main_name: string;
  margaret_name: string;
  username: string;
  email_verified: boolean;
  profile_picture: string;
  is_disqualify: boolean;
  completed_step: number;
  person_organization_complete: number;
  createdAt: string;
};

const Setting = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"billing" | "password" | "basic">(
    "basic"
  );
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null
  );
  console.log("🚀 ~ Setting ~ subscription:", subscription)
  const [loading, setLoading] = useState(true);
  const [isAnnual] = useState(true);
  const { showToast } = useToast();
  const [basicData, setBasicData] = useState<BasicInfoData | null>(null);

  const planType = (subscription?.plan_type ?? "").trim();
  const isMonthly = /month/i.test(planType); // true if plan type contains "month"
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    const payload = {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };

    try {
      const res = await UpdatePasswordDetails(payload);

      if (res && res.success && res.success.message) {
        setMessage(res.success.message);
      } else {
        setMessage("Password updated successfully.");
      }
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const fetchSubscriptionDetails = async () => {
    try {
      setLoading(true);
      const res = await getSubscriptionDetails();
      if (res?.data?.data) {
        setSubscription(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching subscription details:", error);
    } finally {
      setLoading(false);
    }
  };

  const MeDetail = async () => {
    try {
      setLoading(true);
      const response = await MeDetails();
      console.log(response?.data?.data?.user, "response?.data?.data?.user");
      setBasicData(response?.data?.data?.user);
    } catch (error) {
      console.error("Error fetching me details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionDetails();
    MeDetail();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const openPricingModal = async () => {
    try {
      const res = await GetAllPlanDetails();
      const plansByRange: Record<string, any> = {};
      res?.data?.data?.forEach((plan: any) => {
        if (!plansByRange[plan.plan_range]) {
          plansByRange[plan.plan_range] = {};
        }
        plansByRange[plan.plan_range][plan.plan_type] = plan;
      });
      const updatedPlans = Object.values(plansByRange)?.map(
        (planGroup: any) => {
          const monthlyPlan = planGroup.monthly;
          const yearlyPlan = planGroup.yearly;

          return {
            id: monthlyPlan?.id || yearlyPlan?.id,
            title: monthlyPlan?.plan_range || yearlyPlan?.plan_range,
            description:
              "This helps us support your experience and gives you access to all premium features.",
            monthlyPrice: monthlyPlan ? `$${monthlyPlan.amount}` : undefined,
            yearlyPrice: yearlyPlan ? `$${yearlyPlan.amount}` : undefined,
            period: isAnnual ? "/year" : "/month",
            billingNote: yearlyPlan
              ? isAnnual
                ? `Billed ${isAnnual ? `annually` : `monthly`} ($${
                    yearlyPlan.amount
                  })`
                : `or $${monthlyPlan?.amount}/month`
              : undefined,
            features: [],
            buttonText: "Pay Now",
            buttonClass: yearlyPlan
              ? ""
              : "bg-gray-100 text-gray-800 hover:bg-gray-200",
            borderClass: yearlyPlan ? "border-2 border-[#F07EFF]" : "border",
            popular: !!yearlyPlan,
            monthlyPlanData: monthlyPlan, // Keep original data if needed
            yearlyPlanData: yearlyPlan, // Keep original data if needed
          };
        }
      );

      navigate("/dashboard/aspiring-assessment/payment", {
        state: {
          plans: updatedPlans,
          isAnnual: isAnnual,
          assessmentSubmitted: true,
        },
      });
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };


  return (
    <>
      <div className="w-full min-h-screen mt-8">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6 mt-8">
          <button
            className={`px-4 py-2 cursor-pointer font-medium ${
              activeTab === "basic"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("basic")}
          >
            Basic
          </button>
          <button
            className={`px-4 py-2 cursor-pointer font-medium ${
              activeTab === "password"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("password")}
          >
            Password
          </button>
          <button
            className={`px-4 py-2 cursor-pointer font-medium ${
              activeTab === "billing"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("billing")}
          >
            Billing
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "billing" && (
          <div className="min-h-screen bg-white p-6 font-sans">
            <h3 className="text-lg font-semibold mb-4">Your Billing Status</h3>

            <div className="bg-white border border-gray-200 rounded-md overflow-hidden p-6">
              {loading ? (
                <LoadingSpinner />
              ) : subscription?.plan_active ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">
                      Plan Status:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        subscription.plan_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {subscription.plan_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">
                      Plan Type:
                    </span>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <span className="text-gray-600">
                        {subscription.plan_type}
                      </span>

                      {isMonthly && (
                        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8">
                            <div className="absolute transform rotate-45 bg-blue-500 text-white text-xs py-1 right-[-35px] top-8 w-[140px] text-center">
                              Recommended
                            </div>
                          </div>

                          <div className="flex items-start space-x-4">
                            <div className="bg-blue-100 p-3 rounded-full">
                              <FaArrowUp className="text-blue-600 h-6 w-6" />
                            </div>

                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-blue-900 mb-2">
                                Upgrade to Annual Plan
                              </h3>
                              <p className="text-blue-700 mb-4">
                                Save up to 20% with our annual plan and get
                                access to all features with no interruption for
                                a full year.
                              </p>

                              <div className="flex flex-wrap gap-3 mt-2">
                                <Button
                                  onClick={openPricingModal}
                                  variant="primary"
                                  className="flex items-center gap-2"
                                >
                                  <FaArrowUp className="h-4 w-4" />
                                  Upgrade Now
                                </Button>

                                <Button
                                  onClick={openPricingModal}
                                  variant="secondary"
                                  className="flex items-center gap-2"
                                >
                                  <FaCalendarAlt className="h-4 w-4" />
                                  Renew Monthly Plan
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">
                      Membership Level:
                    </span>
                    <span className="text-gray-600">
                      {subscription?.level?.level}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">
                      Start Date:
                    </span>
                    <span className="text-gray-600">
                      {formatDate(subscription?.start_date)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">End Date:</span>
                    <span className="text-gray-600">
                      {formatDate(subscription.end_date)}
                    </span>
                  </div>

                  {/* <div className="pt-4 mt-4 border-t border-gray-200">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    Manage Subscription
                  </button>
                </div> */}
                </div>
              ) : subscription?.is_badge_active === false ? (
  // ❗ Badge inactive UI
  <div className="text-center py-8">
    <p className="text-gray-600">
      You don't have Certification.
    </p>
    <button
      onClick={() => navigate("/dashboard/assesmentcertification")}
      className="w-full sm:w-auto px-6 mt-3 py-2.5 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-md hover:opacity-90 transition disabled:opacity-50"
    >
      Go to Certification
    </button>
  </div>
) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    You don't have any active subscription.
                  </p>
                  <button
                    onClick={openPricingModal}
                    className="w-full sm:w-auto px-6 mt-3 py-2.5 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-md hover:opacity-90 transition disabled:opacity-50"
                  >
                    View Plans
                  </button>
                </div>
                // <div className="text-center py-8">
                //   <p className="text-gray-600">
                //     No subscription information available
                //   </p>
                //   <button
                //     onClick={openPricingModal}
                //     className="w-full sm:w-auto px-6 mt-3 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-md hover:opacity-90 transition disabled:opacity-50"
                //   >
                //     Retry
                //   </button>
                // </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "password" && (
          <div className="min-h-screen bg-white p-6 font-sans">
            <div className="w-full h-full px-4 py-10 md:px-8 bg-[#f9f9f9]">
              <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Change Password
                </h2>

                {message && (
                  <p className="mb-4 text-sm text-green-600 font-medium">
                    {message}
                  </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-md hover:opacity-90 transition disabled:opacity-50"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === "basic" && (
          <div className="min-h-screen bg-white p-6 font-sans">
            <h3 className="text-lg font-semibold mb-4">
              Your Basic Information
            </h3>

            <div className="bg-white border border-gray-200 rounded-md overflow-hidden p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">
                    Email Verified Status:
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      basicData?.email_verified
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {" "}
                    {basicData?.email_verified ? "Verified" : "Unverified"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Email Id</span>
                  <span className="text-gray-600">{basicData?.email}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Username:</span>
                  <span className="text-gray-600">{basicData?.username}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Join Date:</span>
                  <span className="text-gray-600">
                    {formatDate(basicData?.createdAt || "")}
                  </span>
                </div>

                {/* <div className="pt-4 mt-4 border-t border-gray-200">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    Manage Subscription
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Setting;
