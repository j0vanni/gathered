import { useIsMobile } from "@/hooks/use-mobile";
import TVType from "@/types/TVType";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import api from "@/globals";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import ShowEditor from "./ShowEditor";

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
          className={`flex justify-center my-2 w-full text-xs transition-all duration-300 text-foreground rounded-md mt-0 bg-info`}
        >
          S{season} EP{episode}
        </p>
      </div>
    </div>
  );
}

export default ShowBox;
