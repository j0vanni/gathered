import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import MovieType from "@/types/MovieType";
import { NumericFormat } from "react-number-format";

function MovieAlert(movieDetails: MovieType) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <DrawerHeader>
        <DrawerTitle>
          <div className="flex flex-row">
            <p className="uppercase truncate max-w-52 pr-2">
              {movieDetails.title}
            </p>
            <p className="ml-1 text-xs mt-2 text-black/50">
              {movieDetails.runtime} minutes
            </p>
            <p className="ml-auto text-xs text-black/50">
              {movieDetails.status} {movieDetails.release_date.slice(0, 4)}
            </p>
          </div>
        </DrawerTitle>
        <DrawerDescription>
          <div className="flex flex-row gap-x-1">
            {movieDetails.genres.map((gen) => {
              return (
                <div className="bg-foreground text-background rounded-md p-1 text-xs">
                  {gen.name}
                </div>
              );
            })}
          </div>
          <div className="flex flex-row mt-2">
            {movieDetails.budget > 0 ? (
              <NumericFormat
                value={movieDetails.budget}
                thousandSeparator=","
                className="bg-background mr-auto select-none"
                prefix="bud. "
                displayType="text"
              />
            ) : (
              <p className="bg-background mr-auto select-none">bud. ?</p>
            )}
            {movieDetails.revenue > 0 ? (
              <NumericFormat
                value={movieDetails.revenue}
                thousandSeparator=","
                className="bg-background ml-auto text-right select-none"
                prefix="rev. "
                displayType="text"
              />
            ) : (
              <p className="bg-background ml-auto text-right select-none">
                rev. ?
              </p>
            )}
          </div>
          <p className="my-2 text-left">{movieDetails.overview}</p>
        </DrawerDescription>
      </DrawerHeader>
    );
  } else {
    return (
      <DialogHeader>
        <DialogTitle>
          <div className="flex flex-row">
            <p className="uppercase truncate max-w-64 pr-2">
              {movieDetails.title}
            </p>
            <p className="ml-1 text-xs mt-2 text-black/50">
              {movieDetails.runtime} minutes
            </p>
            <p className="ml-auto text-xs text-black/50">
              {movieDetails.status} {movieDetails.release_date.slice(0, 4)}
            </p>
          </div>
        </DialogTitle>
        <DrawerDescription>
          <div className="flex flex-row gap-x-1">
            {movieDetails.genres.map((gen) => {
              return (
                <div className="bg-foreground text-background rounded-md p-1 text-xs">
                  {gen.name}
                </div>
              );
            })}
          </div>
          <div className="flex flex-row mt-2">
            {movieDetails.budget > 0 ? (
              <NumericFormat
                value={movieDetails.budget}
                thousandSeparator=","
                className="bg-background mr-auto"
                prefix="bud. "
                displayType="text"
              />
            ) : (
              <p className="bg-background mr-auto select-none">bud. ?</p>
            )}
            {movieDetails.revenue > 0 ? (
              <NumericFormat
                value={movieDetails.revenue}
                thousandSeparator=","
                className="bg-background ml-auto text-right select-none"
                prefix="rev. "
                displayType="text"
              />
            ) : (
              <p className="bg-background ml-auto text-right select-none">
                rev. ?
              </p>
            )}
          </div>
          <p className="my-2 text-left">{movieDetails.overview}</p>
        </DrawerDescription>
      </DialogHeader>
    );
  }
}

export default MovieAlert;
