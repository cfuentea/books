"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";

export function SearchBooks() {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get("query") || "");

  useEffect(() => {
    setQuery(searchParams.get("query") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };
  
  const clearSearch = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("query");
    setQuery("");
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2">
      <div className="relative w-full max-w-sm">
        <Input
          placeholder="Search by title or author..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-10"
        />
        {query && (
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={clearSearch}
            >
                <X className="h-4 w-4" />
            </Button>
        )}
      </div>
      <Button type="submit" disabled={isPending}>
        <Search className="mr-2 h-4 w-4" /> Search
      </Button>
    </form>
  );
} 