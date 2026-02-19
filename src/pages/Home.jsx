import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import MovieModal from '../components/MovieModal';
import { searchMovies } from '../services/api';

const Home = () => {
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const categories = [
    { key: 'home', label: 'Home' },
    { key: 'trending', label: 'Trending' },
    { key: 'action', label: 'Action' },
    { key: 'comedy', label: 'Comedy' },
    { key: 'drama', label: 'Drama' },
    { key: 'horror', label: 'Horror' },
    { key: 'romance', label: 'Romance' },
    { key: 'scifi', label: 'Sci-Fi' },
  ];

  const handleMovieClick = (movie) => {
    setSelectedMovieId(movie.id);
    setIsModalOpen(true);
  };

  const handleSearch = async (query) => {
    try {
      setIsSearching(true);
      const data = await searchMovies(query);
      setSearchResults(data?.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogoClick = () => {
    setSearchResults([]);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovieId(null);
  };

  return (
    <div className="min-h-screen bg-netflix-bg">
      <Navbar
        onSearch={handleSearch}
        onLogoClick={handleLogoClick}
        categories={categories}
      />
      
      <div className="pt-16">
        {isSearching ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="px-4 md:px-16 py-8">
            <h2 className="text-2xl font-bold mb-6 text-white">Search Results</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {searchResults.map((movie) => {
                const title = movie?.title || movie?.name || 'Untitled';
                const year = (movie?.release_date || movie?.first_air_date || '').slice(0, 4);
                const poster = movie?.poster_path
                  ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                  : '/placeholder-movie.jpg';

                return (
                  <div
                    key={movie.id}
                    className="cursor-pointer transform transition-all duration-300 hover:scale-105"
                    onClick={() => handleMovieClick(movie)}
                  >
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={poster}
                        alt={title}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"%3E%3Crect fill="%23333" width="300" height="450"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                        <div className="text-white">
                          <h3 className="font-semibold text-xs line-clamp-2">{title}</h3>
                          <p className="text-xs text-gray-300">{year}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <Hero onMovieClick={handleMovieClick} />

            <div className="px-4 md:px-16 py-8">
              <MovieRow title="Trending Movies" category="trending" onMovieClick={handleMovieClick} />
              <MovieRow title="Action Movies" category="action" onMovieClick={handleMovieClick} />
              <MovieRow title="Comedy Movies" category="comedy" onMovieClick={handleMovieClick} />
              <MovieRow title="Drama Movies" category="drama" onMovieClick={handleMovieClick} />
              <MovieRow title="Horror Movies" category="horror" onMovieClick={handleMovieClick} />
              <MovieRow title="Romance Movies" category="romance" onMovieClick={handleMovieClick} />
              <MovieRow title="Sci-Fi Movies" category="sci-fi" onMovieClick={handleMovieClick} />
            </div>
          </>
        )}
      </div>

      <MovieModal
        movieId={selectedMovieId}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default Home;
