import React, { useState, useEffect } from 'react';
import { getMoviesByCategory, TMDB_IMAGE_BASE_URL } from '../services/api';

const Hero = ({ onMovieClick }) => {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedMovie = async () => {
      try {
        const data = await getMoviesByCategory('trending');
        if (data?.results?.length) setFeaturedMovie(data.results[0]);
      } catch (error) {
        console.error('Error fetching featured movie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMovie();
  }, []);

  if (loading) {
    return (
      <div className="relative h-96 bg-gray-800 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>
    );
  }

  if (!featuredMovie) {
    return (
      <div className="relative h-96 bg-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">No featured movie available</div>
      </div>
    );
  }

  const imagePath = featuredMovie.backdrop_path || featuredMovie.poster_path;
  const poster = imagePath
    ? `${TMDB_IMAGE_BASE_URL}/w1280${imagePath}`
    : '/placeholder-movie.jpg';
  const title = featuredMovie?.title || featuredMovie?.name || 'Featured';
  const year = (featuredMovie?.release_date || featuredMovie?.first_air_date || '').slice(0, 4);

  return (
    <div 
      className="relative h-96 cursor-pointer group"
      onClick={() => onMovieClick(featuredMovie)}
    >
      <div className="absolute inset-0">
        <img
          src={poster}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"%3E%3Crect fill="%23333" width="1920" height="1080"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="24"%3ENo Image Available%3C/text%3E%3C/svg%3E';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>
      
      <div className="relative z-10 h-full flex items-center px-8 md:px-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {title}
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            {year}
          </p>
          <div className="flex space-x-4">
            <button className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              <span>Play</span>
            </button>
            <button className="bg-gray-600/80 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700/80 transition-colors duration-200 flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
