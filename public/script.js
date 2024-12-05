const socket = io(); // send conn. req to backend 

if (navigator.geolocation) {
navigator.geolocation.watchPosition( 
(position) => {
const { latitude, longitude } = position.coords; 

// Emit location to the server
socket.emit("send-location", { latitude, longitude }); 

},
(error) => {
console.error(error); 
},
{
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
}

);
}

const map = L.map("map").setView([0,0], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Aditya Nautiyal",
}).addTo(map);

const markers = {};

// Listen for location updates from other users
socket.on("receive-location", (data)=>{
    const {id, latitude, longitude} = data;
     map.setView([latitude, longitude], );  // Update the map view to center on the new location
    
    // Update marker position or create a new marker
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    }
    else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);

    }
});



// Handle user disconnection
socket.on("user-disconnected", (id) => {
    if(marker[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }      
});