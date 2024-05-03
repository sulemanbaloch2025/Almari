import React from "react";
import { useEffect, useState } from "react";
import Header from "../Layout/Header";
import { useParams, Redirect } from "react-router-dom"; // Import Redirect
import axios from "axios";
import Categories from "./Categories";
import { FaHeart } from "react-icons/fa";
import API_URL from "../constants";

function CategoryPage() {
    const { catName } = useParams();

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [isSearch, setIsSearch] = useState(false);
    const [redirectToProduct, setRedirectToProduct] = useState(null); // State variable for redirection

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const url = catName === 'All Categories' ? API_URL + '/api/products/get-products' : API_URL + '/api/products/get-products?catName=' + catName;
                const response = await axios.get(url);
                if (response.data.products) {
                 

                    setProducts(response.data.products);
                    setFilteredProducts(response.data.products); // Default to showing all products
                }
            } catch (error) {
                alert('Server Err.');
            }
        };
        fetchProducts();
    }, [catName]);

    const handleSearchChange = (value) => {
        setSearch(value);
    };

    const handleSearchClick = async () => {
        setIsSearch(true);
        try {
            const url = API_URL + '/search?search=' + search;
            const response = await axios.get(url);
            setFilteredProducts(response.data.products);
        } catch (error) {
            alert('Server Err.');
        }
    };

    const handleCategory = (category) => {
        if (category === 'All Categories') {
            setFilteredProducts(products);
        } else {
            const newFilteredProducts = products.filter(product => product.category === category);
            setFilteredProducts(newFilteredProducts);
        }
    };

    const handleLike = async (productId) => {
        let userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Please Login first.');
            return;
        }
        try {
            const url = API_URL + '/like-product';
            const data = { userId, productId };
            const response = await axios.post(url, data);
            if (response.data.message) {
                alert('Liked.');
            }
        } catch (error) {
            alert('Server Err.');
        }
    };

    const handleProductClick = (id) => {
        setRedirectToProduct('/product/' + id); // Set the redirection path
    };

    if (redirectToProduct) {
        return <Redirect to={redirectToProduct} />; // Redirect if redirectToProduct is set
    }

    return (
        <div>
            <Header search={search} handleSearchChange={handleSearchChange} handleSearchClick={handleSearchClick} />
            <Categories handleCategory={handleCategory} />
            
            {isSearch && (
                <h5> SEARCH RESULTS
                    <button className="clear-btn" onClick={() => setIsSearch(false)}> CLEAR </button>
                </h5>
            )}

            {isSearch && filteredProducts.length === 0 && <h5> No Results Found </h5>}

            <div className="d-flex justify-content-center flex-wrap">
                {filteredProducts.map(product => (
                    <div key={product._id} className="card m-3" onClick={() => handleProductClick(product._id)}>
                        <img width="280px" height="250px" src={API_URL + '/' + product.pimage} alt={product.pname} />
                        <h3 className="m-2 price-text"> $ {product.price} </h3>
                        <p className="m-2"> {product.pname} | {product.category} </p>
                        <p className="m-2 text-success"> {product.pdesc} </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CategoryPage;
