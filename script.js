// ✅ Firebase modules import karo
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// ✅ Firebase config (apne project ka config yaha daalo)
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxx",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// ✅ Firebase initialize
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ✅ Leaflet map initialize
const map = L.map("map").setView([25.4358, 81.8463], 13); // Default: Prayagraj

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

// ✅ Marker storage
const markers = {};

// ✅ Realtime bus data fetch from Firebase
function loadBuses(city) {
  const busRef = ref(db, `buses/${city}`);
  onValue(busRef, (snapshot) => {
    const buses = snapshot.val();
    const busListDiv = document.getElementById("bus-list");
    busListDiv.innerHTML = ""; // clear old list

    if (!buses) return;

    Object.keys(buses).forEach((busId) => {
      const bus = buses[busId];
      const { lat, lng, status } = bus;

      // ✅ Update marker on map
      if (markers[busId]) {
        markers[busId].setLatLng([lat, lng]);
      } else {
        markers[busId] = L.marker([lat, lng])
          .addTo(map)
          .bindPopup(`<b>Bus ID:</b> ${busId}<br><b>Status:</b> ${status}`);
      }

      // ✅ Add to bus list panel
      const busDiv = document.createElement("div");
      busDiv.textContent = `🚌 ${busId} - ${status}`;
      busDiv.onclick = () => {
        map.setView([lat, lng], 15);
        markers[busId].openPopup();
      };
      busListDiv.appendChild(busDiv);
    });
  });
}

// ✅ City selection change
document.getElementById("city-select").addEventListener("change", (e) => {
  const city = e.target.value;
  loadBuses(city);
});

// ✅ Search functionality
document.getElementById("bus-search").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const buses = document.querySelectorAll("#bus-list div");
  buses.forEach((bus) => {
    bus.style.display = bus.textContent.toLowerCase().includes(query)
      ? "block"
      : "none";
  });
});

// ✅ Load default city on start
loadBuses("city1");
