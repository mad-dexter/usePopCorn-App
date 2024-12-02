import { useEffect, useState } from "react";

export function useMovies(query, API_URL) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      // Browser API to stop API race condition
      const controller = new AbortController();

      async function getMovieData() {
        // Start the loading
        setIsLoading(true);
        setError("");

        try {
          const resp = await fetch(`${API_URL}s=${query}`, {
            signal: controller.signal,
          });
          if (!resp.ok) {
            throw new Error("Something went wrong while fetching movie data");
          }
          const response = await resp.json();

          // Check if any movie are found
          if (response.Response === "False") {
            throw new Error("No data found of the search term");
          }
          setMovies(response.Search);
        } catch (e) {
          if (e.name !== "AbortError") {
            setError(e.message);
          }
        }

        // End the loading
        setIsLoading(false);
      }

      // Call the function on load
      if (query.length >= 4) {
        setError("");
        setMovies([]);
        // handleCloseMovie();
        getMovieData();
      }

      // Effect cleanup
      return function () {
        controller.abort();
      };
    },
    [query, API_URL]
  );

  return { movies, isLoading, error };
}
