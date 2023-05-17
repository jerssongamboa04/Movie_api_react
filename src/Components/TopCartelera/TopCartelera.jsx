import React, { useState, useEffect } from "react";
import { fetchData } from "../../Utilities/Utilities";
import { Link } from 'react-router-dom';
import "../TopCartelera/TopCartelera.css";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";


const TopCartelera = () => {
    const apiKey = "6142b829afb94b21cca756ad3d7bda4e";
    const url_img = 'https://image.tmdb.org/t/p/original';

    const [data, setData] = useState([]);
    const [posterPath, setPosterPath] = useState('');
    const [favorites, setFavorites] = useState([]);
    const [favorita, setFavorita] = useState(false);

    useEffect(() => {
        fetchData(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&append_to_response=images`)  
            .then((res) => {
                setData(res.results);
                if (res.results.length > 0) {
                    setPosterPath(res.results[2].backdrop_path);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

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

    if (data.length === 0) {
        return <div>Cargando...</div>;
    }

    const isFavorite = (movie) => {
        return favorites.some((favorite) => favorite.title === movie.title);
    };

    const handleAddToFavorites = async (movie) => {
        const favoritesCollectionRef = collection(firestore, "favoritos");

        if (isFavorite(movie)) {
            // Eliminar la película de favoritos
            const movieToDelete = favorites.find((favorite) => favorite.title === movie.title);
            const querySnapshot = await getDocs(query(favoritesCollectionRef, where("title", "==", movieToDelete.title)));
            const docToDelete = querySnapshot.docs[0];

            if (docToDelete) {
                await deleteDoc(doc(favoritesCollectionRef, docToDelete.id));
                console.log("Película eliminada de favoritos:", movie.title);
                // Actualizar la lista de favoritos
                const updatedFavorites = favorites.filter((favorite) => favorite.title !== movie.title);
                setFavorites(updatedFavorites);
            }
        } else {
            // Agregar la película a favoritos
            await addDoc(favoritesCollectionRef, { title: movie.title });
            console.log("Película agregada a favoritos:", movie.title);
            // Actualizar la lista de favoritos
            const updatedFavorites = [...favorites, { title: movie.title }];
            setFavorites(updatedFavorites);
        }
    };

    return (
        <div>
            <div style={{ backgroundImage: `url(${url_img}${posterPath})`, height: 700 }} className='top-cartelera-background'>
                <div className='top-cartelera-overlay'>
                    <button className="btn-favorito" onClick={() => {
                        setFavorita(!favorita);
                        handleAddToFavorites(data[0]);
                    }}>
                        <i className={`fa-solid ${favorita ? "fa-xmark" : "fa-plus"}`}></i> {favorita ? "Eliminar" : "Añadir"}
                    </button>
                    <button className="btn-ver-button"><Link to={`/about/${data[0].id}`}>Ver más</Link></button>
                    <h2 className="title-popular">{data[0].title}</h2>
                    <p>{data[0].overview}</p>
                </div>
            </div>
            <div className='container-peliculas-encontradas'>
                {data.slice(1).map((movie) => (
                    <div key={movie.id} className='card-peliculas'>
                        <img className='card-peliculas-img' src={`${url_img}${movie.poster_path}`} alt={movie.title} />
                        <h3>{movie.title}</h3>
                        <p>{movie.release_date}</p>

                        {isFavorite(movie) ? (
                            <button className="btn-favorito" onClick={() => {
                                setFavorita(!favorita);
                                handleAddToFavorites(movie)
                            }}>
                                <i className="fa-solid fa-xmark"></i> Eliminar
                            </button>
                        ) : (
                            <button className='btn-favorito' type="submit" onClick={() => {
                                setFavorita(!favorita);
                                handleAddToFavorites(movie)
                            }}>
                                <i className="fa-solid fa-plus"></i> Añadir
                            </button>
                        )}
                        <button className="btn-ver-button">
                            <Link to={`/about/${movie.id}`}>Ver más</Link>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

}

export default TopCartelera;
