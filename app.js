// const express = require("express");
// const bodyParser = require("body-parser");
// const resourceRoutes = require("./routes/resourceRoutes");

// const app = express();
// const port = 9000;

// app.use(bodyParser.json());
// app.use("/api/resources", resourceRoutes);

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const resourceRoutes = require("./routes/resourceRoutes");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = express();
// app.use(bodyParser.json());
// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// database connection
mongoose
  .connect(process.env.MONGODB_URL, {
    dbName: "test",
    // bufferCommands: false,
    // connectTimeoutMS: 30000,
  })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("Database not connected", err));

app.use("/api/resources", resourceRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
