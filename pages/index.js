import { useMemo, useState } from 'react';
import Head from 'next/head';
import { ChevronDown, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { LOGO_DATA_URI, FAVICON_DATA_URI } from '../lib/logo';
import Reveal from '../components/Reveal';
import InstagramEmbed from '../components/InstagramEmbed';
import {
  IG_HANDLE,
  IG_URL,
  BOOKING_EMAIL,
  SHOP_NAME,
  SHOP_URL,
  TONY_SHOP_URL,
  SHOP_ADDRESS,
  SHOP_PHONE,
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
  ['Chicago', 'Tattoo artist'],
  ['Old Town Tatu', '3313 W Irving Park Rd'],
  ['Fine line · Portraits', 'Cover-ups · Custom'],
  ['Direct booking', 'Talk with Tony'],
];

const REVIEW = {
  quote: 'He didn’t rush. He took his time with his work and we were all very happy with the results.',
  name: 'Amanda S.',
  source: 'Client review featured by Old Town Tatu',
};

export default function OldTownTatu() {
  const [filter, setFilter] = useState('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    placement: '',
    size: '',
    colorPreference: '',
    date: '',
    time: '',
    references: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const visiblePosts = useMemo(
    () => (filter === 'All' ? PORTFOLIO_POSTS : PORTFOLIO_POSTS.filter((post) => post.tag === filter)),
    [filter]
  );

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/book-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong');
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Tony Wulfman',
    jobTitle: 'Tattoo Artist',
    url: TONY_SHOP_URL,
    sameAs: [IG_URL],
    worksFor: {
      '@type': 'LocalBusiness',
      name: SHOP_NAME,
      url: SHOP_URL,
      telephone: SHOP_PHONE,
      address: {
        '@type': 'PostalAddress',
        streetAddress: '3313 W Irving Park Rd',
        addressLocality: 'Chicago',
        addressRegion: 'IL',
        postalCode: '60618',
        addressCountry: 'US',
      },
    },
  };

  const darkField = 'field-input !text-bone-50 !border-bone-50/25 focus:!border-brass-400';

  return (
    <>
      <Head>
        <title>Tony Wulfman | Chicago Tattoo Artist at Old Town Tatu</title>
        <meta
          name="description"
          content="Explore Tony Wulfman's tattoo work and request a custom session at Old Town Tatu in Chicago. Fine line, portraits, cover-ups, black & grey, and custom tattoo work."
        />
        <meta property="og:title" content="Tony Wulfman | Chicago Tattoo Artist" />
        <meta
          property="og:description"
          content="Fine line, portraits, cover-ups, black & grey, and custom tattoo work at Old Town Tatu in Chicago."
        />
        <meta name="theme-color" content="#120F0D" />
        <link rel="icon" href={FAVICON_DATA_URI} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </Head>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-ink-950/10 bg-bone-50/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-8xl items-center justify-between px-6 md:px-10">
          <a href="#top" className="flex items-center gap-3" aria-label="Tony Wulfman home">
            <img src={LOGO_DATA_URI} alt="" className="h-10 w-10 object-contain" />
            <span className="hidden sm:block">
              <span className="block font-serif text-lg leading-none tracking-tight">Tony Wulfman</span>
              <span className="mt-1 block font-sans text-[10px] uppercase tracking-[0.22em] text-ink-500">
                Tattoo Artist · Old Town Tatu
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
            <a href="#booking" className="btn-primary !hidden !px-6 !py-3 !text-xs md:!inline-flex">
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
              <a href="#booking" onClick={() => setMenuOpen(false)} className="btn-primary mt-2 text-xs">
                Start a Piece
              </a>
            </div>
          </div>
        )}
      </header>

      <main id="top" className="overflow-x-hidden pt-20">
        <section className="relative min-h-[90vh] overflow-hidden bg-ink-950 text-bone-50">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -right-32 top-10 h-[34rem] w-[34rem] rounded-full border border-brass-400/10" />
            <div className="absolute -right-10 top-32 h-[22rem] w-[22rem] rounded-full border border-brass-400/10" />
            <img
              src={LOGO_DATA_URI}
              alt=""
              className="absolute -bottom-24 -right-24 w-[34rem] opacity-[0.035] sm:w-[42rem]"
            />
          </div>

          <div className="relative mx-auto grid min-h-[90vh] max-w-8xl items-center gap-16 px-6 py-24 md:px-10 lg:grid-cols-[1.35fr_.65fr] lg:py-28">
            <div>
              <Reveal>
                <p className="mb-8 font-sans text-xs uppercase tracking-[0.28em] text-brass-400">
                  Tony Wulfman · Old Town Tatu · Chicago
                </p>
              </Reveal>

              <Reveal delay={100}>
                <h1 className="max-w-5xl font-serif text-[14vw] leading-[0.9] tracking-[-0.04em] sm:text-7xl md:text-8xl lg:text-[6.4rem]">
                  Your body keeps
                  <br />
                  the story. <span className="italic text-brass-400">Make it</span>
                  <br />
                  worth telling.
                </h1>
              </Reveal>

              <Reveal delay={200}>
                <p className="mt-8 max-w-2xl font-sans text-base leading-relaxed text-bone-100/72 sm:text-lg">
                  Fine line, portraits, cover-ups, black &amp; grey, and custom tattoo work shaped around your idea —
                  with the time and attention a permanent piece deserves.
                </p>
              </Reveal>

              <Reveal delay={300}>
                <div className="mt-10 flex flex-wrap gap-4">
                  <a href="#booking" className="btn-primary bg-brass-500 text-ink-950 hover:bg-brass-400">
                    Start Your Piece
                  </a>
                  <a href="#work" className="btn-ghost border-bone-50/25 text-bone-50 hover:border-bone-50">
                    See the Work
                  </a>
                </div>
              </Reveal>
            </div>

            <Reveal delay={250}>
              <aside className="lg:justify-self-end">
                <div className="max-w-sm border border-bone-50/15 bg-bone-50/[0.04] p-7 backdrop-blur sm:p-8">
                  <p className="font-sans text-[10px] uppercase tracking-[0.26em] text-brass-400">Currently tattooing at</p>
                  <h2 className="mt-3 font-serif text-3xl">Old Town Tatu</h2>
                  <p className="mt-5 flex gap-3 font-sans text-sm leading-relaxed text-bone-100/70">
                    <MapPin size={17} className="mt-0.5 shrink-0 text-brass-400" />
                    {SHOP_ADDRESS}
                  </p>
                  <a
                    href={`tel:${SHOP_PHONE.replace(/\D/g, '')}`}
                    className="mt-4 flex items-center gap-3 font-sans text-sm text-bone-100/70 transition-colors hover:text-bone-50"
                  >
                    <Phone size={17} className="text-brass-400" /> {SHOP_PHONE}
                  </a>
                  <div className="my-7 h-px bg-bone-50/10" />
                  <a
                    href={TONY_SHOP_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="font-sans text-xs uppercase tracking-[0.2em] text-brass-300 transition-colors hover:text-brass-400"
                  >
                    View Tony on Old Town Tatu ↗
                  </a>
                </div>
              </aside>
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

          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [column-fill:_balance]">
            {visiblePosts.map((post, index) => (
              <Reveal key={post.id} delay={(index % 3) * 70} className="mb-6 break-inside-avoid">
                <InstagramEmbed postId={post.id} />
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-14 text-center">
              <a href={IG_URL} target="_blank" rel="noreferrer" className="btn-ghost">
                <Instagram size={16} className="mr-2" /> More on Instagram
              </a>
            </div>
          </Reveal>
        </section>

        <section id="about" className="bg-ink-900 py-24 text-bone-50 md:py-28">
          <div className="mx-auto grid max-w-8xl gap-16 px-6 md:px-10 lg:grid-cols-[1fr_.9fr] lg:items-center">
            <div>
              <Reveal>
                <p className="mb-5 font-sans text-xs uppercase tracking-[0.3em] text-brass-400">About Tony</p>
                <h2 className="max-w-3xl font-serif text-4xl leading-tight tracking-tight md:text-6xl">
                  Custom work without the generic tattoo-shop attitude.
                </h2>
              </Reveal>

              <Reveal delay={120}>
                <div className="mt-8 max-w-2xl space-y-5 font-sans text-base leading-relaxed text-bone-100/72">
                  <p>
                    Old Town Tatu features Tony for fine line work, cover-ups, and portraits. His approach starts with
                    listening to the idea, refining the direction, and making sure the final piece feels like it belongs on you.
                  </p>
                  <p>
                    The studio itself is one of Chicago&apos;s more distinctive tattoo spaces, located on Irving Park Road in a
                    historic building with a long tattoo history of its own.
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

            <Reveal delay={160}>
              <div className="border border-brass-400/25 bg-bone-50 p-8 text-ink-950 sm:p-10">
                <p className="font-serif text-6xl leading-none text-brass-500">“</p>
                <blockquote className="mt-2 font-serif text-2xl leading-snug sm:text-3xl">{REVIEW.quote}</blockquote>
                <div className="mt-8 border-t border-ink-950/10 pt-5">
                  <p className="font-sans text-sm font-semibold">{REVIEW.name}</p>
                  <p className="mt-1 font-sans text-xs text-ink-500">{REVIEW.source}</p>
                </div>
              </div>
            </Reveal>
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
                      <ChevronDown
                        size={22}
                        className={`ml-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isOpen && <p className="max-w-2xl pb-6 font-sans text-sm leading-relaxed text-ink-500">{item.a}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="booking" className="bg-ink-950 py-24 text-bone-50 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-brass-400">Request a Session</p>
                <h2 className="font-serif text-4xl tracking-tight md:text-6xl">Bring the idea. Tony will help shape the piece.</h2>
                <p className="mt-5 font-sans text-sm leading-relaxed text-bone-100/65">
                  Give enough detail to understand the project. Tony can then follow up directly about direction, timing, availability,
                  and price.
                </p>
              </div>
            </Reveal>

            {submitted ? (
              <Reveal>
                <div className="mx-auto mt-14 max-w-2xl border border-brass-500/30 p-10 text-center">
                  <h3 className="font-serif text-3xl">Request sent.</h3>
                  <p className="mt-4 font-sans text-sm leading-relaxed text-bone-100/70">
                    Check your email for confirmation. Tony can follow up after reviewing the details you submitted.
                  </p>
                </div>
              </Reveal>
            ) : (
              <Reveal delay={100}>
                <form onSubmit={handleSubmit} className="mt-14 grid gap-x-10 gap-y-8 md:grid-cols-2">
                  <div>
                    <label className="field-label !text-brass-300">Name</label>
                    <input required name="name" value={formData.name} onChange={handleChange} className={darkField} />
                  </div>
                  <div>
                    <label className="field-label !text-brass-300">Email</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className={darkField} />
                  </div>
                  <div>
                    <label className="field-label !text-brass-300">Phone</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className={darkField} />
                  </div>
                  <div>
                    <label className="field-label !text-brass-300">Placement</label>
                    <input
                      required
                      name="placement"
                      placeholder="e.g. forearm, ribs, calf"
                      value={formData.placement}
                      onChange={handleChange}
                      className={`${darkField} placeholder-bone-50/30`}
                    />
                  </div>
                  <div>
                    <label className="field-label !text-brass-300">Approximate Size</label>
                    <select name="size" value={formData.size} onChange={handleChange} className={darkField}>
                      <option value="" className="text-ink-950">Select one</option>
                      <option value="Small (palm-sized or less)" className="text-ink-950">Small (palm-sized or less)</option>
                      <option value="Medium (forearm / calf)" className="text-ink-950">Medium (forearm / calf)</option>
                      <option value="Large (half sleeve / back panel)" className="text-ink-950">Large (half sleeve / back panel)</option>
                      <option value="Full sleeve or larger" className="text-ink-950">Full sleeve or larger</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label !text-brass-300">Color or Black &amp; Grey</label>
                    <select name="colorPreference" value={formData.colorPreference} onChange={handleChange} className={darkField}>
                      <option value="" className="text-ink-950">Select one</option>
                      <option value="Black & Grey" className="text-ink-950">Black &amp; Grey</option>
                      <option value="Color" className="text-ink-950">Color</option>
                      <option value="Not sure yet" className="text-ink-950">Not sure yet</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label !text-brass-300">Preferred Date</label>
                    <input required type="date" name="date" value={formData.date} onChange={handleChange} className={darkField} />
                  </div>
                  <div>
                    <label className="field-label !text-brass-300">Preferred Time</label>
                    <input required type="time" name="time" value={formData.time} onChange={handleChange} className={darkField} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="field-label !text-brass-300">Reference Links (optional)</label>
                    <input name="references" value={formData.references} onChange={handleChange} className={darkField} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="field-label !text-brass-300">Tell Tony About the Piece</label>
                    <textarea
                      required
                      rows={5}
                      name="description"
                      placeholder="What is the idea? What matters about it? First tattoo or adding to existing work?"
                      value={formData.description}
                      onChange={handleChange}
                      className={`${darkField} resize-none placeholder-bone-50/30`}
                    />
                  </div>

                  {error && <p className="md:col-span-2 font-sans text-sm text-oxblood-500">{error}</p>}

                  <div className="mt-3 text-center md:col-span-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary bg-brass-500 text-ink-950 hover:bg-brass-400 disabled:opacity-50"
                    >
                      {loading ? 'Sending...' : 'Submit Request'}
                    </button>
                    <p className="mt-4 font-sans text-xs text-bone-100/45">
                      Prefer email?{' '}
                      <a href={`mailto:${BOOKING_EMAIL}`} className="underline underline-offset-4 hover:text-bone-50">
                        {BOOKING_EMAIL}
                      </a>
                    </p>
                  </div>
                </form>
              </Reveal>
            )}
          </div>
        </section>

        <footer className="border-t border-ink-950/10 bg-bone-50 py-14">
          <div className="mx-auto grid max-w-8xl gap-9 px-6 md:grid-cols-[1fr_auto] md:items-end md:px-10">
            <div>
              <div className="flex items-center gap-3">
                <img src={LOGO_DATA_URI} alt="" className="h-10 w-10 object-contain" />
                <div>
                  <p className="font-serif text-xl">Tony Wulfman</p>
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink-500">Tattoo Artist · Old Town Tatu</p>
                </div>
              </div>
              <p className="mt-6 max-w-xl font-sans text-sm leading-relaxed text-ink-500">
                Custom tattoo work in Chicago at {SHOP_NAME}, {SHOP_ADDRESS}.
              </p>
            </div>

            <div className="flex flex-col gap-3 font-sans text-sm text-ink-500 sm:flex-row sm:flex-wrap sm:gap-x-7">
              <a href={`mailto:${BOOKING_EMAIL}`} className="flex items-center gap-2 hover:text-oxblood-600">
                <Mail size={16} /> {BOOKING_EMAIL}
              </a>
              <a href={`tel:${SHOP_PHONE.replace(/\D/g, '')}`} className="flex items-center gap-2 hover:text-oxblood-600">
                <Phone size={16} /> {SHOP_PHONE}
              </a>
              <a href={IG_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-oxblood-600">
                <Instagram size={16} /> @{IG_HANDLE}
              </a>
            </div>
          </div>
          <p className="mx-auto mt-10 max-w-8xl px-6 font-sans text-xs text-ink-500/55 md:px-10">
            © {new Date().getFullYear()} Tony Wulfman. Tattoo appointments at Old Town Tatu, Chicago.
          </p>
        </footer>

        <a
          href="#booking"
          className="fixed bottom-4 left-4 right-4 z-40 flex items-center justify-center rounded-full bg-brass-500 px-6 py-4 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-ink-950 shadow-2xl md:hidden"
        >
          Start Your Piece
        </a>
      </main>
    </>
  );
}
