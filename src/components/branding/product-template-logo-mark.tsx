type ProductTemplateLogoMarkProps = {
  className?: string;
};

export function ProductTemplateLogoMark({ className }: ProductTemplateLogoMarkProps) {
  return (
    <span className={className} aria-hidden="true">
      <svg viewBox="0 0 1200 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="main" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#21D4F5" />
            <stop offset="42%" stopColor="#2489FF" />
            <stop offset="70%" stopColor="#4B4CFF" />
            <stop offset="100%" stopColor="#8C27FF" />
          </linearGradient>
          <linearGradient id="overlay" x1="0" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor="#6AB7FF" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#5B69FF" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#8C2BFF" stopOpacity="0.92" />
          </linearGradient>
          <linearGradient id="dot" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#33D3F5" />
            <stop offset="50%" stopColor="#3488FF" />
            <stop offset="100%" stopColor="#8B2BFF" />
          </linearGradient>
        </defs>

        <rect width="1200" height="1200" fill="#FFFFFF" />

        <path
          d="M340 820 L340 400 C340 318 431 292 477 360 L799 835 C842 898 940 864 940 786 L940 548"
          fill="none"
          stroke="url(#main)"
          strokeWidth="178"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M340 651 C375 564 441 530 508 553 C552 568 581 602 610 644 L799 835 C842 898 940 864 940 786"
          fill="none"
          stroke="url(#overlay)"
          strokeWidth="178"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.72"
        />
        <path
          d="M940 548 L940 627 C940 692 884 735 833 711"
          fill="none"
          stroke="url(#main)"
          strokeWidth="152"
          strokeLinecap="round"
          opacity="0.88"
        />
        <circle cx="940" cy="291" r="91" fill="url(#dot)" />
      </svg>
    </span>
  );
}
