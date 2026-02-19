import axios from 'axios';

const API_KEY = '348add367caa0f0a16a0a4e4b7db238f';
const BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const api = axios.create({
  baseURL: BASE_URL,
});

const withKey = (params = {}) => ({
  api_key: API_KEY,
  language: 'en-US',
  ...params,
});

const GENRES = {
  action: 28,
  comedy: 35,
  drama: 18,
  horror: 27,
  romance: 10749,
  'sci-fi': 878,
};

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await api.get('/search/movie', {
      params: withKey({
        query,
        page,
        include_adult: false,
      }),
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}`, {
      params: withKey({
        append_to_response: 'videos,credits',
      }),
    });
    return response.data;
  } catch (error) {
    console.error('Error getting movie details:', error);
    throw error;
  }
};

export const getMoviesByCategory = async (category, page = 1) => {
  try {
    if (category === 'trending') {
      const response = await api.get('/trending/movie/week', {
        params: withKey({ page }),
      });
      return response.data;
    }

    if (category === 'marvel') {
      const response = await api.get('/discover/movie', {
        params: withKey({
          page,
          sort_by: 'popularity.desc',
          with_companies: 420,
        }),
      });
      return response.data;
    }

    if (GENRES[category]) {
      const response = await api.get('/discover/movie', {
        params: withKey({
          page,
          sort_by: 'popularity.desc',
          with_genres: GENRES[category],
        }),
      });
      return response.data;
    }

    const response = await api.get('/search/movie', {
      params: withKey({
        query: category,
        page,
        include_adult: false,
      }),
    });
    return response.data;
  } catch (error) {
    console.error('Error getting movies by category:', error);
    throw error;
  }
};
