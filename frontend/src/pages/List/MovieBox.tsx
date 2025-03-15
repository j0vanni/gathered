import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import api from "@/globals";
import { useIsMobile } from "@/hooks/use-mobile";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import MovieType from "../../types/MovieType";
import MovieEditor from "./MovieEditor";
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

export default MovieBox;
