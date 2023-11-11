import SearchResult from "@/components/shop/search-result";
import { SWRProvider } from "@/components/swr-provider";

const SearchPage = async () => {
  return (
    <div className="p-2 mt-2">
      <SWRProvider>
        <SearchResult title="Searching..." />
      </SWRProvider>
    </div>
  )
}

export default SearchPage;
