import React, { useState, useEffect } from "react";
import "../Busqueda/Busqueda.css";
import { fetchData } from "../../Utilities/Utilities";
import { Link } from 'react-router-dom';
import Movie from "../Movie/Movie.jsx";


const Busqueda = () => {

  // Constantes para funciones y peticiones
  const apiKey = "6142b829afb94b21cca756ad3d7bda4e";
  const [searchValue, setSearchValue] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);
  const [movies, setMovies] = useState([]);


  const handleClick = () => {
    setSearchClicked(true);

  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchValue.trim() !== "") {
      fetchData(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchValue}`
      )
        .then((res) => {
          setMovies(res.results);
          setSearchClicked(true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
    setSearchClicked(false);
  };
  return (
    <div>
      <div className="container-busqueda">
        <div>
          <h1 className="title-name">GammaFilms</h1>
        </div>
        <form onSubmit={handleSubmit} className="form-busqueda">
          <input type="text" name="inputName" placeholder="Buscar películas" value={searchValue} onChange={handleInputChange} />
          <button className='btn-enviar' type="submit" onClick={handleClick}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </form>
      </div>
      {searchClicked && <Movie movies={movies} />}
    </div>
  )
}

export default Busqueda; 