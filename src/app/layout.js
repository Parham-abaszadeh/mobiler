import { Vazirmatn } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const vazir = Vazirmatn({ subsets: ['arabic', 'latin'], variable: '--font-vazir' });
export const metadata = { title: 'موبایلر | فروشگاه لوازم الکترونیکی', description: 'گوشی، لپ‌تاپ، هدفون و لوازم جانبی با موجودی لحظه‌ای' };

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazir.variable} font-sans`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
