"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  X
} from "lucide-react";

const heroImages = ["/photos/campus-1.jpg", "/photos/1.jpeg", "/photos/2.jpeg"];

const navItems = [
  { href: "#about", label: "About" },
  { href: "#admissions", label: "Admissions" },
  { href: "#academics", label: "Academics" },
  { href: "#life", label: "School Life" },
  { href: "#contact", label: "Contact" }
];

const stats = [
  { label: "Families Served", value: "500+" },
  { label: "Years of Growth", value: "15+" },
  { label: "CBC Pathway", value: "PP1 - Grade 9" }
];

const highlights = [
  {
    title: "CBC-First Learning",
    description: "Hands-on learning, guided discovery, and strong teacher support across every level.",
    icon: Sparkles
  },
  {
    title: "Christian Character",
    description: "Faith, discipline, and compassion are woven into academics, mentoring, and daily routines.",
    icon: ShieldCheck
  },
  {
    title: "Parent Communication",
    description: "Applications, updates, fees, and school communication stay simple through the portal and WhatsApp.",
    icon: MessageCircle
  }
];

const programs = [
  {
    title: "Pre-Primary",
    subtitle: "PP1 - PP2",
    description: "Warm, play-based foundations that build confidence, language, and curiosity.",
    image: "/photos/1.jpeg"
  },
  {
    title: "Primary School",
    subtitle: "Grade 1 - 6",
    description: "Strong academic routines with literacy, numeracy, projects, and personal growth.",
    image: "/photos/2.jpeg"
  },
  {
    title: "Junior Secondary",
    subtitle: "Grade 7 - 9",
    description: "A structured transition into leadership, responsibility, and deeper subject mastery.",
    image: "/photos/3.jpeg"
  }
];

const quickLinks = [
  { label: "Parent Portal", href: "/portal/parent", icon: Users },
  { label: "Admin Portal", href: "/portal/admin", icon: ShieldCheck },
  { label: "Fee Updates", href: "/portal/fees", icon: CreditCard }
];

const newsItems = [
  {
    title: "Term 2 admissions are open",
    description: "Families can begin the process online and complete school visits with the admissions office.",
    tag: "Admissions"
  },
  {
    title: "CBC projects and assessments are active",
    description: "Learners continue with practical work, teacher feedback, and competency tracking.",
    tag: "Academics"
  },
  {
    title: "Portal access is live for admins and parents",
    description: "Admin, bursar, and parent access now use phone number and a 6-character password.",
    tag: "Portal"
  }
];

const contacts = [
  { label: "Call the school", value: "+254 710 414 220", href: "tel:+254710414220", icon: Phone },
  {
    label: "Visit school",
    value: "Kimilili, Bungoma County",
    href: "https://maps.google.com/?q=Kimilili+Bungoma+County",
    icon: MapPin
  },
  {
    label: "Talk on WhatsApp",
    value: "Start an admissions chat",
    href: "https://wa.me/254710414220?text=Hello%20Shekinah%20School%2C%20I%20would%20like%20to%20ask%20about%20admissions.",
    icon: MessageCircle
  }
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({
    parentName: "",
    phone: "",
    childClassInterested: "",
    message: ""
  });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadMessage, setLeadMessage] = useState<string | null>(null);

  const handleLeadSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLeadSubmitting(true);
    setLeadMessage(null);

    try {
      const response = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadForm)
      });
      const payload = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        setLeadMessage(payload.error ?? "We could not save your inquiry right now.");
        return;
      }

      setLeadMessage(payload.message ?? "Your inquiry has been received.");
      setLeadForm({ parentName: "", phone: "", childClassInterested: "", message: "" });
    } catch {
      setLeadMessage("We could not save your inquiry right now.");
    } finally {
      setLeadSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-navy text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-sm">
          <p className="font-semibold">Admissions for the current term are open.</p>
          <a
            href="https://wa.me/254710414220?text=Hello%20Shekinah%20School%2C%20I%20want%20to%20book%20a%20visit."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-white/90 transition hover:text-white"
          >
            Book a school visit
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <header className="sticky top-[41px] z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy font-bold text-white">
                SS
              </div>
              <div>
                <p className="text-lg font-bold tracking-tight text-navy">Shekinah School</p>
                <p className="text-xs text-slate-500">Excellence in Education, Grounded in Faith.</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-6 lg:flex">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="border-b-2 border-transparent pb-1 text-sm font-semibold text-slate-600 transition hover:border-purple hover:text-navy"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-navy transition hover:border-purple hover:text-purple"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </a>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-navy lg:hidden"
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {menuOpen ? (
            <div className="space-y-3 border-t border-slate-200 py-4 lg:hidden">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block font-semibold text-navy"
                >
                  {item.label}
                </a>
              ))}
              <div className="space-y-2 border-t border-slate-200 pt-3">
                {quickLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block text-sm font-semibold text-slate-600"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </header>

      <section id="about" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="grid h-full grid-cols-1 md:grid-cols-3">
            {heroImages.map((image) => (
              <div key={image} className="relative h-64 md:h-[42rem]">
                <Image src={image} alt="" fill className="object-cover" priority />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(2,6,23,0.86),rgba(15,23,42,0.7),rgba(30,58,138,0.45))]" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-120px)] max-w-7xl gap-12 px-4 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-24">
          <div className="max-w-3xl text-white">
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] backdrop-blur">
              Kimilili, Bungoma County
            </p>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              A caring CBC school where every learner is seen, stretched, and supported.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">
              Shekinah School blends strong academics, Christian values, and practical CBC learning
              from early years through junior secondary. Families get a clear admissions path, a
              welcoming school environment, and a school community that stays connected.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/apply"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-navy transition hover:bg-slate-100"
              >
                Start an Application
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/portal/parent"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Open Parent Portal
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-white/10 px-4 py-2 font-semibold text-white/95 backdrop-blur">
                CBC aligned
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 font-semibold text-white/95 backdrop-blur">
                Admin and parent portals live
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 font-semibold text-white/95 backdrop-blur">
                Admissions open
              </span>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
            <div className="rounded-[1.5rem] bg-white p-6 text-slate-900">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple">
                Why Families Choose Shekinah
              </p>
              <div className="mt-6 grid gap-4">
                {highlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-navy">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-navy">{item.title}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <p className="text-3xl font-extrabold text-navy">{stat.value}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="academics" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple">Academic Pathway</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              Guided learning from pre-primary through junior secondary
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Our school journey is designed to help learners grow in confidence, mastery, and
              character at every stage of the CBC pathway.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {programs.map((program) => (
              <article
                key={program.title}
                className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-60">
                  <Image src={program.image} alt={program.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple">
                    {program.subtitle}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-navy">{program.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{program.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="life" className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-navy sm:text-3xl">What families can expect</h2>
                <Trophy className="h-8 w-8 text-purple" />
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  "Daily academic structure and teacher accountability",
                  "Faith-based mentorship and discipline",
                  "Practical CBC learning experiences",
                  "Clear parent communication and reporting",
                  "Support for transitions into junior secondary",
                  "A school culture built around growth and care"
                ].map((point) => (
                  <div key={point} className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <p className="text-sm leading-6 text-slate-700">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-navy p-8 text-white shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">Current updates</p>
              <div className="mt-6 space-y-4">
                {newsItems.map((item) => (
                  <article key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">{item.tag}</p>
                    <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/75">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="admissions" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple">Admissions</p>
              <h2 className="mt-3 text-3xl font-bold text-navy">A simple next step for new families</h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Begin with a message, ask questions, book a visit, and get help choosing the right
                entry point for your child.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Send a WhatsApp message to the admissions team",
                  "Book a school visit and meet the school team",
                  "Share the learner's grade and prior school details",
                  "Receive guidance on placement, fees, and onboarding"
                ].map((step, index) => (
                  <div key={step} className="flex gap-4 rounded-2xl bg-slate-50 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="pt-1 text-sm leading-6 text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
              <a
                href="/apply"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                Open Full Application
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="grid gap-6">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-purple" />
                  <h3 className="text-xl font-bold text-navy">Request Admission</h3>
                </div>
                <form onSubmit={handleLeadSubmit} className="mt-6 grid gap-3">
                  <input
                    value={leadForm.parentName}
                    onChange={(event) =>
                      setLeadForm((current) => ({ ...current, parentName: event.target.value }))
                    }
                    placeholder="Parent name"
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900"
                    required
                  />
                  <input
                    value={leadForm.phone}
                    onChange={(event) =>
                      setLeadForm((current) => ({ ...current, phone: event.target.value }))
                    }
                    placeholder="Phone number"
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900"
                    required
                  />
                  <select
                    value={leadForm.childClassInterested}
                    onChange={(event) =>
                      setLeadForm((current) => ({
                        ...current,
                        childClassInterested: event.target.value
                      }))
                    }
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900"
                    required
                  >
                    <option value="">Child class interested</option>
                    <option value="PP1">PP1</option>
                    <option value="PP2">PP2</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                  </select>
                  <textarea
                    value={leadForm.message}
                    onChange={(event) =>
                      setLeadForm((current) => ({ ...current, message: event.target.value }))
                    }
                    placeholder="Tell us what you need help with"
                    rows={4}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900"
                    required
                  />
                  <button
                    type="submit"
                    disabled={leadSubmitting}
                    className="rounded-full bg-gradient-to-r from-navy to-navy-light px-6 py-3 font-semibold text-white transition hover:scale-[1.01] disabled:opacity-60"
                  >
                    {leadSubmitting ? "Sending inquiry..." : "Send Admission Inquiry"}
                  </button>
                  {leadMessage ? (
                    <p className="text-sm text-slate-600">{leadMessage}</p>
                  ) : null}
                </form>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-6 w-6 text-purple" />
                  <h3 className="text-xl font-bold text-navy">Useful portal links</h3>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {quickLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-purple hover:shadow-md"
                      >
                        <Icon className="h-6 w-6 text-navy" />
                        <p className="mt-4 font-semibold text-navy">{item.label}</p>
                        <p className="mt-2 text-sm text-slate-500">Open now</p>
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <ChevronDown className="h-6 w-6 text-purple" />
                  <h3 className="text-xl font-bold text-navy">School focus areas</h3>
                </div>
                <div className="mt-6 grid gap-3">
                  {["Academic discipline", "Competency growth", "Parent partnership", "Christian values"].map((item) => (
                    <div key={item} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">Contact</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">Talk to Shekinah School</h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-white/70">
                Whether you are exploring admissions, confirming fees, or opening the parent or
                admin portal, we want the next step to feel straightforward.
              </p>
            </div>

            <div className="grid gap-4">
              {contacts.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    className="flex items-start gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-blue-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{item.label}</p>
                      <p className="mt-1 text-sm text-white/70">{item.value}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
