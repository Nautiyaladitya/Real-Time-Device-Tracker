const express = require("express");
const app = express();
const path = require('path');
const http = require("http");
const socketio = require("socket.io"); 

// Create server and initialize Socket.io
const server = http.createServer(app);
const io = socketio(server);

// Set EJS as view engine
app.set("view engine", "ejs");

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io event handling for device tracking
io.on("connection", function (socket) {
    console.log("New user connected");

    // Handle location sending from client
    socket.on("send-location", function (data) {
        io.emit("receive-location", { id: socket.id, ...data });
    });
    
    // Handle user disconnection
    socket.on("disconnect", function () {
        io.emit("user-disconnected", socket.id);
    });
});

// Serve index.ejs for the root route
app.get("/", function (req, res) { 
    res.render("index");
});

// API to handle device location requests
app.get('/api/deviceLocation', (req, res) => {
    // Logic for tracking device location can go here
    res.json({ message: "Device location data" });
});

// Set up dynamic port for deployment and local development
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
