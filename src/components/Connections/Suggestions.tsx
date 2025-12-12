import { useEffect, useState } from "react";
import FriendCard from "../Profile/Friendcard";
import { GetSearchFriend, GetSuggestedFriend } from "../../Common/ServerAPI";
import { useToast } from "../ui/Toast/ToastProvider";

type Connection = {
  id: number;
  name: string;
  username: string;
  image: string;
  profileImage: string;
};

type Props = {
  searchTerm: string;
  onSelect: (connection: Connection) => void;
};

const PAGE_SIZE = 12;

const Suggestions = ({ searchTerm, onSelect }: Props) => {
  const [suggestions, setSuggestions] = useState<Connection[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const resetAndFetch = () => {
    setSuggestions([]);
    setPage(1);
    setHasMore(true);
    fetchSuggestions(1, searchTerm, false);
  };

  const fetchSuggestions = async (
    pageNo = 1,
    search = "",
    append = false
  ) => {
    try {
      setIsLoading(true);
      let response
      if(searchTerm !== ""){
        response = await GetSearchFriend(search, pageNo, PAGE_SIZE);
      }else{
        response = await GetSuggestedFriend(search, pageNo, PAGE_SIZE);
      }
      const rows = response?.data?.data?.rows || [];
      const formatted = rows.map((item: any) => ({
        id: item.id,
        name: `${item?.profile?.first_name} ${item?.profile?.last_name}` || item?.username,
        username: item?.username || "",
        image: item?.profile?.profile_picture,
        profileImage: item?.profile?.profile_picture,
      }));

      setSuggestions((prev) => (append ? [...prev, ...formatted] : formatted));
      setHasMore(formatted.length === PAGE_SIZE);
      setPage(pageNo + 1);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      showToast({
        type: "error",
        message: "Failed to load suggestions.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    resetAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <>
      <div className="w-full grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6 justify-items-center">
        {suggestions.length > 0 ? (
          suggestions.map((conn) => (
            <FriendCard
              key={conn.id}
              name={conn.name}
              username={conn.username}
              image={conn.image}
              connection={conn}
              actions={[]}
              onMaximize={() => onSelect(conn)}
            />
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center py-10">
            <p className="text-gray-500 text-sm">No suggestions found.</p>
          </div>
        )}
      </div>
      {(suggestions.length > 0 || hasMore || isLoading) && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => fetchSuggestions(page, searchTerm, true)}
            disabled={!hasMore || isLoading}
            className="font-['Open_Sans'] px-4 py-2 text-sm rounded-full border border-gray-300 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Loading..."
              : hasMore
                ? "Load more suggestions"
                : "No more suggestions"}
          </button>
        </div>
      )}
    </>
  );
};

export default Suggestions;
