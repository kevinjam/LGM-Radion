// src/app/layout.tsx
// src/app/layout.tsx
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

export const metadata = {
  title: "LGM Radio - Uplifting Sermons & Gospel Music",
  description:
    "Tune in to LGM Radio for uplifting sermons, inspiring podcasts, gospel music, and live interactive discussions. Stay connected and be blessed with our ministry!",
  openGraph: {
    title: "LGM Radio - Your Spiritual Home 🎧",
    description:
      "Join LGM Radio for soul-lifting sermons, inspiring podcasts, gospel music, and live discussions. Stay connected and be blessed! 🙏",
    url: "https://radio.latterglory.ug", // Your subdomain
    siteName: "LGM Radio",
    images: [
      {
        url: "https://radio.latterglory.ug/icons/logoshare.png", // Path to your logo
        width: 1200,
        height: 1200,
        alt: "LGM Radio Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        {/* Link to the manifest */}
        <link rel="manifest" href="/manifest.json" />
        {/* Theme color matching your manifest */}
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
      {children}
      <Analytics />
        {/* <ErrorBoundary fallback={<div className="text-center p-4 text-red-500">An error occurred. Please refresh the page.</div>}>
          {children}
        </ErrorBoundary> */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </body>
    </html>
  );
}

// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { ThemeProvider } from "../context/ThemeContext";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "LGM Radio",
//   description: "Listen to your favorite radio shows and podcasts on LGM Radio.",
//   manifest: "/manifest.json", // Link to the manifest file
//   icons: {
//     apple: "icons/icon-96x96.png", // Apple touch icon
//   },
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <head>
//         {/* PWA Meta Tags */}
//         <meta name="apple-mobile-web-app-capable" content="yes" />
//         <meta name="apple-mobile-web-app-status-bar-style" content="default" />
//         <meta name="apple-mobile-web-app-title" content="LGM Radio" />
//         <meta name="mobile-web-app-capable" content="yes" />
//         <meta name="theme-color" content="#000000" />
//         <link rel="apple-touch-icon" href="/icons/icon-96x96.png" />
//       </head>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <ThemeProvider>{children}</ThemeProvider>
//         <script
//     dangerouslySetInnerHTML={{
//       __html: `
//         if ("serviceWorker" in navigator) {
//           window.addEventListener("load", () => {
//             navigator.serviceWorker.register("/service-worker.js").then(
//               (registration) => {
//                 console.log("Service Worker registered:", registration);
//               },
//               (error) => {
//                 console.log("Service Worker registration failed:", error);
//               }
//             );
//           });
//         }
//       `,
//     }}
//   />
//       </body>
//     </html>
//   );
// }
