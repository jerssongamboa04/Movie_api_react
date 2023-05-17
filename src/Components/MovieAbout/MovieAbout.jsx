import React, { useState, useEffect } from "react";
import YouTube from 'react-youtube';
import { firestore } from "../../firebaseConfig.js";
import { collection, addDoc, deleteDoc, query, where, getDocs, doc } from "firebase/firestore";

import "../MovieAbout/MovieAbout.css";
import { fetchData } from "../../Utilities/Utilities";
import { useParams } from 'react-router-dom';
import Busqueda from "../Busqueda/Busqueda";

const MovieAbout = () => {
  const apiKey = "6142b829afb94b21cca756ad3d7bda4e";
  const url_img = 'https://image.tmdb.org/t/p/original';

  const { id } = useParams();
  const [favorites, setFavorites] = useState([]);
  const [movieData, setMovieData] = useState(null);
  const [isTrailerVisible, setIsTrailerVisible] = useState(false);
  const [favorita, setFavorita] = useState(false);
  // console.log(movieData);

  useEffect(() => {
    fetchData(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=videos,language=es`)
      .then((res) => {
        setMovieData(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [apiKey, id]);


  const closeTrailer = () => {
    setIsTrailerVisible(false);
  };

  const isFavorite = (movieData) => {
    return favorites.some((favorite) => favorite.title === movieData.title);
  };

  const handleAddToFavorites = async () => {
    const favoritesCollectionRef = collection(firestore, "favoritos");
    const querySnapshot = await getDocs(query(favoritesCollectionRef, where("title", "==", movieData.title)));
    const existingFavorite = querySnapshot.docs[0];

    if (!existingFavorite) {
      await addDoc(favoritesCollectionRef, movieData);
      console.log("Película añadida a favoritos:", movieData.title);
    }
  };

  const handleRemoveFromFavorites = async () => {
    const favoritesCollectionRef = collection(firestore, "favoritos");
    const movieTitle = movieData.title; // Almacena el título de la película
    const querySnapshot = await getDocs(query(favoritesCollectionRef, where("title", "==", movieTitle)));
    const docToDelete = querySnapshot.docs[0];

    if (docToDelete) {
      await deleteDoc(doc(favoritesCollectionRef, docToDelete.id));
      console.log("Película eliminada de favoritos:", movieTitle);

      // Actualiza el estado de favorites después de eliminar el documento
      setFavorites(favorites.filter(favorite => favorite.title !== movieTitle));
    }
  };
  useEffect(() => {
    const fetchFavorites = async () => {
      const favoritesCollection = collection(firestore, "favoritos");
      const q = query(favoritesCollection);
      const querySnapshot = await getDocs(q);
      const favoritesData = querySnapshot.docs.map((doc) => doc.data());
      setFavorites(favoritesData);
    };

    fetchFavorites();
  }, [favorites]);

  return (
    <div>
      <Busqueda />

      {movieData ? (
        <div style={{ backgroundImage: `url(${url_img}${movieData.backdrop_path})` }} className='top-cartelera-background'>
          <div className="contenedor-youtube">
            <div className="contenedor-video">
              {isTrailerVisible && (
                <YouTube
                  videoId={movieData.videos.results[0].key}
                  className="reproductor container"
                  containerClassName={"youtube-container amru"}
                  opts={{
                    width: "100%",
                    height: "100%",
                    playerVars: {
                      autoplay: 1,
                      controls: 0,
                      cc_load_policy: 0,
                      fs: 0,
                      iv_load_policy: 0,
                      modestbranding: 0,
                      rel: 0,
                      showinfo: 0,
                      origin: "https://www.youtube.com/",

                    },
                  }}
                />
              )}
            </div>
            <div className='top-cartelera-overlay'>

              {isFavorite(movieData) ? (
                <button className="btn-favorito" onClick={() => {
                  setFavorita(!favorita);
                  handleRemoveFromFavorites();
                }}>
                  <i className="fa-solid fa-xmark"></i> Eliminar
                </button>
              ) : (
                <button className='btn-favorito' type="submit" onClick={() => {
                  setFavorita(!favorita);
                  handleAddToFavorites();
                }}>
                  <i className="fa-solid fa-plus"></i> Añadir
                </button>
              )}
              {isTrailerVisible ? (
                <button className='btn-cerrar-trailer' type="button" onClick={closeTrailer}>
                  Cerrar Trailer
                  <i className="fa-solid fa-xmark"></i>
                </button>
              ) : (
                <button className='btn-ver-trailer' type="submit" onClick={() => setIsTrailerVisible(true)}>
                  <i className="fa-solid fa-play" style={{ color: "#ffffff" }}></i>
                  Ver Trailer
                </button>
              )}
              <h1>{movieData.title}</h1>
              <p>{movieData.overview}</p>
              <p>Duracion: {movieData.runtime}</p>
              <div className="contenedor-genero">
                {movieData.genres.map((genre) => (
                  <button key={genre.id}>{genre.name}</button>
                ))}
              </div>

              <div>
                <h2>{movieData.videos.results[0].title}</h2>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>Cargando...</div>
      )}
    </div>
  );
}

export default MovieAbout;