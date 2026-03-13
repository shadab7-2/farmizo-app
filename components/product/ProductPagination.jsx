"use client";

export default function ProductPagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  loading = false,
}) {
  if (!totalPages || totalPages <= 1) return null;

  const canPrev = currentPage > 1 && !loading;
  const canNext = currentPage < totalPages && !loading;

  return (
    <div className="mt-10 flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => canPrev && onPageChange(currentPage - 1)}
        disabled={!canPrev}
        className="rounded border border-border-default px-4 py-2 text-sm disabled:opacity-50"
      >
        Previous
      </button>

      <p className="text-sm text-text-muted">
        Page {currentPage} of {totalPages}
      </p>

      <button
        type="button"
        onClick={() => canNext && onPageChange(currentPage + 1)}
        disabled={!canNext}
        className="rounded border border-border-default px-4 py-2 text-sm disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
