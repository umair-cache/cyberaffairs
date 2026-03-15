"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import { siteConfig } from "@/config/site";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  name:    string;
  email:   string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?:    string;
  email?:   string;
  subject?: string;
  message?: string;
}

type SubmitStatus = "idle" | "submitting" | "success" | "error";

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!form.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!form.subject.trim()) {
    errors.subject = "Subject is required.";
  }

  if (!form.message.trim()) {
    errors.message = "Message is required.";
  } else if (form.message.trim().length < 20) {
    errors.message = "Message must be at least 20 characters.";
  }

  return errors;
}

// ─── Contact reasons ──────────────────────────────────────────────────────────

const subjectOptions = [
  { value: "",              label: "Select a subject…"         },
  { value: "tip",           label: "Submit a News Tip"         },
  { value: "research",      label: "Share Security Research"   },
  { value: "correction",    label: "Article Correction"        },
  { value: "collaboration", label: "Collaboration Inquiry"     },
  { value: "advertising",   label: "Advertising / Sponsorship" },
  { value: "other",         label: "Other"                     },
];

// ─── Contact info cards ───────────────────────────────────────────────────────

const contactCards = [
  {
    icon:        <MailIcon />,
    title:       "Email Us",
    description: "For general enquiries and tips",
    value:       siteConfig.author.email,
    href:        `mailto:${siteConfig.author.email}`,
    linkLabel:   "Send an email",
  },
  {
    icon:        <TwitterIcon />,
    title:       "Twitter / X",
    description: "For quick questions and updates",
    value:       "@cyberaffairs",
    href:        siteConfig.socials.twitter,
    linkLabel:   "Follow on Twitter",
    external:    true,
  },
  {
    icon:        <ShieldIcon />,
    title:       "Responsible Disclosure",
    description: "Security vulnerabilities and CVEs",
    value:       "security@cyberaffairs.site",
    href:        "mailto:security@cyberaffairs.site",
    linkLabel:   "Send disclosure",
  },
];

// ─── Field component ──────────────────────────────────────────────────────────

interface FieldProps {
  id:          string;
  label:       string;
  error?:      string;
  required?:   boolean;
  children:    React.ReactNode;
}

function Field({ id, label, error, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-sans text-sm font-semibold text-[#374151]"
      >
        {label}
        {required && (
          <span className="text-[#DC2626] ml-1" aria-hidden="true">*</span>
        )}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="font-sans text-xs text-[#DC2626] flex items-center gap-1"
        >
          <ErrorIcon />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Input class helper ───────────────────────────────────────────────────────

function inputClass(hasError: boolean): string {
  return [
    "w-full font-sans text-sm text-[#111111] bg-white rounded-lg border px-4 py-2.5",
    "placeholder:text-[#9CA3AF] transition-all duration-150",
    "focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-0 focus:border-[#4F46E5]",
    hasError
      ? "border-[#DC2626] bg-red-50"
      : "border-[#E5E7EB] hover:border-[#D1D5DB]",
  ].join(" ");
}

// ─── Success state ────────────────────────────────────────────────────────────

function SuccessMessage({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 gap-5 animate-in fade-in duration-300">
      <span
        className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200"
        aria-hidden="true"
      >
        <CheckIcon />
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="font-sans text-xl font-bold text-[#0D0A2E]">
          Message Sent
        </h3>
        <p className="font-sans text-sm text-[#6B7280] max-w-sm">
          Thank you for reaching out. We review every message and will get back
          to you within 1–2 business days.
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="font-sans text-sm font-semibold text-[#4F46E5] hover:text-[#1E135C] transition-colors duration-150 focus-visible:outline-none focus-visible:underline"
      >
        Send another message
      </button>
    </div>
  );
}

// ─── Contact form ─────────────────────────────────────────────────────────────

function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name:    "",
    email:   "",
    subject: "",
    message: "",
  });
  const [errors,        setErrors]       = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      
      // Clear field error on change
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const validationErrors = validate(form);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        // Focus first error field for accessibility
        const firstErrorKey = Object.keys(validationErrors)[0];
        document.getElementById(firstErrorKey)?.focus();
        return;
      }

      setSubmitStatus("submitting");
      setErrors({});

      try {
        // Simulate submission — replace with your API endpoint fetch call
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setSubmitStatus("success");
      } catch {
        setSubmitStatus("error");
      }
    },
    [form]
  );

  const handleReset = useCallback(() => {
    setForm({ name: "", email: "", subject: "", message: "" });
    setErrors({});
    setSubmitStatus("idle");
  }, []);

  if (submitStatus === "success") {
    return <SuccessMessage onReset={handleReset} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact form"
      className="flex flex-col gap-5 relative"
    >
      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field id="name" label="Full Name" error={errors.name} required>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Smith"
            autoComplete="name"
            aria-required="true"
            aria-describedby={errors.name ? "name-error" : undefined}
            aria-invalid={!!errors.name}
            className={inputClass(!!errors.name)}
            disabled={submitStatus === "submitting"}
          />
        </Field>

        <Field id="email" label="Email Address" error={errors.email} required>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="jane@example.com"
            autoComplete="email"
            aria-required="true"
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-invalid={!!errors.email}
            className={inputClass(!!errors.email)}
            disabled={submitStatus === "submitting"}
          />
        </Field>
      </div>

      {/* Subject */}
      <Field id="subject" label="Subject" error={errors.subject} required>
        <select
          id="subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          aria-required="true"
          aria-describedby={errors.subject ? "subject-error" : undefined}
          aria-invalid={!!errors.subject}
          className={inputClass(!!errors.subject)}
          disabled={submitStatus === "submitting"}
        >
          {subjectOptions.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>

      {/* Message */}
      <Field id="message" label="Message" error={errors.message} required>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us more about your enquiry…"
          rows={6}
          aria-required="true"
          aria-describedby={errors.message ? "message-error" : undefined}
          aria-invalid={!!errors.message}
          className={`${inputClass(!!errors.message)} resize-y min-h-[140px]`}
          disabled={submitStatus === "submitting"}
        />
        <span className="font-sans text-xs text-[#9CA3AF] text-right">
          {form.message.length} / 2000
        </span>
      </Field>

      {/* Submit error */}
      {submitStatus === "error" && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 animate-in fade-in"
        >
          <ErrorIcon className="text-[#DC2626] mt-0.5 flex-shrink-0" />
          <p className="font-sans text-sm text-[#DC2626]">
            Something went wrong. Please try again or email us directly at{" "}
            <a
              href={`mailto:${siteConfig.author.email}`}
              className="underline hover:no-underline"
            >
              {siteConfig.author.email}
            </a>
            .
          </p>
        </div>
      )}

      {/* Submit button */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <p className="font-sans text-xs text-[#9CA3AF]">
          <span aria-hidden="true">*</span> Required fields
        </p>
        <button
          type="submit"
          disabled={submitStatus === "submitting"}
          className="inline-flex items-center gap-2 font-sans text-sm font-semibold px-6 py-2.5 rounded-lg bg-[#4F46E5] text-white hover:bg-[#1E135C] border border-transparent transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
          aria-live="polite"
        >
          {submitStatus === "submitting" ? (
            <>
              <SpinnerIcon />
              Sending…
            </>
          ) : (
            <>
              Send Message
              <SendIcon />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  return (
    <Container className="py-10 sm:py-14">

      {/* ── Page header ───────────────────────────────────────────────── */}
      <div className="mb-10 max-w-xl">
        <p className="font-sans text-xs font-bold uppercase tracking-widest text-[#4F46E5] mb-2">
          Contact
        </p>
        <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#0D0A2E] tracking-tight mb-3">
          Get in Touch
        </h1>
        <p className="font-sans text-base text-[#6B7280] leading-relaxed">
          Have a security tip, research to share, or just want to say hello?
          We read every message and respond within 1–2 business days.
        </p>
      </div>

      {/* ── Layout: form + sidebar ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-14 items-start">

        {/* ── Contact form ──────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8">
          <h2 className="font-sans text-lg font-bold text-[#0D0A2E] mb-6">
            Send us a message
          </h2>
          <ContactForm />
        </div>

        {/* ── Sidebar ───────────────────────────────────────────────────── */}
        <aside className="flex flex-col gap-5" aria-label="Contact information">

          {/* Contact cards */}
          {contactCards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col gap-3 p-5 rounded-xl border border-[#E5E7EB] bg-white"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#F5F3FF] flex-shrink-0"
                  aria-hidden="true"
                >
                  {card.icon}
                </span>
                <div>
                  <span className="block font-sans text-sm font-bold text-[#0D0A2E]">
                    {card.title}
                  </span>
                  <span className="block font-sans text-xs text-[#9CA3AF]">
                    {card.description}
                  </span>
                </div>
              </div>
              
              <a
                href={card.href}
                target={card.external ? "_blank" : undefined}
                rel={card.external ? "noopener noreferrer" : undefined}
                aria-label={card.linkLabel}
                className="font-sans text-sm font-semibold text-[#4F46E5] hover:text-[#1E135C] transition-colors duration-150 focus-visible:outline-none focus-visible:underline break-all"
              >
                {card.value}
              </a>
            </div>
          ))}

          {/* Disclosure policy note */}
          <div className="p-5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB]">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 mt-0.5" aria-hidden="true">
                <InfoIcon />
              </span>
              <div className="flex flex-col gap-1.5">
                <span className="font-sans text-sm font-bold text-[#0D0A2E]">
                  Responsible Disclosure
                </span>
                <p className="font-sans text-xs text-[#6B7280] leading-relaxed">
                  If you have discovered a security vulnerability in our
                  platform, please disclose it responsibly via{" "}
                  <a
                    href="mailto:security@cyberaffairs.site"
                    className="text-[#4F46E5] hover:underline font-semibold"
                  >
                    security@cyberaffairs.site
                  </a>
                  . We respond to all valid disclosures within 48 hours.
                </p>
              </div>
            </div>
          </div>

          {/* Back link */}
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-[#6B7280] hover:text-[#4F46E5] transition-colors duration-150 focus-visible:outline-none focus-visible:underline"
          >
            <ArrowLeftIcon />
            Learn more about us
          </Link>
        </aside>
      </div>
    </Container>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#4F46E5" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" className="animate-spin">
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}