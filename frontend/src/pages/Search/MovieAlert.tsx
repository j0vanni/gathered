import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import MovieType from "@/types/MovieType";
import { DialogDescription } from "@radix-ui/react-dialog";
import { NumericFormat } from "react-number-format";

function MovieAlert(movieDetails: MovieType) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <DrawerHeader className="text-foreground">
        <DrawerTitle className="text-foreground">
          <div className="flex flex-row">
            <p className="uppercase truncate max-w-52 pr-2">
              {movieDetails.title}
            </p>
            <p className="ml-1 text-xs mt-2 text-foreground/70">
              {movieDetails.runtime} minutes
            </p>
            <p className="ml-auto text-xs text-foreground/70">
              {movieDetails.status} {movieDetails.release_date.slice(0, 4)}
            </p>
          </div>
        </DrawerTitle>
        <DrawerDescription className="text-foreground">
          <div className="flex flex-row gap-x-1">
            {movieDetails.genres.map((gen) => {
              return (
                <div
                  key={gen.id || gen.name}
                  className="bg-primary/70 text-foreground rounded-md p-1 text-xs"
                >
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
                className="text-foreground mr-auto select-none"
                prefix="bud. "
                displayType="text"
              />
            ) : (
              <p className="text-foreground mr-auto select-none">bud. ?</p>
            )}
            {movieDetails.revenue > 0 ? (
              <NumericFormat
                value={movieDetails.revenue}
                thousandSeparator=","
                className="text-foreground ml-auto text-right select-none"
                prefix="rev. "
                displayType="text"
              />
            ) : (
              <p className="text-foreground ml-auto text-right select-none">
                rev. ?
              </p>
            )}
          </div>
          <p className="my-2 text-foreground text-left">
            {movieDetails.overview}
          </p>
        </DrawerDescription>
      </DrawerHeader>
    );
  } else {
    return (
      <DialogHeader className="text-foreground">
        <DialogTitle className="text-foreground">
          <div className="flex flex-row">
            <p className="uppercase truncate max-w-64 pr-2">
              {movieDetails.title}
            </p>
            <p className="ml-1 text-xs mt-2 text-foreground/70">
              {movieDetails.runtime} minutes
            </p>
            <p className="ml-auto text-xs text-foreground/70">
              {movieDetails.status} {movieDetails.release_date.slice(0, 4)}
            </p>
          </div>
        </DialogTitle>
        <DialogDescription className="text-foreground">
          <div className="flex flex-row gap-x-1">
            {movieDetails.genres.map((gen) => {
              return (
                <div
                  key={gen.id || gen.name}
                  className="bg-primary/70 text-foreground rounded-md p-1 text-xs"
                >
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
                className="text-foreground mr-auto"
                prefix="bud. "
                displayType="text"
              />
            ) : (
              <p className="text-foreground mr-auto select-none">bud. ?</p>
            )}
            {movieDetails.revenue > 0 ? (
              <NumericFormat
                value={movieDetails.revenue}
                thousandSeparator=","
                className="text-foreground ml-auto text-right select-none"
                prefix="rev. "
                displayType="text"
              />
            ) : (
              <p className="text-foreground ml-auto text-right select-none">
                rev. ?
              </p>
            )}
          </div>
          <p className="my-2 text-foreground text-left">
            {movieDetails.overview}
          </p>
        </DialogDescription>
      </DialogHeader>
    );
  }
}

export default MovieAlert;
