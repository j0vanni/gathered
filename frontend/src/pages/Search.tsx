import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import MovieType from "@/types/MovieType";
import TVType from "@/types/TVType";
import { NumericFormat } from "react-number-format";
import { Results } from "../types/SearchType";
import MockMovie from "./MockMovie";
import MockRes from "./MockRes";
import MockTV from "./MockTV";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

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
const list_holder = ["list1", "list2", "list3"];

const image = "https://image.tmdb.org/t/p/original";

let show_items = MockRes;
show_items.results = show_items.results.filter(
  (item) => item.media_type !== "person"
);

function ShowItem(data: Results) {
  const {
    backdrop_path,
    id,
    name,
    original_name,
    overview,
    poster_path,
    media_type,
    adult,
    original_language,
    genre_ids,
    popularity,
    first_air_date,
    vote_average,
    origin_country,
  }: Results = data;
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
          src={image + poster_path}
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
            <p>{vote_average.toString()} / 10</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TVAlert(item: TVType) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <DrawerHeader>
        <DrawerTitle>
          <div className="flex flex-row">
            <p className="uppercase">{MockTV.name}</p>
            <p className="ml-auto text-xs text-black/50">{MockTV.status}</p>
          </div>
        </DrawerTitle>
        <DrawerDescription>
          <div className="flex flex-row gap-x-1">
            {MockTV.genres.map((item, index) => {
              return (
                <div className="bg-foreground text-background rounded-md p-1 text-xs">
                  {item.name}
                </div>
              );
            })}
          </div>
          <p className="mt-2">{item.overview}</p>
          <Accordion type="single" collapsible>
            <AccordionItem value="seasons">
              <AccordionTrigger>
                {MockTV.number_of_seasons} Seasons
              </AccordionTrigger>
              {MockTV.seasons.map((item, index) => (
                <AccordionContent>
                  <div className="flex flex-row">
                    {item.season_number}: {item.name} {" - "}
                    {item.episode_count} episodes
                    <p className="ml-auto">{item.air_date?.slice(0, 4)}</p>
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
            <p className="uppercase">{MockTV.name}</p>
            <p className="ml-auto text-xs text-black/50">{MockTV.status}</p>
          </div>
        </DialogTitle>
        <DialogDescription>
          <div className="flex flex-row gap-x-1">
            {MockTV.genres.map((item, index) => {
              return (
                <div className="bg-foreground text-background rounded-md p-1 text-xs">
                  {item.name}
                </div>
              );
            })}
          </div>
          <p className="mt-2">{item.overview}</p>
          <Accordion type="single" collapsible>
            <AccordionItem value="seasons">
              <AccordionTrigger>
                {MockTV.number_of_seasons} Seasons
              </AccordionTrigger>
              {MockTV.seasons.map((item, index) => (
                <AccordionContent>
                  <div className="flex flex-row">
                    {item.season_number}: {item.name} {" - "}
                    {item.episode_count} episodes
                    <p className="ml-auto">{item.air_date?.slice(0, 4)}</p>
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

function MovieAlert(item: MovieType) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <DrawerHeader>
        <DrawerTitle>
          <div className="flex flex-row">
            <p className="uppercase">{MockMovie.title}</p>
            <p className="ml-1 text-xs mt-2 text-black/50">
              {MockMovie.runtime} minutes
            </p>
            <p className="ml-auto text-xs text-black/50">
              {MockMovie.status} {MockMovie.release_date.slice(0, 4)}
            </p>
          </div>
        </DrawerTitle>
        <DrawerDescription>
          <div className="flex flex-row gap-x-1">
            {MockMovie.genres.map((item, index) => {
              return (
                <div className="bg-foreground text-background rounded-md p-1 text-xs">
                  {item.name}
                </div>
              );
            })}
          </div>
          <div className="flex flex-row mt-2">
            <NumericFormat
              value={MockMovie.budget}
              thousandSeparator=","
              className="bg-background mr-auto select-none"
              prefix="bud. "
              displayType="text"
            />
            <NumericFormat
              value={MockMovie.revenue}
              thousandSeparator=","
              className="bg-background ml-auto text-right select-none"
              prefix="rev. "
              displayType="text"
            />
          </div>
          <p className="my-2 text-left">{MockMovie.overview}</p>
        </DrawerDescription>
      </DrawerHeader>
    );
  } else {
    return (
      <DialogHeader>
        <DialogTitle>
          <div className="flex flex-row">
            <p className="uppercase">{MockMovie.title}</p>
            <p className="ml-1 text-xs mt-2 text-black/50">
              {MockMovie.runtime} minutes
            </p>
            <p className="ml-auto text-xs text-black/50">
              {MockMovie.status} {MockMovie.release_date.slice(0, 4)}
            </p>
          </div>
        </DialogTitle>
        <DrawerDescription>
          <div className="flex flex-row gap-x-1">
            {MockMovie.genres.map((item, index) => {
              return (
                <div className="bg-foreground text-background rounded-md p-1 text-xs">
                  {item.name}
                </div>
              );
            })}
          </div>
          <div className="flex flex-row mt-2">
            <NumericFormat
              value={MockMovie.budget}
              thousandSeparator=","
              className="bg-background mr-auto"
              prefix="bud. "
              displayType="text"
            />
            <NumericFormat
              value={MockMovie.revenue}
              thousandSeparator=","
              className="bg-background ml-auto text-right select-none"
              prefix="rev. "
              displayType="text"
            />
          </div>
          <p className="my-2 text-left">{MockMovie.overview}</p>
        </DrawerDescription>
      </DialogHeader>
    );
  }
}

function SearchBar({ className = "" }: { className?: string }) {
  const [searchItems, setToggleSearchItems] = useState("multi");
  return (
    <div
      className={`flex flex-col flex-1 justify-center items-center p-4 ${className}`}
    >
      <div className="flex flex-row w-full max-w-4xl px-4 sm:px-6 mx-auto gap-3">
        <Input
          className="w-full"
          placeholder="Search for movies or TV shows.."
        />
        <ToggleGroup
          type="single"
          onValueChange={setToggleSearchItems}
          defaultChecked
          defaultValue="multi"
        >
          <ToggleGroupItem value="multi">All</ToggleGroupItem>
          <ToggleGroupItem value="tv">TV</ToggleGroupItem>
          <ToggleGroupItem value="movie">Mov</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <Separator className="w-5/6 max-w-4xl mx-auto my-4" />
    </div>
  );
}

function SearchItem({ item }: { item: Results }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger className="w-full text-left">
          <ShowItem {...item} />
        </DrawerTrigger>
        <DrawerContent className="w-full rounded-md">
          {item.media_type === "movie" ? (
            <TVAlert {...item} />
          ) : (
            <MovieAlert {...item} />
          )}
          <DrawerFooter className="flex flex-row items-center gap-1">
            <Select>
              <SelectTrigger className="w-42 mr-auto">
                <SelectValue placeholder="Choose a List" />
              </SelectTrigger>
              <SelectContent>
                {list_holder.map((item, index) => {
                  return <SelectItem value={item}>{item}</SelectItem>;
                })}
              </SelectContent>
            </Select>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
            <Button>Add to List</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  } else {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="w-full text-left">
          <ShowItem {...item} />
        </DialogTrigger>
        <DialogContent className="w-full rounded-md [&>button]:hidden">
          {item.media_type === "movie" ? (
            <TVAlert {...item} />
          ) : (
            <MovieAlert {...item} />
          )}
          <DialogFooter className="flex flex-row items-center gap-1">
            <Select>
              <SelectTrigger className="w-42 mr-auto">
                <SelectValue placeholder="Choose a List" />
              </SelectTrigger>
              <SelectContent>
                {list_holder.map((item, index) => {
                  return <SelectItem value={item}>{item}</SelectItem>;
                })}
              </SelectContent>
            </Select>
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button>Add to List</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
}

function Search({}: Props) {
  return (
    <>
      <div className="bg-background w-full">
        <SearchBar className="sticky top-0 bg-background z-10" />
        <div className="flex flex-col align-middle items-center select-none">
          {show_items.results.map((item, _index) => (
            <div className="w-11/12">
              <SearchItem item={item}>{item}</SearchItem>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-4xl sm:px-6 px-4 mx-auto flex flex-col gap-y-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}

export default Search;
