import type { JSX, SVGProps } from "react";

export function CookbookIcon({
  className,
  ...props
}: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M6 3.5h11a2.5 2.5 0 0 1 2.5 2.5v13.25A1.75 1.75 0 0 1 17.75 21H6.5A2.5 2.5 0 0 0 4 18.5V6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 3.5A2.5 2.5 0 0 0 3.5 6v12.25"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M9.25 4v16.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.75 8.5h4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M12.75 12h4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M12.75 15.5H15"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
