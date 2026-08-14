import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationControlsProps {
  pageNum: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (updater: (page: number) => number) => void;
}

export const PaginationControls = ({
  pageNum,
  pageSize,
  totalCount,
  onPageChange,
}: PaginationControlsProps) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  if (totalCount <= 0) return null;

  return (
    <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
      <span className="text-sm text-slate-500">
        Showing {(pageNum - 1) * pageSize + 1} to {Math.min(pageNum * pageSize, totalCount)} of {totalCount} entries
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={pageNum === 1}
          onClick={() => onPageChange((page) => page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-slate-700 font-medium px-2">
          Page {pageNum} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={pageNum === totalPages}
          onClick={() => onPageChange((page) => page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
