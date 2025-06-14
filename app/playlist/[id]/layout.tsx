import React from "react";

export default function PlaylistLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  );
}
