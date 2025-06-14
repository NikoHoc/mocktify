import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { UserNavbar } from "../components/UserNavbar";
import { UserFooter } from "../components/UserFooter";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Mocktify",
    description: "Keep on track with your favorite songs",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<UserNavbar />
				<div className="py-12">
					{children}
				</div>
				<UserFooter />
			</body>
		</html>
	);
}