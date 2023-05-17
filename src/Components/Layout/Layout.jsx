import React from 'react'
import "../Layout/Layout.css";
import { Outlet, Link } from "react-router-dom";


const Layout = () => {
    return (

        <div className='container-layout'>

            <nav className='container-ul'>
                <ul>
                    <li className='link-layout'>
                        <Link to="/">Home</Link>
                    </li>
                    <li className='link-layout'>
                        <Link to="/About">About</Link>
                    </li>
                    <li className='link-layout'>
                        <Link to="/Favourities">Favorites</Link>
                    </li>
                </ul>
            </nav>

            <Outlet />
        </div>
    )
}

export default Layout;