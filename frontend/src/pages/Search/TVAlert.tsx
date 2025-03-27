import { useIsMobile } from "@/hooks/use-mobile";
import TVType from "@/types/TVType";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function TVAlert(tvDetails: TVType) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <DrawerHeader>
        <DrawerTitle>
          <div className="flex flex-row">
            <p className="uppercase">{tvDetails.name}</p>
            <p className="ml-auto text-xs text-foreground/70">
              {tvDetails.status}
            </p>
          </div>
        </DrawerTitle>
        <DrawerDescription>
          <div className="flex flex-row gap-x-1">
            {tvDetails.genres.map((gen) => {
              return (
                <div className="bg-primary/70 text-foreground rounded-md p-1 text-xs">
                  {gen.name}
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-foreground">{tvDetails.overview}</p>
          <Accordion type="single" collapsible>
            <AccordionItem value="seasons" className="text-foreground/70">
              <AccordionTrigger>
                {tvDetails.number_of_seasons} Seasons
              </AccordionTrigger>
              {tvDetails.seasons.map((season) => (
                <AccordionContent>
                  <div className="flex flex-row">
                    {season.season_number}: {season.name} {" - "}
                    {season.episode_count} episodes
                    <p className="ml-auto">{season.air_date?.slice(0, 4)}</p>
                  </div>
                </AccordionContent>
              ))}
            </AccordionItem>
          </Accordion>
        </DrawerDescription>
      </DrawerHeader>
    );
  } else {
    return (
      <DialogHeader>
        <DialogTitle>
          <div className="flex flex-row">
            <p className="uppercase">{tvDetails.name}</p>
            <p className="ml-auto text-xs text-foreground/70">
              {tvDetails.status}
            </p>
          </div>
        </DialogTitle>
        <DialogDescription>
          <div className="flex flex-row gap-x-1">
            {tvDetails.genres.map((gen) => {
              return (
                <div className="bg-primary/70 text-foreground rounded-md p-1 text-xs">
                  {gen.name}
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-foreground">{tvDetails.overview}</p>
          <Accordion type="single" collapsible>
            <AccordionItem value="seasons" className="text-foreground/70">
              <AccordionTrigger>
                {tvDetails.number_of_seasons} Seasons
              </AccordionTrigger>
              {tvDetails.seasons.map((season) => (
                <AccordionContent>
                  <div className="flex flex-row">
                    {season.season_number}: {season.name} {" - "}
                    {season.episode_count} episodes
                    <p className="ml-auto">{season.air_date?.slice(0, 4)}</p>
                  </div>
                </AccordionContent>
              ))}
            </AccordionItem>
          </Accordion>
        </DialogDescription>
      </DialogHeader>
    );
  }
}

export default TVAlert;
