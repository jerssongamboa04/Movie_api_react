import React, { useState, useEffect } from "react";
import "../Movie/Movie.css";
import { Link } from "react-router-dom";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../firebaseConfig.js";

const Movie = ({ movies }) => {
    const url_img = "https://image.tmdb.org/t/p/original";
    console.log(movies);

    const [favorites, setFavorites] = useState([]); // Estado para almacenar las películas favoritas
    const [favorita, setFavorita] = useState(false); // Estado para indicar si la película es favorita

    // Función para verificar si una película está marcada como favorita
    const isFavorite = (movieData) => {
        return favorites.some((favorite) => favorite.title === movieData.title);
    };

    // Función para añadir una película a la lista de favoritos
    const handleAddToFavorites = async (movie) => {
        const favoritesCollectionRef = collection(firestore, "favoritos");
        const querySnapshot = await getDocs(
            query(favoritesCollectionRef, where("title", "==", movie.title))
        );
        const existingFavorite = querySnapshot.docs[0];

        if (!existingFavorite) {
            await addDoc(favoritesCollectionRef, movie);
            console.log("Película añadida a favoritos:", movie.title);
            setFavorites([...favorites, movie]);
        }
    };

    // Función para eliminar una película de la lista de favoritos
    const handleRemoveFromFavorites = async (movie) => {
        const favoritesCollectionRef = collection(firestore, "favoritos");
        const querySnapshot = await getDocs(
            query(favoritesCollectionRef, where("title", "==", movie.title))
        );
        const docToDelete = querySnapshot.docs[0];

        if (docToDelete) {
            await deleteDoc(doc(favoritesCollectionRef, docToDelete.id));
            console.log("Película eliminada de favoritos:", movie.title);
            setFavorites(favorites.filter((favorite) => favorite.title !== movie.title));
        }
    };

    // Obtener la lista de favoritos al cargar el componente
    useEffect(() => {
        const fetchFavorites = async () => {
            const favoritesCollection = collection(firestore, "favoritos");
            const querySnapshot = await getDocs(favoritesCollection);
            const favoritesData = querySnapshot.docs.map((doc) => doc.data());
            setFavorites(favoritesData);
        };

        fetchFavorites();
    }, []);

    return (
        <div>
            <h1 className='title-buscado'>Tus Peliculas Buscadas</h1>
            <div className='container-peliculas-encontradas'>
                {movies.map((movie) => (
                    <div key={movie.id} className='card-peliculas'>
                        <img className='card-peliculas-img' src={`${url_img + movie.poster_path}`} alt={movie.title} />
                        <h3>{movie.title}</h3>
                        <p>{movie.release_date}</p>

                        {isFavorite(movie) ? (

                            <button className="btn-favorito" onClick={() => {
                                setFavorita(!favorita);
                                handleRemoveFromFavorites(movie);
                            }}>
                                <i className="fa-solid fa-xmark"></i> Eliminar
                            </button>
                        ) : (
                            <button className='btn-favorito' type="submit" onClick={() => {
                                setFavorita(!favorita);
                                handleAddToFavorites(movie);
                            }}>
                                <i className="fa-solid fa-plus"></i> Añadir
                            </button>
                        )}

                        <button className="btn-ver-button"><Link to={`/about/${movie.id}`}>Ver mas</Link></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Movie;