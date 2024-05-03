const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require('path');
const cors = require("cors");
const multer = require('multer')
const users = require("./routes/api/users");
const messages = require("./routes/api/messages");
const products = require("./routes/api/products");
const reports = require("./routes/api/reports");
const productsController= require("./controllers/productController")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const uploadsPath = path.join(__dirname, 'uploads'); 
      cb(null, uploadsPath)
  },
  filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})
const upload = multer({ storage: storage });



  



const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors({ origin: 'http://localhost:3000'}));
// Port that the webserver listens to
const port = 4000;

const server = app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);

const io = require("socket.io").listen(server);

// Body Parser middleware to parse request bodies
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// CORS middleware
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Database configuration
const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Successfully Connected"))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

// Assign socket object to every request
app.use(function (req, res, next) {
  req.io = io;
  next();
});

// Routes
app.use("/api/users", users);
app.use("/api/messages", messages);
app.use("/api/products", products);
app.use("/api/reports", reports);

app.post('/api/products/add-product', upload.fields([{ name: 'pimage' }, { name: 'pimage2' }]), productsController.addProduct)
