
const mongoose = require('mongoose');
const Product = require("../models/Product"); 

exports.addProduct = (req, res) => {
    console.log(req.files);
    console.log(req.body);

    if (!req.files || !req.files.pimage || !req.files.pimage2) {
        return res.status(400).send({ message: "Images are required and were not provided." });
    }

    const { pname, pdesc, price, category, userId, plat,plong } = req.body;
    const pimage = req.files.pimage[0].filename;
    const pimage2 = req.files.pimage2[0].filename;
    const addedBy = userId;
  

    const newProduct = new Product({
        pname,
        pdesc,
        price,
        category,
        pimage,
        pimage2,
        addedBy,
        pLoc: {
            type: 'Point',
            coordinates: [plong, plat] 
        }
    });

    newProduct.save()
        .then(() => res.send({ message: 'Product saved successfully.' }))
        .catch(err => {
            console.error(err);
            res.status(500).send({ message: 'Server error', error: err });
        });
};