export default interface SearchResponse {
  page: Number;
  results: Results[];
}

export interface Results {
  backdrop_path: string;
  id: Number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string;
  media_type: string;
  adult: boolean;
  original_language: string;
  genre_ids: Number[];
  popularity: Number;
  first_air_date: string;
  vote_average: Number;
  origin_country: string[];
}
