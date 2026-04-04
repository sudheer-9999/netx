import Link from "next/link"

export function NavItem({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active?: boolean
}) {
  return (
    <li className="overflow-hidden">
      <Link
        href={href}
        className="flex items-center group"
      >
        {/* triangle container */}
        <span
          className={`
            inline-flex items-center
            overflow-hidden
            transition-all duration-300 ease-out
            ${active ? "w-[0.6em] mr-1" : "w-0 group-hover:w-[0.6em] group-hover:mr-1"}
          `}
        >
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 10 10"
            fill="currentColor"
          >
            <path d="M1 0L10 5L1 10V0Z" />
          </svg>
        </span>

        {/* label */}
        <span>{label}</span>
      </Link>
    </li>
  )
}