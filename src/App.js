import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from './services/api';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const observer = useRef();
  const lastMovieElementRef = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber(prevPageNumber => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    async function loadMovies() {
      const response = await api.get(
        `/list_movies.json?limit=8&page=${pageNumber}`
      );

      setMovies(prevMovies => {
        return [
          ...new Set([
            ...prevMovies,
            ...response.data.data.movies.map(movie => movie)
          ])
        ];
      });

      setHasMore(response.data.data.movies.length > 0);

      setLoading(false);
    }

    loadMovies();
  }, [pageNumber]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className='container'>
      <h1 className='text-primary mb-3'>YTS Movies</h1>

      <div className='row'>
        {movies.map((movie, index) => {
          if (movies.length === index + 1) {
            return (
              <div className='col-3'>
                <div
                  ref={lastMovieElementRef}
                  className='card'
                  style={{ marginBottom: '10px', maxWidth: '14em' }}
                >
                  <img
                    src={movie.medium_cover_image}
                    alt={movie.medium_cover_image}
                    className='card-img-top'
                  />
                  <div className='card-body'>
                    <h5 className='card-title'>{movie.title}</h5>
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div className='col-3'>
                <div
                  ref={lastMovieElementRef}
                  className='card'
                  style={{ marginBottom: '10px', maxWidth: '14em' }}
                >
                  <img
                    src={movie.medium_cover_image}
                    alt={movie.medium_cover_image}
                    className='card-img-top'
                  />
                  <div className='card-body'>
                    <h5 className='card-title'>{movie.title}</h5>
                  </div>
                </div>
              </div>
            );
          }
        })}
        <div>{loading && 'Loading...'}</div>
      </div>
    </div>
  );
}
