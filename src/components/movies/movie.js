import React, { useEffect, useState } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import Input from "../UIElements/input";

import "./movie.css";

const { REACT_APP_AUTHORIZATION_HEADER } = process.env;

const Movie = () => {
  const [movieDetails, setMovieDetails] = useState({});
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [disableInput, setDisableInput] = useState(false);
  const [movieTitleSelected, setMovieTitleSelected] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);

  // updates the input fields value
  const handleInputChange = (e) => {
    const { value } = e.target;
    setInputValue(value);

    //  displays the searched movies
    showSearchedMovies(value);
  };

  // shows the movies the user search for
  const showSearchedMovies = (value) => {
    // filters the movies based on the users input
    const userSearchResults = allMovies.filter((movie) =>
      movie.title.toLowerCase().includes(value.toLowerCase())
    );

    // updates the found movies from the users search
    setMovies(userSearchResults);

    // if the search value is empty show all movies
    value === "" && setMovies(allMovies);
  };

  // Brings user back to the movies they searched for
  const handleBackBtnClick = () => {
    setMovieDetails({});
    setDisableInput(false);
    setMovieTitleSelected("");
    showSearchedMovies(inputValue);
  };

  // get all movie titles
  const getMovieTitles = async (title) => {
    let res;
    try {
      res = await axios.get("/movies/titles/", {
        headers: {
          Authorization: REACT_APP_AUTHORIZATION_HEADER,
        },
      });

      // Promise resolved
      setShowSpinner(false);
      setAllMovies(res.data);
      setMovies(res.data);
    } catch (err) {
      console.error("The promise was rejected!", err);
    }
  };

  // Get's specific movie details when a movie is clicked
  const getMovieDetails = async (id, title) => {
    // disable input
    setDisableInput(true);
    setMovieTitleSelected(title);

    let res;
    try {
      res = await axios.get(`/movies/${id}`, {
        headers: {
          Authorization: REACT_APP_AUTHORIZATION_HEADER,
        },
      });

      // promise resolved
      setMovieDetails(res.data);
    } catch (err) {
      console.error("The promise was rejected!", err);
    }
  };

  // template for movie sub details
  const movieSubDetails = (property, value, notFoundMsg) => {
    return (
      <p>
        {property}: <span>{value ? value : notFoundMsg}</span>{" "}
      </p>
    );
  };

  useEffect(() => {
    // shows spinner initially if no movies have been retrieved yet
    movies.length === 0 ? setShowSpinner(true) : setShowSpinner(false);

    // initially retrieves all movies to display to the user
    getMovieTitles();
  }, [movies.length]);

  return (
    <>
      <h1>Movie List</h1>
      <Container fluid>
        <Row>
          <Col>
            {/* Input */}
            <Input
              inputValue={inputValue}
              handleInputChange={handleInputChange}
              disabled={disableInput} // disabled only when viewing specific movie details
            />
          </Col>
        </Row>

        <Row className="my-5">
          <Col>
            {/* All movies */}
            {movies.length > 0 && !movieDetails.hasOwnProperty("id") && (
              <ul className="movies-wrapper">
                {movies.map((movie, index) => {
                  const { id, title } = movie;
                  return (
                    <li
                      key={id}
                      className="movie-title-li"
                      onClick={() => getMovieDetails(id, title)}
                    >
                      {title}
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Loading Spinner */}
            {showSpinner && <Spinner animation="grow" />}

            {/* Alert for movies not found */}
            {movies.length === 0 &&
              !movieDetails.hasOwnProperty("id") &&
              !showSpinner && (
                <Alert
                  variant="danger"
                  style={{ width: "73%" }}
                  className="mx-auto"
                >
                  No movies found!
                </Alert>
              )}

            {/* Movie Properties */}
            {movieDetails.hasOwnProperty("id") && (
              <div className="movie-details-wrapper">
                {/* Movie title */}
                <h4>
                  <span>
                    {" "}
                    <i
                      className="bi bi-arrow-left-circle my-2 mx-3"
                      onClick={handleBackBtnClick}
                    ></i>
                  </span>
                  {movieTitleSelected}
                </h4>

                {/* specific movie data */}
                <div className="movie-details">
                  <Row style={{}}>
                    <Col
                      className="px-2 py-2"
                      style={{
                        display: "flex",
                      }}
                      lg={6}
                      md={12}
                      sm={12}
                      xs={12}
                    >
                      <img
                        src={movieDetails.img}
                        alt={movieTitleSelected}
                        className="movie-img"
                      />
                    </Col>

                    <Col className="px-2 py-2" lg={6} md={12} sm={12} xs={12}>
                      {movieSubDetails(
                        "Description",
                        movieDetails.description,
                        "No found description"
                      )}
                      {movieSubDetails(
                        "Director",
                        movieDetails.director,
                        "No found director"
                      )}
                      {movieSubDetails(
                        "Stars",
                        movieDetails.stars,
                        "No found stars"
                      )}
                      {movieSubDetails(
                        "Genres",
                        movieDetails.genres,
                        "No found genres"
                      )}
                      {movieSubDetails(
                        "Rated",
                        movieDetails.rated,
                        "This movie is not rated"
                      )}
                      {movieSubDetails(
                        "Year",
                        movieDetails.year,
                        "No found year"
                      )}
                      {movieSubDetails(
                        "Rating",
                        movieDetails.rating,
                        "No rating found"
                      )}
                    </Col>
                  </Row>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Movie;