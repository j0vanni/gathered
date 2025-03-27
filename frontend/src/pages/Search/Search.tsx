import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import api from "@/globals";
import useAuth from "@/useAuth";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import List from "../List/Lists";
import SearchBar from "./SearchBar";
import SearchItem from "./SearchItem";

//<Progress value={percentage} />

type Props = {};
/*
using OMDb API

can search by:
    s: name of title
    type: movie, series, episode
    y: year
    page: page number

    let's just do s and type to start,
        year not super necessary right now

user drawer component when user clicks on show
*/

async function getLists() {
  try {
    const response = await axios.get(`${api}/lists/`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching lists:", error);
  }
}

function Search({}: Props) {
  const [searchItems, setSearchItems] = useState<any[]>([]);
  const [trendingItems, setTrendingItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [searchToggle] = useState("all");
  const [lists, setLists] = useState<List[]>([]);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const fetchSearchResults = async () => {
    try {
      if (query.length > 0) {
        const response = await axios.get(
          `${api}/search/${searchToggle}?query=${query}&page=${page}`,
          {
            withCredentials: true,
          }
        );
        setSearchItems(response.data.results);
        setTotalPages(response.data.total_pages);
      } else {
        setSearchItems([]);
        setTotalPages(1);
        fetchTrendingResults();
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    getLists().then((lists) => {
      setLists(lists);
    });
  }, []);

  const fetchTrendingResults = async () => {
    try {
      const response = await axios.get(`${api}/search/trending?page=${page}`, {
        withCredentials: true,
      });
      setTrendingItems(response.data.results);
    } catch (error) {
      console.error("Error fetching trending results:", error);
    }
  };

  const handleSearch = (query: string) => {
    setQuery(query);
    setPage(1);
    fetchSearchResults();
  };

  const handleAddToList = async (
    listId: string,
    itemId: number,
    itemType: string
  ) => {
    try {
      const response = await axios.post(
        `${api}/lists/addItem`,
        {
          listId,
          itemId,
          itemType,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success("Added to list");
      }
    } catch (error) {
      console.error("Error adding item to list:", error);
    }
  };

  useEffect(() => {
    if (query.length > 0) {
      fetchSearchResults();
    }
    if (trendingItems.length === 0) {
      fetchTrendingResults();
    }
  }, [page]);

  return (
    <>
      <div className="bg-background w-full">
        <SearchBar
          className="sticky top-0 z-10"
          value={query}
          onChange={setQuery}
          onSubmit={handleSearch}
        />
        <div className="flex flex-col align-middle items-center select-none">
          {searchItems.length > 0 ? (
            <>
              {searchItems.map((item) => (
                <div className="w-11/12" key={item.id}>
                  <SearchItem
                    item={item}
                    lists={lists}
                    onAddToList={handleAddToList}
                  />
                </div>
              ))}
            </>
          ) : (
            <>
              {trendingItems.map((item) => (
                <div className="w-11/12" key={item.id}>
                  <SearchItem
                    item={item}
                    lists={lists}
                    onAddToList={handleAddToList}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <div className="w-full max-w-4xl sm:px-6 px-4 mx-auto flex flex-col gap-y-4">
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => {
                    if (page > 1) {
                      setPage(page - 1);
                    }
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem className="select-none">
                {page === 1 || page === totalPages ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink href="#">{page}</PaginationLink>
                )}
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">{totalPages}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => {
                    if (page < totalPages) {
                      setPage(page + 1);
                    }
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </>
  );
}

export default Search;
