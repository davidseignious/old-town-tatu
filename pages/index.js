import { useState, useMemo } from 'react';
import Head from 'next/head';
import { Instagram, Mail, MapPin, ChevronDown } from 'lucide-react';
import { LOGO_DATA_URI, FAVICON_DATA_URI } from '../lib/logo';
import Reveal from '../components/Reveal';
import InstagramEmbed from '../components/InstagramEmbed';
import {
    IG_HANDLE,
    IG_URL,
    BOOKING_EMAIL,
    PORTFOLIO_POSTS,
    PORTFOLIO_FILTERS,
    PHILOSOPHY_QUOTE,
    PROCESS_STEPS,
    FAQS,
} from '../lib/content';

const NAV_LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#philosophy', label: 'Philosophy' },
  { href: '#process', label: 'Process' },
  { href: '#faq', label: 'FAQ' },
  ];

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
        () => (filter === 'All' ? PORTFOLIO_POSTS : PORTFOLIO_POSTS.filter((p) => p.tag === filter)),
        [filter]
      );

  const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
                const res = await fetch('/api/book-appointment', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(formData),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Something went wrong');
                setSubmitted(true);
        } catch (err) {
                setError(err.message);
        } finally {
                setLoading(false);
        }
  };

  return (
        <>
          <Head>
            <title>tonywulfman.art | Tony Wulfman - Chicago Tattoo Artist</title>
          <meta
            name="description"
            content="Tony Wulfman is a Chicago-based tattoo artist specializing in black & grey realism, fine line, and custom pieces. Book a session at Old Town Tatu."
          />
                      <link rel="icon" href={FAVICON_DATA_URI} />
              </Head>

  {/* ---------- NAV ---------- */}
        <header className="fixed top-0 inset-x-0 z-50 bg-bone-50/90 backdrop-blur border-b border-ink-950/10">
                  <div className="max-w-8xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
                    <a href="#top" className="flex items-center gap-3">
                      <img src={LOGO_DATA_URI} alt="tonywulfman.art" className="h-10 w-10 object-contain" />
                      <span className="font-serif text-lg tracking-tight hidden sm:block">tonywulfman.art</span>
          </a>

          <nav className="hidden md:flex items-center gap-10 font-sans text-sm uppercase tracking-widest text-ink-800">
        {NAV_LINKS.map((l) => (
                        <a key={l.href} href={l.href} className="hover:text-oxblood-600 transition-colors">
{l.label}
  </a>
            ))}
              </nav>

          <div className="flex items-center gap-4">
                          <a href="#booking" className="hidden md:inline-flex btn-primary !py-3 !px-6 text-xs">
                            Book Now
              </a>
            <button
              className="md:hidden p-2"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
                              <div className="w-6 h-px bg-ink-950 mb-1.5" />
                              <div className="w-6 h-px bg-ink-950" />
                </button>
                </div>
                </div>

{menuOpen && (
            <div className="md:hidden border-t border-ink-950/10 bg-bone-50 px-6 py-6 flex flex-col gap-5 font-sans uppercase tracking-widest text-sm">
{NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
{l.label}
</a>
            ))}
            <a href="#booking" onClick={() => setMenuOpen(false)} className="btn-primary text-xs">
                            Book Now
              </a>
              </div>
        )}
</header>

      <main id="top" className="pt-20 overflow-x-hidden">
        {/* ---------- HERO ---------- */}
        <section className="relative min-h-[92vh] flex items-center bg-ink-950 text-bone-50">
                    <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
                      <img src={LOGO_DATA_URI} alt="" className="w-[140%] max-w-none -translate-x-1/4 translate-y-1/4" />
          </div>

          <div className="relative max-w-8xl mx-auto px-6 md:px-10 py-32 w-full">
                      <Reveal>
                        <p className="font-sans uppercase tracking-[0.3em] text-xs text-brass-400 mb-8">
                          tonywulfman.art &middot; Chicago
          </p>
          </Reveal>
            <Reveal delay={100}>
                        <h1 className="font-serif text-[13vw] sm:text-7xl md:text-8xl leading-[0.95] tracking-tight max-w-5xl">
                          Your body keeps
                <br />
                          the story.{' '}
                <span className="italic text-brass-400">I make sure</span>
                <br />
                          it&rsquo;s told right.
          </h1>
          </Reveal>
            <Reveal delay={200}>
                        <p className="font-sans text-lg text-bone-100/80 max-w-xl mt-8 leading-relaxed">
                          Tony Wulfman - black &amp; grey realism, fine line, and custom work built around what
                a piece actually means to you. Every session starts with a conversation, not a
                price tag.
                  </p>
                  </Reveal>
            <Reveal delay={300}>
                                <div className="flex flex-wrap gap-4 mt-10">
                                  <a href="#booking" className="btn-primary bg-brass-500 hover:bg-brass-400 text-ink-950">
                                    Start Your Piece
                  </a>
                <a
                  href="#work"
                  className="btn-ghost border-bone-50/30 text-bone-50 hover:border-bone-50"
                >
                                      See the Work
                    </a>
                    </div>
                    </Reveal>
                    </div>

          <a
            href="#work"
            aria-label="Scroll to work"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-bone-50/60 animate-bounce"
          >
                          <ChevronDown size={28} />
              </a>
              </section>

{/* ---------- MARQUEE ---------- */}
        <div className="bg-brass-500 text-ink-950 py-3 overflow-hidden whitespace-nowrap border-y border-ink-950/10">
                    <div className="inline-block animate-[marquee_28s_linear_infinite] font-sans text-sm uppercase tracking-[0.25em]">
        {Array(6)
              .fill(
                          'Black & Grey Realism  •  Fine Line  •  Religious & Mythological  •  Custom Concepts  •  Est. 2020  •  '
                        )
              .join(' ')}
</div>
  </div>
        <style jsx global>{`
                  @keyframes marquee {
                              0% { transform: translateX(0); }
                                          100% { transform: translateX(-50%); }
                                                    }
                                                            `}</style>

{/* ---------- PORTFOLIO ---------- */}
        <section id="work" className="max-w-8xl mx-auto px-6 md:px-10 py-28">
                    <Reveal>
                      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                        <div>
                          <p className="font-sans uppercase tracking-[0.3em] text-xs text-oxblood-600 mb-4">
                            The Work
          </p>
                <h2 className="font-serif text-4xl md:text-5xl tracking-tight max-w-lg">
                            Straight from the shop floor.
          </h2>
          </div>
              <p className="font-sans text-ink-500 max-w-sm">
                          Pulled live from{' '}
                <a href={IG_URL} target="_blank" rel="noreferrer" className="underline hover:text-oxblood-600">
                                    @{IG_HANDLE}
                  </a>{' '}
                - real clients, real healed work, no stock photography.
                  </p>
                  </div>
                  </Reveal>

          <Reveal delay={100}>
                              <div className="flex flex-wrap gap-3 mb-10">
                {PORTFOLIO_FILTERS.map((f) => (
                                  <button
                                                         key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2 rounded-full font-sans text-xs uppercase tracking-widest border transition-colors ${
                                        filter === f
                                          ? 'bg-ink-950 text-bone-50 border-ink-950'
                                          : 'border-ink-950/25 text-ink-800 hover:border-ink-950'
                  }`}
                >
{f}
</button>
              ))}
                </div>
                </Reveal>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
              {visiblePosts.map((post, i) => (
                              <Reveal key={post.id} delay={(i % 3) * 80} className="mb-6 break-inside-avoid">
                                <InstagramEmbed postId={post.id} />
                </Reveal>
            ))}
              </div>

          <Reveal>
                          <div className="text-center mt-14">
                            <a href={IG_URL} target="_blank" rel="noreferrer" className="btn-ghost">
                              <Instagram size={16} className="mr-2" /> More on Instagram
              </a>
              </div>
              </Reveal>
              </section>

{/* ---------- PHILOSOPHY ---------- */}
        <section id="philosophy" className="bg-ink-900 text-bone-50 py-28">
                    <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
                      <Reveal>
                        <p className="font-sans uppercase tracking-[0.3em] text-xs text-brass-400 mb-8">
                          Philosophy
          </p>
          </Reveal>
            <Reveal delay={100}>
                        <blockquote className="font-serif italic text-3xl md:text-5xl leading-tight text-bone-50">
                          &ldquo;{PHILOSOPHY_QUOTE}&rdquo;
</blockquote>
  </Reveal>
            <Reveal delay={200}>
                <div className="mt-12 font-sans text-bone-100/75 leading-relaxed max-w-2xl mx-auto space-y-4">
                  <p>
                    Tony opened Old Town Tatu in Chicago in 2020, built on the idea that a tattoo
                  should never be out of reach because of money - pricing is worked out together,
                                      piece by piece, until it&rsquo;s fair for both sides.
                    </p>
                <p>
                                      Off the clock, he&rsquo;s a father of three and a dog behavior trainer &mdash;
                  which is maybe why patience with people (and a little stubbornness) shows up in
                                      the work.
                    </p>
                    </div>
                    </Reveal>
            <Reveal delay={300}>
                                  <div className="mt-14 max-w-md mx-auto">
                                    <InstagramEmbed postId="Dcjy0dVQsOs" />
                    </div>
                    </Reveal>
                    </div>
                    </section>

{/* ---------- PROCESS ---------- */}
        <section id="process" className="max-w-6xl mx-auto px-6 md:px-10 py-28">
                    <Reveal>
                      <p className="font-sans uppercase tracking-[0.3em] text-xs text-oxblood-600 mb-4 text-center">
                        How It Works
          </p>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-center mb-16">
                        From idea to healed skin.
          </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-14">
        {PROCESS_STEPS.map((step, i) => (
                        <Reveal key={step.n} delay={i * 100}>
                          <div className="flex gap-6">
                            <span className="font-serif italic text-4xl text-brass-500 leading-none">
          {step.n}
          </span>
                                             <div>
                              <h3 className="font-serif text-2xl mb-2">{step.title}</h3>
                                               <p className="font-sans text-ink-500 leading-relaxed">{step.body}</p>
          </div>
          </div>
          </Reveal>
                                       ))}
</div>
  </section>

{/* ---------- FAQ ---------- */}
        <section id="faq" className="bg-bone-100 py-28">
                    <div className="max-w-3xl mx-auto px-6 md:px-10">
                      <Reveal>
                        <p className="font-sans uppercase tracking-[0.3em] text-xs text-oxblood-600 mb-4 text-center">
                          Good to Know
          </p>
              <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-center mb-16">
                          Frequently Asked
          </h2>
          </Reveal>

            <div className="divide-y divide-ink-950/10 border-y border-ink-950/10">
        {FAQS.map((f, i) => (
                          <div key={f.q}>
                            <button
                                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between py-6 text-left font-serif text-xl md:text-2xl"
                  >
                    {f.q}
                    <ChevronDown
                      size={22}
                      className={`shrink-0 ml-4 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                    />
                      </button>
{openFaq === i && (
                      <p className="font-sans text-ink-500 leading-relaxed pb-6 max-w-2xl">{f.a}</p>
                   )}
</div>
              ))}
                </div>
                </div>
                </section>

{/* ---------- BOOKING ---------- */}
        <section id="booking" className="bg-ink-950 text-bone-50 py-28">
                    <div className="max-w-4xl mx-auto px-6 md:px-10">
                      <Reveal>
                        <p className="font-sans uppercase tracking-[0.3em] text-xs text-brass-400 mb-4 text-center">
                          Book a Session
          </p>
              <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-center mb-4">
                          Start your piece.
          </h2>
              <p className="font-sans text-bone-100/70 text-center max-w-lg mx-auto mb-16">
                          Fill this out with as much detail as you can. Tony reads every submission
                personally and replies within 24&ndash;48 hours to talk price and timing.
                  </p>
                  </Reveal>

{submitted ? (
                <Reveal>
                  <div className="text-center py-16 border border-brass-500/30 rounded-2xl">
                    <h3 className="font-serif text-3xl mb-4">Got it.</h3>
                    <p className="font-sans text-bone-100/70">
                      Your request is in. Check your email for confirmation - Tony will follow up
                     soon to talk through the details.
                       </p>
                       </div>
                       </Reveal>
             ) : (
                             <Reveal delay={100}>
                               <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-x-10 gap-y-8">
                                 <div>
                                   <label className="field-label !text-brass-300">Name</label>
                     <input
                       required
                       name="name"
                       value={formData.name}
                      onChange={handleChange}
                      className="field-input !text-bone-50 !border-bone-50/25 focus:!border-brass-400"
                    />
                        </div>
                  <div>
                                            <label className="field-label !text-brass-300">Email</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="field-input !text-bone-50 !border-bone-50/25 focus:!border-brass-400"
                    />
                        </div>
                  <div>
                                            <label className="field-label !text-brass-300">Phone</label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="field-input !text-bone-50 !border-bone-50/25 focus:!border-brass-400"
                    />
                        </div>
                  <div>
                                            <label className="field-label !text-brass-300">Placement</label>
                    <input
                      required
                      name="placement"
                      placeholder="e.g. forearm, ribs, calf"
                      value={formData.placement}
                      onChange={handleChange}
                      className="field-input !text-bone-50 !border-bone-50/25 focus:!border-brass-400 placeholder-bone-50/30"
                    />
                        </div>
                  <div>
                                            <label className="field-label !text-brass-300">Approximate Size</label>
                    <select
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      className="field-input !text-bone-50 !border-bone-50/25 focus:!border-brass-400"
                    >
                                              <option value="" className="text-ink-950">Select one</option>
                      <option value="Small (palm-sized or less)" className="text-ink-950">Small (palm-sized or less)</option>
                      <option value="Medium (forearm / calf)" className="text-ink-950">Medium (forearm / calf)</option>
                      <option value="Large (half sleeve / back panel)" className="text-ink-950">Large (half sleeve / back panel)</option>
                      <option value="Full sleeve or larger" className="text-ink-950">Full sleeve or larger</option>
                        </select>
                        </div>
                  <div>
                                            <label className="field-label !text-brass-300">Color or Black &amp; Grey</label>
                    <select
                      name="colorPreference"
                      value={formData.colorPreference}
                      onChange={handleChange}
                      className="field-input !text-bone-50 !border-bone-50/25 focus:!border-brass-400"
                    >
                                              <option value="" className="text-ink-950">Select one</option>
                      <option value="Black & Grey" className="text-ink-950">Black &amp; Grey</option>
                      <option value="Color" className="text-ink-950">Color</option>
                      <option value="Not sure yet" className="text-ink-950">Not sure yet</option>
                        </select>
                        </div>
                  <div>
                                            <label className="field-label !text-brass-300">Preferred Date</label>
                    <input
                      required
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="field-input !text-bone-50 !border-bone-50/25 focus:!border-brass-400"
                    />
                        </div>
                  <div>
                                            <label className="field-label !text-brass-300">Preferred Time</label>
                    <input
                      required
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="field-input !text-bone-50 !border-bone-50/25 focus:!border-brass-400"
                    />
                        </div>
                  <div className="md:col-span-2">
                                            <label className="field-label !text-brass-300">
                                              Reference Links (Instagram, Pinterest, etc. - optional)
                        </label>
                    <input
                      name="references"
                      value={formData.references}
                      onChange={handleChange}
                      className="field-input !text-bone-50 !border-bone-50/25 focus:!border-brass-400"
                    />
                        </div>
                  <div className="md:col-span-2">
                                            <label className="field-label !text-brass-300">Tell Tony About the Piece</label>
                    <textarea
                      required
                      rows={5}
                      name="description"
                      placeholder="What's the idea? Any meaning behind it? First tattoo or adding to existing work?"
                      value={formData.description}
                      onChange={handleChange}
                      className="field-input !text-bone-50 !border-bone-50/25 focus:!border-brass-400 placeholder-bone-50/30 resize-none"
                    />
                        </div>

{error && <p className="md:col-span-2 text-oxblood-500 font-sans text-sm">{error}</p>}

                  <div className="md:col-span-2 text-center mt-4">
                      <button
                       type="submit"
                       disabled={loading}
                       className="btn-primary bg-brass-500 hover:bg-brass-400 text-ink-950 disabled:opacity-50"
                     >
                       {loading ? 'Sending...' : 'Submit Request'}
</button>
  </div>
  </form>
  </Reveal>
            )}
</div>
              </section>

{/* ---------- FOOTER ---------- */}
        <footer className="bg-bone-50 py-16 border-t border-ink-950/10">
                    <div className="max-w-8xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="flex items-center gap-3">
                        <img src={LOGO_DATA_URI} alt="tonywulfman.art" className="h-9 w-9 object-contain" />
                        <span className="font-serif text-lg">tonywulfman.art</span>
          </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 font-sans text-sm text-ink-500">
                        <a href={`mailto:${BOOKING_EMAIL}`} className="flex items-center gap-2 hover:text-oxblood-600">
                          <Mail size={16} /> {BOOKING_EMAIL}
          </a>
              <span className="flex items-center gap-2">
                          <MapPin size={16} /> Chicago, IL
          </span>
              <a
                href={IG_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-oxblood-600"
              >
                                  <Instagram size={16} /> @{IG_HANDLE}
                  </a>
                  </div>
                  </div>
          <p className="text-center font-sans text-xs text-ink-500/60 mt-10">
                              &copy; {new Date().getFullYear()} tonywulfman.art. All rights reserved.
                  </p>
                  </footer>
                  </main>
                  </>
  );
}
