import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import MockMovie from "./MockMovie";
import MockTV from "./MockTV";
import MovieType from "../types/MovieType";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import TVType from "../types/TVType";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusIcon } from "lucide-react";

type Props = {};

const MockData = {
  lists: [
    {
      name: "list name",
      users: ["user1"],
      items: [
        MockTV,
        MockMovie,
        MockMovie,
        MockTV,
        MockTV,
        MockTV,
        MockMovie,
        MockMovie,
        MockTV,
        MockTV,
        MockTV,
        MockMovie,
        MockMovie,
        MockTV,
        MockTV,
        MockTV,
        MockMovie,
        MockMovie,
        MockTV,
        MockTV,
      ],
    },
    {
      name: "list name 2",
      users: ["hold this"],
      items: [MockTV, MockMovie, MockMovie, MockTV, MockTV, MockTV, MockMovie],
    },
  ],
};

const MockUsers = [
  {
    name: "user1",
    email: "user1@gmail.com",
    pfp: "https://via.placeholder.com/150",
  },
  {
    name: "user2",
    email: "user2@gmail.com",
    pfp: "https://via.placeholder.com/150",
  },
  {
    name: "user3",
    email: "user3@gmail.com",
    pfp: "https://via.placeholder.com/150",
  },
  {
    name: "user4",
    email: "user4@gmail.com",
    pfp: "https://via.placeholder.com/150",
  },
  {
    name: "user5",
    email: "user5@gmail.com",
    pfp: "https://via.placeholder.com/150",
  },
  {
    name: "user6",
    email: "user6@gmail.com",
    pfp: "https://via.placeholder.com/150",
  },
  {
    name: "user7",
    email: "user7@gmail.com",
    pfp: "https://via.placeholder.com/150",
  },
  {
    name: "user8",
    email: "user8@gmail.com",
    pfp: "https://via.placeholder.com/150",
  },
  {
    name: "user9",
    email: "user9@gmail.com",
    pfp: "https://via.placeholder.com/150",
  },
  {
    name: "user10",
    email: "user10@gmail.com",
    pfp: "https://via.placeholder.com/150",
  },
  {
    name: "user11",
    email: "user11@gmail.com",
    pfp: "https://via.placeholder.com/150",
  },
  {
    name: "user12",
    email: "user12@gmail.com",
    pfp: "https://via.placeholder.com/150",
  },
  {
    name: "user13",
    email: "user13@gmail.com",
    pfp: "https://via.placeholder.com/150",
  },
];

const image = "https://image.tmdb.org/t/p/original";
function MovieBox({
  item,
  className = "",
}: {
  item: MovieType;
  className?: string;
}) {
  const [watched, setWatched] = useState(true);

  const handleWatched = () => {
    setWatched((watch) => !watch);
  };

  const handleRemove = () => {};

  return (
    <div className={`relative group ${className}`}>
      <div className="absolute inset-0 flex flex-col items-center justify-start group-hover:opacity-100 opacity-0 transition-all duration-300">
        <div className="mt-[50%] -translate-y-[50%] flex flex-col items-center justify-around w-full">
          <Button
            className="text-wrap text-xs w-11/12 bg-background/40 hover:bg-background/70 text-foreground mix-blend-lighter"
            onClick={handleWatched}
          >
            mark as {watched ? "unwatched" : "watched"}
          </Button>
        </div>
        <Button
          className="mt-[25%] -translate-y-[50%] text-xs w-11/12 h-6 top-40 bg-red-600/50 hover:bg-red-800/70 text-background mix-blend-lighter"
          onClick={handleRemove}
        >
          remove
        </Button>
      </div>
      <img
        src={image + item.poster_path}
        className="aspect-auto w-full rounded-md opacity-100"
      />
      <div className="flex items-center text-center flex-col">
        <p className="text-sm font-bold pb-0 w-full truncate">{item.title}</p>

        <p
          className={`flex justify-center my-2 w-full text-xs transition-all duration-300 text-white rounded-md mt-0 ${
            watched ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {watched ? "watched" : "unwatched"}
        </p>
      </div>
    </div>
  );
}

function ShowBox({
  item,
  className = "",
}: {
  item: TVType;
  className?: string;
}) {
  const [episode, setEpisode] = useState(1);
  const [season, setSeason] = useState(1);
  const [currSeasonEP, setCurrSeasonEP] = useState(1);

  const handleNextEP = () => {
    setEpisode((prevEp) => {
      if (prevEp + 1 > currSeasonEP) {
        setSeason((prevSeason) => prevSeason + 1);
        return 1;
      } else {
        return prevEp + 1;
      }
    }) as any;
  };

  const handlePrevEP = () => {
    setEpisode((prevEp) => {
      if (prevEp - 1 > 0) {
        return prevEp - 1;
      } else if (season > 1 && prevEp == 1) {
        setSeason((prevSeason) => prevSeason - 1);
        //get curr season ep count
        return currSeasonEP;
      } else {
        return prevEp;
      }
    }) as any;
  };

  const handleRemove = () => {};

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
          className="mt-[25%] -translate-y-[50%] text-xs w-11/12 h-6 bg-red-600/50 hover:bg-red-800/70 text-background mix-blend-lighter"
          onClick={handleRemove}
        >
          remove
        </Button>
      </div>
      <img
        src={image + item.poster_path}
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

function ListTitle({ title }: { title: string }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(title);
  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          asChild
          className="relative left-[50%] -translate-x-1/2 w-3/4 mb-4"
        >
          <Button variant="outline">{title}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="mt-4 flex flex-col items-center">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
              <Separator className="my-2 w-1/2" />
            </DialogTitle>
            <DialogDescription>
              <div className="text-sm font-bold text-center">Users in List</div>
              <ScrollArea className="w-[375px] whitespace-nowrap rounded-md">
                <div className="flex w-max space-x-2 p-2">
                  {MockUsers.map((item) => {
                    return (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Avatar>
                            <AvatarImage src={item.pfp} />
                            <AvatarFallback className="uppercase">
                              {item.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Remove from List</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    );
                  })}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="bg-muted hover:bg-muted/80 cursor-pointer">
                        <AvatarFallback>
                          <PlusIcon className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => console.log("add user")}>
                        Add User to List
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger
          asChild
          className="relative left-[50%] -translate-x-1/2 w-3/4 mb-4"
        >
          <Button variant="outline">{title}</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="flex flex-col items-center">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
            <Separator className="my-2 w-1/2" />
          </DrawerHeader>
          <DrawerDescription className="flex flex-col items-center">
            <div className="text-sm font-bold text-center">Users in List</div>
            <ScrollArea className="w-10/12 whitespace-nowrap rounded-md">
              <div className="flex w-full space-x-2 p-2">
                {MockUsers.map((item) => {
                  return (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Avatar>
                          <AvatarImage src={item.pfp} />
                          <AvatarFallback className="uppercase">
                            {item.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Remove from List</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                })}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="bg-muted hover:bg-muted/80 cursor-pointer">
                      <AvatarFallback>
                        <PlusIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => console.log("add user")}>
                      Add User to List
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </DrawerDescription>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
            <Button>Submit</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
}

function List({}: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center w-full p-4 gap-4 mx-auto">
      <Input placeholder="Search for a list"></Input>
      <Separator />
      <div>
        {MockData.lists.map((list) => {
          return (
            <div className="w-full ">
              <ListTitle title={list.name} />
              <div className="flex w-full">
                <div className="flex flex-row gap-1 flex-wrap content-center justify-center align-center">
                  {list.items.map((item) => {
                    return "seasons" in item ? (
                      <ShowBox
                        item={item as TVType}
                        className="sm:w-1/6 w-1/4"
                      />
                    ) : (
                      <MovieBox
                        item={item as MovieType}
                        className="sm:w-1/6 w-1/4"
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
