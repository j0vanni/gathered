import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import api from "@/globals";
import { useIsMobile } from "@/hooks/use-mobile";
import MovieType from "@/types/MovieType";
import TVType from "@/types/TVType";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { ResultsMovie, ResultsShow } from "../types/SearchType";
import List from "./Lists";
import useAuth from "@/useAuth";
import { useNavigate } from "react-router";

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

function ShowItem(data: ResultsShow) {
  const {
    name,
    original_name,
    overview,
    poster_path,
    media_type,
    first_air_date,
    vote_average,
    origin_country,
  }: ResultsShow = data;
  const air_year = first_air_date ? first_air_date.slice(0, 4) : "";

  return (
    <div className="relative p-2 hover:bg-black/5 rounded-md">
      <div className="flex flex-row">
        {origin_country && origin_country.length > 0 && (
          <>
            <ReactCountryFlag
              countryCode={origin_country[0]}
              svg
              className="absolute top-2 right-2"
            />
            <p className="absolute top-6 right-2.5 text-black/50 text-sm">
              {media_type}
            </p>
          </>
        )}
        <img
          src={poster_path}
          className="sm:w-28 w-24 fit rounded-md object-contain"
        />
        <div className="flex flex-col p-2 w-full">
          <p className="truncate w-64 sm:w-auto text-lg">{name}</p>
          {original_name != name && (
            <p className="truncate w-64 sm:w-auto text-xs text-black/50">
              {original_name}
            </p>
          )}
          <p className="text-wrap text-foreground line-clamp-3 text-base">
            {overview}
          </p>
          <div className="flex-grow"></div>
          <div className="flex flex-row justify-between text-sm text-black/50">
            <p className="bottom-0">{air_year}</p>
            <p>{Number(vote_average).toString()} / 10</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MovieItem(item: ResultsMovie) {
  const {
    title,
    original_title,
    overview,
    poster_path,
    media_type,
    release_date,
    vote_average,
  }: ResultsMovie = item;
  const movie_year = release_date ? release_date.slice(0, 4) : "";

  return (
    <div className="relative p-2 hover:bg-black/5 rounded-md">
      <div className="flex flex-row">
        <p className="absolute top-2 right-1 text-black/50 text-sm">
          {media_type.slice(0, 3)}
        </p>
        <img
          src={poster_path}
          className="sm:w-28 w-24 fit rounded-md object-contain"
        />
        <div className="flex flex-col p-2 w-full">
          <p className="truncate w-64 sm:w-auto text-lg">{title}</p>
          {original_title != title && (
            <p className="truncate w-64 sm:w-auto text-xs text-black/50">
              {original_title}
            </p>
          )}
          <p className="text-wrap text-foreground line-clamp-3 text-base ">
            {overview}
          </p>
          <div className="flex-grow"></div>
          <div className="flex flex-row justify-between text-sm text-black/50">
            <p className="bottom-0">{movie_year}</p>
            <p>{Number(vote_average).toString()} / 10</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TVAlert(item: any) {
  const isMobile = useIsMobile();
  const [tvDetails, setTvDetails] = useState<TVType | null>(null);

  useEffect(() => {
    const fetchTvDetails = async () => {
      try {
        const response = await axios.get(`${api}/details/tv?id=${item.id}`, {
          withCredentials: true,
        });
        setTvDetails(response.data);
      } catch (error) {
        console.error("Error fetching TV details:", error);
      }
    };

    fetchTvDetails();
  }, [item.id]);

  if (!tvDetails) {
    return null;
  }

  if (isMobile) {
    return (
      <DrawerHeader>
        <DrawerTitle>
          <div className="flex flex-row">
            <p className="uppercase">{tvDetails.name}</p>
            <p className="ml-auto text-xs text-black/50">{tvDetails.status}</p>
          </div>
        </DrawerTitle>
        <DrawerDescription>
          <div className="flex flex-row gap-x-1">
            {tvDetails.genres.map((gen) => {
              return (
                <div className="bg-foreground text-background rounded-md p-1 text-xs">
                  {gen.name}
                </div>
              );
            })}
          </div>
          <p className="mt-2">{tvDetails.overview}</p>
          <Accordion type="single" collapsible>
            <AccordionItem value="seasons">
              <AccordionTrigger>
                {tvDetails.number_of_seasons} Seasons
              </AccordionTrigger>
              {tvDetails.seasons.map((season) => (
                <AccordionContent>
                  <div className="flex flex-row">
                    {season.season_number}: {season.name} {" - "}
                    {season.episode_count} episodes
                    <p className="ml-auto">{season.air_date?.slice(0, 4)}</p>
                  </div>
                </AccordionContent>
              ))}
            </AccordionItem>
          </Accordion>
        </DrawerDescription>
      </DrawerHeader>
    );
  } else {
    return (
      <DialogHeader>
        <DialogTitle>
          <div className="flex flex-row">
            <p className="uppercase">{tvDetails.name}</p>
            <p className="ml-auto text-xs text-black/50">{tvDetails.status}</p>
          </div>
        </DialogTitle>
        <DialogDescription>
          <div className="flex flex-row gap-x-1">
            {tvDetails.genres.map((gen) => {
              return (
                <div className="bg-foreground text-background rounded-md p-1 text-xs">
                  {gen.name}
                </div>
              );
            })}
          </div>
          <p className="mt-2">{tvDetails.overview}</p>
          <Accordion type="single" collapsible>
            <AccordionItem value="seasons">
              <AccordionTrigger>
                {tvDetails.number_of_seasons} Seasons
              </AccordionTrigger>
              {tvDetails.seasons.map((season) => (
                <AccordionContent>
                  <div className="flex flex-row">
                    {season.season_number}: {season.name} {" - "}
                    {season.episode_count} episodes
                    <p className="ml-auto">{season.air_date?.slice(0, 4)}</p>
                  </div>
                </AccordionContent>
              ))}
            </AccordionItem>
          </Accordion>
        </DialogDescription>
      </DialogHeader>
    );
  }
}

function MovieAlert(item: any) {
  const isMobile = useIsMobile();
  const [movieDetails, setMovieDetails] = useState<MovieType | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`${api}/details/movie?id=${item.id}`, {
          withCredentials: true,
        });
        setMovieDetails(response.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [item.id]);

  if (!movieDetails) {
    return null;
  }

  if (isMobile) {
    return (
      <DrawerHeader>
        <DrawerTitle>
          <div className="flex flex-row">
            <p className="uppercase truncate w-52">{movieDetails.title}</p>
            <p className="ml-1 text-xs mt-2 text-black/50">
              {movieDetails.runtime} minutes
            </p>
            <p className="ml-auto text-xs text-black/50">
              {movieDetails.status} {movieDetails.release_date.slice(0, 4)}
            </p>
          </div>
        </DrawerTitle>
        <DrawerDescription>
          <div className="flex flex-row gap-x-1">
            {movieDetails.genres.map((gen) => {
              return (
                <div className="bg-foreground text-background rounded-md p-1 text-xs">
                  {gen.name}
                </div>
              );
            })}
          </div>
          <div className="flex flex-row mt-2">
            {movieDetails.budget > 0 ? (
              <NumericFormat
                value={movieDetails.budget}
                thousandSeparator=","
                className="bg-background mr-auto select-none"
                prefix="bud. "
                displayType="text"
              />
            ) : (
              <p className="bg-background mr-auto select-none">bud. ?</p>
            )}
            {movieDetails.revenue > 0 ? (
              <NumericFormat
                value={movieDetails.revenue}
                thousandSeparator=","
                className="bg-background ml-auto text-right select-none"
                prefix="rev. "
                displayType="text"
              />
            ) : (
              <p className="bg-background ml-auto text-right select-none">
                rev. ?
              </p>
            )}
          </div>
          <p className="my-2 text-left">{movieDetails.overview}</p>
        </DrawerDescription>
      </DrawerHeader>
    );
  } else {
    return (
      <DialogHeader>
        <DialogTitle>
          <div className="flex flex-row">
            <p className="uppercase truncate w-64">{movieDetails.title}</p>
            <p className="ml-1 text-xs mt-2 text-black/50">
              {movieDetails.runtime} minutes
            </p>
            <p className="ml-auto text-xs text-black/50">
              {movieDetails.status} {movieDetails.release_date.slice(0, 4)}
            </p>
          </div>
        </DialogTitle>
        <DrawerDescription>
          <div className="flex flex-row gap-x-1">
            {movieDetails.genres.map((gen) => {
              return (
                <div className="bg-foreground text-background rounded-md p-1 text-xs">
                  {gen.name}
                </div>
              );
            })}
          </div>
          <div className="flex flex-row mt-2">
            {movieDetails.budget > 0 ? (
              <NumericFormat
                value={movieDetails.budget}
                thousandSeparator=","
                className="bg-background mr-auto"
                prefix="bud. "
                displayType="text"
              />
            ) : (
              <p className="bg-background mr-auto select-none">bud. ?</p>
            )}
            {movieDetails.revenue > 0 ? (
              <NumericFormat
                value={movieDetails.revenue}
                thousandSeparator=","
                className="bg-background ml-auto text-right select-none"
                prefix="rev. "
                displayType="text"
              />
            ) : (
              <p className="bg-background ml-auto text-right select-none">
                rev. ?
              </p>
            )}
          </div>
          <p className="my-2 text-left">{movieDetails.overview}</p>
        </DrawerDescription>
      </DialogHeader>
    );
  }
}

function SearchBar({
  className = "",
  value,
  onChange,
  onSubmit,
}: {
  className?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}) {
  return (
    <div
      className={`flex flex-col flex-1 justify-center items-center p-4 ${className}`}
    >
      <div className="flex flex-row w-full max-w-4xl px-4 sm:px-6 mx-auto gap-3">
        <Input
          className="w-full"
          placeholder="Search for movies or TV shows.."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSubmit(value);
            }
          }}
        />
        {/* <ToggleGroup
          type="single"
          // onValueChange={"multi"}
          defaultChecked
          defaultValue="multi"
        >
          <ToggleGroupItem value="multi">All</ToggleGroupItem>
          <ToggleGroupItem value="tv">TV</ToggleGroupItem>
          <ToggleGroupItem value="movie">Mov</ToggleGroupItem>
        </ToggleGroup> */}
      </div>
      <Separator className="w-5/6 max-w-4xl mx-auto my-4" />
    </div>
  );
}

function SearchItem({
  item,
  lists,
  onAddToList,
}: {
  item: ResultsShow | ResultsMovie;
  lists: {
    items: (MovieType | TVType)[];
    name: string;
    listId: string;
    users: { email: string; id: string; name: string; photo: string }[];
    userIds: string[];
    createdAt: Date;
  }[];
  onAddToList: (listId: string, itemId: number, itemType: string) => void;
}) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const handleAddToList = () => {
    if (selectedListId) {
      onAddToList(selectedListId, Number(item.id), item.media_type);
      handleClose();
    } else {
      toast.error("Please select a list");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedListId(null);
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger className="w-full text-left">
          {item.media_type === "tv" ? (
            <ShowItem {...(item as ResultsShow)} />
          ) : (
            <MovieItem {...(item as ResultsMovie)} />
          )}
        </DrawerTrigger>
        <DrawerContent className="w-full rounded-md">
          {item.media_type === "tv" ? (
            <TVAlert {...item} />
          ) : (
            <MovieAlert {...item} />
          )}
          <DrawerFooter className="flex flex-row items-center gap-1">
            <Select onValueChange={setSelectedListId}>
              <SelectTrigger className="w-full mr-auto truncate">
                <SelectValue placeholder="Choose a List" />
              </SelectTrigger>
              <SelectContent>
                {lists.map((item) => {
                  return (
                    <SelectItem key={item.listId} value={item.listId}>
                      {item.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <DrawerClose>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </DrawerClose>
            <Button onClick={handleAddToList}>Add to List</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  } else {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="w-full text-left">
          {item.media_type === "tv" ? (
            <ShowItem {...(item as ResultsShow)} />
          ) : (
            <MovieItem {...(item as ResultsMovie)} />
          )}
        </DialogTrigger>
        <DialogContent className="w-full rounded-md [&>button]:hidden">
          {item.media_type === "movie" ? (
            <MovieAlert {...item} />
          ) : (
            <TVAlert {...item} />
          )}
          <DialogFooter className="flex flex-row items-center gap-1">
            <Select onValueChange={setSelectedListId}>
              <SelectTrigger className="w-full mr-auto truncate">
                <SelectValue placeholder="Choose a List" />
              </SelectTrigger>
              <SelectContent>
                {lists.map((item) => {
                  return (
                    <SelectItem key={item.listId} value={item.listId}>
                      {item.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddToList}>Add to List</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
}

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
      const response = await axios.get(
        `${api}/search/${searchToggle}?query=${query}&page=${page}`,
        {
          withCredentials: true,
        }
      );
      setSearchItems(response.data.results);
      setTotalPages(response.data.total_pages);
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
      const response = await axios.get(`${api}/search/trending`, {
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
          className="sticky top-0 bg-background z-10"
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
                  ></SearchItem>
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
