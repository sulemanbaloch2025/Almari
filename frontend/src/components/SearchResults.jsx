import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import Header from '../Layout/Header';
import API_URL from "../constants";

import { Link, Redirect } from 'react-router-dom';  // Using Redirect from react-router-dom v5

function SearchResults() {
    const { searchQuery } = useParams();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const url = `http://localhost:4000/api/products/search?search=${encodeURIComponent(searchQuery)}`;
            const response = await fetch(url);
            const data = await response.json();
            console.log("he",data)
            try {
                const response = await fetch(url);
                const data = await response.json();
                if (response.ok) {
                    setProducts(data.products);
                } else {
                    console.error('Failed to fetch products:', data.message);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchData();
    }, [searchQuery]);

    const handleDelete = (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        console.log('Delete product', productId);
        // Implement delete logic here
    };

    const handleProductClick = (id) => {
        //navigate(`/product/${id}`);
    };

    return (
        <>
              <Header/>
              <div className="d-flex justify-content-center flex-wrap">
                {products.map((product, index) => (
                    console.log(`${API_URL}/uploads/${product.pimage}`),
                    <div key={product._id} className="card m-3" onClick={() => handleProductClick(product._id)}>
                       
                       <Link to={`/product/${product._id}`}>
                            <img width="280px" height="250px" src={`${API_URL}/uploads/${product.pimage}`} alt={product.pname} />
                        </Link>
                        <h3 className="m-2 price-text">{product.pname} </h3>
                        <h3 className="m-2 price-text">${product.price} </h3>
                        <p className="m-2">{product.category}</p>
                        <p className="m-2 text-success">{product.pdesc}</p>
                    </div>
                ))}
                {products.length === 0 && <h5>No Products Found</h5>}
            </div>
        </>
    );
}

export default SearchResults;
