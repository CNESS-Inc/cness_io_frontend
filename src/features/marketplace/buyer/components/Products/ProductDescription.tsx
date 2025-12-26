import React from 'react';
import { TagList } from '../Products/Taglist';

const ProductDescription: React.FC = () => {
  const tags = ['AmbientMusic', 'SoulfulSounds', 'HealingVibrations', 'MeditationMusic'];

  return (
    // <div className="w-full px-4 sm:px-5 md:px-6 lg:px-8">
    //   <div className="max-w-7xl mx-auto">
        <div className="py-5 md:py-8 lg:py-10">
          {/* Title */}
          <div className="mb-6 md:mb-8 lg:mb-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-['Poppins'] text-gray-900 tracking-tight">
              Description
            </h2>
          </div>

          <div className="space-y-6 md:space-y-8 lg:space-y-10">
            {/* Resonance Rating */}
            <div className="space-y-2">
              <p className="font-['Open_Sans'] text-base md:text-lg lg:text-xl text-gray-800 leading-relaxed">
                <span className="font-normal">Resonance Rating: </span>
                <span className="font-bold">(High Spiritual Resonance)</span>
              </p>
            </div>

            {/* Perfect for */}
            <div className="space-y-2">
              <p className="font-['Open_Sans'] text-base md:text-lg lg:text-xl text-gray-800 leading-relaxed">
                <span className="font-normal">Perfect for: </span>
                <span className="font-bold block md:inline">
                  Meditation • Healing • Focus • Yoga • Mindful Creativity
                </span>
              </p>
            </div>

            {/* Main Description */}
            <div className="space-y-4">
              <p className="font-['Open_Sans'] text-sm md:text-base lg:text-lg text-gray-800 leading-relaxed">
                <strong className="font-bold">
                  Official Release of Our New Album: ARAKARA
                </strong>
                <br />
                <span className="font-normal">Ecstasy of the Awake- </span>
                <span className="font-bold">Siddhar Trance of Inner Fire</span>
              </p>

              <p className="font-['Open_Sans'] text-sm md:text-base lg:text-lg text-gray-800 leading-relaxed">
                White Swan Records is proud to present Turiya Nada's
                incomparable Arakara, a powerful aural document of
                ancient-meets-modern devotion.
              </p>

              <p className="font-['Open_Sans'] text-sm md:text-base lg:text-lg text-gray-800 leading-relaxed">
                Arakara means: induce the sacred magic of the Now, now!
              </p>

              <p className="font-['Open_Sans'] text-sm md:text-base lg:text-lg text-gray-800 leading-relaxed">
                After over 5 years of intent to create a wave of music
                to reach humanity as blessings of the Siddhars, Arakara was created. 
                The meditative powers within the resonance as seeds of mighty consciousness,
                alongside the joys of the special musical composition is the dance of awakening. 
                Arakara will make you dance in the sacred joys!
              </p>
            </div>

            {/* Tags Section */}
            <div className="pt-4 md:pt-6">
              <TagList tags={tags} />
            </div>
          </div>
        </div>
    //   </div>
    // </div>
  );
};

export default ProductDescription;