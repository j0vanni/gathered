import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import api from "@/globals";
import { ResultsMovie, ResultsShow } from "../../types/SearchType";
import MovieType from "@/types/MovieType";
import TVType from "@/types/TVType";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ShowItem from "./ShowItem";
import MovieItem from "./MovieItem";
import TVAlert from "./TVAlert";
import MovieAlert from "./MovieAlert";

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
  const [details, setDetails] = useState<any>(null);
  const [loadedDetails, setLoadedDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setLoadedDetails(false);
    setDetails(null);
  };

  const handleOpen = async () => {
    setIsLoading(true);
    setOpen(true);
    try {
      const url =
        item.media_type === "tv"
          ? `${api}/details/tv?id=${item.id}`
          : `${api}/details/movie?id=${item.id}`;
      const response = await axios.get(url, {
        withCredentials: true,
      });
      setDetails(response.data);
      setLoadedDetails(true);
    } catch (error) {
      console.error("Error fetching details:", error);
      toast.error("Failed to load details");
      setOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDetails = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      );
    } else if (details && loadedDetails) {
      return item.media_type === "tv" ? (
        <TVAlert {...details} />
      ) : (
        <MovieAlert {...details} />
      );
    }
    return null;
  };

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleClose();
          }
        }}
      >
        <DrawerTrigger className="w-full text-left" onClick={handleOpen}>
          {item.media_type === "tv" ? (
            <ShowItem {...(item as ResultsShow)} />
          ) : (
            <MovieItem {...(item as ResultsMovie)} />
          )}
        </DrawerTrigger>
        <DrawerContent className="w-full rounded-md">
          {renderDetails()}
          {loadedDetails && (
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
          )}
        </DrawerContent>
      </Drawer>
    );
  } else {
    return (
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleClose();
          }
          setOpen(isOpen);
        }}
      >
        <DialogTrigger className="w-full text-left" onClick={handleOpen}>
          {item.media_type === "tv" ? (
            <ShowItem {...(item as ResultsShow)} />
          ) : (
            <MovieItem {...(item as ResultsMovie)} />
          )}
        </DialogTrigger>
        <DialogContent className="w-full rounded-md [&>button]:hidden">
          {renderDetails()}
          {loadedDetails && (
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
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={handleAddToList}>Add to List</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );
  }
}

export default SearchItem;
