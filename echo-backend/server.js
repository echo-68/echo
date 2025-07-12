const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
const echoRoutes = require("./routes/echoRoutes");
app.use("/api/echo", echoRoutes);
app.use("/audio", express.static(path.join(__dirname, "public/audio")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
