import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MovieGrid from '../components/MovieGrid';
import MovieModal from '../components/MovieModal';
import { getMoviesByCategory, searchMovies } from '../services/api';

const CATEGORY_CONFIG = {
  trending: { title: 'Trending', fetch: () => getMoviesByCategory('trending') },
  action: { title: 'Action', fetch: () => getMoviesByCategory('action') },
  comedy: { title: 'Comedy', fetch: () => getMoviesByCategory('comedy') },
  drama: { title: 'Drama', fetch: () => getMoviesByCategory('drama') },
  horror: { title: 'Horror', fetch: () => getMoviesByCategory('horror') },
  romance: { title: 'Romance', fetch: () => getMoviesByCategory('romance') },
  scifi: { title: 'Sci-Fi', fetch: () => getMoviesByCategory('sci-fi') },
};

const CategoryPage = () => {
  const { type } = useParams();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const categories = useMemo(
    () => [
      { key: 'home', label: 'Home' },
      { key: 'trending', label: 'Trending' },
      { key: 'action', label: 'Action' },
      { key: 'comedy', label: 'Comedy' },
      { key: 'drama', label: 'Drama' },
      { key: 'horror', label: 'Horror' },
      { key: 'romance', label: 'Romance' },
      { key: 'scifi', label: 'Sci-Fi' },
    ],
    [],
  );

  const activeCategory = CATEGORY_CONFIG[type] ? type : 'home';

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      setSearchResults([]);

      const cfg = CATEGORY_CONFIG[type];
      if (!cfg) {
        setMovies([]);
        setLoading(false);
        setError('Unknown category');
        return;
      }

      try {
        const data = await cfg.fetch();
        if (!cancelled) {
          setMovies(data?.results || []);
        }
      } catch (e) {
        if (!cancelled) setError('Failed to fetch movies');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [type]);

  const handleMovieClick = (movie) => {
    setSelectedMovieId(movie.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovieId(null);
  };

  const handleSearch = async (query) => {
    try {
      setIsSearching(true);
      const data = await searchMovies(query);
      setSearchResults(data?.results || []);
    } catch (e) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogoClick = () => {
    setSearchResults([]);
  };

  const title = CATEGORY_CONFIG[type]?.title || 'Category';

  return (
    <div className="min-h-screen bg-netflix-bg">
      <Navbar
        onSearch={handleSearch}
        onLogoClick={handleLogoClick}
        categories={categories}
        activeCategory={activeCategory}
      />

      <div className="pt-24 px-4 md:px-16 pb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">{title}</h1>

        {isSearching ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <MovieGrid movies={searchResults} onMovieClick={handleMovieClick} />
        ) : loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(18)].map((_, i) => (
              <div key={i} className="w-full h-72 bg-gray-700 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <MovieGrid movies={movies} onMovieClick={handleMovieClick} />
        )}
      </div>

      <MovieModal movieId={selectedMovieId} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default CategoryPage;
