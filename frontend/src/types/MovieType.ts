import { Genre } from "./Genre";
import { Language } from "./Language";
import { ProdCountry } from "./ProdCountry";
import { Production } from "./Production";

export default interface MovieType {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: Collection;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: Production[];
  production_countries: ProdCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: Language[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  watching?: {
    watched: boolean;
  };
  vote_average: number;
  vote_count: number;
}

interface Collection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}
