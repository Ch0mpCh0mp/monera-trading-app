import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  webpack(config) {
    // 1) Find the rule that handles images (and likely svg too)
    const fileLoaderRule = config.module.rules.find((rule: any) => {
      return (
        rule &&
        typeof rule === "object" &&
        rule.test instanceof RegExp &&
        rule.test.test(".svg")
      );
    });

    // 2) Re-apply that rule for everything *except* svg
    //    and add SVGR for svg
    config.module.rules.push(
      // SVG -> React component
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ["@svgr/webpack"],
      }
    );

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    return config;
  },
};

export default nextConfig;
