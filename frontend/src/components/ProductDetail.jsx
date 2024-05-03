import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../Layout/Header";
import API_URL from "../constants";
import './ProductDetails.css'; // Make sure to import the CSS file
import { Link, Redirect } from 'react-router-dom';  // Using Redirect from react-router-dom v5
import { useHistory } from "react-router-dom";
import { useGetConversationMessages } from '../Services/chatService';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';







function ProductDetail() {
    const history = useHistory();

    const getConversationMessages = useGetConversationMessages(); 
    const [activeImageIndex, setActiveImageIndex] = useState(0); // State to manage active image index
    const [product, setproduct] = useState();
    const [user, setuser] = useState();
    const p = useParams();
    const [redirectTo, setRedirectTo] = useState(null);  // State to manage redirection

   
    useEffect(() => {
        const url = API_URL + '/api/products/product/' + p.productId;
        console.log(url)
     
        axios.get(url)
            .then((res) => {
                if (res.data.product) {
                    setproduct(res.data.product);

                }
            })
            .catch((err) => {
                alert('Server Err.');
            });
    }, [p.productId]);

    if (redirectTo) {
        return <Redirect to={redirectTo} />;
    }

    
    const switchImage = (index) => {
        setActiveImageIndex(index);
    }

    

    const handleChat = (sellerId) => {
        const userId = localStorage.getItem('userId'); // Check user is logged in
        if (!userId) {
            console.error('User is not logged in');
            return;
        }
    
        // Fetch conversation messages
        getConversationMessages(sellerId).then(conversations => {
            // Ensure that conversations is an array and filter out any that don't meet expected structure
            const validConversations = conversations.filter(conversation => Array.isArray(conversation.participants));
    
            // Find an existing conversation that includes the sellerId in its participants
            const existingConversation = validConversations.find(conversation => 
                conversation.participants.includes(sellerId)
            );
    
            if (existingConversation && existingConversation._id) {
                // Redirect to an existing conversation
                history.push(`/chat/${existingConversation._id}`);
            } else {
                // No existing conversation found, redirect to create a new chat
                history.push(`/chat/new?userId=${sellerId}`);
            }
        }).catch(error => {
            console.error('Error fetching conversation details:', error);
            alert('Failed to retrieve conversation details');
        });
    };

    const handleReport = (addedBy) => {
        history.push(`/report/${addedBy}`);
    };
    
    const handleContact = (addedBy) => {
        const url = `${API_URL}/api/users/get-user/${addedBy}`;
        console.log(url)  // Updated URL to match the backend
        axios.get(url)
            .then((res) => {
                if (res.data.user) {
                    setuser(res.data.user);
                } else {
                    alert(res.data.message);  // Show the message from the server (e.g., User not found)
                }
            })
            .catch((err) => {
                alert('Server Err: ' + err.message);  // Displaying more detailed error
            });
    };
    
    return (
        <div>
        <Header />
        <div className="product-detail-page">
        
            <div className="product-detail-container">
                <div className="product-content">
                {product && (
                            <div className="product-images-container">
                                {/* Display active image based on activeImageIndex */}
                                {/* Arrows to switch between images */}
                                <div className="image-wrapper">
                                    <span className="arrow left-arrow" onClick={() => switchImage(activeImageIndex === 0 ? 1 : 0)}>&#9664;</span>
                                    <img className="product-image" src={API_URL + '/uploads/' + (activeImageIndex === 0 ? product.pimage : product.pimage2)} alt={product.pname} />
                                    <span className="arrow right-arrow" onClick={() => switchImage(activeImageIndex === 1 ? 0 : 1)}>&#9654;</span>
                                </div>
                            </div>
                        )}
                    <div className="product-info">
                    <h3 className="product-name">{product?.pname} | {product?.category}</h3>

                        <h3 className="product-price">$ {product?.price}</h3>
                        <h2 className="product-description">{product?.pdesc}</h2>
                        
                  
               
                        {product?.addedBy && (
                            
                            <button className="contact-button" onClick={() => handleChat(product.addedBy)}>
                                      <FontAwesomeIcon icon={faComment} /> 
                             
                                      <span className="icon-text">Chat with Seller</span>
                            </button>
                        )}
                         <button className="contact-button2" onClick={() => handleReport(product.addedBy)}>
                         <FontAwesomeIcon icon={faExclamationTriangle} />

                         <span className="icon-text">Report Buyer</span>
                                </button>
                   
                        

{product?.addedBy && (
                            <button className="contact-button2" onClick={() => handleContact(product.addedBy)}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    <span className="icon-text">Show  Details</span>
                            </button>
                            
                        )}
                        {user && (
                            <div className="user-info">
                                <h4 className="username">{user.username}</h4>
                                <p className="user-contact">{user.mobile}</p>
                                <p className="user-email">{user.email}</p>
                            </div>
                        )}

                        
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default ProductDetail;
