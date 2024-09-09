const express = require("express");
const dotenv = require("dotenv");
const mysqlPool = require("./config/db");
dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Rest Object
const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send(`<h3>Personal Blog node application is running...</h3>`);
  res.end();
});

//Routes
app.use("/", require("./routes/personalBolgs"));
app.use("/", require("./routes/userRoutes"));

//PORT
const PORT = process.env.PORT || 5000;

mysqlPool
  .query("SELECT 1")
  .then(() => {
    console.log("MySQL DB is Connected!");
    app.listen(PORT, () => {
      console.log(`Server Running ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
