
const express = require("express");
const router = express.Router();
const multer = require('multer');
const mongoose = require("mongoose");
const Product = require("../../models/Product");
const path = require('path');
const { addProduct } = require('../../controllers/productController'); // Adjust path as needed



// Search for products


// Add a new product

// Delete a product by ID
router.delete("/delete/:pId", (req, res) => {
    Product.findByIdAndRemove(req.params.pId)
        .then(result => {
            if (result) {
                res.send({ message: 'Product deleted successfully', product: result });
            } else {
                res.status(404).send({ message: 'Product not found' });
            }
        })
        .catch(err => res.status(500).send({ message: 'Server error', error: err.message }));
});

router.get("/get-products", (req, res) => {
    const catName = req.query.catName;
    let filter = {};
    console.log("In route handler");
    console.log(catName);

    if (catName && catName !== 'All Categories') {
        filter.category = catName;
    }

    Product.find(filter)
        .then(result => res.send({ message: 'success', products: result }))
        .catch(err => res.status(500).send({ message: 'server error', error: err }));
});

module.exports = router;

// Get product by ID
router.get("/product/:pId", (req, res) => {
    Product.findById(req.params.pId)
        .then(result => res.send({ message: 'success', product: result }))
        .catch(err => res.status(500).send({ message: 'server error', error: err }));
});

// Get all products added by a specific user
router.get("/my-products/:userId", (req, res) => {
    const userId = req.params.userId;

    Product.find({ addedBy: userId })
    .then((products) => {
        if (products.length >= 0) {
            res.send({ message: 'Success', products: products });
        } else {
            res.status(404).send({ message: 'No products found for this user.' });
        }
    })
    .catch((err) => {
        console.error(err); // It's good practice to log the error for debugging
        res.status(500).send({ message: 'Server error', error: err.message });
    });
});


router.get("/search", (req, res) => {
    const search = req.query.search;
    if (!search || typeof search !== 'string') {
        return res.status(400).send({ message: 'Invalid search query' });
    }
    const searchQuery = {
        $or: [
            { pname: { $regex: search, $options: 'i' } },
            { pdesc: { $regex: search, $options: 'i' } },
            { price: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } }
        ]
    };
    Product.find(searchQuery)
        .then(results => res.send({ message: 'success', products: results }))
        .catch(err => res.status(500).send({ message: 'server error', error: err.message }));
});




module.exports = router;
