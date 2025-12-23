import React from 'react';
import { RelatedProductCard } from '../Products/RelatedProductCard';
import nandhiji from '../../../../../assets/nandhiji.svg'

 const RelatedProducts: React.FC = () => {
  const relatedProducts = [
    {
      image: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/TcapewAU1k.png",
      title: "Dance of Siddhars",
      description: "After over 5 years of intent to create a wave of music to reach humanity as blessings of the Siddhars, Arakara was created. The meditative powers within the resonance as seeds of mighty consciousness,",
      author: {
        name: "Nandhiji",
        avatar: nandhiji
      }
    },
    {
      image: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/EBSy78Rmei.png",
      title: "Dance of Siddhars",
      description: "After over 5 years of intent to create a wave of music to reach humanity as blessings of the Siddhars, Arakara was created. The meditative powers within the resonance as seeds of mighty consciousness,",
      author: {
        name: "Nandhiji",
        avatar: nandhiji
      }
    },
    {
      image: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/k6R4EBtSmv.png",
      title: "Dance of Siddhars",
      description: "After over 5 years of intent to create a wave of music to reach humanity as blessings of the Siddhars, Arakara was created. The meditative powers within the resonance as seeds of mighty consciousness,",
      author: {
        name: "Nandhiji",
        avatar: nandhiji
      }
    },
    {
      image: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/NquJSVbJjj.png",
      title: "Dance of Siddhars",
      description: "After over 5 years of intent to create a wave of music to reach humanity as blessings of the Siddhars, Arakara was created. The meditative powers within the resonance as seeds of mighty consciousness,",
      author: {
        name: "Nandhiji",
        avatar:nandhiji
      }
    },
    {
      image: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/WvV3TKk93U.png",
      title: "Dance of Siddhars",
      description: "After over 5 years of intent to create a wave of music to reach humanity as blessings of the Siddhars, Arakara was created. The meditative powers within the resonance as seeds of mighty consciousness,",
      author: {
        name: "Nandhiji",
        avatar:nandhiji
      }
    },
    {
      image: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/Yb8okw0hu4.png",
      title: "Dance of Siddhars",
      description: "After over 5 years of intent to create a wave of music to reach humanity as blessings of the Siddhars, Arakara was created. The meditative powers within the resonance as seeds of mighty consciousness,",
      author: {
        name: "Nandhiji",
        avatar: nandhiji
      }
    },
    {
      image: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/TcapewAU1k.png",
      title: "Dance of Siddhars",
      description: "After over 5 years of intent to create a wave of music to reach humanity as blessings of the Siddhars, Arakara was created. The meditative powers within the resonance as seeds of mighty consciousness,",
      author: {
        name: "Nandhiji",
        avatar: nandhiji
      }
    },
       {
      image: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/k6R4EBtSmv.png",
      title: "Dance of Siddhars",
      description: "After over 5 years of intent to create a wave of music to reach humanity as blessings of the Siddhars, Arakara was created. The meditative powers within the resonance as seeds of mighty consciousness,",
      author: {
        name: "Nandhiji",
        avatar: nandhiji
      }
    }
  ];

  return (
    <div className="flex pt-[20px] pr-[20px] pb-[20px] pl-[20px] flex-col gap-[20px] items-start self-stretch shrink-0 flex-nowrap relative">
      <div className="flex gap-[10px] items-center self-stretch shrink-0 flex-nowrap relative">
        <div className="flex w-[214px] gap-[10px] items-center shrink-0 flex-nowrap relative">
          <span className="h-[30px] shrink-0 basis-auto font-['Poppins'] text-[20px] font-semibold leading-[30px] text-[#000] tracking-[-0.6px] relative text-left whitespace-nowrap">
            Related to the Product
          </span>
        </div>
      </div>
      
      <div className="flex gap-[20px] items-start self-stretch shrink-0 flex-nowrap relative">
        {relatedProducts.map((product, index) => (
          <RelatedProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
};
export default RelatedProducts