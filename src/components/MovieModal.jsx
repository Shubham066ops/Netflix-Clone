import React, { useState, useEffect } from 'react';
import { getMovieDetails } from '../services/api';
import { TMDB_IMAGE_BASE_URL } from '../services/api';

const MovieModal = ({ movieId, isOpen, onClose }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && movieId) {
      const fetchMovieDetails = async () => {
        try {
          setLoading(true);
          const details = await getMovieDetails(movieId);
          setMovieDetails(details);
          setError(null);
        } catch (err) {
          setError('Failed to fetch movie details');
        } finally {
          setLoading(false);
        }
      };

      fetchMovieDetails();
    }
  }, [isOpen, movieId]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const imagePath = movieDetails?.poster_path || movieDetails?.backdrop_path;
  const poster = imagePath
    ? `${TMDB_IMAGE_BASE_URL}/w500${imagePath}`
    : '/placeholder-movie.jpg';
  const title = movieDetails?.title || movieDetails?.name || 'Untitled';
  const year = (movieDetails?.release_date || movieDetails?.first_air_date || '').slice(0, 4);
  const runtime = movieDetails?.runtime ? `${movieDetails.runtime} min` : undefined;
  const genres = Array.isArray(movieDetails?.genres)
    ? movieDetails.genres.map((g) => g.name).join(', ')
    : '';
  const rating = typeof movieDetails?.vote_average === 'number'
    ? movieDetails.vote_average.toFixed(1)
    : 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto bg-netflix-bg rounded-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-red-500 text-center">
              <p className="text-xl mb-4">Error</p>
              <p>{error}</p>
            </div>
          </div>
        ) : movieDetails ? (
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3">
              <img
                src={poster}
                alt={title}
                className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"%3E%3Crect fill="%23333" width="300" height="450"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
            
            <div className="md:w-2/3 p-6">
              <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {year ? <span className="text-gray-300">{year}</span> : null}
                {year ? <span className="text-gray-300">•</span> : null}
                {runtime ? <span className="text-gray-300">{runtime}</span> : null}
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white font-semibold">{rating}</span>
                  <span className="text-gray-400">/10</span>
                </div>
                
                {movieDetails?.vote_count ? (
                  <div className="text-gray-300">{movieDetails.vote_count} votes</div>
                ) : null}
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">Plot</h3>
                <p className="text-gray-300 leading-relaxed">{movieDetails.overview}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-1">Genres</h4>
                  <p className="text-white">{genres || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-1">Status</h4>
                  <p className="text-white">{movieDetails.status || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-1">Release Date</h4>
                  <p className="text-white">{movieDetails.release_date || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-1">Original Language</h4>
                  <p className="text-white">{movieDetails.original_language || 'N/A'}</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button className="bg-netflix-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  <span>Play Now</span>
                </button>
                <button className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200">
                  Add to Watchlist
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MovieModal;
