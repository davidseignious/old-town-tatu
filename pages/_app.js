import { Fraunces, Inter } from 'next/font/google';
import '../styles/globals.css';

const display = Fraunces({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    style: ['normal', 'italic'],
    variable: '--font-display',
    display: 'swap',
});

const body = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    variable: '--font-body',
    display: 'swap',
});

export default function App({ Component, pageProps }) {
    return (
          <main className={`${display.variable} ${body.variable} font-sans`}>
      <Component {...pageProps} />
        </main>
  );
}
