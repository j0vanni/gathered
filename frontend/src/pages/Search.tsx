import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

import Title from "../types/title";
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

const mockData: Title = {
  Title: "Mob Psycho 100",
  Year: "2016–2022",
  Rated: "TV-14",
  Released: "27 Oct 2018",
  Runtime: "24 min",
  Genre: "Animation, Action, Comedy",
  Director: "N/A",
  Writer: "N/A",
  Actors: "Setsuo Ito, Takahiro Sakurai, Miyu Irino",
  Plot: "A psychic middle school boy tries to live a normal life and keep his growing powers under control, even though he constantly gets into trouble.",
  Language:
    "French, Spanish, German, Russian, Italian, Portuguese, Arabic, Japanese, English",
  Country: "Japan",
  Awards: "13 wins & 40 nominations",
  Poster:
    "https://m.media-amazon.com/images/M/MV5BYzU3NDM4ZjgtY2UyMi00YTczLTgyNDEtMjBiMDJlOGUxNjcxXkEyXkFqcGc@._V1_SX300.jpg",
  Ratings: {
    Source: "Internet Movie Database",
    Value: "8.5/10",
  },
  Metascore: "N/A",
  imdbRating: "8.5",
  imdbVotes: "50,584",
  imdbID: "tt5897304",
  Type: "series",
  totalSeasons: "3",
  Response: "True",
};

const arr = [
  mockData,
  mockData,
  mockData,
  mockData,
  mockData,
  mockData,
  mockData,
  mockData,
];

console.log(arr);

function ShowItem(data: Title) {
  return (
    <div className="hover:bg-[rgb(32,32,32)] rounded-lg">
      <div className="flex flex-row items-center gap-4 select-none w-[95%]">
        <img src={data.Poster} className="w-20 rounded-md" />
        <div>
          <div className="flex flex-row items-center gap-2">
            <p className="text-lg font-bold">{data.Title}</p>
            <p className="text-sm">{data.Year}</p>
            <p className="ml-auto text-xs text-gray-300">{data.Type}</p>
          </div>
          <p className="text-wrap">{data.Plot}</p>
          <div className="flex flex-row gap-6 text-sm">
            <p>{data.Ratings.Value} rating</p>
            {Number(data.totalSeasons) > 0 ? (
              <p>{data.totalSeasons} seasons</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function Search({}: Props) {
  return (
    <>
      <div className="flex flex-col flex-1 justify-center items-center my-4">
        <div className="flex flex-row w-[64vw] justify-between gap-3">
          <Input className="w-[80%]" placeholder="show/movie title" />
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="movie">movie</SelectItem>
              <SelectItem value="series">series</SelectItem>
              <SelectItem value="episode">episode</SelectItem>
            </SelectContent>
          </Select>
          <Button>Search</Button>
        </div>
        <Separator className="w-[90%] my-4" />
        <div className="w-[80vw] flex flex-col gap-y-4">
          {arr.map((item) => {
            return <ShowItem {...item} />;
          })}
        </div>
      </div>
    </>
  );
}

export default Search;
