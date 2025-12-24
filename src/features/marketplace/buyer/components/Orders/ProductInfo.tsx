
import {CategoryTag} from '../Products/CategoryTag';
import {AuthorInfo} from '../Products/AuthorInfo';
import { useState } from 'react';
import OrderDetailsModal from './OrderDetailmodel';
interface ProductData {
  title: string;
  description: string;
  category: string;
  categoryColor: string; 
  image: string;
  author: {
    name: string;
    avatar: string;
  };
}

interface ProductInfoProps {
  product: ProductData;
}

export default function ProductInfo({ product }: ProductInfoProps) {

const [openOrderDetails, setOpenOrderDetails] = useState(false);

  return (
    <div className="flex gap-[10px] items-center self-stretch shrink-0 flex-nowrap relative">
      <div className="flex w-[140px] h-[134.35px] flex-col gap-[10px] items-center shrink-0 flex-nowrap rounded-[22px] relative overflow-hidden">
        <div 
          className="h-[134.374px] self-stretch shrink-0 bg-cover bg-no-repeat rounded-[22px] relative"
          style={{ backgroundImage: `url(${product.image})` }}
        />
      </div>
      <div className="flex gap-[33px] items-start grow shrink-0 basis-0 flex-nowrap relative">
        <div className="flex flex-col gap-[30px] items-start grow shrink-0 basis-0 flex-nowrap relative">
          <div className="flex flex-col gap-[5px] items-start self-stretch shrink-0 flex-nowrap relative">
            <CategoryTag
  label={product.category}      // ✅ correct prop
  color={product.categoryColor}
 />
            <span className="h-[19px] self-stretch shrink-0 basis-auto font-['Poppins'] text-[16px] font-medium leading-[19px] text-[#363842] relative text-left overflow-hidden whitespace-nowrap">
              {product.title}
            </span>
            <span className="flex w-[595px] h-[49px] justify-start items-start self-stretch shrink-0 font-['Open_Sans'] text-[13px] font-normal leading-[20.8px] text-[#363842] relative text-left overflow-hidden">
              {product.description}
            </span>
            <div className="flex justify-between items-center self-stretch shrink-0 flex-nowrap relative">
              <AuthorInfo 
                name={product.author.name}
                avatar={product.author.avatar}
              />
            <div className="flex w-[356px] gap-[10px] items-start shrink-0 flex-nowrap relative">
  {/* View In Library */}
  <button
    className="flex w-[114px] h-[30px] px-[15px] gap-[10px] justify-center items-center rounded-[7px] bg-[#7076fe] text-white"
  >
    <span className="font-['Poppins'] text-[12px] font-medium leading-[18px] tracking-[-0.23px] whitespace-nowrap">
      View In Library
    </span>
  </button>

  {/* Order Details */}
<button
  onClick={() => setOpenOrderDetails(true)}
  className="flex w-[114px] h-[30px] px-[15px] gap-[10px] justify-center items-center rounded-[7px] border border-[#7076fe] text-[#7076fe]"
>
  <span className="font-['Poppins'] text-[12px] font-medium leading-[18px] tracking-[-0.23px] whitespace-nowrap">
    Order Details
  </span>
</button>

  {/* Write a Review */}
  <button
    className="flex w-[114px] h-[30px] px-[15px] gap-[10px] justify-center items-center rounded-[7px] border border-[#7076fe] text-[#7076fe]"
  >
    <span className="font-['Poppins'] text-[12px] font-medium leading-[18px] tracking-[-0.23px] whitespace-nowrap">
      Write a Review
    </span>
  </button>
</div>
            </div>
          </div>
        </div>
      </div>
      {openOrderDetails && (
  <OrderDetailsModal onClose={() => setOpenOrderDetails(false)} />
)}
    </div>
    
  );
}
