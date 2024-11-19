const express = require("express");
const mongoose = require("mongoose");
const passport = require('passport');
const User = require('./models/User');
const authRoutes = require("./routes/auth");
require("dotenv").config();
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

app.use(express.json());   
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

mongoose.connect(
    `mongodb://localhost:27017/`
)
.then((x) =>{
    console.log("Connected to Mongo!");
})
.catch((err) =>{
    console.log(err);
});

app.get("/", (req, res) => {
    res.send( "Hello World!" );
    });
    
    app.use("/auth", authRoutes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});