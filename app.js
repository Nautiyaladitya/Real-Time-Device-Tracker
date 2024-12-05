const express = require("express");
const app = express();
const path = require('path');
const http = require("http");
const socketio = require("socket.io");  // socket.io pe server chal raha hai

// app.use(express.json()); // extra to remove !!!!!!!!!!!!!!
const server = http.createServer(app); //(ye server bana ke dega),  In node modules there is this main method to create server 
const io = socketio(server); //calling socketio function & will use this io variable in future !
// end boiler -> socket.io


// performing ejs

app.set("view engine", "ejs");  // view engine set up 
app.use(express.static(path.join(__dirname, "public"))); 
//Middleware to serve static files , setting public folder so that we can acces our static files eg. images css file etc in public folder & use vanilla js..

//handling request comming from io in script.js || Handling socket.io connections
io.on("connection", function (socket){
    console.log("New user connected");
    socket.on("send-location", function (data){
        io.emit("receive-location", {id: socket.id, ...data});
    });
    
    socket.on("disconnect", function () {  // handling disconnect in backend , release this event. 
        io.emit("user-disconnected", socket.id);
    });
});


app.get("/", function (req, res) { // created a route
    res.render("index"); // rendering .ejs file
});

server.listen(3000, ()=> {
    console.log("Server is running on http://localhost:3000");

});

