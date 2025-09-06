import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
      protocol: 'https',
      hostname: 'randomuser.me',
    },
    {
      protocol: 'https',
      hostname: 'picsum.photos',
    },
    {
      protocol: 'https',
      hostname: 'thispersondoesnotexist.com',
    },
    {
      protocol: 'https',
      hostname: 'thisimagedoesnotexist.com',
    },
  ],
  },
};

export default nextConfig;
