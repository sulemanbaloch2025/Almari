import React from "react";
import { useEffect, useState } from "react";
import Header from "../Layout/Header";
import { Redirect, Link } from "react-router-dom"; // Import Redirect instead of useNavigate
import axios from "axios";
import categories from "./CategoriesList";
import API_URL from "../constants";
import { useRadioGroup } from "@material-ui/core";


function AddProduct() {
    const [redirectTo, setRedirectTo] = useState(null); // State for redirection
    const [pname, setpname] = useState('');
    const [pdesc, setpdesc] = useState('');
    const [price, setprice] = useState('');
    const [category, setcategory] = useState('');
    const [pimage, setpimage] = useState('');
    const [pimage2, setpimage2] = useState('');

    useEffect(() => {
       
    }, []);

    const handleApi = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            const formData = new FormData();
            formData.append('pname', pname);
            formData.append('pdesc', pdesc);
            formData.append('price', price);
            formData.append('category', category);
            formData.append('userId', localStorage.getItem('userId'));
            formData.append('plat', position.coords.latitude.toString());
            formData.append('plong', position.coords.longitude.toString());
   
            // Ensure `pimage` and `pimage2` are referencing actual File objects
            // Example: assuming `pimage` and `pimage2` are state variables tied to <input type="file" onChange={...}/>
            if (pimage && pimage2) {
                formData.append('pimage', pimage);
                formData.append('pimage2', pimage2);
            }
    
            const url = API_URL + '/api/products/add-product';
            console.log(url); // This will log the full API URL to help verify correctness
    
            axios.post(url, formData)
                .then((res) => {
                    alert(res.data.message);
                    setRedirectTo('/'); // Navigate to home after successful API call
                })
                .catch((err) => {
                    // Log the error or display a message
                    console.error('Error submitting form:', err);
                    alert('Could not find endpoint or other error: ' + err.message);
                });
        }, (error) => {
            // Handle geolocation errors here
            console.error('Geolocation error:', error);
            alert('Error getting location: ' + error.message);
        });
    };
    if (redirectTo) {
        return <Redirect to={redirectTo} />; // Render Redirect component based on redirectTo state
    }

    return (
        <div>
            <Header />
            <div className="p-3">
                <h2> ADD PRODUCT HERE : </h2>
                <label> Product Name </label>
                <input className="form-control" type="text" value={pname}
                    onChange={(e) => setpname(e.target.value)} />
                <label> Product Description </label>
                <input className="form-control" type="text" value={pdesc}
                    onChange={(e) => setpdesc(e.target.value)} />
                <label> Product Price </label>
                <input className="form-control" type="text" value={price}
                    onChange={(e) => setprice(e.target.value)} />
                <label> Product Category </label>
                <select className="form-control" value={category}
                    onChange={(e) => setcategory(e.target.value)}>
                    <option> Bikes </option>
                    <option> Mobiles </option>
                    <option> Cloth </option>
                    {categories && categories.length > 0 && categories.map((item, index) => (
                        <option key={'option' + index}> {item} </option>
                    ))}
                </select>
                <label> Product Image </label>
                <input className="form-control" type="file"
                    onChange={(e) => setpimage(e.target.files[0])} />
                <label> Product Second Image </label>
                <input className="form-control" type="file"
                    onChange={(e) => setpimage2(e.target.files[0])} />
                <button onClick={handleApi} className="btn btn-primary mt-3"> SUBMIT </button>
            </div>
        </div>
    );
}

export default AddProduct;
