import React, { useEffect, useState } from "react";
//import { CheckCircle } from "lucide-react";
import wallet from "../assets/wallet1.svg";
import { WalletDetails } from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";

const CreditsWallet: React.FC = () => {
  const [activeTab, setActiveTab] = useState("karma");
  const karmaCredits = localStorage.getItem("karma_credits") || "0";
  const [walletData, setWalletData] = useState<any | null>(null);
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { showToast } = useToast();

  const fetchWallet = async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      const res = await WalletDetails(page, limit); // You'll need to modify WalletDetails to accept pagination params

      if (res.success && res.data?.data) {
        setWalletData(res.data.data);
        setTotalItems(res.data.data.count);

        // Calculate total credits (sum of all credits where type is CREDIT)
        const total = res.data.data.rows.reduce(
          (sum: number, transaction: any) => {
            if (transaction.type === "CREDIT") {
              return sum + parseInt(transaction.credits);
            }
            return sum;
          },
          0
        );
        setTotalCredits(total);
      }
    } catch (error: any) {
      showToast({
        message:
          error.response?.data?.error?.message || "Failed to fetch wallet data",
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  // Reset to first page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

   const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };


  return (
    <div className="min-h-screen  font-poppins p-1">
      <div className="max-w-8xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Header Section */}
        <div
          className="relative w-full h-[313px] text-white flex flex-col justify-center px-1 md:px-10"
          style={{
            backgroundImage: "url('/walletbg.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Content */}
          <div className="relative z-10 space-y-8">
            {/* Title Section */}
            <div>
              <h2 className="font-poppins font-bold text-[35px] leading-[40px] text-white mb-1">
                Your Credits Wallet
              </h2>
              <p className="font-openSans font-semibold text-[16px] leading-[20px] text-white/80">
                Your Credits Wallet
              </p>
            </div>

            {/* Credits Summary Bar */}
            <div
              className="flex items-center justify-between w-full max-w-8xl rounded-[20px] text-white shadow-md"
              style={{
                background: "rgba(0, 0, 0, 0.3)", // #000000 at 30% opacity
                backdropFilter: "blur(24px)", // glass blur from Figma
                WebkitBackdropFilter: "blur(24px)",
                padding: "22px 39px",
              }}
            >
              {/* Left Section */}
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-[48px] h-[48px]  rounded-lg">
                  <img src={wallet} alt="wallet"></img>
                </div>

                <div>
                  <p className="text-sm font-medium text-white/80 font-poppins">
                    Total Credits Earned
                  </p>
                  <h3 className="font-poppins font-bold text-[57px] leading-[65px] text-white mt-1 flex items-baseline gap-2">
                    {karmaCredits}
                    <span className="text-[35px] leading-[40px] font-bold text-white">
                      Pts
                    </span>
                  </h3>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex flex-col items-start">
                <p className="font-[Open_Sans] font-semibold text-[16px] leading-[20px] text-white/80 mb-3">
                  Member Status
                </p>
                <span className="bg-[#FDC800] text-black font-poppins font-semibold text-[18px] h-[45px] px-[55px] flex items-center justify-center rounded-[50px] shadow-md">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-[20px] shadow-sm px-10 pt-10 pb-10  relative z-10">
          {/* Tabs */}
          <div className="flex gap-3 mb-0">
            {["karma", "redeeming", "transaction"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-[14px] font-openSans font-semibold rounded-t-[10px] transition-all duration-200 relative
          ${
            activeTab === tab
              ? "bg-[#F2F2F2] text-[#111827] border border-[#E5E7EB] border-b-0 z-10"
              : "bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB]"
          }`}
              >
                {tab === "karma"
                  ? "Karma Credits"
                  : tab === "redeeming"
                  ? "Redeeming"
                  : "Transaction"}
              </button>
            ))}
          </div>

          {/* Inner Gray Content Area */}
          <div className="relative z-0 bg-[#F2F2F2] rounded-b-[20px] -mt-[1px]">
            {activeTab === "karma" && (
              <>
                <Section
                  title="Social Media Participation"
                  description="Karma Credits in the social space are awarded only for impactful and verified actions that reflect the conscious values of CNESS."
                  rows={[
                    {
                      action: "Posting a conscious post",
                      condition: "When the post receives 100 or more likes",
                      credits: "+10 Credits",
                    },
                    {
                      action: "Posting a conscious reel",
                      condition: "When the reel receives 100 or more likes",
                      credits: "+10 Credits",
                    },
                  ]}
                />

                <p className="text-[#242424] text-[16px] font-['Open_Sans'] font-normal leading-[28px] px-6 mb-8">
                  No Karma points are awarded for unverified or low-engagement
                  posts. This ensures that Karma reflects genuine community
                  impact rather than post quantity.
                </p>

                <Section
                  title="Best Practices Contribution"
                  rows={[
                    {
                      action: "Submitting a Best Practice",
                      condition: "Upon approval by the CNESS moderation team",
                      credits: "+10 Credits",
                    },
                  ]}
                />

                <Section
                  title="Marketplace and Listing"
                  rows={[
                    {
                      action: "Submitting a Best Practice",
                      condition: "Upon approval by the CNESS moderation team",
                      credits: "+10 Credits",
                    },
                  ]}
                />

                <Section
                  title="Profile Completion"
                  rows={[
                    {
                      action: "Completing the True Profile",
                      condition: "When profile completion reaches 100%",
                      credits: "+100 Credits",
                    },
                  ]}
                />
              </>
            )}

            {activeTab === "redeeming" && (
              <div className="space-y-10">
                {/* Redemption Rules Section */}
                <div className="bg-[#F2F2F2] rounded-2xl p-6">
                  <h4 className="font-poppins font-bold text-[#242424] text-[20px] leading-[22px] mb-2">
                    Redemption Rules
                  </h4>
                  <p className="text-[#242424] text-[16px] font-['Open_Sans'] font-normal leading-[22px]">
                    Minimum redemption: 500 Karma Credits.*
                  </p>
                </div>

                {/* Social Media Section */}
                <Section
                  title="Social Media"
                  rows={[
                    {
                      option: "Featured Post",
                      description:
                        "Redeem credits to have your post or reel featured on the CNESS main feed or official social pages.",
                      credits: "500 credits Required",
                    },
                    {
                      option: "Verified Creator Badge",
                      description:
                        "Unlock a special badge that highlights you as a conscious content creator.",
                      credits: "5000 credits Required",
                    },
                    {
                      option: "CNESS Spotlight Feature",
                      description:
                        "Get your conscious story or video highlighted on the CNESS social handles.",
                      credits: "1000 credits Required",
                    },
                  ]}
                  isRedeeming
                />

                {/* Marketplace Section */}
                <Section
                  title="Marketplace"
                  rows={[
                    {
                      option: "Product Discounts",
                      description:
                        "Use credits to get discounts on conscious products or services.",
                      credits: "2000 credits = 20% off",
                    },
                    {
                      option: "Featured Product Placement",
                      description:
                        'Highlight your product in the "Top Conscious Picks" section.',
                      credits: "5000 credits Required",
                    },
                    {
                      option: "Marketplace Promotion Slot",
                      description:
                        "Earn banner placement or social mention for your brand/product.",
                      credits: "2000 credits",
                    },
                  ]}
                  isRedeeming
                />

                {/* Directory Section */}
                <Section
                  title="Directory"
                  rows={[
                    {
                      option: "Featured Listing",
                      description:
                        'Appear in the "Featured Conscious" section on the Directory.',
                      credits: "2500 credits",
                    },
                    {
                      option: "Profession Spotlight",
                      description:
                        "Highlight your profile under your profession category for one month.",
                      credits: "2500 credits",
                    },
                  ]}
                  isRedeeming
                />

                {/* Certification Section */}
                <Section
                  title="Certification"
                  rows={[
                    {
                      option: "Assessment Fee Discount",
                      description:
                        "Redeem credits for partial discounts on upcoming certification assessments.",
                      credits: "1000 credits = 10% off",
                    },
                  ]}
                  isRedeeming
                />
              </div>
            )}

            {activeTab === "transaction" && (
              <div className="bg-[#F2F2F2] rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-poppins font-bold text-[#242424] text-[20px] leading-[22px]">
                    Transaction History
                  </h4>

                  {/* Items per page selector */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 font-['Open_Sans']">
                      Show:
                    </label>
                    <select
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="bg-white rounded-[10px] border border-[#E4E2E4] p-8 text-center">
                    <p className="text-gray-500 font-['Open_Sans'] text-[14px]">
                      Loading transactions...
                    </p>
                  </div>
                ) : walletData && walletData.rows.length > 0 ? (
                  <>
                    <div className="bg-white rounded-[10px] border border-[#E4E2E4] overflow-hidden shadow-sm mb-4">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="bg-white">
                            <th className="text-left font-['Open_Sans'] font-semibold text-[#242424] text-[14px] px-6 py-6 leading-[20px]">
                             Redemption Option	
                            </th>
                            <th className="text-left font-['Open_Sans'] font-semibold text-[#242424] text-[14px] px-6 py-6 leading-[20px]">
                              Description
                            </th>
                            <th className="text-right font-['Open_Sans'] font-semibold text-[#242424] text-[14px] px-6 py-6 leading-[20px]">
                              Credits Required / Value
                            </th>
                            <th className="text-left font-['Open_Sans'] font-semibold text-[#242424] text-[14px] px-6 py-6 leading-[20px]">
                              
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {walletData.rows.map((transaction: any,index:any) => (
                            <tr
                              key={transaction.id}
                              className="border-t border-[#E4E2E4] hover:bg-[#FAFAFA] transition-colors"
                            >
                              <td className="px-6 py-6 text-[#4B5563] font-['Open_Sans'] text-[14px] leading-[20px] align-middle">
                              {index + 1}
                              </td>
                              <td className="px-6 py-6 text-[#242424] font-['Open_Sans'] text-[14px] align-middle">
                                <div className="flex items-center gap-4">
                                  {transaction.file ? (
                                    <img
                                      src={transaction.file}
                                      alt={transaction.name}
                                      className="w-[50px] h-[50px] rounded-lg object-cover"
                                    />
                                  ) : (
                                    <div className="w-[50px] h-[50px] rounded-lg bg-gray-200 flex items-center justify-center">
                                      <span className="text-gray-500 text-xs">
                                        No Image
                                      </span>
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-medium">
                                      {transaction.name}
                                    </div>
                                    <div className="text-[12px] text-gray-500">
                                      {transaction.user_credit_config.slug}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="text-right px-6 py-6 font-['Open_Sans'] font-semibold text-[14px] leading-[20px] align-middle">
                                <span
                                >
                                  {transaction.user_credit_config.description}
                                </span>
                              </td>
                              <td className="px-6 py-6 font-['Open_Sans'] font-semibold text-[14px] leading-[20px] align-middle">
                                <span
                                  className={
                                    transaction.type === "CREDIT"
                                      ? "text-[#16A34A]"
                                      : "text-[#DC2626]"
                                  }
                                >
                                  {transaction.type === "CREDIT" ? "+" : "-"}
                                  {transaction.credits} {transaction.type === "CREDIT" ? "Credit" : "Debit"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-[10px] border border-[#E4E2E4] p-4">
                        {/* Items count */}
                        <div className="text-sm text-gray-600 font-['Open_Sans']">
                          Showing {startItem} to {endItem} of {totalItems}{" "}
                          entries
                        </div>

                        {/* Pagination buttons */}
                        <div className="flex items-center gap-1">
                          {/* First Page */}
                          <button
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              currentPage === 1
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {"<<"}
                          </button>

                          {/* Previous Page */}
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              currentPage === 1
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {"<"}
                          </button>

                          {/* Page Numbers */}
                          {getPageNumbers().map((page) => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-1 rounded text-sm font-medium ${
                                currentPage === page
                                  ? "bg-[#7177FE] text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {page}
                            </button>
                          ))}

                          {/* Next Page */}
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              currentPage === totalPages
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {">"}
                          </button>

                          {/* Last Page */}
                          <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              currentPage === totalPages
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {">>"}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white rounded-[10px] border border-[#E4E2E4] p-8 text-center">
                    <p className="text-gray-500 font-['Open_Sans'] text-[14px]">
                      No transactions found
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-gradient-to-b from-[#585ED4] to-[#7077FE] py-20 px-6 flex justify-center items-center">
          <p className="text-white text-left text-[14px] font-['Open_Sans'] font-normal leading-[22px] max-w-4xl">
            Note: Credits are accumulated through active participation in the
            CNESS community. To redeem your credits, please contact our
            community team at{" "}
            <a
              href="mailto:community@cness.com"
              className="text-white underline font-semibold"
            >
              community@cness.com
            </a>{" "}
            with your desired redemption option.
          </p>
        </div>
      </div>
    </div>
  );
};

// ✅ Section Component
// ✅ Section Component
const Section = ({
  title,
  description,
  rows,
  isRedeeming = false,
}: {
  title: string;
  description?: string;
  rows: any[];
  isRedeeming?: boolean;
}) => (
  <div className="bg-[#F2F2F2] rounded-2xl p-6 mb-10">
    {/* Section Header */}
    <div className="mb-4">
      <h4 className="font-poppins font-bold text-[#242424] text-[20px] leading-[22px] mb-2">
        {title}
      </h4>
      {description && (
        <p className="text-[#4B5563] text-[14px] font-['Open_Sans'] font-normal leading-[22px]">
          {description}
        </p>
      )}
    </div>

    {/* Table */}
    <div className="bg-white rounded-[10px] border border-[#E4E2E4] overflow-hidden shadow-sm">
      <table className="w-full border-collapse text-sm table-fixed">
        <thead>
          <tr className="bg-white">
            {isRedeeming ? (
              <>
                <th className="w-[25%] text-left font-['Open_Sans'] font-semibold text-[#242424] text-[14px] px-6 py-6 leading-[20px]">
                  Redemption Option
                </th>
                <th className="w-[55%] text-left font-['Open_Sans'] font-semibold text-[#242424] text-[14px] px-6 py-6 leading-[20px]">
                  Description
                </th>
                <th className="w-[20%] text-left font-['Open_Sans'] font-semibold text-[#242424] text-[14px] px-6 py-6 leading-[20px]">
                  Credits Required / Value
                </th>
              </>
            ) : (
              <>
                <th className="w-[25%] text-left font-['Open_Sans'] font-semibold text-[#242424] text-[14px] px-6 py-6 leading-[20px]">
                  Action
                </th>
                <th className="w-[55%] text-left font-['Open_Sans'] font-semibold text-[#242424] text-[14px] px-6 py-6 leading-[20px]">
                  Condition / Criteria
                </th>
                <th className="w-[20%] text-left font-['Open_Sans'] font-semibold text-[#242424] text-[14px] px-6 py-6 leading-[20px]">
                  Karma Credits
                </th>
              </>
            )}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className="border-t border-[#E4E2E4] hover:bg-[#FAFAFA] transition-colors"
            >
              {isRedeeming ? (
                <>
                  <td className="px-6 py-6 text-[#242424] font-['Open_Sans'] font-normal text-[14px] leading-[20px] align-middle">
                    {row.option}
                  </td>
                  <td className="px-6 py-6 text-[#4B5563] font-['Open_Sans'] font-normal text-[14px] leading-[20px] align-middle">
                    {row.description}
                  </td>
                  <td className="px-6 py-6 text-[#7177FE] font-['Open_Sans'] font-semibold text-[14px] leading-[20px] align-middle">
                    {row.credits}
                  </td>
                </>
              ) : (
                <>
                  <td className="px-6 py-6 text-[#242424] font-['Open_Sans'] font-normal text-[14px] leading-[20px] align-middle">
                    {row.action}
                  </td>
                  <td className="px-6 py-6 text-[#242424] font-['Open_Sans'] font-normal text-[14px] leading-[20px] align-middle">
                    {row.condition}
                  </td>
                  <td className="px-6 py-6 text-[#7177FE] font-['Open_Sans'] font-semibold text-[14px] leading-[20px] align-middle">
                    {row.credits}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ✅ Empty State Component
//const EmptyState = ({ message }: { message: string }) => (
//<div className="text-center text-gray-500 py-10">
//<CheckCircle className="w-10 h-10 mx-auto text-[#7077FE]" />
//<p className="mt-3 text-sm">{message}</p>
//</div>
//);

export default CreditsWallet;
