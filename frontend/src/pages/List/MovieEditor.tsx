import { Button } from "@/components/ui/button";
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
import { useIsMobile } from "@/hooks/use-mobile";
import MovieType from "@/types/MovieType";
import { Separator } from "@radix-ui/react-separator";

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

  return isMobile ? (
    <DrawerContent className="bg-muted">
      <Separator className="w-2/5 h-0.5 mx-auto bg-border bottom-2 relative" />

      <DrawerHeader>
        <DrawerTitle className="text-center text-foreground">
          {movieDetails.title}
        </DrawerTitle>
        <div className="flex flex-row flex-wrap gap-2 justify-center">
          {movieDetails.genres.map((genre) => (
            <div
              key={genre.id}
              className="bg-primary/70 text-foreground rounded-md p-1 text-xs h-6 truncate"
            >
              {genre.name}
            </div>
          ))}
        </div>
      </DrawerHeader>
      <DrawerDescription className="w-11/12 mx-auto">
        <div className="flex flex-row w-full gap-4">
          <img
            src={movieDetails.poster_path}
            className="w-3/5 object-cover rounded-md shadow-lg overflow-hidden mx-auto aspect-2/3"
            alt={movieDetails.title}
          />
          <p className="line-clamp-[10] w-11/12 text-foreground/70">
            {movieDetails.overview}
          </p>
        </div>
        <div className="flex flex-row items-center justify-center my-4 text-foreground">
          {movieDetails.watching?.watched ? "Watched" : "Not Watched"}
        </div>
      </DrawerDescription>
      <DrawerFooter className="flex flex-row justify-between">
        <Button
          variant="destructive"
          onClick={handleRemoveItem}
          className="bg-error/70 hover:bg-error/80"
        >
          Remove from List
        </Button>
        {watched ? (
          <Button
            variant="outline"
            onClick={() => handleOK(false)}
            className="border-border"
          >
            Unwatch
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => handleOK(true)}
            className="border-border"
          >
            Watch
          </Button>
        )}
      </DrawerFooter>
    </DrawerContent>
  ) : (
    <DialogContent className="bg-muted">
      <DialogHeader>
        <DialogTitle className="text-center text-foreground">
          {movieDetails.title}
        </DialogTitle>
        <div className="flex flex-row flex-wrap gap-2 justify-center">
          {movieDetails.genres.map((genre) => (
            <div
              key={genre.id}
              className="bg-primary/70 text-foreground rounded-md p-1 text-xs h-6 truncate"
            >
              {genre.name}
            </div>
          ))}
        </div>
      </DialogHeader>
      <DialogDescription>
        <div className="flex flex-row gap-4">
          <img
            src={movieDetails.poster_path}
            className="w-2/5 object-cover rounded-md shadow-lg overflow-hidden mx-auto aspect-2/3"
            alt={movieDetails.title}
          />
          <p className="line-clamp-[10] w-11/12 text-foreground">
            {movieDetails.overview}
          </p>
        </div>
        <div className="flex flex-row items-center justify-center my-4 text-foreground">
          {movieDetails.watching?.watched ? "Watched" : "Not Watched"}
        </div>
        <div className="flex flex-row items-center justify-around my-4 text-foreground/60">
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
        <div className="flex flex-row items-center justify-between my-4 text-foreground/60">
          <p className="text-xs">Released {movieDetails.release_date}</p>
          <p className="text-xs">
            Rating {movieDetails.vote_average.toFixed(1)} -{" "}
            {movieDetails.vote_count} votes
          </p>
          <p className="text-xs">Runtime {movieDetails.runtime} minutes</p>
        </div>
      </DialogDescription>
      <DialogFooter>
        <Button
          variant="destructive"
          onClick={handleRemoveItem}
          className="bg-error/70 hover:bg-error/80"
        >
          Remove from List
        </Button>
        {watched ? (
          <Button
            variant="outline"
            onClick={() => handleOK(false)}
            className="border-border"
          >
            Unwatch
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => handleOK(true)}
            className="border-border"
          >
            Watch
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
}

export default MovieEditor;
