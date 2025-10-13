export default interface Movie{
    adult: boolean,
    backdrop_path: string | null;
    genre_ids: number[];
    id: number;
    media_type: string;
    name: string | null;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string | null;
    title: string | null;
    video: boolean;
    vote_average: number;
    vote_count: number;
}