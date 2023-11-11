'use client';

import { SearchIcon } from "lucide-react";
import { KeyboardEvent, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = (event: KeyboardEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    router.refresh();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
  }, [pathname, searchParams]);

  return (
    <div className={cn(
      "hidden",
      "lg:block lg:m"
    )}>
      <form className="min-w-[20rem] relative" onSubmit={handleSearch}>
        <Input
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full" />
        {
          query &&
          <Button
            size="icon"
            variant="ghost"
            type="submit"
            className="absolute top-1 right-1 h-8">
            <SearchIcon size={18} />
          </Button>
        }
      </form>
    </div>
  )
}

export default SearchBar;
