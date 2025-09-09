import type { Metadata } from "next";
import "./globals.css";

import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

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
				<Sidebar />
				<main>
        	{children}
				</main>
      </body>
			<Footer />
    </html>
  );
}
