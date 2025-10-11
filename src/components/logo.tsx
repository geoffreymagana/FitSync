import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L6 8V11C6 14.31 8.69 17 12 17S18 14.31 18 11V8L12 2Z" />
      <path d="M12 22C15.31 22 18 19.31 18 16V13L12 7L6 13V16C6 19.31 8.69 22 12 22Z" />
    </svg>
  );
}
