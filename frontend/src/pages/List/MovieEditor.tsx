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
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle className="text-center">{movieDetails.title}</DrawerTitle>
        <div className="flex flex-row flex-wrap gap-2 justify-center">
          {movieDetails.genres.map((genre) => (
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
        <div className="flex flex-row w-full gap-4">
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
      </DrawerDescription>
      <DrawerFooter className="flex flex-row justify-between">
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
      </DrawerFooter>
    </DrawerContent>
  ) : (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-center">{movieDetails.title}</DialogTitle>
        <div className="flex flex-row flex-wrap gap-2 justify-center">
          {movieDetails.genres.map((genre) => (
            <div
              key={genre.id}
              className="bg-foreground text-background rounded-md p-1 text-xs h-6 truncate"
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

export default MovieEditor;
