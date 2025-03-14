import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import api from "@/globals";
import { useIsMobile } from "@/hooks/use-mobile";
import axios from "axios";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import MovieType from "../types/MovieType";
import TVType from "../types/TVType";
import { useNavigate } from "react-router";
import useAuth from "@/useAuth";
import { EpisodeType } from "@/types/EpisodeType";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {};

interface User {
  id: string;
  name: string;
  email: string;
  photo: string;
}

interface List {
  createdAt: Date;
  items: (MovieType | TVType)[];
  listId: any;
  name: string;
  userIds: string[];
  users: User[];
}

function MovieBox({
  item,
  listId,
  className = "",
  handleRemoveItem,
}: {
  item: MovieType;
  listId: string;
  className?: string;
  handleRemoveItem: (itemId: number) => void;
}) {
  const [didWatch, setDidWatched] = useState(
    item.watching ? item.watching?.watched : false
  );
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleMovieEditor = (open: boolean) => {
    setOpen(open);
  };

  const updateWatching = async (watchVar: boolean) => {
    handleMovieEditor(false);

    setDidWatched(watchVar);
    if (item.watching) {
      item.watching.watched = watchVar;
    }

    try {
      await axios.post(
        `${api}/lists/updateWatching`,
        {
          listId,
          itemId: item.id,
          watching: { watched: watchVar },
          itemType: "movie",
        },
        { withCredentials: true }
      );
    } catch (error) {
      setDidWatched(!watchVar);
      if (item.watching) {
        item.watching.watched = !watchVar;
      }
      toast.error("Failed to update watch status");
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <img
              src={item.poster_path}
              className="aspect-[2/3] object-cover rounded-md opacity-100"
            />
          </DrawerTrigger>
          {open && (
            <MovieEditor
              movieDetails={item}
              handleRemoveItem={() => handleRemoveItem(item.id)}
              handleOK={updateWatching}
            />
          )}
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <img
              src={item.poster_path}
              className="aspect-[2/3] object-cover rounded-md opacity-100"
            />
          </DialogTrigger>
          {open && (
            <MovieEditor
              movieDetails={item}
              handleRemoveItem={() => handleRemoveItem(item.id)}
              handleOK={updateWatching}
            />
          )}
        </Dialog>
      )}
      <div className="flex items-center text-center flex-col">
        <p className="text-sm font-bold pb-0 w-full truncate">{item.title}</p>

        <p
          className={`flex justify-center my-2 w-full text-xs transition-all duration-300 text-white rounded-md mt-0 ${
            didWatch ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {didWatch ? "watched" : "unwatched"}
        </p>
      </div>
    </div>
  );
}

function ShowBox({
  item,
  listId,
  className = "",
  handleRemoveItem,
}: {
  item: TVType;
  listId: string;
  className?: string;
  handleRemoveItem: (itemId: number) => void;
}) {
  if (!item.watching) {
    return null;
  }

  const [episode, setEpisode] = useState(item.watching.episode);
  const [season, setSeason] = useState(item.watching.season);
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const updateWatching = async (ep = episode, s = season) => {
    handleShowEditor(false);

    const [prevEp, prevSeason] = [episode, season];

    setEpisode(ep);
    setSeason(s);
    try {
      await axios.post(
        `${api}/lists/updateWatching`,
        {
          listId,
          itemId: item.id,
          watching: { episode: ep, season: s },
          itemType: "tv",
        },
        { withCredentials: true }
      );
      item.watching = { episode: ep, season: s };
      toast.success("Watch status updated");
    } catch (error) {
      console.error("Error updating watch status:", error);
      toast.error("Failed to update watch status");

      setEpisode(prevEp);
      setSeason(prevSeason);
    }
  };

  const handleShowEditor = (open: boolean) => {
    setOpen(open);
  };

  return (
    <div className={`relative group ${className}`}>
      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <img
              src={item.poster_path}
              className="aspect-[2/3] object-cover rounded-md opacity-100"
            />
          </DrawerTrigger>
          {open && (
            <ShowEditor
              showDetails={item}
              listId={listId}
              handleRemoveItem={() => {
                handleRemoveItem(item.id);
                handleShowEditor(false);
              }}
              handleOK={updateWatching}
            />
          )}
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <img
              src={item.poster_path}
              className="aspect-[2/3] object-cover rounded-md opacity-100"
            />
          </DialogTrigger>
          {open && (
            <ShowEditor
              showDetails={item}
              listId={listId}
              handleRemoveItem={() => {
                handleRemoveItem(item.id);
                handleShowEditor(false);
              }}
              handleOK={updateWatching}
            />
          )}
        </Dialog>
      )}

      <div className="flex items-center text-center flex-col">
        <p className="text-sm font-bold pb-0 w-full truncate">{item.name}</p>
        <p
          className={`flex justify-center my-2 w-full text-xs text-white rounded-md bg-blue-400 mt-0`}
        >
          S{season} EP{episode}
        </p>
      </div>
    </div>
  );
}

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
    setIsLoading(true);
    try {
      const episodeDetails = await axios.get(`${api}/details/tv/episode`, {
        params: {
          id: showDetails.id,
          season: currSeason,
          episode: currEpisode,
        },
        withCredentials: true,
      });
      setCurrEpisodeDetails(episodeDetails.data);
      setMaxEpiInSeason(
        showDetails.seasons.find((s) => s.season_number === currSeason)
          ?.episode_count || 0
      );
    } catch (error) {
      console.error("Error fetching episode details:", error);
    } finally {
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
      setCurrEpisode((currEp) => (currEp !== undefined ? currEp + 1 : 1));
    }, 150);

    setDebounceTimer(timer);
  };

  const handlePrevEP = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      setCurrEpisode((currEp) => (currEp !== undefined ? currEp - 1 : 1));
    }, 150);

    setDebounceTimer(timer);
  };

  return isMobile ? (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>{showDetails.name}</DrawerTitle>
        <div className="flex flex-row gap-2 justify-center">
          {showDetails.genres.map((genre) => (
            <div className="bg-foreground text-background rounded-md p-1 text-xs">
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
                setCurrEpisode(1); // Reset to episode 1 when changing seasons
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
                  .filter((season) => season.season_number > 0) // Filter out specials (season 0)
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
        <div className="flex flex-row gap-2 justify-center">
          {showDetails.genres.map((genre) => (
            <div className="bg-foreground text-background rounded-md p-1 text-xs">
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
                setCurrEpisode(1); // Reset to episode 1 when changing seasons
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
                  .filter((season) => season.season_number > 0) // Filter out specials (season 0)
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

function MovieEditor({
  movieDetails,
  handleRemoveItem,
  handleOK,
}: {
  movieDetails: MovieType;
  handleRemoveItem: () => void;
  handleOK: (watched: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const watched = movieDetails.watching?.watched || false;
  console.log(movieDetails);

  return isMobile ? (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle className="text-center">{movieDetails.title}</DrawerTitle>
        <div className="flex flex-row gap-2 justify-center">
          {movieDetails.genres.map((genre) => (
            <div className="bg-foreground text-background rounded-md p-1 text-xs">
              {genre.name}
            </div>
          ))}
        </div>
      </DrawerHeader>
      <DrawerDescription>
        <p className="line-clamp-3">{movieDetails.overview}</p>
        <div className="flex flex-row items-center justify-center my-4 text-white">
          {movieDetails.watching?.watched ? "Watched" : "Not Watched"}
        </div>
        <img
          src={movieDetails.poster_path}
          className="w-2/5 object-cover rounded-md shadow-lg overflow-hidden mx-auto"
          alt={movieDetails.title}
        />
      </DrawerDescription>
      <DrawerFooter>
        <Button variant="destructive" onClick={handleRemoveItem}>
          Remove from List
        </Button>
      </DrawerFooter>
    </DrawerContent>
  ) : (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-center">{movieDetails.title}</DialogTitle>
        <div className="flex flex-row gap-2 justify-center">
          {movieDetails.genres.map((genre) => (
            <div className="bg-foreground text-background rounded-md p-1 text-xs">
              {genre.name}
            </div>
          ))}
        </div>
      </DialogHeader>
      <DialogDescription>
        <div className="flex flex-row gap-4">
          <img
            src={movieDetails.poster_path}
            className="w-2/5 object-cover rounded-md shadow-lg overflow-hidden mx-auto"
            alt={movieDetails.title}
          />
          <p className="line-clamp-[10] w-11/12">{movieDetails.overview}</p>
        </div>
        <div className="flex flex-row items-center justify-center my-4 text-white">
          {movieDetails.watching?.watched ? "Watched" : "Not Watched"}
        </div>
        <div className="flex flex-row items-center justify-around my-4">
          <p className="text-xs">
            {movieDetails.revenue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}{" "}
            revenue
          </p>
          <p className="text-xs">
            {movieDetails.budget.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}{" "}
            budget
          </p>
        </div>
        <div className="flex flex-row items-center justify-between my-4">
          <p className="text-xs">Released {movieDetails.release_date}</p>
          <p className="text-xs">
            Rating {movieDetails.vote_average.toFixed(1)} -{" "}
            {movieDetails.vote_count} votes
          </p>
          <p className="text-xs">Runtime {movieDetails.runtime} minutes</p>
        </div>
      </DialogDescription>
      <DialogFooter>
        <Button variant="destructive" onClick={handleRemoveItem}>
          Remove from List
        </Button>
        {watched ? (
          <Button variant="outline" onClick={() => handleOK(false)}>
            Unwatch
          </Button>
        ) : (
          <Button variant="outline" onClick={() => handleOK(true)}>
            Watch
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
}

function ListTitle({
  title,
  users,
  listId,
  getLists,
}: {
  title: string;
  users: User[];
  listId: string;
  getLists: () => void;
}) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(title);
  const [listTitle, setListTitle] = useState(title);
  const [, setAddUserOpen] = useState(false);
  const [addUserEmail, setAddUserEmail] = useState("");
  const handleCancel = () => {
    setName(title);
    setOpen(false);
    setAddUserOpen(false);
    setAddUserEmail("");
  };

  const handleRemoveUser = async (user: User) => {
    try {
      const response = await axios.post(
        `${api}/lists/removeUser`,
        { listId, userId: user.id },
        { withCredentials: true }
      );
      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }
      await getLists();
      toast.success("User removed from list");
    } catch (error) {
      toast.error("Error removing user from list");
    }
  };

  const handleDeleteList = async () => {
    try {
      await axios.post(
        `${api}/lists/delete`,
        { listId },
        { withCredentials: true }
      );
      await getLists();
      toast.success("List deleted successfully");
    } catch (error) {
      toast.error("Error deleting list");
    }
  };

  const handleSubmitList = async () => {
    try {
      await axios.post(
        `${api}/lists/update`,
        { listId, name, users },
        { withCredentials: true }
      );
      setListTitle(name);
      setOpen(false);
      toast.success("List updated successfully");
    } catch (error) {
      console.error("Error updating list:", error);
      toast.error("Failed to update list");
    }
  };

  const handleAddUserToList = async () => {
    if (!addUserEmail) {
      toast.error("Please enter an email");
      return;
    }
    try {
      const response = await axios.post(
        `${api}/lists/addUser`,
        { userEmail: addUserEmail, listId },
        { withCredentials: true }
      );
      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }
      await getLists();
      toast.success("User added to list");
    } catch (error) {
      console.log(error);
      toast.error("Error adding user to list");
    }
  };

  return (
    <>
      {!isMobile ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild className="mb-4 w-11/12">
            <Button variant="outline" className="w-64 truncate">
              {listTitle}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader className="flex flex-col items-center">
              <DialogTitle className="mt-2 mb-4">Edit List</DialogTitle>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
              <Separator className="my-2 w-1/2" />
              <div className="text-sm font-bold text-center">Users in List</div>
              <ScrollArea className="w-[375px] whitespace-nowrap rounded-md">
                <div className="flex w-max space-x-2 p-2">
                  {users.map((item, index) => {
                    return (
                      <DropdownMenu key={index}>
                        <DropdownMenuTrigger asChild>
                          <Avatar>
                            <AvatarImage
                              src={`${item.photo}`}
                              referrerPolicy="no-referrer"
                            />
                            <AvatarFallback className="uppercase">
                              {item.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleRemoveUser(item)}
                          >
                            Remove from List
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    );
                  })}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              <div className="flex w-11/12 flex-col items-center justify-center">
                <h1>Add User</h1>
                <div className=" w-full flex-row flex">
                  <Input
                    placeholder="Enter user to add's email"
                    value={addUserEmail}
                    onChange={(e) => setAddUserEmail(e.target.value)}
                  />
                  <Button onClick={handleAddUserToList}>Add</Button>
                </div>
              </div>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="destructive" onClick={handleDeleteList}>
                Delete List
              </Button>
              <DialogClose asChild>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={handleSubmitList}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-64 mb-4 truncate">
              {listTitle}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="flex flex-col items-center">
              <DrawerTitle className="mt-2 mb-4">Edit List</DrawerTitle>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
              <Separator className="my-2 w-1/2" />
            </DrawerHeader>
            <div className="flex flex-col items-center">
              <div className="text-sm font-bold text-center">Users in List</div>
              <ScrollArea className="w-10/12 whitespace-nowrap rounded-md">
                <div className="flex w-full space-x-2 p-2">
                  {users.map((item) => (
                    <DropdownMenu key={item.id}>
                      <DropdownMenuTrigger asChild>
                        <Avatar>
                          <AvatarImage
                            src={`${item.photo}`}
                            referrerPolicy="no-referrer"
                          />
                          <AvatarFallback className="uppercase">
                            {item.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => handleRemoveUser(item)}
                        >
                          Remove from List
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              <div className="flex w-11/12 flex-col items-center justify-center">
                <h1>Add User</h1>
                <div className=" w-full flex-row flex">
                  <Input
                    placeholder="Enter user to add's email"
                    value={addUserEmail}
                    onChange={(e) => setAddUserEmail(e.target.value)}
                  />
                  <Button onClick={handleAddUserToList}>Add</Button>
                </div>
              </div>
            </div>
            <DrawerFooter className="pt-6">
              <Button variant="destructive" onClick={handleDeleteList}>
                Delete List
              </Button>

              <DrawerClose asChild>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </DrawerClose>
              <Button onClick={handleSubmitList}>Submit</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}

function List({}: Props) {
  const isMobile = useIsMobile();
  const [newListName, setNewListName] = useState("");
  const [listOpen, setListOpen] = useState(false);
  const [lists, setLists] = useState<List[]>([]);
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    getLists();

    const intervalId = setInterval(() => {
      getLists();
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  function getOpenStates(lists: List[]) {
    const storedOpenStates: Record<number, boolean> = {};

    lists.forEach((list, index) => {
      const storedState = localStorage.getItem(`list_${list.listId}_open`);
      if (storedState !== null) {
        storedOpenStates[index] = JSON.parse(storedState);
      }
    });

    return storedOpenStates;
  }

  async function getLists() {
    await axios
      .get(`${api}/lists/`, {
        withCredentials: true,
      })
      .then((res) => {
        setLists(res.data);
        setOpenStates(getOpenStates(res.data));
      });
  }

  const toggleList = (index: number, listId: string) => {
    const newState = !openStates[index];

    setOpenStates((prev) => ({
      ...prev,
      [index]: newState,
    }));

    localStorage.setItem(`list_${listId}_open`, JSON.stringify(newState));
  };

  const handleSubmit = async () => {
    try {
      if (!newListName) {
        console.error("List name is required");
        toast.error("List name is required");
        return;
      }

      await axios.post(
        `${api}/lists/create`,
        { listName: newListName },
        { withCredentials: true }
      );

      setListOpen(false);
      setNewListName("");
      await getLists();
      toast.success("List created successfully!");
    } catch (error) {
      console.error("Error creating list:", error);
      return null;
    }
  };

  const handleRemoveItem = async (
    listId: string,
    itemId: number,
    itemType: string
  ) => {
    const prevList = lists;

    const keyName = (itemId + itemType).toString();
    setLists((prevLists) =>
      prevLists.map((list) => {
        if (list.listId === listId) {
          const newItems = { ...list.items };
          delete newItems[keyName as keyof typeof newItems];

          return {
            ...list,
            items: newItems,
          };
        }
        return list;
      })
    );
    try {
      await axios.post(
        `${api}/lists/removeItem`,
        { listId, itemId, itemType },
        { withCredentials: true }
      );
      toast.success("Item removed from list");
    } catch (error) {
      setLists(prevList);
      toast.error("Error removing item from list");
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-4 gap-4 mx-auto">
      <Input placeholder="Search for a list"></Input>
      {isMobile ? (
        <Drawer open={listOpen} onOpenChange={setListOpen}>
          <DrawerTrigger asChild>
            <Button>Create a List</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Create a List</DrawerTitle>
            </DrawerHeader>
            <DrawerDescription>
              <Input
                placeholder="List Name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="w-11/12 mx-auto"
              />
            </DrawerDescription>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <Button onClick={handleSubmit}>Submit</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={listOpen} onOpenChange={setListOpen}>
          <DialogTrigger asChild>
            <Button>Create a List</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a List</DialogTitle>
              <DialogDescription>
                <Input
                  placeholder="List Name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                />
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSubmit}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <Separator />
      <div>
        {lists.map((list, index) => {
          const isOpen = openStates[index] ?? false;
          return (
            <div
              className="flex flex-col items-center w-full"
              key={list.listId}
            >
              <ListTitle
                title={list.name}
                users={list.users}
                listId={list.listId}
                getLists={getLists}
              />
              <div className="absolute right-4">
                <Button
                  variant="ghost"
                  className="px-2 py-1"
                  onClick={() => toggleList(index, list.listId)}
                >
                  {isOpen ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="w-full ">
                <div className="grid 2xl:grid-cols-10 lg:grid-cols-6 sm:grid-cols-6 grid-cols-3 gap-4">
                  {isOpen &&
                    Object.entries(list.items).map(([_id, item]) => {
                      return "seasons" in item ? (
                        <ShowBox
                          item={item as TVType}
                          className=""
                          handleRemoveItem={(itemId) => {
                            handleRemoveItem(list.listId, itemId, "tv");
                          }}
                          listId={list.listId}
                        />
                      ) : (
                        <MovieBox
                          item={item as MovieType}
                          className=""
                          handleRemoveItem={(itemId) => {
                            handleRemoveItem(list.listId, itemId, "movie");
                          }}
                          listId={list.listId}
                        />
                      );
                    })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default List;
