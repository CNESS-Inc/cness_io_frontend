import Button from '../components/ui/Button'

const About = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" tabIndex={-1}>
        Welcome to the Optimized App
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section aria-labelledby="features-heading">
          <h2 id="features-heading" className="text-2xl font-semibold mb-4">
            Features
          </h2>
          <ul className="space-y-2 list-disc pl-5">
            <li>Lazy loaded routes</li>
            <li>Accessible components</li>
            <li>Performance optimized</li>
            <li>Reusable UI components</li>
          </ul>
        </section>

        <section aria-labelledby="demo-heading">
          <h2 id="demo-heading" className="text-2xl font-semibold mb-4">
            Demo
          </h2>
          <div className="space-y-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary" size="lg">
              Large Secondary
            </Button>
          </div>
        </section>
      </div>

      <div className="mt-8">

      </div>
    </div>
  )
}

export default About