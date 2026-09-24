import { useState } from "react";
import "./Guide.css";
import Navbar from "./components/Navbar";


type Step = {
  title: string;
  description: string;
};

type FAQ = {
  question: string;
  answer: string;
};



const steps: Step[] = [
  {
    title: "Browse opportunities",
    description:
      "Head to Opportunities and search or filter by department and location. No account needed to look around.",
  },
  {
    title: "Create an account",
    description:
      "Sign up to unlock saving internships and tracking the ones you've applied to.",
  },
  {
    title: "Save or mark as applied",
    description:
      "Tap Save to bookmark something for later, or Applied once you've sent your application. Applied listings drop out of your active feed automatically.",
  },
  {
    title: "Build your CV",
    description:
      "Fill in the basics in CV Builder and download a ready-to-send CV.",
  },
  {
    title: "Apply directly",
    description:
      "Use the link or email on each listing to apply straight to the company — no extra steps in between.",
  },
];

const faqs: FAQ[] = [
  {
    question: "Do I need an account to browse internships?",
    answer:
      "No. Browsing and searching Opportunities is open to everyone. You'll only need an account to save internships or mark them as applied.",
  },
  {
    question: "Why did an internship disappear from my feed?",
    answer:
      "Once you mark something as Applied, it's removed from your active feed so you're only ever looking at internships you haven't acted on yet. You can still find it under your Applied list.",
  },
  {
    question: "Is Interlink only for tech or IT students?",
    answer:
      "Not at all. Internships are listed across departments — from marketing and finance to engineering and design. Filter by your department to see what's relevant to you.",
  },
  {
    question: "Can I apply to internships outside my state?",
    answer:
      "Yes. Location filtering just helps you find what's nearby first — it's a preference, not a restriction. You can search or browse anywhere in the country.",
  },
  {
    question: "How often are new internships added?",
    answer:
      "We're adding new listings regularly as we find them. Check back often, or save opportunities you're interested in so you don't lose track.",
  },
  {
    question: "Is Interlink free to use?",
    answer:
      "Yes — browsing, saving, applying, and building your CV are all free.",
  },
];

function FAQItem({ faq }: { faq: FAQ }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="faq-item">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="faq-question"
      >
        <span>{faq.question}</span>
        <span className={`faq-icon ${open ? "faq-icon--open" : ""}`} aria-hidden="true">
          +
        </span>
      </button>
      {open && <p className="faq-answer">{faq.answer}</p>}
    </div>
  );
}

export default function Guide() {
  return (
    <>
      <Navbar />
    <div className="guide-page">
      <header className="guide-header">
        <h1>Finding your way around NaijaIntern</h1>
        <p>
          A quick walkthrough of how the platform works, from your first
          search to sending an application.
        </p>
      </header>

      <section className="guide-steps">
        <ol>
          {steps.map((step, i) => (
            <li key={step.title} className="guide-step">
              <div className="guide-step-number">{i + 1}</div>
              <div className="guide-step-body">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="guide-faq">
        <h2>Common questions</h2>
        <div className="faq-list">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} faq={faq} />
          ))}
        </div>
      </section>
    </div>
    </>
  );
}