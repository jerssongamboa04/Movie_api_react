import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Peticion from './Components/Peticion/Peticion.jsx'
import Layout from "./Components/Layout/Layout.jsx";
import Favourites from "./Components/Favourites/Favourites.jsx";
import MovieAbout from "./Components/MovieAbout/MovieAbout.jsx";



function App() {
  return (


    <div className="App">
      <BrowserRouter>
        <Layout />
        <Routes>
          <Route path="/" element={<Peticion />} />
          <Route path="/About/:id" element={<MovieAbout />} />
          <Route path="/Favourities" element={<Favourites />} />
        </Routes>
      </BrowserRouter>


    </div>
  );
}

export default App;
