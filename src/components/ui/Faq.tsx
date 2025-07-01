import React, { useState } from 'react';
import type { ReactNode } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: ReactNode;
}

interface FAQBlockProps {
  items: FAQItem[];
  expandedFaqs: Record<string, boolean>;
  toggleFAQ: (id: string) => void;
}

const FAQBlock: React.FC<FAQBlockProps> = ({ items, expandedFaqs, toggleFAQ }) => (
  <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
    <div className="divide-y divide-gray-100">
      {items.map((item) => (
        <div key={item.id} className="p-6">
          <button
            className="flex justify-between items-center w-full text-left"
            onClick={() => toggleFAQ(item.id)}
          >
            <span className="text-lg font-medium text-gray-900 pr-4">{item.question}</span>
            <span className="text-gray-500 text-xl flex-shrink-0">
              {expandedFaqs[item.id] ? '−' : '+'}
            </span>
          </button>
          {expandedFaqs[item.id] && (
            <div className="text-base mt-4 text-gray-800">{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  </div>
);

interface SectionProps {
  title: string;
  blocks: FAQItem[][];
  expandedFaqs: Record<string, boolean>;
  toggleFAQ: (id: string) => void;
  cols: string;
}

const Section: React.FC<SectionProps> = ({ title, blocks, expandedFaqs, toggleFAQ, cols }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">{title}</h2>
    <div className={`grid grid-cols-1 ${cols} gap-6`}>
      {blocks.map((blockItems, i) => (
        <FAQBlock key={i} items={blockItems} expandedFaqs={expandedFaqs} toggleFAQ={toggleFAQ} />
      ))}
    </div>
  </div>
);

interface FAQSectionProps {
  searchQuery: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({ searchQuery }) => {
  const [expandedFaqs, setExpandedFaqs] = useState<Record<string, boolean>>({});
  const toggleFAQ = (id: string) => setExpandedFaqs((prev) => ({ ...prev, [id]: !prev[id] }));
  // ========== DATA ==========

  const personSignupFlow: FAQItem[] = [
{
  id: 'signup-1',
  question: ' How do I get started as an individual on cness.io?',
  answer: (
    <div>
      <p>Visit cness.io and click “Sign Up” or “Get Certified.” Just fill out two quick steps:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Enter your name, email, and basic details.</li>
        <li>Share a bit about your work and what conscious purpose means to you.</li>
      </ul>
      <p className="mt-2">This helps us tailor your journey and match you with the right resources.</p>
    </div>
  )
},    
{
  id: 'signup-2',
  question: 'What personal information is required during signup?',
  answer: (
    <div>
      <p>We’ll ask for a few key details to set up your profile and personalize your experience:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li><strong>Full name & email</strong></li>
        <li><strong>Profession & area of work</strong></li>
        <li><strong>Country & city</strong> (optional)</li>
        <li>A short note on what conscious work means to you</li>
        <li>Optionally, links to your resume or social profiles</li>
      </ul>
      <p className="mt-2">This helps us understand your intent, not just your identity.</p>
    </div>
  )
},
{
  id: 'signup-3',
  question: 'Is signing up on cness.io completely free?',
  answer: (
    <div>
      <p>Yes — signing up is completely free!</p>
      <p className="mt-2">You’ll get access to:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Your personal dashboard</li>
        <li>Starter modules on conscious certification</li>
        <li>Invitations to events and learning updates</li>
      </ul>
      <p className="mt-2">Paid plans only apply to advanced modules, mentorship, or certifications like <strong>Inspired</strong> or <strong>Luminary</strong>, and are always clearly explained.</p>
    </div>
  )
},
   {
  id: 'signup-4',
  question: 'Can I use Google or Facebook to sign up quickly?',
  answer: (
    <div>
      <p>Yes! You can sign up instantly with:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li><strong>Google Login</strong></li>
        <li><strong>Facebook Login</strong></li>
      </ul>
      <p className="mt-2">No extra passwords needed. You can fill out more profile details anytime after.</p>
    </div>
  )
},
{
  id: 'signup-5',
  question: 'I didn’t receive the confirmation email. What should I do?',
  answer: (
    <div>
      <p>No worries — your confirmation email might be in <strong>Spam</strong>, <strong>Promotions</strong>, or <strong>Updates</strong>.</p>
      <p className="mt-2">If it’s still missing:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Go back to the login page</li>
        <li>Click <strong>“Resend Verification Email”</strong></li>
        <li>Still stuck? Email us at <a href="mailto:support@cness.io" className="text-blue-600">support@cness.io</a></li>
      </ul>
    </div>
  )
},
{
  id: 'signup-6',
  question: 'Can I update my profile after signing up?',
  answer: (
    <div>
      <p>Yes! You have full control over your profile.</p>
      <p className="mt-2">After logging in:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Go to the <strong>Profile</strong> tab in your dashboard</li>
        <li>Edit your name, profession, purpose, location, and more</li>
        <li>Update your certification journey, best practices, and uploads anytime</li>
      </ul>
    </div>
  )
},
{
  id: 'signup-7',
  question: 'I forgot my password. How can I reset it?',
  answer: (
    <div>
      <p>Just follow these quick steps:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Go to the <strong>Login</strong> page</li>
        <li>Click on <strong>“Forgot Password”</strong></li>
        <li>Enter your registered email</li>
      </ul>
      <p className="mt-2">You’ll get a secure link to set a new password.</p>
    </div>
  )
},
    {
  id: 'signup-8',
  question: 'Is my personal data safe with CNESS?',
  answer: (
    <div>
      <p>Yes — we take your privacy seriously.</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Your data is securely stored with encryption</li>
        <li>We never sell or share your information</li>
        <li>You can delete your account anytime from your profile</li>
      </ul>
      <p className="mt-2">
        See our <a href="/privacy-policy" className="text-blue-600">Privacy Policy</a> for full details.
      </p>
    </div>
  )
}
  ];

  const certificationJourney: FAQItem[] = [
    { id: 'cert-1', question: 'What is the CNESS Inspired Certification and who is it for?', answer: <p>The CNESS Inspired Certification is designed for individuals who are actively embodying conscious values in their profession and personal life. It recognizes those who are beyond intention and are already integrating purpose,
       ethics, and impact into their daily actions.</p> },
    { id: 'cert-2', question: 'How is the Inspired self-assessment structured?', answer: <p>The assessment is structured around five core CNESS pillars. Each section includes selected reflection statements, open-ended “Purpose Pause” questions, space to share best practices, and an option to upload supporting documents. 
      Each pillar is scored out of 20 points.</p> },
{
  id: 'cert-3',
  question: 'What are the five pillars evaluated during the certification process?',
  answer: (
    <div>
      <p>The five pillars are:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li><strong>Mission & Vision</strong> – Aligning your personal purpose and professional role</li>
        <li><strong>Customer & Consumer Alignment</strong> – Ethical, value-based client interactions</li>
        <li><strong>Communities & Charities</strong> – Social contribution and community engagement</li>
        <li><strong>Vision & Legacy</strong> – The long-term impact and values you’re building</li>
        <li><strong>Leadership Best Practices</strong> – Integrity, self-leadership, and conscious influence</li>
      </ul>
    </div>
  )
},
{
  id: 'cert-4',
  question: 'What types of questions or inputs are required in each pillar?',
  answer: (
    <div>
      <p>Each pillar includes:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>A multiple-choice reflection prompt</li>
        <li>Open-ended Purpose Pause questions</li>
        <li>A space to list conscious best practices</li>
      </ul>
      <p className="mt-2">You can also add optional uploads or links to showcase your work.</p>
    </div>
  )
},
    { id: 'cert-5', question: ' Do I need to upload any documents or links to complete the assessment?', answer: <p>No, uploads are optional. However, adding relevant documents, media, or links can strengthen your assessment by showcasing real-world actions and impact. Screenshots, testimonials,
       blogs, or social media posts are all welcome.</p> },
{
  id: 'cert-6',
  question: 'How is my score calculated and what does it reflect?',
  answer: (
    <div>
      <p>Each pillar is scored out of <strong>20</strong>, based on:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Alignment with conscious values</li>
        <li>Depth and clarity of your reflections</li>
        <li>Relevance and originality of best practices</li>
        <li>Quality (not quantity) of uploads</li>
      </ul>
      <p className="mt-2">Your total score out of <strong>100</strong> reflects your overall conscious alignment.</p>
    </div>
  )
},
    { id: 'cert-7', question: ' What is the total score required to achieve Inspired Certification?', answer: <p>To qualify for Inspired Certification, a minimum total score—typically above 70—is required. Exact thresholds may vary slightly based on quality and completeness.
       High scores may qualify you for the Luminary level upon review.</p> },
    { id: 'cert-8', question: 'How do I access my Self-Assessment Report?', answer: <p>Once your responses are submitted and reviewed, a detailed Self-Assessment Report is auto-generated and shared with you. This includes your scores, reflections, best practices,
       and any uploaded content—organized by pillar.</p> },
    { id: 'cert-9', question: 'Will I receive feedback or a summary after submission?', answer: <p>Yes. Along with your total score and level, you will receive brief comments or highlights from the review team, offering insights and recommendations 
      to support your growth and next steps.</p> },
    { id: 'cert-10', question: ' Can I improve my responses or upgrade my certification level later?', answer: <p>Absolutely. You may revisit and update your self-assessment after a short interval. This allows for reflection, action, and conscious growth. 
      You can also apply to upgrade from Inspired to Luminary when ready</p> },
{
  id: 'cert-11',
  question: 'What do I receive once I’m certified at the Inspired level?',
  answer: (
    <div>
      <p>When you’re certified at the <strong>Inspired level</strong>, you’ll receive:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>A personalized Self-Assessment Report</li>
        <li>A digital Inspired Certification Badge</li>
        <li>A downloadable Certificate of Recognition</li>
        <li>Optional listing in the CNESS Public Directory</li>
        <li>Access to advanced resources and community initiatives</li>
      </ul>
    </div>
  )
},
    { id: 'cert-12', question: 'Is there a timeline or deadline to complete the certification?', answer: <p>No, the journey is self-paced. You can complete it in one sitting or return to it anytime. However, once submitted, the review process typically takes 5–7 business days.</p> },
    { id: 'cert-13', question: 'Can I re-apply or retake the assessment if I’m not satisfied with myresults?', answer: <p>Yes. If you feel your assessment doesn’t reflect your growth or new conscious efforts, you can re-apply after a short waiting period. Your new submission will be evaluated as a fresh entry.</p> },
{
  id: 'cert-14',
  question: 'Where can I showcase my badge and certificate?',
  answer: (
    <div>
      <p>You can showcase your badge and certificate on:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>LinkedIn and other social platforms</li>
        <li>Your personal website or blog</li>
        <li>Email signatures</li>
        <li>The CNESS public directory (optional)</li>
      </ul>
      <p className="mt-2">We also give you verified badge links for authenticity.</p>
    </div>
  )
},
    { id: 'cert-15', question: 'Who reviews my assessment and ensures scoring is fair?', answer: <p>Your responses are reviewed by trained members of the CNESS Review Team or peer-led conscious circles. Reviews are based on a structured rubric to ensure fairness, consistency,
       and depth of understanding.</p> },
  ];

  const pricingPlans: FAQItem[] = [
    { id: 'price-1', question: ' Is it free to sign up for CNESS as an individual?', answer: <p>Yes. Creating a personal account on cness.io is completely free. You can begin your self-assessment, explore the platform, and access basic tools without any cost.</p> },
{
  id: 'price-2',
  question: 'What is included in the free plan?',
  answer: (
    <div>
      <p>The Free Starter Access includes:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Full use of the self-assessment form</li>
        <li>Reflecting across all five CNESS pillars</li>
        <li>Saving progress and returning anytime</li>
        <li>Community updates and learning content</li>
        <li>Eligibility for the Aspiring Recognition badge if minimum criteria are met</li>
      </ul>
    </div>
  )
},
{
  id: 'price-3',
  question: 'What are the paid certification plans for individuals?',
  answer: (
    <div>
      <p>Here are the paid certification plans:</p>
      <ul className="list-disc pl-5 mt-2 space-y-2">
        <li>
          <strong>Inspired Certification</strong> ($108) – Full review, personalized report, Inspired badge, certificate, and optional public profile.
        </li>
        <li>
          <strong>Luminary Certification</strong> ($258) – Deeper review, premium Luminary badge, featured profile, alumni network, and advanced modules.
        </li>
      </ul>
      <p className="mt-2 text-sm text-gray-600">Note: Prices are in USD. Local taxes may apply.</p>
    </div>
  )
},
{
  id: 'price-4',
  question: 'What does the certification fee cover?',
  answer: (
    <div>
      <p>Your certification fee covers:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>A professional review of your self-assessment</li>
        <li>A detailed Self-Assessment Report</li>
        <li>A verified Digital Badge and Certificate</li>
        <li>Eligibility for directory listing and showcases</li>
        <li>Ongoing access to conscious learning tools and support</li>
      </ul>
    </div>
  )
},
    { id: 'price-5', question: 'When do I pay – before or after assessment?', answer: <p>You pay after completing your full self-assessment. Once your responses are submitted and reviewed, your final score and eligibility will be shared. You can then choose to proceed with payment to unlock the certification and recognition features.</p> },
    { id: 'price-6', question: 'Can I upgrade later from Inspired to Luminary?', answer: <p>Yes. If you begin with the Inspired level, you can return to your dashboard, update your best practices and uploads, and request an upgrade. You’ll only need to pay the difference in cost (i.e., $150) at the time of upgrade.</p> },
{
  id: 'price-7',
  question: 'Are there discounts or financial aid options available?',
  answer: (
    <div>
      <p>Yes! CNESS offers:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Discounts for students, early-career professionals, and non-profit leaders</li>
        <li>Group pricing for teams or collectives</li>
        <li>Scholarships on a case-by-case basis</li>
      </ul>
      <p className="mt-2">
        Email <a href="mailto:support@cness.io" className="text-blue-600">support@cness.io</a> to request support or apply for aid.
      </p>
    </div>
  )
},
{
  id: 'price-8',
  question: 'What payment methods are accepted?',
  answer: (
    <div>
      <p>Payments can be made securely via:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Credit/Debit Cards (Visa, Mastercard, Amex)</li>
        <li>PayPal (International)</li>
        <li>UPI and Netbanking (where available)</li>
      </ul>
      <p className="mt-2">All transactions go through Stripe-secured checkout.</p>
    </div>
  )
},
    { id: 'price-9', question: ' Is the certification fee refundable?', answer: <p>Partial refunds may be considered within <strong>7 days</strong> of report delivery if the process did not meet your expectations. You can email <strong>support@cness.io</strong> with your request and feedback. 
      Each case is reviewed with fairness and care.</p> },
{
  id: 'price-10',
  question: 'What is included in the Free Plan?',
  answer: (
    <div>
      <p>The <strong>Free Plan</strong> is always $0 — perfect for exploring at your own pace. It includes:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Access to the full self-assessment form</li>
        <li>Saving progress as you go</li>
        <li>Eligibility for the Aspiring badge (if minimum score met)</li>
        <li>Newsletter and community updates</li>
      </ul>
    </div>
  )
},
{
  id: 'price-11',
  question: 'What is included in the Inspired Certification?',
  answer: (
    <div>
      <p><strong>Inspired Certification</strong> ($108 one-time) is for individuals actively living their values and making an ethical impact. It includes:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>A full review of your self-assessment</li>
        <li>A personalized Self-Assessment Report</li>
        <li>A verified Inspired digital badge</li>
        <li>A downloadable Certificate of Recognition</li>
        <li>Optional public profile listing in the CNESS Directory</li>
        <li>Feedback and conscious practice recommendations</li>
      </ul>
    </div>
  )
},
{
  id: 'price-12',
  question: 'What is included in the Luminary Certification?',
  answer: (
    <div>
      <p><strong>Luminary Certification</strong> ($258 one-time) is for changemakers leading consciously and inspiring systemic change. It includes:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Advanced review with personalized feedback</li>
        <li>A verified Luminary badge and framed certificate</li>
        <li>Featured listing in the CNESS Luminary Showcase</li>
        <li>Access to exclusive learning modules and events</li>
        <li>Invitation to the CNESS Alumni Network</li>
        <li>Recognition as a conscious thought leader</li>
      </ul>
    </div>
  )

}];

  const badgeProfile: FAQItem[] = [
    { id: 'badge-1', question: 'What is the CNESS Digital Badge?', answer: <p>The CNESS Digital Badge is a verified symbol of your conscious alignment. It reflects your certification level (Aspiring, Inspired, or Luminary) and can be displayed on your LinkedIn profile, website, resume, or email signature. Each badge is uniquely issued,
       secure, and linked to your public certification details.</p> },
{
  id: 'badge-2',
  question: 'How do I receive my badge after certification?',
  answer: (
    <div>
      <p>Once your self-assessment is reviewed and approved, you’ll receive:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>A downloadable badge image</li>
        <li>A secure verification link</li>
        <li>Instructions to share it on LinkedIn, Credly, or your website</li>
      </ul>
    </div>
  )
},
{
  id: 'badge-3',
  question: 'Can I add the badge to my LinkedIn or resume?',
  answer: (
    <div>
      <p>Absolutely! You’ll get step-by-step guidance to:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Add your CNESS badge under “Licenses & Certifications” on LinkedIn</li>
        <li>Embed it in your resume or digital portfolio</li>
        <li>Include it in your email signature or personal branding</li>
      </ul>
    </div>
  )
},
{
  id: 'badge-4',
  question: 'What is the CNESS Public Profile?',
  answer: (
    <div>
      <p>Certified individuals (Inspired or Luminary) can choose to publish a public profile on cness.io. It includes:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Your name, photo, location, and profession</li>
        <li>Your certification badge and level</li>
        <li>Highlights from your self-assessment (best practices, purpose)</li>
        <li>Optional social/media links or uploads</li>
      </ul>
      <p className="mt-2">This creates a verified presence for conscious professionals in the global directory.</p>
    </div>
  )
},
{
  id: 'badge-5',
  question: 'Is it mandatory to publish my profile publicly?',
  answer: (
    <div>
      <p>No — it’s completely optional. You control your visibility.</p>
      <p className="mt-2">During certification, you can choose:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li><strong>Public Profile</strong> (visible in the CNESS directory)</li>
        <li><strong>Private Recognition</strong> (badge and certificate only)</li>
      </ul>
      <p className="mt-2">Your data and reflections are never published without your consent.</p>
    </div>
  )
},
{
  id: 'badge-6',
  question: 'What recognition do I get beyond the badge?',
  answer: (
    <div>
      <p>As a certified CNESS individual, you may also receive:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>A Certificate of Conscious Recognition (PDF, printable)</li>
        <li>Inclusion in social media highlights or featured stories (optional)</li>
        <li>Invitations to alumni gatherings, events, or interviews</li>
        <li>Luminary participants may be featured in the CNESS Showcase and storytelling initiatives</li>
      </ul>
    </div>
  )
},
    {
  id: 'badge-7',
  question: 'Can I update my public profile later?',
  answer: (
    <div>
      <p>Yes! You can return anytime to:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Edit your photo, bio, and profession</li>
        <li>Add new best practices or links</li>
        <li>Upgrade your certification level and refresh your badge</li>
      </ul>
      <p className="mt-2">All updates are reviewed and reflected on your public profile.</p>
    </div>
  )
}
  ];

  const techSupport: FAQItem[] = [
    { id: 'tech-1', question: 'I forgot my password. How can I reset it?', answer: <p>Go to the Login page and click on “Forgot Password”. Enter your registered email address, and we’ll send you a link to reset your password securely. 
      If you don’t see the email, check your spam or promotions folder.</p> },
{
  id: 'tech-2',
  question: 'I didn’t receive the verification email after signing up. What should I do?',
  answer: (
    <div>
      <p>First, check your spam, promotions, or junk folders. If it’s still missing:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Go to the login page</li>
        <li>Click <strong>“Resend Verification Email”</strong></li>
      </ul>
      <p className="mt-2">
        If the issue continues, email <a href="mailto:support@cness.io" className="text-blue-600">support@cness.io</a> and we’ll help right away.
      </p>
    </div>
  )
},
{
  id: 'tech-3',
  question: 'I’m having trouble logging in. What can I check?',
  answer: (
    <div>
      <p>Make sure:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Your email is correct</li>
        <li>Your password is case-sensitive</li>
        <li>You’ve verified your email (check your inbox)</li>
      </ul>
      <p className="mt-2">
        If you still can’t log in, email <a href="mailto:support@cness.io" className="text-blue-600">support@cness.io</a> with a screenshot or details of the issue.
      </p>
    </div>
  )
},
    { id: 'tech-4', question: 'Can I log in using Google or Facebook?', answer: <p>Yes. If you signed up using Google or Facebook, make sure you continue using the same method to log in. If you signed up with email/password,
       Google/Facebook login won't work unless linked manually later.</p> },
    { id: 'tech-5', question: 'Is my data secure on cness.io?', answer: <p>Yes. We use industry-standard encryption to protect your data. Your information is never sold or shared without your consent. 
      For more, please review our Privacy Policy.</p> },
    { id: 'tech-6', question: 'Can I access cness.io from my phone or tablet?', answer: <p>Yes! CNESS is fully responsive and works smoothly on mobile, tablet, and desktop browsers. A mobile app is in development and will be available soon for easier access.</p> },
{
  id: 'tech-7',
  question: 'My progress didn’t save. What should I do?',
  answer: (
    <div>
      <p>Your progress is usually saved automatically. If there’s a disruption:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Try refreshing the page</li>
        <li>Log out and log back in</li>
        <li>Avoid using “incognito” or private browsing modes</li>
      </ul>
      <p className="mt-2">
        If it continues, email <a href="mailto:support@cness.io" className="text-blue-600">support@cness.io</a> with details.
      </p>
    </div>
  )
},
    { id: 'tech-8', question: 'I submitted the form but didn’t receive my report or badge. What now?', answer: <p>Reports and badges are issued after manual review. This usually takes<strong>5–7 business days.</strong>  If it's been longer, please reach out to us and we’ll prioritize your case.</p> },
    { id: 'tech-9', question: 'Can I delete my account if I no longer wish to use the platform?', answer: <p>Yes. You can request account deletion at any time. Please email <strong>support@cness.io</strong> with your registered email and subject line <strong>“Account Deletion Request”.</strong> Your data will be securely and permanently removed.</p> },
  ];

  // ========= Filter each array =========
  const filterItems = (items: FAQItem[]) =>
    items.filter(item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filteredPersonSignupFlow = filterItems(personSignupFlow);
  const filteredCertificationJourney = filterItems(certificationJourney);
  const filteredPricingPlans = filterItems(pricingPlans);
  const filteredBadgeProfile = filterItems(badgeProfile);
  const filteredTechSupport = filterItems(techSupport);

  return (
    <div className="w-full px-4 py-12 space-y-16">
      {filteredPersonSignupFlow.length > 0 && (
        <Section
          title="👤 Person Signup Flow"
          blocks={[filteredPersonSignupFlow.slice(0,4), filteredPersonSignupFlow.slice(4,8)]}
          expandedFaqs={expandedFaqs}
          toggleFAQ={toggleFAQ}
          cols="md:grid-cols-2"
        />
      )}

      {filteredCertificationJourney.length > 0 && (
        <Section
          title="🏆 Certification Journey"
          blocks={[
            filteredCertificationJourney.slice(0,5),
            filteredCertificationJourney.slice(5,10),
            filteredCertificationJourney.slice(10,15)
          ]}
          expandedFaqs={expandedFaqs}
          toggleFAQ={toggleFAQ}
          cols="md:grid-cols-3"
        />
      )}

      {filteredPricingPlans.length > 0 && (
        <Section
          title="💰 Pricing & Plans"
          blocks={[
            filteredPricingPlans.slice(0,4),
            filteredPricingPlans.slice(4,8),
            filteredPricingPlans.slice(8,12)
          ]}
          expandedFaqs={expandedFaqs}
          toggleFAQ={toggleFAQ}
          cols="md:grid-cols-3"
        />
      )}

      {filteredBadgeProfile.length > 0 && (
        <Section
          title="🛡️ Digital Badge & Profile"
          blocks={[
            filteredBadgeProfile.slice(0,4),
            filteredBadgeProfile.slice(4,7)
          ]}
          expandedFaqs={expandedFaqs}
          toggleFAQ={toggleFAQ}
          cols="md:grid-cols-2"
        />
      )}

      {filteredTechSupport.length > 0 && (
        <Section
          title="💻 Tech & Access Support"
          blocks={[
            filteredTechSupport.slice(0,5),
            filteredTechSupport.slice(5,9)
          ]}
          expandedFaqs={expandedFaqs}
          toggleFAQ={toggleFAQ}
          cols="md:grid-cols-2"
        />
      )}

      {filteredPersonSignupFlow.length === 0 &&
       filteredCertificationJourney.length === 0 &&
       filteredPricingPlans.length === 0 &&
       filteredBadgeProfile.length === 0 &&
       filteredTechSupport.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No FAQs found matching "{searchQuery}".
        </p>
      )}
    </div>
  );
};

export default FAQSection;