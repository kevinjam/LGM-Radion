// next.config.ts
import withPWA from "next-pwa";
import type { NextConfig } from "next";

// Validate environment variables at build time
const requiredEnvVars = ["MONGODB_URI"];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Environment variable ${envVar} is missing`);
  }
});

// Define the base Next.js configuration
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-src 'self' https://chat.radiojar.com https://www.google.com https://www.youtube.com ;",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.castbox.fm",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "chat.radiojar.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/api/image/proxy/**",
      },
      {
        protocol: "https",
        hostname: "radiojar.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "googleapis.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Enable compression for API routes and other responses
  compress: true,
};

// Wrap the config with PWA settings
export default withPWA({
  dest: "public", // Output directory for service worker files
  register: true, // Automatically register the service worker
  skipWaiting: true, // Skip waiting for the service worker to take control
  disable: process.env.NODE_ENV === "development", // Disable PWA in development
})(nextConfig);