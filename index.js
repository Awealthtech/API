const express = require("express");
const app = express();
const authRoutes = require('./routes/authRoutes');
const dotenv = require("dotenv");
dotenv.config();


const mongoose = require("mongoose");
const bodyParser = require("body-parser")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DB_URI =
process.env.MONGOLAB_URI;



app.use('/auth', authRoutes);

// Start the server

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.APP_PORT, () => console.log(`listening on ${process.env.APP_PORT}`));
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });

// app.listen(process.env.APP_PORT, () => {
//   console.log('Server started on port 3000');
// });
