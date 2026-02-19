import React from 'react';
import { TMDB_IMAGE_BASE_URL } from '../services/api';

const MovieCard = ({ movie, onClick }) => {
  const poster = movie?.poster_path
    ? `${TMDB_IMAGE_BASE_URL}/w342${movie.poster_path}`
    : '/placeholder-movie.jpg';
  const title = movie?.title || movie?.name || 'Untitled';
  const year = (movie?.release_date || movie?.first_air_date || '').slice(0, 4);
  
  return (
    <div 
      className="flex-shrink-0 w-48 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10"
      onClick={() => onClick(movie)}
    >
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={poster}
          alt={title}
          className="w-full h-72 object-cover"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"%3E%3Crect fill="%23333" width="300" height="450"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="text-white">
            <h3 className="font-semibold text-sm line-clamp-2">{title}</h3>
            <p className="text-xs text-gray-300">{year}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
