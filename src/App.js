import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating.js";
import { useMovies } from "./useMovies.js";
import { useLocalStorageState } from "./useLocalStorageState.js";
import { useKey } from "./useKey.js";

const API_KEY = "79d3ecf5";
const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&`;

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  // Calling Custom hooks
  const { movies, isLoading, error } = useMovies(query, API_URL);
  const [watched, setWatched] = useLocalStorageState([], "watched");

  // Functions ------------------------------------------------
  function handleRemoveMoviesFromWatched(id) {
    setWatched((c) => c.filter((el) => el.imdbID !== id));
  }

  function handleSetWatched(movie) {
    setWatched((c) => [...c, movie]);
  }

  function handleMovieSelection(id) {
    // Check if same movie is selected again
    if (id === selectedMovieId) {
      handleCloseMovie();
      return;
    }
    setSelectedMovieId(id);
  }

  function handleCloseMovie() {
    document.title = "Use Popcorn";
    setSelectedMovieId(null);
  }

  // Example of Component composition
  return (
    <>
      <NavBar>
        <SearchBar query={query} setQuery={setQuery} />
        <SearchResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loading />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && error === "" && (
            <MovieList
              movies={movies}
              handleMovieSelection={handleMovieSelection}
            />
          )}
        </Box>

        <Box>
          {selectedMovieId ? (
            <MovieDetails
              selectedMovieId={selectedMovieId}
              handleCloseMovie={handleCloseMovie}
              handleSetWatched={handleSetWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                watched={watched}
                handleRemoveMoviesFromWatched={handleRemoveMoviesFromWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loading() {
  return <p className="loader">Loading.....</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>❌</span> {message}
    </p>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function SearchBar({ query, setQuery }) {
  // useRef hook is used to store and persist data between renders. Only diff from useState is the fact changing ref value wont re render the component
  const inputEl = useRef(null);

  // Effect to handle enter event
  useEffect(function () {
    document.addEventListener("keydown", function (e) {
      if (document.activeElement === inputEl.current) return;
      if (e.code === "Enter") {
        // Focus on the search text only when the current active element is not the serach bar
        inputEl.current.focus();
        inputEl.current.value = "";
      }
    });
  }, []);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      ref={inputEl}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function SearchResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen1, setIsOpen1] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  );
}

function MovieList({ movies, handleMovieSelection }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          handleMovieSelection={handleMovieSelection}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, handleMovieSelection }) {
  return (
    <li onClick={() => handleMovieSelection(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedList({ watched, handleRemoveMoviesFromWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          handleRemoveMoviesFromWatched={handleRemoveMoviesFromWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, handleRemoveMoviesFromWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => handleRemoveMoviesFromWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}

function MovieDetails({
  selectedMovieId,
  handleCloseMovie,
  handleSetWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  // useRef is used to set values that persists between renders and on change doesnot triggers a re render. This can also be used fopr backend values.
  const countRef = useRef(0);

  let isInWatchedList = false;
  let watchedRating = 0;

  watched.forEach((el) => {
    if (el.imdbID === selectedMovieId) {
      isInWatchedList = true;
      watchedRating = el.userRating;
    }
  });

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  useKey("Escape", handleCloseMovie);

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);

        const resp = await fetch(`${API_URL}i=${selectedMovieId}`);
        const response = await resp.json();

        setMovie(response);

        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedMovieId]
  );

  // Update the title using useEffects
  useEffect(
    function () {
      document.title = `Movie | ${title}`;
    },
    [title]
  );

  useEffect(
    function () {
      if (userRating) countRef.current++;
    },
    [userRating]
  );

  function handleAddtoList() {
    const movieWatched = {
      imdbID: selectedMovieId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      ratingCounter: countRef.current,
    };

    handleSetWatched(movieWatched);

    // Close the movie details
    handleCloseMovie();
  }

  return (
    <div className="details">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={handleCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {isInWatchedList ? (
                <p>
                  You rated with movie {watchedRating} <span>⭐️</span>
                </p>
              ) : (
                <>
                  <StarRating
                    maxRatings={10}
                    size={24}
                    onRatingSelection={setUserRating}
                    defaultRating={0}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAddtoList}>
                      + Add to list
                    </button>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
