
const testimonials = [
  {
    id: 1,
    name: 'Rockstar',
    description: 'Crafting soundscapes that speak where words fall silent.',
    image: 'https://cdn.cness.io/tes1.svg'
  },
  {
    id: 2,
    name: 'Innovator',
    description: 'Pioneering technologies that redefine the limits of creativity.',
    image: 'https://cdn.cness.io/tes2.svg'
  },
  {
    id: 3,
    name: 'Visionary',
    description: 'Shaping the future through artistic expression',
    image: 'https://cdn.cness.io/tes3.svg'
  },
  {
    id: 4,
    name: 'Maestro',
    description: 'Conducting harmony between technology and human emotion.',
    image: 'https://cdn.cness.io/tes4.svg'
  },
  {
    id: 5,
    name: 'Alchemist',
    description: 'Transforming concepts into tangible experiences that inspire.',
    image: 'https://cdn.cness.io/tes5.svg'
  }
];

export default function TestimonialSection() {
  return (
    <div className="py-12 lg:py-20 px-4 lg:px-6 bg-gradient-to-t from-[#FFFFFF] to-[#F1F3FF]">
      <div className="max-w-4xl mx-auto text-center  space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h2 className=" font-[Poppins]
    font-semibold
    text-[30px]
    leading-[45px]
    tracking-[-0.03em]
    text-center
    capitalize
    text-gray-900">
            Thousands of <span className="text-[#7077FE]">podcasters</span><br />
            use Our Marketplace to grow their business
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="space-y-4">
<img
  src={testimonial.image}
  alt={testimonial.name}
  className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl mx-auto object-cover"
/>              
              <div className="space-y-2">
                <h3 className="font-[Poppins] font-medium text-gray-900 text-lg">{testimonial.name}</h3>
                <p className="font-['open_sans']text-sm text-gray-600 leading-relaxed">
                  {testimonial.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="space-y-6">
          <p className="font-[Poppins] text-lg text-gray-600 max-w-2xl mx-auto">
            The platform experts use to scale their knowledge, serve their community, 
            and grow their revenue without burnout.
          </p>
          <button className="px-8 py-3 bg-[#7077FE] text-white rounded-lg font-medium hover:bg-[#7077FE] transition-colors">
            Become a Seller
          </button>
        </div>
      </div>
    </div>
  );
}
