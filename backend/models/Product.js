const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for Products
const ProductSchema = new Schema({
    pname: {
        type: String
    },
    pdesc: {
        type: String
    },
    price: {
        type: String
    },
    category: {
        type: String
    },
    pimage: {
        type: String
    },
    pimage2: {
        type: String
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId
    },
    pLoc: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number]
        }
    }
});

// Index the 'pLoc' field as a '2dsphere' for GeoJSON querying
ProductSchema.index({ pLoc: '2dsphere' });

// Create the model from the schema
const Product = mongoose.model('Product', ProductSchema);

// Export the model
module.exports = Product;