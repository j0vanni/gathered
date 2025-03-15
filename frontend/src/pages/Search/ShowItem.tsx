import { ResultsShow } from "../../types/SearchType";
import ReactCountryFlag from "react-country-flag";

function ShowItem(data: ResultsShow) {
  const {
    name,
    original_name,
    overview,
    poster_path,
    media_type,
    first_air_date,
    vote_average,
    origin_country,
  }: ResultsShow = data;
  const air_year = first_air_date ? first_air_date.slice(0, 4) : "";

  return (
    <div className="relative p-2 hover:bg-black/5 rounded-md">
      <div className="flex flex-row">
        {origin_country && origin_country.length > 0 && (
          <>
            <ReactCountryFlag
              countryCode={origin_country[0]}
              svg
              className="absolute top-2 right-2"
            />
            <p className="absolute top-6 right-2.5 text-black/50 text-sm">
              {media_type}
            </p>
          </>
        )}
        <img
          src={poster_path}
          className="sm:w-28 w-24 fit rounded-md object-contain"
        />
        <div className="flex flex-col p-2 w-full">
          <p className="truncate w-64 sm:w-auto text-lg">{name}</p>
          {original_name != name && (
            <p className="truncate w-64 sm:w-auto text-xs text-black/50">
              {original_name}
            </p>
          )}
          <p className="text-wrap text-foreground line-clamp-3 text-base">
            {overview}
          </p>
          <div className="flex-grow"></div>
          <div className="flex flex-row justify-between text-sm text-black/50">
            <p className="bottom-0">{air_year}</p>
            <p>{Number(vote_average).toString()} / 10</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowItem;
