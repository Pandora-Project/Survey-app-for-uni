const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodbUri";
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const surveyRouter = require('./routes/survey');

app.use('/survey', surveyRouter);
// app.get("/api", (req, res) => {
//     res.json();
// })

app.listen(5000, () => {console.log("Server started on port 5000")})
