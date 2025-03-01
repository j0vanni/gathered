export default interface SearchResponse {
  page: Number;
  results: ResultsShow[];
}

export interface ResultsShow {
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

export interface ResultsMovie {
  backdrop_path: string;
  id: Number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: string;
  adult: boolean;
  original_language: string;
  genre_ids: Number[];
  popularity: Number;
  release_date: string;
  video: boolean;
  vote_average: Number;
  vote_count: Number;
}
