import React from "react"

import { useEffect, useState } from "react";
import Header from '../Layout/Header';
import { Link, Redirect } from 'react-router-dom';  // Using Redirect from react-router-dom v5

import axios from "axios";
import Categories from "./Categories";
import { FaHeart } from "react-icons/fa";
import API_URL from "../constants";
import './Home2.css'; // Make sure to import the CSS file



function Home2() {


    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [isSearch, setIsSearch] = useState(false);
    const [redirectTo, setRedirectTo] = useState(null);  // State to manage redirection


    // Fetch all products on component mount
    useEffect(() => {
        fetchProducts();
        if (redirectTo) {
            return <Redirect to={redirectTo} />;
        }
    }, []);

    const fetchProducts = () => {
        const url = `${API_URL}/api/products/get-products`;
        console.log(url)
        axios.get(url)
            .then((res) => {
                if (res.data.products) {
                    setProducts(res.data.products);
                    setFilteredProducts(res.data.products); // Initially show all products
                }
            })
            .catch((err) => {
                alert('no.');
            });
    };

    const handleSearch = (value) => {
        setSearch(value);
    };

    const handleSearchClick = () => {
        if (!search) {
            setFilteredProducts(products);
            setIsSearch(false);
            return;
        }

        const url = `${API_URL}/search?search=${search}&loc=${localStorage.getItem('userLoc')}`;
        axios.get(url)
            .then((res) => {
                setFilteredProducts(res.data.products);
                setIsSearch(true);
            })
            .catch((err) => {
                alert('Server Error.');
            });
    };

    const handleCategory = (category) => {
        if (category === 'All') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter((item) => item.category === category);
            setFilteredProducts(filtered);
        }
        setIsSearch(false); // Reset search state when category is changed
    };

    const handleLike = (productId, e) => {
        e.stopPropagation(); // Prevent navigation to product detail page when liking a product
        let userId = localStorage.getItem('userId');

        if (!userId) {
            alert('Please Login first.');
            return;
        }

        const url = `${API_URL}/like-product`;
        const data = { userId, productId };
        console.log(localStorage.getItem('userId'));
        axios.post(url, data)
            .then((res) => {
                if (res.data.message) {
                    alert('Liked.');
                }
            })
            .catch((err) => {
                alert('Server Error.');
            });
    };

    const handleProductClick = (id) => {
        //navigate(`/product/${id}`);
    };


    return (
        <div>
            <Header search={search} handleSearch={handleSearch} handleClick={handleSearchClick} />
            <Categories handleCategory={handleCategory} />
            <div className="d-flex justify-content-center flex-wrap">
                {filteredProducts.map((product, index) => (
                    console.log(`${API_URL}/uploads/${product.pimage}`),
                    <div key={product._id} className="card m-3" onClick={() => handleProductClick(product._id)}>
                       
                       <Link to={`/product/${product._id}`}>
                            <img width="280px" height="250px" src={`${API_URL}/uploads/${product.pimage}`} alt={product.pname} />
                        </Link>
                        <div className="quicklook">Quicklook</div>
                        <h2 className="new">{product.pname}</h2>
                        <p className="new">{product.pdesc}</p>
                        <h3 className="new">${product.price} </h3>
                       

                    </div>
                ))}
                {filteredProducts.length === 0 && !isSearch && <h5>No Products Found</h5>}
            </div>
        </div>
    );

   /*

    return (
        <div>
            heeferferllo
        </div>
    )
    */
}

export default Home2;
