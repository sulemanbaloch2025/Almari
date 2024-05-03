import React from 'react';
import { useState } from 'react'; // Import useState
import { Redirect } from 'react-router-dom';
import './Header.css';
import categories from './CategoriesList';
import './Categories.css';



function Categories(props) {
    const [selectedCategory, setSelectedCategory] = useState(null); // State to track selected category
    const [redirectTo, setRedirectTo] = useState(null); // State for managing redirection

    const handleCategoryClick = (item) => {
        setSelectedCategory(item); // Update the selected category state
        setRedirectTo('/category/' + item); // Set the redirection path
    };

    // If redirectTo is set, render the Redirect component to redirect
    if (redirectTo) {
        return <Redirect to={redirectTo} />;
    }

    return (
        <div className='cat-container'>
            <div>
                {categories && categories.length > 0 &&
                    categories.map((item, index) => {
                        return (
                            <span
                                onClick={() => handleCategoryClick(item)}
                                key={index}
                                className={`category ${selectedCategory === item ? 'selected' : ''}`}> 
                                {item} 
                            </span>
                        );
                    })}
            </div>
        </div>
    );
}

export default Categories;