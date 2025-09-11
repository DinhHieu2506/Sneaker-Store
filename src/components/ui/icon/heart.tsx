

const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20.84 4.61c-1.54-1.32-3.77-1.04-5.12.35L12 8.09 8.28 4.96C6.93 3.57 4.7 3.29 3.16 4.61 1.2 6.3 1.34 9.3 3.39 11.12L12 19l8.61-7.88c2.05-1.82 2.19-4.82.23-6.51Z" />
  </svg>
);

export default HeartIcon;
