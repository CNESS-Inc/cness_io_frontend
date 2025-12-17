export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQCategory {
  id: string;
  title: string;
  faqs: FaqItem[];
}

export const faqCategories: FAQCategory[] = [
  {
    id: "account",
    title: "Account & Profile",
    faqs: [
      { id: "acc-1", question: "How do I create an account?", answer: "Click 'Sign Up' at the top right and fill out your information to create a new account." },
      { id: "acc-2", question: "How can I update my profile information?", answer: "Go to your account settings, select 'Edit Profile', and save your updated details." },
      { id: "acc-3", question: "I forgot my password. What should I do?", answer: "Use the 'Forgot Password' link on the login page to reset your password via email." },
      { id: "acc-4", question: "How do I place an order?", answer: "Browse products, add them to your cart, and proceed to checkout. Select your payment method and confirm your purchase." },
    ],
  },
  {
    id: "orders",
    title: "Orders & Purchases",
    faqs: [
      { id: "order-1", question: "How do I place an order?", answer: "Browse products, add them to your cart, and proceed to checkout. Select your payment and confirm your purchase." },
      { id: "order-2", question: "Where can I find my past orders?", answer: "Open your profile menu and click 'My Orders' to view your purchase history." },
    ],
  },
  {
    id: "payments",
    title: "Payments & Billing",
    faqs: [
      { id: "pay-1", question: "What payment methods are accepted?", answer: "We accept all major credit/debit cards, UPI, and wallet payments." },
      { id: "pay-2", question: "How do I download my invoice?", answer: "Go to 'My Orders', select your order, and click the 'Download Invoice' button." },
    ],
  },
  {
    id: "support",
    title: "Support & Contact",
    faqs: [
      { id: "sup-1", question: "How do I contact support?", answer: "You can call us or email us at the contact info below!" },
      { id: "sup-2", question: "What if my issue is not listed?", answer: "Reach out via email or phone, and our team will assist you as soon as possible." },
    ],
  },
];

export default faqCategories;
