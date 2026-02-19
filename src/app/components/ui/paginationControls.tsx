"use client";

import { Button } from "@/app/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col gap-4 md:flex-row items-center justify-between px-2 py-4 border-t border-pink-500">
      <div className="text-sm text-gray-500">
        Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a{" "}
        <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> de{" "}
        <span className="font-medium">{totalItems}</span> clientes
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => router.push(createPageUrl(currentPage - 1))}
          className="h-8 w-8 p-0 border border-pink-500 cursor-pointer bg-transparent text-white disabled:bg-transparent disabled:text-gray-500"
        >
          <ChevronLeft className="h-4 w-4 text-pink-600" />
        </Button>

        <div className="text-sm font-medium">
          Página {currentPage} de {totalPages}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => router.push(createPageUrl(currentPage + 1))}
          className="h-8 w-8 p-0 border border-pink-500 cursor-pointer bg-transparent text-white disabled:bg-transparent disabled:text-gray-500"
        >
          <ChevronRight className="h-4 w-4 text-pink-600" />
        </Button>
      </div>
    </div>
  );
}