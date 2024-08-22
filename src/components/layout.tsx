import { DM_Sans } from "next/font/google";
import "../styles/globals.css";

const font = DM_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={font.className}>{children}</div>;
}
