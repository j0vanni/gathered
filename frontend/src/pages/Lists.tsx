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

  const handleWatched = async () => {
    setDidWatched((prev) => {
      updateWatching(!prev);
      return !prev;
    });
  };

  const updateWatching = async (watchVar: boolean) => {
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
      toast.error("Failed to update watch status");
    }
  };

  return (
    <div className={`relative group ${className}`}>
      <div className="absolute inset-0 flex flex-col items-center justify-start group-hover:opacity-100 opacity-0 transition-all duration-300">
        <div className="mt-[50%] -translate-y-[50%] flex flex-col items-center justify-around w-full">
          <Button
            className="text-wrap text-xs w-11/12 bg-background/40 hover:bg-background/70 text-foreground mix-blend-lighter"
            onClick={handleWatched}
          >
            mark as {didWatch ? "unwatched" : "watched"}
          </Button>
        </div>
        <Button
          className="mt-[25%] -translate-y-[50%] text-xs w-3/5 h-6 top-40 bg-red-600/50 hover:bg-red-800/70 text-background mix-blend-lighter"
          onClick={() => handleRemoveItem(item.id)}
        >
          remove
        </Button>
      </div>
      <img
        src={item.poster_path}
        className="aspect-auto w-full rounded-md opacity-100"
      />
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
  const [currSeasonEP, setCurrSeasonEP] = useState(
    item.seasons.find((s) => s.season_number === season)?.episode_count || 0
  );
  const maxSeason = item.seasons.reduce(
    (max, s) => Math.max(max, s.season_number),
    0
  );

  const updateWatching = async (ep = episode, s = season) => {
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
  };

  const handleNextEP = async () => {
    setEpisode((prevEp) => {
      if (prevEp + 1 > currSeasonEP) {
        if (season + 1 > maxSeason) {
          toast.error("No more seasons");
          return prevEp;
        } else {
          setSeason(season + 1);
          setCurrSeasonEP(item.seasons[season].episode_count);
          updateWatching(1, season + 1);
          return 1;
        }
      } else {
        updateWatching(prevEp + 1, season);
        return prevEp + 1;
      }
    });
  };

  const handlePrevEP = async () => {
    setEpisode((prevEp) => {
      if (prevEp - 1 > 0) {
        updateWatching(prevEp - 1, season);
        return prevEp - 1;
      } else if (season > 1 && prevEp == 1) {
        const prevSeason = season - 1;
        const prevSeasonEpisodeCount =
          item.seasons.find((s) => s.season_number === prevSeason)
            ?.episode_count || 0;

        setSeason(prevSeason);
        setCurrSeasonEP(prevSeasonEpisodeCount);
        updateWatching(prevSeasonEpisodeCount, prevSeason);
        return prevSeasonEpisodeCount;
      } else {
        return prevEp;
      }
    });
  };

  return (
    <div className={`relative group ${className}`}>
      <div className="absolute inset-0 flex flex-col items-center justify-start group-hover:opacity-100 opacity-0 transition-all duration-300">
        <div className="mt-[50%] -translate-y-[50%] flex flex-row justify-around w-full">
          <Button
            className="ml-2 bg-background/50 w-1 h-auto hover:bg-background/70 text-foreground mix-blend-lighter"
            onClick={handlePrevEP}
          >
            -
          </Button>
          <Button
            className="mr-2 bg-background/50 w-1 h-auto hover:bg-background/70 text-foreground mix-blend-lighter"
            onClick={handleNextEP}
          >
            +
          </Button>
        </div>
        <Button
          className="relative top-[15%] -translate-y-[50%] text-xs w-3/5 h-6 bg-red-600/50 hover:bg-red-800/70 text-background mix-blend-lighter"
          onClick={() => handleRemoveItem(item.id)}
        >
          remove
        </Button>
      </div>
      <img
        src={item.poster_path}
        className="aspect-auto w-full rounded-md opacity-100"
      />

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
            <Button variant="outline" className="w-full mb-4 truncate">
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

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get(`${api}/auth/user`, {
          withCredentials: true,
        });

        if (res.status !== 200) {
          window.location.href = "/";
        }
      } catch (error) {
        window.location.href = "/";
      }
    };
    checkLogin();
  }, []);

  useEffect(() => {
    getLists();
  }, []);

  useEffect(() => {
    if (lists.length > 0) {
      const storedOpenStates: Record<number, boolean> = {};

      lists.forEach((list, index) => {
        const storedState = localStorage.getItem(`list_${list.listId}_open`);
        if (storedState !== null) {
          storedOpenStates[index] = JSON.parse(storedState);
        }
      });

      setOpenStates(storedOpenStates);
    }
  }, [lists]);

  async function getLists() {
    const response = await axios.get(`${api}/lists/`, {
      withCredentials: true,
    });
    setLists(response.data);
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
    try {
      await axios.post(
        `${api}/lists/removeItem`,
        { listId, itemId, itemType },
        { withCredentials: true }
      );
      await getLists();
      toast.success("Item removed from list");
    } catch (error) {
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
              <div className="w-[25rem]" />
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
              <div className="flex w-full">
                <div className="flex flex-row gap-4 flex-wrap content-center justify-center align-center">
                  {isOpen &&
                    Object.entries(list.items).map(([_id, item]) => {
                      return "seasons" in item ? (
                        <ShowBox
                          item={item as TVType}
                          className="sm:w-1/6 w-1/4"
                          handleRemoveItem={(itemId) => {
                            handleRemoveItem(list.listId, itemId, "tv");
                          }}
                          listId={list.listId}
                        />
                      ) : (
                        <MovieBox
                          item={item as MovieType}
                          className="sm:w-1/6 w-1/4"
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
