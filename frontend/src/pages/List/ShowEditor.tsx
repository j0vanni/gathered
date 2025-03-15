import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import TVType from "@/types/TVType";
import { useState } from "react";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/globals";
import { EpisodeType } from "@/types/EpisodeType";
import axios from "axios";
import { useEffect } from "react";

function ShowEditor({
  showDetails,
  handleRemoveItem,
  handleOK,
}: {
  showDetails: TVType;
  listId: String;
  handleRemoveItem: () => void;
  handleOK: (episode: number, season: number) => void;
}) {
  const isMobile = useIsMobile();
  const [currEpisode, setCurrEpisode] = useState(
    showDetails.watching?.episode || 1
  );
  const [currSeason, setCurrSeason] = useState(
    showDetails.watching?.season || 1
  );
  const [currEpisodeDetails, setCurrEpisodeDetails] =
    useState<EpisodeType | null>(null);
  const [maxEpiInSeason, setMaxEpiInSeason] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchEpisodeDetails() {
    const loadingTimer = setTimeout(() => {
      setIsLoading(true);
    }, 300);
    try {
      const episodeDetails = await axios.get(`${api}/details/tv/episode`, {
        params: {
          id: showDetails.id,
          season: currSeason,
          episode: currEpisode,
        },
        withCredentials: true,
      });
      clearTimeout(loadingTimer);
      setCurrEpisodeDetails(episodeDetails.data);
      setMaxEpiInSeason(
        showDetails.seasons.find((s) => s.season_number === currSeason)
          ?.episode_count || 0
      );
    } catch (error) {
      console.error("Error fetching episode details:", error);
    } finally {
      clearTimeout(loadingTimer);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchEpisodeDetails();
  }, []);

  useEffect(() => {
    if (currEpisode && currSeason) {
      fetchEpisodeDetails();
    }
  }, [currEpisode, currSeason]);

  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleNextEP = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      setCurrEpisode((currEp) => {
        if (currEp !== undefined && currEp < maxEpiInSeason) {
          return currEp + 1;
        }
        return currEp || 1;
      });
    }, 150);

    setDebounceTimer(timer);
  };

  const handlePrevEP = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      setCurrEpisode((currEp) => {
        if (currEp !== undefined && currEp > 1) {
          return currEp - 1;
        }
        return currEp || 1;
      });
    }, 150);

    setDebounceTimer(timer);
  };

  return isMobile ? (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>{showDetails.name}</DrawerTitle>
        <div className="flex flex-row flex-wrap gap-2 justify-center">
          {showDetails.genres.map((genre) => (
            <div
              key={genre.id}
              className="bg-foreground text-background rounded-md p-1 text-xs h-6 truncate"
            >
              {genre.name}
            </div>
          ))}
        </div>
      </DrawerHeader>
      <DrawerDescription className="w-11/12 mx-auto">
        <p className="line-clamp-3">{showDetails.overview}</p>
        <div className="flex flex-row items-center justify-center my-4 text-white">
          Currently on: Season{" "}
          <span className="font-bold mx-2">{currSeason}</span>Episode{" "}
          <span className="font-bold mx-2">{currEpisode}</span>
        </div>
        {isLoading ? (
          <>
            <div className="flex flex-row justify-between">
              <Skeleton className="w-3/5 rounded-md h-6" />
              <Skeleton className="w-32 rounded-md h-4" />
            </div>
            <Skeleton className="w-full mt-2 rounded-md h-9 mb-1" />
            <Skeleton className="w-3/5 mt-1 rounded-md h-[8.25rem] mx-auto" />
          </>
        ) : (
          <>
            <div className="flex flex-row justify-between">
              <p className="text-lg font-bold text-white">
                {currEpisodeDetails?.name}
              </p>
              <p className="text-xs">Released {currEpisodeDetails?.air_date}</p>
            </div>
            <p className="line-clamp-2 mb-1">{currEpisodeDetails?.overview}</p>
            {currEpisodeDetails?.still_path != null ? (
              <img
                src={currEpisodeDetails?.still_path}
                className="w-3/5 object-cover rounded-md shadow-lg overflow-hidden mx-auto"
                alt={currEpisodeDetails?.name}
              />
            ) : (
              <div className="w-3/5 h-56 bg-gray-700 rounded-md shadow-lg overflow-hidden mx-auto"></div>
            )}
          </>
        )}
      </DrawerDescription>
      <DrawerFooter>
        <div className="flex flex-col w-full gap-4">
          <div className="flex flex-row justify-between w-full gap-4">
            <Select
              value={currSeason.toString()}
              onValueChange={(value) => {
                const newSeason = parseInt(value);
                setCurrSeason(newSeason);
                setCurrEpisode(1);
                setMaxEpiInSeason(
                  showDetails.seasons.find((s) => s.season_number === newSeason)
                    ?.episode_count || 0
                );
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Season" />
              </SelectTrigger>
              <SelectContent>
                {showDetails.seasons
                  .filter((season) => season.season_number > 0)
                  .map((season) => (
                    <SelectItem
                      key={season.id}
                      value={season.season_number.toString()}
                    >
                      {season.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select
              value={currEpisode.toString()}
              onValueChange={(value) => setCurrEpisode(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Episode" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: maxEpiInSeason }, (_, i) => i + 1).map(
                  (ep) => (
                    <SelectItem key={ep} value={ep.toString()}>
                      Episode {ep}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-row justify-between">
            <Button
              variant="outline"
              onClick={handlePrevEP}
              className="text-xs"
            >
              - Episode
            </Button>
            <Button
              variant="outline"
              onClick={handleNextEP}
              className="text-xs"
            >
              + Episode
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveItem}
              className="text-xs"
            >
              Remove from List
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOK(currEpisode || 1, currSeason || 1)}
              className="text-xs"
            >
              OK
            </Button>
          </div>
        </div>
      </DrawerFooter>
    </DrawerContent>
  ) : (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-center text-2xl">
          {showDetails.name}
        </DialogTitle>
        <div className="flex flex-row flex-wrap gap-2 justify-center">
          {showDetails.genres.map((genre) => (
            <div
              key={genre.id}
              className="bg-foreground text-background rounded-md p-1 h-6 text-xs truncate"
            >
              {genre.name}
            </div>
          ))}
        </div>
      </DialogHeader>
      <DialogDescription>
        <p className="line-clamp-3">{showDetails.overview}</p>
        <div className="flex flex-row items-center justify-center my-4 text-white">
          Currently on: Season{" "}
          <span className="font-bold mx-2">{currSeason}</span>Episode{" "}
          <span className="font-bold mx-2">{currEpisode}</span>
        </div>
        {isLoading ? (
          <>
            <div className="flex flex-row justify-between">
              <Skeleton className="w-3/5 rounded-md h-6" />
              <Skeleton className="w-32 rounded-md h-4" />
            </div>
            <Skeleton className="w-full mt-1 rounded-md h-10" />
            <Skeleton className="w-full mt-4 rounded-md mx-auto h-56" />
          </>
        ) : (
          <>
            <div className="flex flex-row justify-between">
              <p className="text-lg font-bold text-white">
                {currEpisodeDetails?.name}
              </p>
              <p className="text-xs">Released {currEpisodeDetails?.air_date}</p>
            </div>
            <p className="line-clamp-2">{currEpisodeDetails?.overview}</p>
            <img
              src={currEpisodeDetails?.still_path}
              className="mt-4 w-full h-56 object-cover rounded-md shadow-lg aspect-[16/9]"
              alt={currEpisodeDetails?.name}
            />
          </>
        )}
      </DialogDescription>
      <DialogFooter>
        <div className="flex flex-col w-full gap-4">
          <div className="flex flex-row justify-between w-full gap-4">
            <Select
              value={currSeason.toString()}
              onValueChange={(value) => {
                const newSeason = parseInt(value);
                setCurrSeason(newSeason);
                setCurrEpisode(1);
                setMaxEpiInSeason(
                  showDetails.seasons.find((s) => s.season_number === newSeason)
                    ?.episode_count || 0
                );
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Season" />
              </SelectTrigger>
              <SelectContent>
                {showDetails.seasons
                  .filter((season) => season.season_number > 0)
                  .map((season) => (
                    <SelectItem
                      key={season.id}
                      value={season.season_number.toString()}
                    >
                      {season.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select
              value={currEpisode.toString()}
              onValueChange={(value) => setCurrEpisode(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Episode" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: maxEpiInSeason }, (_, i) => i + 1).map(
                  (ep) => (
                    <SelectItem key={ep} value={ep.toString()}>
                      Episode {ep}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-row justify-between w-full">
            <Button variant="outline" onClick={handlePrevEP}>
              - Episode
            </Button>
            <Button variant="outline" onClick={handleNextEP}>
              + Episode
            </Button>
            <Button variant="destructive" onClick={handleRemoveItem}>
              Remove from List
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOK(currEpisode || 1, currSeason || 1)}
            >
              OK
            </Button>
          </div>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}

export default ShowEditor;
