import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';  // Using Redirect from react-router-dom v5
import './Header.css'
import { FaSearch } from "react-icons/fa";

function Header(props) {
    const [redirectTo, setRedirectTo] = useState(null);  // State to manage redirection
    const [searchQuery, setSearchQuery] = useState('');  // Local state for the search query
    const [showOver, setShowOver] = useState(false);     // State to manage the overlay visibility

    function handleSearch() {
        const searchURL = `http://localhost:4000/search?search=${encodeURIComponent(searchQuery)}`;
        fetch(searchURL)
            .then(response => response.json())
            .then(data => {
                console.log(data);  // Handle your search results as needed
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
            });
    }

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setRedirectTo('/login');  // Set path to redirect
    }

    // If redirectTo is set, render the Redirect component to redirect
    if (redirectTo) {
        return <Redirect to={redirectTo} />;
    }

    return (
        <div className='header-container d-flex justify-content-between'>
            <div className="header-links">
                <Link className='links' to="/">Almari</Link>
            </div>

            <div className="search-container">
                <input
                    className='search'
                    type='text'
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                />
                <button className='search-btn' onClick={handleSearch}><FaSearch /></button>
            </div>

            <div onClick={() => setShowOver(prev => !prev)} style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#002f34',
                width: '40px',
                height: '40px',
                color: '#fff',
                fontSize: '14px',
                borderRadius: '50%'
            }}>
                N
            </div>

            {showOver && (
                <div style={{
                    minHeight: '100px',
                    width: '200px',
                    background: '#002f34',
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    zIndex: 1,
                    marginTop: '50px',
                    marginRight: '50px',
                    color: '#fff',
                    fontSize: '14px',
                    borderRadius: '7px'
                }}>
                    {localStorage.getItem('token') ? (
                        <>
                            <Link to="/add-product"><button className="logout-btn">ADD PRODUCT</button></Link>
                            <Link to="/liked-products"><button className="logout-btn">FAVOURITES</button></Link>
                            <Link to="/my-products/userId"><button className="logout-btn">MY ADS</button></Link>
                            <button className='logout-btn' onClick={handleLogout}>LOGOUT</button>
                        </>
                    ) : (
                        <Link to="/login">LOGIN</Link>
                    )}
                </div>
            )}
        </div>
    );
}

export default Header;
