import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";

type AdminPaginationProps = {
  basePath: string;
  previousCursor: string | null;
  nextCursor: string | null;
  previousLabel: string;
  nextLabel: string;
  summary: string;
  ariaLabel: string;
};

function paginationHref(
  basePath: string,
  cursor: string,
  direction: "previous" | "next",
) {
  const params = new URLSearchParams({ cursor, direction });
  return `${basePath}?${params.toString()}`;
}

const controlClass =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-line px-3 text-base font-bold sm:min-h-9 sm:text-sm";

export function AdminPagination({
  basePath,
  previousCursor,
  nextCursor,
  previousLabel,
  nextLabel,
  summary,
  ariaLabel,
}: AdminPaginationProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className="flex flex-col gap-3 border-t border-line bg-background px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="tabular-nums text-base/7 text-muted sm:text-sm/6">
        {summary}
      </p>
      <div className="flex items-center gap-2">
        {previousCursor ? (
          <Link
            href={paginationHref(basePath, previousCursor, "previous")}
            className={`${controlClass} hover:border-accent hover:text-accent`}
          >
            <ChevronLeft className="size-5 shrink-0 sm:size-4" aria-hidden="true" />
            {previousLabel}
          </Link>
        ) : (
          <span
            className={`${controlClass} cursor-not-allowed text-muted opacity-45`}
            aria-disabled="true"
          >
            <ChevronLeft className="size-5 shrink-0 sm:size-4" aria-hidden="true" />
            {previousLabel}
          </span>
        )}
        {nextCursor ? (
          <Link
            href={paginationHref(basePath, nextCursor, "next")}
            className={`${controlClass} hover:border-accent hover:text-accent`}
          >
            {nextLabel}
            <ChevronRight className="size-5 shrink-0 sm:size-4" aria-hidden="true" />
          </Link>
        ) : (
          <span
            className={`${controlClass} cursor-not-allowed text-muted opacity-45`}
            aria-disabled="true"
          >
            {nextLabel}
            <ChevronRight className="size-5 shrink-0 sm:size-4" aria-hidden="true" />
          </span>
        )}
      </div>
    </nav>
  );
}
