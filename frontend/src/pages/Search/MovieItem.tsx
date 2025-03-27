import { ResultsMovie } from "../../types/SearchType";

function MovieItem(item: ResultsMovie) {
  const {
    title,
    original_title,
    overview,
    poster_path,
    media_type,
    release_date,
    vote_average,
  }: ResultsMovie = item;
  const movie_year = release_date ? release_date.slice(0, 4) : "";

  return (
    <div className="relative p-2 rounded-md">
      <div className="flex flex-row">
        <p className="absolute top-2 right-1 text-foreground/70 text-sm">
          {media_type.slice(0, 3)}
        </p>
        <img
          src={poster_path}
          className="sm:w-28 w-24 fit rounded-md object-contain"
        />
        <div className="flex flex-col p-2 w-full">
          <p className="truncate w-64 sm:w-auto text-lg font-bold">{title}</p>
          {original_title != title && (
            <p className="truncate w-64 sm:w-auto text-xs text-foreground/70">
              {original_title}
            </p>
          )}
          <p className="text-wrap text-foreground line-clamp-3 text-base ">
            {overview}
          </p>
          <div className="flex-grow"></div>
          <div className="flex flex-row justify-between text-sm text-foreground/70">
            <p className="bottom-0 text-foreground/70">{movie_year}</p>
            <p className="text-foreground/70">
              {Number(vote_average).toString()} / 10
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieItem;
