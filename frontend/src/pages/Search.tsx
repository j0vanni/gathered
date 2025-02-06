import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import ReactCountryFlag from "react-country-flag";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import MockRes from "./MockRes";
import { Results } from "../types/Searchtype";
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

function SearchBar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-col flex-1 justify-center items-center pt-4 ${className}`}
    >
      <div className="flex flex-row w-full max-w-4xl px-4 sm:px-6 mx-auto gap-3">
        <Input
          className="w-full"
          placeholder="Search for movies or TV shows.."
        />
        <ToggleGroup type="single">
          <ToggleGroupItem value="multi">All</ToggleGroupItem>
          <ToggleGroupItem value="tv">TV</ToggleGroupItem>
          <ToggleGroupItem value="movie">Mov</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <Separator className="w-5/6 max-w-4xl mx-auto my-4" />
    </div>
  );
}

function Search({}: Props) {
  return (
    <>
      <div className="bg-background w-full">
        <SearchBar className="sticky top-0 bg-background z-10" />
        <div className="flex flex-col align-middle items-center select-none">
          {show_items.results.map((item, _index) => (
            <div className="w-11/12">
              <ShowItem {...item} key={_index} />
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-4xl sm:px-6 px-4 mx-auto flex flex-col gap-y-4"></div>
    </>
  );
}

export default Search;
