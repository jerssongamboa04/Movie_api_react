import React, { useState, useEffect } from "react";
import "../Favourites/Favourites.css";
import { fetchData } from "../../Utilities/Utilities";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";
import { Link } from 'react-router-dom';
import Busqueda from "../Busqueda/Busqueda.jsx";

const Favourites = () => {
  const [favorites, setFavorites] = useState([]);
  const [moviesData, setMoviesData] = useState([]);
  const url_img = 'https://image.tmdb.org/t/p/original';
  const apiKey = "6142b829afb94b21cca756ad3d7bda4e";

  useEffect(() => {
    const fetchFavorites = async () => {
      const favoritesCollection = collection(firestore, "favoritos");
      const q = query(favoritesCollection);
      const querySnapshot = await getDocs(q);
      const favoritesData = querySnapshot.docs.map((doc) => doc.data());
      setFavorites(favoritesData);
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchMoviesData = async () => {
      const movieTitles = favorites.map((favorite) => favorite.title);
      const moviePromises = movieTitles.map((title) =>
        fetchData(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}`)
      );
      const moviesData = await Promise.all(moviePromises);
      setMoviesData(moviesData);
    };

    fetchMoviesData();
  }, [favorites]);


  if (moviesData.length === 0) {
    return <div>Cargando...</div>;
  }

  const handleRemoveFromFavorites = async (favorite) => {
    const favoritesCollectionRef = collection(firestore, "favoritos");
    const querySnapshot = await getDocs(query(favoritesCollectionRef, where("title", "==", favorite.title)));
    const docToDelete = querySnapshot.docs[0];

    if (docToDelete) {
      await deleteDoc(doc(favoritesCollectionRef, docToDelete.id));
      console.log("Película eliminada de favoritos:", favorite.title);
      // Actualizar la lista de favoritos
      const updatedFavorites = favorites.filter((item) => item.title !== favorite.title);
      setFavorites(updatedFavorites);
    }
  };

  return (
    <div>
      <Busqueda />
      <h1 className='title-buscado'>Tus peliculas favoritas</h1>

      <div className='container-peliculas-encontradas'>

        {moviesData.map((movieData, index) => (
          <div key={index} className='card-peliculas'>
            <img className='card-peliculas-img' src={`${url_img}${movieData.results[0].poster_path}`} alt={movieData.results[0].title} />
            <h3>{movieData.results[0].title}</h3>
            <p>{movieData.results[0].release_date}</p>
            <button className="btn-favorito" onClick={() => handleRemoveFromFavorites(favorites[index])}>
              <i className="fa-solid fa-xmark"></i> Eliminar
            </button>
            <button className="btn-ver-button">
              <Link to={`/about/${movieData.results[0].id}`}>Ver más</Link>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favourites;
