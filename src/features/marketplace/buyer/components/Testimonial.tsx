
const testimonials = [
  {
    id: 1,
    name: 'Rockstar',
    description: 'Crafting soundscapes that speak where words fall silent.',
    image: '/api/placeholder/120/120'
  },
  {
    id: 2,
    name: 'Innovator',
    description: 'Pioneering technologies that redefine the limits of creativity.',
    image: '/api/placeholder/120/120'
  },
  {
    id: 3,
    name: 'Visionary',
    description: 'Shaping the future through artistic expression',
    image: '/api/placeholder/120/120'
  },
  {
    id: 4,
    name: 'Maestro',
    description: 'Conducting harmony between technology and human emotion.',
    image: '/api/placeholder/120/120'
  },
  {
    id: 5,
    name: 'Alchemist',
    description: 'Transforming concepts into tangible experiences that inspire.',
    image: '/api/placeholder/120/120'
  }
];

export default function TestimonialSection() {
  return (
    <div className="py-12 lg:py-20 px-4 lg:px-6">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h2 className="text-2xl lg:text-4xl font-semibold text-gray-900 leading-tight">
            Thousands of <span className="text-purple-600">podcasters</span><br />
            use Our Marketplace to grow their business
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="space-y-4">
              <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gray-200 rounded-xl mx-auto"></div>
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900 text-lg">{testimonial.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {testimonial.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="space-y-6">
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The platform experts use to scale their knowledge, serve their community, 
            and grow their revenue without burnout.
          </p>
          <button className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
            Become a Seller
          </button>
        </div>
      </div>
    </div>
  );
}
