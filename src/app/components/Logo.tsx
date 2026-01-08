import * as React from "react";

type LogoProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

export default function Logo({ size = 64, ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      role="img"
      {...props}
    >
      <rect x="12" y="12" width="232" height="232" rx="44" ry="44" fill="#162320" />
      <path
        d="M64 156 L108 118 L144 138 L188 98"
        fill="none"
        stroke="#00A63E"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M168 98 H188 V118"
        fill="none"
        stroke="#00A63E"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
