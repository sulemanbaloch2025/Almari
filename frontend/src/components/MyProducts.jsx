import React from "react"
import { useEffect, useState } from "react";
import Header from "../Layout/Header";
import axios from "axios";
import Categories from "./Categories";
import { FaHeart, FaTrash } from "react-icons/fa"; // Import FaTrash for the delete icon
import API_URL from "../constants";

function MyProducts() {
    const [products, setProducts] = useState([]);
    const [cproducts, setCProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [isFetching, setIsFetching] = useState(false); // flag to indicate fetching

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        
        
        if (!isFetching) { // Check if we're already fetching
            setIsFetching(true); // Set the flag to prevent future fetches
            const url = `${API_URL}/api/products/my-products/${userId}`;

            axios.get(url)
                .then((res) => {
                    if (res.data.products) {
                        setProducts(res.data.products);
                        setCProducts(res.data.products);
                    }
                    setIsFetching(false); // Reset the flag after fetching
                })
                .catch((err) => {
                    alert('Server error. Please try again later.');
                    setIsFetching(false); // Reset the flag if there's an error
                });
        }
    }, []);

    const handleSearch = (value) => {
        setSearch(value);
    };

    const handleClick = () => {
        let filteredProducts = products.filter((item) => {
            return item.pname.toLowerCase().includes(search.toLowerCase()) ||
                item.pdesc.toLowerCase().includes(search.toLowerCase()) ||
                item.category.toLowerCase().includes(search.toLowerCase());
        });
        setCProducts(filteredProducts);
    };

    const handleCategory = (value) => {
        let filteredProducts = products.filter((item) => {
            return item.category === value;
        });
        setCProducts(filteredProducts);
    };

    const handleLike = (productId) => {
        let userId = localStorage.getItem('userId');

        const url = `${API_URL}/like-product`;
        const data = { userId, productId };
        axios.post(url, data)
            .then((res) => {
                if (res.data.message) {
                    alert('Liked.');
                }
            })
            .catch((err) => {
                alert('Server error. Please try again later.');
            });
    };

    // Function to handle product deletion
    const handleDelete = (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return; // Stop if the user cancels
        }
        
        const url = `${API_URL}/delete-product/${productId}`;
    
        axios.delete(url)
            .then((res) => {
                if (res.data.message === 'Product deleted successfully') {
                    alert('Product deleted.');
                    setProducts(prevProducts => prevProducts.filter(item => item._id !== productId));
                    setCProducts(prevCProducts => prevCProducts.filter(item => item._id !== productId));
                } else {
                    alert(res.data.message);
                }
            })
            .catch((err) => {
                alert('Server Error. Please try again later.');
            });
    };

    return (
        <div>
            <Header search={search} handleSearch={handleSearch} handleClick={handleClick} />
            <Categories handleCategory={handleCategory} />


            <h5> ALL RESULTS </h5>

            <div className="d-flex justify-content-center flex-wrap">
                {products && products.length > 0 &&
                    products.map((item, index) => (
                        <div key={item._id} className="card m-3">
                            <div className="icon-con">
                                <FaTrash className="icons text-danger" style={{ marginLeft: "10px" }} onClick={() => handleDelete(item._id)} />
                            </div>
                            <img width="280px" height="250px" src={`${API_URL}/uploads/${item.pimage}`} alt="Product" />
                            <p className="m-2"> {item.pname} | {item.category} </p>
                            <h3 className="m-2 text-danger"> ${item.price} </h3>
                            <p className="m-2 text-success"> {item.pdesc} </p>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default MyProducts;
