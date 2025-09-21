import type { Metadata } from "next";
import "./globals.css";

import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import AxiosGlobals from './components/AxiosGlobals';

export const metadata: Metadata = {
  title: "Mimic",
  description: "A twitter clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
				<AxiosGlobals />
				<Sidebar />
				<main>
        	{children}
				</main>
				<Footer />
      </body>
    </html>
  );
}
