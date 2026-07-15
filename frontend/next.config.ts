import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Explicitly set the workspace root to the frontend directory.
    // This silences the "multiple lockfiles" warning caused by the backend
    // package-lock.json that lives one level up in the monorepo.
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
