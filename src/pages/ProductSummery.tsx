import { useEffect, useState } from "react";
import { BookOpen, Download } from "lucide-react";
import { MdOutlineEmojiNature } from "react-icons/md";
import { BsCalendar2 } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { HiArrowUturnLeft } from "react-icons/hi2";
import { FaStar } from "react-icons/fa6";
import { IoVideocamOutline } from "react-icons/io5";
import { GetOrderDetailsByOrdId } from "../Common/ServerAPI";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../components/ui/Toast/ToastProvider";
import ReviewsTab from "../components/MarketPlace/library/ReviewsTab";


const resonanceTags = ["Motivated", "Greatful", "Funny", "Focused", "Emotional"];

const priceDetails = [
  { label: "Subtotal", value: "$1259", isDiscount: "" },
  { label: "Platform Fee", value: "$01" },
  { label: "Discount(10%)", value: "-$1260" },
  { label: "Total", value: "$1260", bold: true }
];

export default function ProductSummery() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { id } = useParams<{ id: string }>();
  console.log('id', id)

  const [rating, setRating] = useState(3);
  const [selectedTags, setSelectedTags] = useState(["Motivated", "Greatful", "Funny"]);
  const [isLoading, setIsLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [productId, setProductId] = useState("");
  const [orderItem, setOrderItems] = useState<any>({});

  const [review, setReview] = useState("");
  const fetchOrderItemItems = async () => {
    setIsLoading(true);
    try {
      const response = await GetOrderDetailsByOrdId(id || "");
      console.log('response', response)
      const items = response?.data?.data?.items || [];
      setOrderItems(response?.data?.data || []);
if(items.length>0){
      setProductId(items[0]?.product_id || "");
      setShowReview(true);
}
      // If cart is empty, redirect back
      if (items.length === 0) {
        showToast({
          message: "Your Order is empty",
          type: "error",
          duration: 3000,
        });
        navigate("/dashboard/order-history");
      }
    } catch (error: any) {
      showToast({
        message: "Failed to load Order details",
        type: "error",
        duration: 3000,
      });
      navigate("/dashboard/order-history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderItemItems();
  }, []);
  const toggleTag = (tag: string) =>
    setSelectedTags(selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    );
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter(n => n)        // remove extra spaces
      .map(n => n[0])        // first letter of each word
      .join("")
      .toUpperCase();
  };
  return (
    <div>
      <div className="pt-5 pb-2 px-2">
        <nav className="flex items-center text-xs text-gray-500 mb-2 font-medium">
          <span className="text-gray-700">Order History</span>
          <span className="mx-1">{'>'}</span>
          <span className="text-gray-400">Product Summary</span>
        </nav>
        <div className="text-2xl font-bold text-gray-800">Product Summary</div>
      </div>
      <div className="flex flex-col md:flex-row gap-6 p-6 mx-auto bg-transparent">
        {/* Main Content */}
        <div className="flex-1">
          {/* Product Card */}
          {/* Column 2 - Details */}
          {orderItem && orderItem.items && orderItem.items.length > 0 && orderItem.items.map((item: any) => ((
            <div className="bg-white rounded-lg shadow flex flex-col md:flex-row items-center gap-6 p-6">
              {/* Column 1 - Image */}
              <div className="flex-1 flex justify-center">
                <img
                  style={{width:"60%"}}
                  src={item?.product_thumbnail || "https://cdn.cness.io/collection1.svg"}
                  alt={item?.product_name}
                  className="w-full h-full object-cover rounded"
                />
              </div><div className="flex-1">
                <div className="font-semibold text-gray-900">Order ID : {orderItem?.order_id}</div>
                <div className="text-lg font-bold text-[#242E3A] mb-1">{item?.product_name}</div>
                <div className="text-gray-500 mb-2">{item?.shop?.shop_name}</div>
                <div className="flex items-center gap-0.5 text-xs text-[#242E3A] font-medium">
                  {/* Course */}
                  <span className="flex items-center gap-0.5">
                    <IoVideocamOutline />
                    {item?.category?.name}
                  </span>
                  <span className="text-indigo-200 mx-1">•</span>
                  {/* Peaceful */}
                  <span className="flex items-center gap-0.5">
                    {/* <MdOutlineEmojiNature className="w-3 h-3 text-gray-500" /> */}
                    <span className="text-xs text-[#7077FE]">{`${item?.mood?.icon} ${item?.mood?.name}`}</span>
                  </span>
                  <span className="text-indigo-200 mx-1">•</span>
                  {/* Purchased Date */}
                  <span className="flex items-center gap-1">
                    <BsCalendar2 className="w-3 h-3 text-[#7077FE]" />
                    Purchased on <span className="text-xs font-bold">{orderItem?.purchase_date}</span>
                  </span>
                </div>
                <div className="font-bold text-xl text-indigo-600 mb-2">${item?.price}</div>
                <button className="mt-1 px-4 py-2 bg-[#7077FE] text-white rounded shadow hover:bg-[#5E65F6] flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  View in Library
                </button>
              </div> </div>)))}



          {/* Review Section */}
        {showReview && (<ReviewsTab productId={productId} show_public_review={false} show_overall_review={false} />)}
         
        </div>

        {/* --- RIGHT SIDEBAR --- */}
        <div className="w-full  md:w-[320px]">
          <div className="font-bold text-[16px] font-[poppins] text-gray-900 mb-2">Purchased details</div>

          <div className="rounded-lg shadow p-6 mb-4" style={{ backgroundColor: '#F9F9F9' }}>
            <div className="flex items-center gap-2 mb-1">
              <>
                {orderItem?.buyer?.profile_picture ?
                  <img style={{ width: "42px", height: "42px", borderRadius: "50px" }} src={orderItem?.buyer?.profile_picture || ""} alt="" />
                  : <div className="rounded-full bg-indigo-100 text-indigo-700 text-center font-bold px-3 py-1" style={{ width: "42px", height: "42px" }}>{getInitials(orderItem?.buyer?.full_name || "")}</div>}
              </>
              <div>
                <div className="font-semibold text-[#242E3A]">{orderItem?.buyer?.full_name}</div>
                {/* <div className="text-xs text-gray-500">9943830539</div> */}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <div className="font-bold text-gray-900 mb-2">Price Details</div>
            <div className="space-y-2 mb-4">
              <div className=" flex justify-between items-center text-gray-700">
                <span>{`Subtotal`}</span>
                <span className="font-semibold">{orderItem?.subtotal_amount}</span>
              </div>
              <div className=" flex justify-between items-center text-gray-700">
                <span>{`Platform Fee`}</span>
                <span className="font-semibold">0</span>
              </div>
              <div className=" flex justify-between items-center text-gray-700">
                <span>{`Discount`}</span>
                <span className="font-semibold">{orderItem?.discount_amount}</span>
              </div>
              <div className=" flex justify-between items-center text-indigo-700">
                <span>{`Total`}</span>
                <span className="font-semibold">{orderItem?.total_amount}</span>
              </div>

            </div>

            <div className="bg-white rounded-lg px-3 py-3 font-[poppins] flex justify-between items-center font-normal text-gray-800 border border-gray-200">
              <span>Paid by</span>
              <span>Strip</span>
            </div>
            <button
              className="w-full mb-2 mt-4 px-4 py-2 bg-[#FFFFFF] text-[#7077FE] rounded shadow flex items-center justify-center gap-2 border"
              style={{ borderColor: '#7077FE' }}
            >
              <Download className="w-5 h-5" />
              Download invoice
            </button>

            <button className="w-full px-4 py-2 bg-[#7077FE] text-white rounded shadow hover:bg-[#7077FE] flex items-center justify-center gap-2">
              <HiArrowUturnLeft className="w-5 h-5" />
              Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
