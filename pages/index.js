import { useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import { ChevronDown, ChevronLeft, ChevronRight, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { LOGO_DATA_URI, FAVICON_DATA_URI } from '../lib/logo';
import Reveal from '../components/Reveal';
import InstagramEmbed from '../components/InstagramEmbed';
import {
  SITE_NAME,
  SITE_URL,
  IG_HANDLE,
  IG_URL,
  BOOKING_EMAIL,
  STUDIO_ADDRESS,
  STUDIO_PHONE,
  PORTFOLIO_POSTS,
  PORTFOLIO_FILTERS,
  PHILOSOPHY_QUOTE,
  PROCESS_STEPS,
  FAQS,
} from '../lib/content';

const NAV_LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#process', label: 'Process' },
  { href: '#faq', label: 'FAQ' },
];

const TRUST_ITEMS = [
  ['Tony Wulfman Art', 'Personal tattoo portfolio'],
  ['Chicago', '3313 W Irving Park Rd'],
  ['Fine line · Portraits', 'Cover-ups · Custom'],
  ['Direct booking', 'Talk with Tony'],
];

const REVIEW = {
  quote: 'He didn’t rush. He took his time with his work and we were all very happy with the results.',
  name: 'Amanda S.',
  source: 'Client review',
};

export default function TonyWulfmanArt() {
  const [filter, setFilter] = useState('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const instagramCarouselRef = useRef(null);

  const scrollInstagram = (direction) => {
    const carousel = instagramCarouselRef.current;
    if (!carousel) return;
    const amount = Math.min(carousel.clientWidth * 0.9, 440);
    carousel.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  const visiblePosts = useMemo(
    () => (filter === 'All' ? PORTFOLIO_POSTS : PORTFOLIO_POSTS.filter((post) => post.tag === filter)),
    [filter]
  );

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Tony Wulfman',
    alternateName: SITE_NAME,
    jobTitle: 'Tattoo Artist',
    url: SITE_URL,
    email: BOOKING_EMAIL,
    telephone: STUDIO_PHONE,
    sameAs: [IG_URL],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '3313 W Irving Park Rd',
      addressLocality: 'Chicago',
      addressRegion: 'IL',
      postalCode: '60618',
      addressCountry: 'US',
    },
  };

  const darkField = 'field-input !text-bone-50 !border-bone-50/25 focus:!border-brass-400';

  return (
    <>
      <Head>
        <title>Tony Wulfman Art | Chicago Tattoo Artist</title>
        <meta
          name="description"
          content="Tony Wulfman Art is the official portfolio and booking site for Chicago tattoo artist Tony Wulfman. Explore fine line, portraits, cover-ups, black & grey realism, and custom work."
        />
        <meta property="og:title" content="Tony Wulfman Art | Chicago Tattoo Artist" />
        <meta
          property="og:description"
          content="Explore Tony Wulfman’s tattoo portfolio and request a custom session in Chicago."
        />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${SITE_URL}images/tony-tattooing.webp`} />
        <meta name="theme-color" content="#120F0D" />
        <link rel="canonical" href={SITE_URL} />
        <link rel="icon" href={FAVICON_DATA_URI} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      </Head>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-ink-950/10 bg-bone-50/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-8xl items-center justify-between px-6 md:px-10">
          <a href="#top" className="flex items-center gap-3" aria-label="Tony Wulfman Art home">
            <img src={LOGO_DATA_URI} alt="" className="h-10 w-10 object-contain" />
            <span className="hidden sm:block">
              <span className="block font-serif text-lg leading-none tracking-tight">Tony Wulfman Art</span>
              <span className="mt-1 block font-sans text-[10px] uppercase tracking-[0.22em] text-ink-500">
                Chicago Tattoo Artist
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-9 font-sans text-xs uppercase tracking-[0.18em] text-ink-700 md:flex">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-oxblood-600">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a href="https://venue.ink/@tonywulfmanart" target="_blank" rel="noreferrer" className="btn-primary !hidden !px-6 !py-3 !text-xs md:!inline-flex">
              Start a Piece
            </a>
            <button
              type="button"
              className="p-2 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((current) => !current)}
            >
              <span className="mb-1.5 block h-px w-6 bg-ink-950" />
              <span className="block h-px w-6 bg-ink-950" />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-ink-950/10 bg-bone-50 px-6 py-6 md:hidden">
            <div className="flex flex-col gap-5 font-sans text-sm uppercase tracking-widest">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              ))}
              <a href="https://venue.ink/@tonywulfmanart" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)} className="btn-primary mt-2 text-xs">
                Start a Piece
              </a>
            </div>
          </div>
        )}
      </header>

      <main id="top" className="overflow-x-hidden pb-24 pt-20 md:pb-0">
        <section className="relative overflow-hidden bg-ink-950 text-bone-50">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-32 top-10 h-[34rem] w-[34rem] rounded-full border border-brass-400/10" />
            <div className="absolute -right-10 top-32 h-[22rem] w-[22rem] rounded-full border border-brass-400/10" />
            <img src={LOGO_DATA_URI} alt="" className="absolute -bottom-24 -right-24 w-[34rem] opacity-[0.035] sm:w-[42rem]" />
          </div>

          <div className="relative mx-auto grid min-h-[88vh] max-w-8xl items-center gap-14 px-6 py-20 md:px-10 lg:grid-cols-[1.15fr_.85fr] lg:py-24">
            <div className="relative z-10">
              <Reveal>
                <p className="mb-8 font-sans text-xs uppercase tracking-[0.28em] text-brass-400">
                  Tony Wulfman Art · Chicago
                </p>
              </Reveal>

              <Reveal delay={100}>
                <h1 className="max-w-5xl font-serif text-[14vw] leading-[0.9] tracking-[-0.04em] sm:text-7xl md:text-8xl lg:text-[5.9rem]">
                  Your body keeps
                  <br />
                  the story. <span className="italic text-brass-400">Make it</span>
                  <br />
                  worth telling.
                </h1>
              </Reveal>

              <Reveal delay={200}>
                <p className="mt-8 max-w-2xl font-sans text-base leading-relaxed text-bone-100/70 sm:text-lg">
                  Fine line, portraits, cover-ups, black &amp; grey realism, and custom tattoo work shaped around your idea —
                  with the time and attention a permanent piece deserves.
                </p>
              </Reveal>

              <Reveal delay={300}>
                <div className="mt-10 flex flex-wrap gap-4">
                  <a href="https://venue.ink/@tonywulfmanart" target="_blank" rel="noreferrer" className="btn-primary bg-brass-500 text-ink-950 hover:bg-brass-400">
                    Start Your Piece
                  </a>
                  <a href="#work" className="btn-ghost border-bone-50/25 text-bone-50 hover:border-bone-50">
                    See the Work
                  </a>
                </div>
              </Reveal>
            </div>

            <Reveal delay={180} className="lg:justify-self-end">
              <div className="w-full max-w-xl">
                <div className="relative overflow-hidden border border-bone-50/15 bg-ink-900 shadow-2xl">
                  <img
                    src="https://res.cloudinary.com/hxnwueko/image/upload/v1788485635/tony-tattooing-session.webp"
                    alt="Tony Wulfman tattooing a client in his Chicago studio"
                    className="aspect-[4/3] w-full object-cover"
                    fetchPriority="high"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950 via-ink-950/75 to-transparent px-6 pb-6 pt-20">
                    <p className="font-sans text-[10px] uppercase tracking-[0.24em] text-brass-300">In the chair</p>
                    <p className="mt-2 max-w-sm font-serif text-2xl leading-tight">Focused work. Relaxed room. No rushed experience.</p>
                  </div>
                </div>

                <div className="relative -mt-px grid gap-0 border border-bone-50/15 bg-bone-50/[0.04] sm:grid-cols-2">
                  <div className="p-5 sm:border-r sm:border-bone-50/10">
                    <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-brass-400">Chicago Studio</p>
                    <p className="mt-2 flex gap-2 font-sans text-xs leading-relaxed text-bone-100/70">
                      <MapPin size={15} className="mt-0.5 shrink-0 text-brass-400" /> {STUDIO_ADDRESS}
                    </p>
                  </div>
                  <div className="p-5">
                    <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-brass-400">Direct contact</p>
                    <a
                      href={`tel:${STUDIO_PHONE.replace(/\D/g, '')}`}
                      className="mt-2 flex items-center gap-2 font-sans text-xs text-bone-100/70 transition-colors hover:text-bone-50"
                    >
                      <Phone size={15} className="text-brass-400" /> {STUDIO_PHONE}
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="border-b border-ink-950/10 bg-bone-100">
          <div className="mx-auto grid max-w-8xl grid-cols-2 px-6 md:grid-cols-4 md:px-10">
            {TRUST_ITEMS.map(([title, detail], index) => (
              <div
                key={title}
                className={`py-7 ${index % 2 === 0 ? 'pr-4' : 'pl-4'} md:px-6 ${index > 0 ? 'md:border-l md:border-ink-950/10' : ''}`}
              >
                <p className="font-serif text-lg leading-tight">{title}</p>
                <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.18em] text-ink-500">{detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="work" className="mx-auto max-w-8xl px-6 py-24 md:px-10 md:py-28">
          <Reveal>
            <div className="mb-12 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-oxblood-600">Selected Work</p>
                <h2 className="max-w-2xl font-serif text-4xl tracking-tight md:text-6xl">
                  The work should speak before the sales pitch does.
                </h2>
              </div>
              <p className="max-w-sm font-sans text-sm leading-relaxed text-ink-500">
                Portfolio pulled from{' '}
                <a href={IG_URL} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-oxblood-600">
                  @{IG_HANDLE}
                </a>
                . Real tattoos, real clients, no stock work.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="mb-10 flex flex-wrap gap-3">
              {PORTFOLIO_FILTERS.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`rounded-full border px-5 py-2 font-sans text-xs uppercase tracking-widest transition-colors ${
                    filter === item
                      ? 'border-ink-950 bg-ink-950 text-bone-50'
                      : 'border-ink-950/20 text-ink-800 hover:border-ink-950'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="mb-6 flex items-center justify-between gap-4">
              <a
                href={IG_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 font-sans text-sm text-ink-600 transition-colors hover:text-oxblood-600"
              >
                <Instagram size={18} />
                <span>Follow @{IG_HANDLE}</span>
              </a>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollInstagram(-1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-950/20 transition-colors hover:border-ink-950 hover:bg-ink-950 hover:text-bone-50"
                  aria-label="Previous Instagram posts"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollInstagram(1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-950/20 transition-colors hover:border-ink-950 hover:bg-ink-950 hover:text-bone-50"
                  aria-label="Next Instagram posts"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </Reveal>

          <div
            ref={instagramCarouselRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4"
            style={{ scrollbarWidth: 'thin' }}
            aria-label="Tony Wulfman Instagram photo carousel"
          >
            {visiblePosts.map((post, index) => (
              <Reveal
                key={post.id}
                delay={(index % 3) * 60}
                className="w-[88vw] max-w-[430px] shrink-0 snap-start sm:w-[420px]"
              >
                <div className="overflow-hidden border border-ink-950/10 bg-white shadow-sm">
                  <InstagramEmbed postId={post.id} />
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-10 text-center">
              <a href={IG_URL} target="_blank" rel="noreferrer" className="btn-ghost">
                <Instagram size={16} className="mr-2" /> View @{IG_HANDLE} on Instagram
              </a>
            </div>
          </Reveal>
        </section>

        <section id="about" className="bg-ink-900 py-24 text-bone-50 md:py-28">
          <div className="mx-auto grid max-w-8xl gap-16 px-6 md:px-10 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
            <Reveal>
              <div className="relative mx-auto max-w-md lg:mx-0">
                <div className="overflow-hidden border border-bone-50/15">
                  <img
                    src="https://res.cloudinary.com/hxnwueko/image/upload/v1788485741/tony-with-client.webp"
                    alt="Tony Wulfman talking with a client during a tattoo session"
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover"
                  />
                </div>
                <div className="relative -mt-12 ml-6 border border-brass-400/25 bg-bone-50 p-6 text-ink-950 shadow-2xl sm:ml-12">
                  <p className="font-serif text-4xl leading-none text-brass-500">“</p>
                  <blockquote className="mt-1 font-serif text-xl leading-snug">{REVIEW.quote}</blockquote>
                  <p className="mt-4 font-sans text-xs font-semibold">{REVIEW.name} · {REVIEW.source}</p>
                </div>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <p className="mb-5 font-sans text-xs uppercase tracking-[0.3em] text-brass-400">About Tony</p>
                <h2 className="max-w-3xl font-serif text-4xl leading-tight tracking-tight md:text-6xl">
                  Custom work built around the person wearing it.
                </h2>
              </Reveal>

              <Reveal delay={120}>
                <div className="mt-8 max-w-2xl space-y-5 font-sans text-base leading-relaxed text-bone-100/70">
                  <p>
                    Tony Wulfman is a Chicago tattoo artist whose work spans fine line, portraits, cover-ups, black &amp; grey realism,
                    religious imagery, geometric work, and fully custom concepts.
                  </p>
                  <p>
                    His approach starts with listening to the idea, refining the direction, and making sure the final piece feels intentional,
                    personal, and right for the body it will live on.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div className="mt-9 flex flex-wrap gap-3">
                  {['Fine line', 'Portraits', 'Cover-ups', 'Black & grey', 'Custom work'].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-bone-50/15 px-4 py-2 font-sans text-xs uppercase tracking-widest text-bone-100/80"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="bg-bone-100 py-20 md:py-24">
          <div className="mx-auto max-w-5xl px-6 text-center md:px-10">
            <Reveal>
              <p className="mb-5 font-sans text-xs uppercase tracking-[0.3em] text-oxblood-600">The Standard</p>
              <blockquote className="font-serif text-3xl leading-tight tracking-tight md:text-5xl">“{PHILOSOPHY_QUOTE}”</blockquote>
            </Reveal>
          </div>
        </section>

        <section className="overflow-hidden bg-ink-950 text-bone-50">
          <div className="mx-auto grid max-w-8xl lg:grid-cols-[.78fr_1.22fr]">
            <Reveal className="relative min-h-[32rem]">
              <img
                src="https://res.cloudinary.com/hxnwueko/image/upload/v1788485853/tony-outside-old-town.webp"
                alt="Tony Wulfman outside his Chicago tattoo studio at dusk"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
              <p className="absolute bottom-6 left-6 font-sans text-[10px] uppercase tracking-[0.25em] text-bone-50/80">
                Chicago · Irving Park Road
              </p>
            </Reveal>

            <div className="flex items-center px-6 py-20 md:px-12 lg:px-16 lg:py-24">
              <Reveal>
                <p className="font-sans text-xs uppercase tracking-[0.3em] text-brass-400">The Studio</p>
                <h2 className="mt-5 max-w-3xl font-serif text-4xl leading-tight tracking-tight md:text-6xl">
                  A Chicago setting that feels as personal as the work.
                </h2>
                <p className="mt-7 max-w-xl font-sans text-base leading-relaxed text-bone-100/70">
                  The experience matters too. Tony works from a character-filled Chicago studio where the goal is simple: make the client comfortable,
                  take the time the piece needs, and leave with work that feels worth wearing for life.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a href="https://venue.ink/@tonywulfmanart" target="_blank" rel="noreferrer" className="btn-primary bg-brass-500 text-ink-950 hover:bg-brass-400">Request a Session</a>
                  <p className="flex items-center gap-2 font-sans text-xs text-bone-100/70">
                    <MapPin size={15} className="text-brass-400" /> {STUDIO_ADDRESS}
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="process" className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-28">
          <Reveal>
            <p className="mb-4 text-center font-sans text-xs uppercase tracking-[0.3em] text-oxblood-600">How It Works</p>
            <h2 className="mb-16 text-center font-serif text-4xl tracking-tight md:text-6xl">From idea to healed work.</h2>
          </Reveal>

          <div className="grid gap-x-16 gap-y-14 md:grid-cols-2">
            {PROCESS_STEPS.map((step, index) => (
              <Reveal key={step.n} delay={index * 80}>
                <div className="flex gap-6 border-t border-ink-950/10 pt-7">
                  <span className="font-serif text-4xl italic leading-none text-brass-500">{step.n}</span>
                  <div>
                    <h3 className="font-serif text-2xl">{step.title}</h3>
                    <p className="mt-3 font-sans text-sm leading-relaxed text-ink-500">{step.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="faq" className="bg-bone-100 py-24 md:py-28">
          <div className="mx-auto max-w-3xl px-6 md:px-10">
            <Reveal>
              <p className="mb-4 text-center font-sans text-xs uppercase tracking-[0.3em] text-oxblood-600">Good to Know</p>
              <h2 className="mb-14 text-center font-serif text-4xl tracking-tight md:text-5xl">Before you book.</h2>
            </Reveal>

            <div className="divide-y divide-ink-950/10 border-y border-ink-950/10">
              {FAQS.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={item.q}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="flex w-full items-center justify-between py-6 text-left font-serif text-xl md:text-2xl"
                    >
                      {item.q}
                      <ChevronDown size={22} className={`ml-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && <p className="max-w-2xl pb-6 font-sans text-sm leading-relaxed text-ink-500">{item.a}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="booking" className="bg-ink-950 py-24 text-bone-50 md:py-28">
          <div className="mx-auto max-w-5xl px-6 text-center md:px-10">
            <Reveal>
              <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-brass-400">Book with Tony</p>
              <h2 className="mx-auto max-w-3xl font-serif text-4xl tracking-tight md:text-6xl">
                Ready to start your piece?
              </h2>
              <p className="mx-auto mt-5 max-w-2xl font-sans text-sm leading-relaxed text-bone-100/70">
                Tony’s appointments are handled through his official Venue Ink booking page.
              </p>
              <div className="mt-9">
                <a
                  href="https://venue.ink/@tonywulfmanart"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary bg-brass-500 text-ink-950 hover:bg-brass-400"
                >
                  Book on Venue Ink
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <footer className="border-t border-ink-950/10 bg-bone-50 py-14">
          <div className="mx-auto grid max-w-8xl gap-9 px-6 md:grid-cols-[1fr_auto] md:items-end md:px-10">
            <div>
              <div className="flex items-center gap-3">
                <img src={LOGO_DATA_URI} alt="" className="h-10 w-10 object-contain" />
                <div>
                  <p className="font-serif text-xl">Tony Wulfman Art</p>
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink-500">Chicago Tattoo Artist</p>
                </div>
              </div>
              <p className="mt-6 max-w-xl font-sans text-sm leading-relaxed text-ink-500">
                Custom tattoo work in Chicago. Studio appointments at {STUDIO_ADDRESS}.
              </p>
            </div>

            <div className="flex flex-col gap-3 font-sans text-sm text-ink-500 sm:flex-row sm:flex-wrap sm:gap-x-7">
              <a href={`mailto:${BOOKING_EMAIL}`} className="flex items-center gap-2 hover:text-oxblood-600">
                <Mail size={16} /> {BOOKING_EMAIL}
              </a>
              <a href={`tel:${STUDIO_PHONE.replace(/\D/g, '')}`} className="flex items-center gap-2 hover:text-oxblood-600">
                <Phone size={16} /> {STUDIO_PHONE}
              </a>
              <a href={IG_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-oxblood-600">
                <Instagram size={16} /> @{IG_HANDLE}
              </a>
            </div>
          </div>
          <p className="mx-auto mt-10 max-w-8xl px-6 font-sans text-xs text-ink-500/55 md:px-10">
            © {new Date().getFullYear()} Tony Wulfman Art. All rights reserved.
          </p>
        </footer>

        <a
          href="https://venue.ink/@tonywulfmanart"
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-4 left-4 right-4 z-40 flex items-center justify-center rounded-full bg-brass-500 px-6 py-4 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-ink-950 shadow-2xl md:hidden"
        >
          Book on Venue Ink
        </a>
      </main>
    </>
  );
}
