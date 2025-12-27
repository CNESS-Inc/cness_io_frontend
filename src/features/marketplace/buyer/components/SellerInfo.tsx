export default function SellerInfo({
}: any) {
    return (
        <>
            <div className="grid grid-cols-1 gap-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3  gap-4 md:gap-6">
                    <div className="flex justify-center md:justify-start">
                        <img
                            src="https://cdn.cness.io/impactor.png"
                            alt="Impactor Certificate"
                            className="w-full max-w-[200px] md:max-w-none object-contain mx-auto md:mx-0"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <p className="font-open-sans font-normal text-[18px] leading-[160%] tracking-normal text-[#363842] mb-2.5">
                            Nandhiji received the <span className="font-open-sans font-bold italic text-[18px] leading-[160%] tracking-normal">"Impactor Certificate"</span> in recognition of the positive influence
                            his products have had on customers' lives. Many of them shared how his creations
                            have brought meaningful change and inspiration to their daily experiences.
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                            <p className="font-open-sans font-bold text-[16px] sm:text-[18px] leading-[160%] text-[#363842] sm:me-2">
                                Impact Rating :
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="rotate-0 opacity-100 gap-2.5 rounded-lg px-2.5 py-1 bg-[#E5E5E5] font-open-sans font-bold text-[14px] sm:text-[16px] leading-[160%] text-[#291B89]">
                                    21.8k
                                </div>
                                <div className="rotate-0 opacity-100 gap-2.5 rounded-lg px-3 sm:px-5 py-1 bg-[#291B89] font-poppins font-semibold italic text-[11px] sm:text-[12px] leading-[190%] text-[#F9BA1D]">
                                    Rank 1
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="font-poppins font-semibold text-[20px] leading-[40px] -tracking-[0.03em] capitalize text-black">
                        Sellerial Philosophy
                    </h3>
                </div>
                <p className="font-open-sans font-normal text-[16px] leading-[160%] tracking-normal text-[#363842]">
                    I believe art should spark reflection and positivity. I focus on Sellers whose work connects emotion, purpose, and craftsmanship.
                </p>
                <p className="font-open-sans font-normal text-[16px] leading-[160%] tracking-normal text-[#363842]">
                    Nandhiji, also known as Siddha Master Nandhiji or Guru Nandhiji, is a mystic, yogi, visionary, and spiritual teacher who bridges ancient Siddhar wisdom with the modern world. Born in Tamil Nadu, India, he was guided by powerful Siddhar masters and enlightened sages in the sacred traditions of South India.</p>
                <p className="font-open-sans font-normal text-[16px] leading-[160%] tracking-normal text-[#363842]">
                    Through years of intense sadhana and silence in the caves and temples of South India, Nandhiji awakened to the higher states of consciousness he calls the “Ariven”—the awakened mind. His mission is to share the teachings of the Siddhars to inspire humanity toward higher consciousness, creative awakening, and compassionate leadership. </p>
                <p className="font-open-sans font-normal text-[16px] leading-[160%] tracking-normal text-[#363842]">
                    Through his music, writings, and meditative practices, he encourages seekers to transcend limitations and experience the ecstatic oneness of being.</p>
                <div className="flex mb-4">
                    <p className="font-open-sans me-2 font-bold text-[16px] leading-[160%] tracking-normal text-[#363842]">
                        Tags:
                    </p>
                    <div className="rounded-[30px] pt-[3px] px-2.5 pb-[3px] me-1 bg-[#F2F2F2] font-poppins font-medium text-[10px] leading-[190%] -tracking-[0.019em] text-[#242424]">
                        AmbientMusic
                    </div>
                    <div className="rounded-[30px] pt-[3px] px-2.5 pb-[3px] me-1 bg-[#F2F2F2] font-poppins font-medium text-[10px] leading-[190%] -tracking-[0.019em] text-[#242424]">
                        SoulfulSounds
                    </div>
                    <div className="rounded-[30px] pt-[3px] px-2.5 pb-[3px] me-1 bg-[#F2F2F2] font-poppins font-medium text-[10px] leading-[190%] -tracking-[0.019em] text-[#242424]">
                        HealingVibrations
                    </div>
                    <div className="rounded-[30px] pt-[3px] px-2.5 pb-[3px] me-1 bg-[#F2F2F2] font-poppins font-medium text-[10px] leading-[190%] -tracking-[0.019em] text-[#242424]">
                        MeditationMusic
                    </div>
                </div>
            </div>

        </>
    );
}