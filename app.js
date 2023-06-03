const express = require("express");
const YAML = require("yamljs");
require("dotenv").config();
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/AuthRoutes");
const socketHandler = require("./utils/socketHandler");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const swaggerDocument = YAML.load(path.resolve(__dirname, "swagger.yaml"));
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
// Middleware
app.use(express.json());

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/blogs", blogRoutes);
app.use("/auth", authRoutes);
app.use(express.static("public"));
app.use("/auth", authRoutes);


// Socket.io
io.on("connection", (socket) => {
  socketHandler(socket, io);
});

// Start the server
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
