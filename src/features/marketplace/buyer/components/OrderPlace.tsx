import PriceDisplay from '../components/Products/PriceDisplay';

interface OrderPlaceProps {
  date: string;
  total: string;
  originalPrice: string;
  discount: string;
  orderId: string;
}

export default function OrderPlace({ date, total, originalPrice, discount, orderId }: OrderPlaceProps) {
  return (
    <div className="flex pt-[15px] pr-[45px] pb-[15px] pl-[45px] justify-between items-start self-stretch shrink-0 flex-nowrap rounded-tl-[20px] rounded-tr-[20px] rounded-br-none rounded-bl-none border-solid border border-[#f3f3f3] relative overflow-hidden">
      <div className="flex w-[402.469px] h-[72px] items-center shrink-0 flex-nowrap relative">
        <div className="flex w-[402.469px] gap-[80px] items-center self-stretch shrink-0 flex-nowrap relative">
          <div className="flex w-[130px] flex-col gap-[5px] items-start shrink-0 flex-nowrap relative">
            <span className="h-[19px] shrink-0 basis-auto font-['Poppins'] text-[16px] font-normal leading-[19px] text-[#363842] relative text-left overflow-hidden whitespace-nowrap">
              Order Placed
            </span>
            <span className="h-[32px] shrink-0 basis-auto font-['Poppins'] text-[20px] font-semibold leading-[32px] text-[#242424] relative text-left overflow-hidden whitespace-nowrap">
              {date}
            </span>
          </div>
          <div className="flex w-[192.469px] flex-col gap-[5px] items-start shrink-0 flex-nowrap relative">
            <span className="h-[19px] shrink-0 basis-auto font-['Poppins'] text-[16px] font-normal leading-[19px] text-[#363842] relative text-left overflow-hidden whitespace-nowrap">
              Total
            </span>
            <PriceDisplay 
              currentPrice={total}
              originalPrice={originalPrice}
              discount={discount}
            />
          </div>
        </div>
      </div>
      <div className="flex w-[180px] h-[72px] items-center shrink-0 flex-nowrap relative">
        <div className="flex w-[180px] gap-[80px] items-center self-stretch shrink-0 flex-nowrap relative">
          <div className="flex w-[180px] flex-col gap-[5px] items-end shrink-0 flex-nowrap relative">
            <span className="h-[19px] shrink-0 basis-auto font-['Poppins'] text-[16px] font-normal leading-[19px] text-[#363842] relative text-left overflow-hidden whitespace-nowrap">
              Order ID
            </span>
            <span className="h-[32px] shrink-0 basis-auto font-['Poppins'] text-[20px] font-semibold leading-[32px] text-[#242424] relative text-left overflow-hidden whitespace-nowrap">
              {orderId}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
