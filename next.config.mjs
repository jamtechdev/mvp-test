/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['via.placeholder.com'], // ✅ allow this remote host for next/image
  },
};

export default nextConfig;
