import React from 'react';
import { TagList } from '../Products/Taglist';

 const ProductDescription: React.FC = () => {
  const tags = ['AmbientMusic', 'SoulfulSounds', 'HealingVibrations', 'MeditationMusic'];

  return (
    <div className="flex flex-col items-start self-stretch shrink-0 flex-nowrap relative">
      <div className="flex pt-0 pr-[20px] pb-0 pl-[20px] flex-col gap-[10px] items-start self-stretch shrink-0 flex-nowrap relative">
        <div className="flex pt-[20px] pr-0 pb-[20px] pl-0 flex-col gap-[33px] justify-center items-start self-stretch shrink-0 flex-nowrap rounded-[24px] relative">
          <div className="flex gap-[20px] items-start self-stretch shrink-0 flex-nowrap relative">
            <div className="flex flex-col gap-[33px] items-start self-stretch grow shrink-0 basis-0 flex-nowrap relative">
              <div className="flex flex-col gap-[33px] items-start self-stretch shrink-0 flex-nowrap relative">
                <div className="flex h-[40px] gap-[20px] items-center self-stretch shrink-0 flex-nowrap relative">
                  <div className="flex w-[111px] gap-[10px] justify-center items-center shrink-0 flex-nowrap relative">
                    <span className="flex w-[111px] h-[40px] justify-center items-start shrink-0 basis-auto font-['Poppins'] text-[20px] font-semibold leading-[40px] text-[#000] tracking-[-0.6px] relative text-center capitalize whitespace-nowrap">
                      Description
                    </span>
                  </div>
                </div>
                
                <div className="w-[740px] self-stretch shrink-0 font-['Open_Sans'] text-[18px] font-bold leading-[28.8px] relative text-left whitespace-nowrap">
                  <span className="font-['Open_Sans'] text-[18px] font-normal leading-[28.8px] text-[#363842] relative text-left">
                    Resonance Rating:{" "}
                  </span>
                  <span className="font-['Open_Sans'] text-[18px] font-bold leading-[28.8px] text-[#363842] relative text-left">
                    (High Spiritual Resonance)
                  </span>
                </div>
                
                <div className="w-[740px] self-stretch shrink-0 font-['Open_Sans'] text-[18px] font-normal leading-[28.8px] relative text-left whitespace-nowrap">
                  <span className="font-['Open_Sans'] text-[18px] font-normal leading-[28.8px] text-[#363842] relative text-left">
                    Perfect for:{" "}
                  </span>
                  <span className="font-['Open_Sans'] text-[18px] font-bold leading-[28.8px] text-[#363842] relative text-left">
                    Meditation • Healing • Focus • Yoga • Mindful Creativity
                  </span>
                </div>
                
                <div className="self-stretch shrink-0 font-['Open_Sans'] text-[16px] font-normal leading-[25.6px] relative text-left">
                  <span className="font-['Open_Sans'] text-[16px] font-bold leading-[25.6px] text-[#363842] relative text-left">
                    Official Release of Our New Album: ARAKARA
                    <br />
                  </span>
                  <span className="font-['Open_Sans'] text-[16px] font-normal leading-[25.6px] text-[#363842] relative text-left">
                    Ecstasy of the Awake-{" "}
                  </span>
                  <span className="font-['Open_Sans'] text-[16px] font-bold leading-[25.6px] text-[#363842] relative text-left">
                    Siddhar Trance of Inner Fire
                    <br />
                    <br />
                  </span>
                  <span className="font-['Open_Sans'] text-[16px] font-normal leading-[25.6px] text-[#363842] relative text-left">
                    White Swan Records is proud to present Turiya Nada's
                    incomparable Arakara, a powerful aural document of
                    ancient-meets-modern devotion.
                    <br />
                    Arakara means: induce the sacred magic of the Now, now!
                    <br />
                    <br />
                    After over 5 years of intent to create a wave of music
                    to reach humanity as blessings of the
                    Siddhars, Arakara was created. The meditative powers
                    within the resonance as seeds of mighty consciousness,
                    alongside the joys of the special musical composition is
                    the dance of awakening. Arakara will make you dance in
                    the sacred joys!
                  </span>
                </div>
                
                <TagList tags={tags} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription