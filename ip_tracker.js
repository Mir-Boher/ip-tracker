const searchBar = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const locationPin = document.getElementById("location");
const timezone = document.getElementById("timezone");
const ipAddress = document.getElementById("ip-address");
const isp = document.getElementById("isp");

searchBtn.addEventListener("click", async (e) => {
  const inputIp = searchBar.value;
  e.preventDefault();
  searchBtn.disabled = true;
  try {
    const response = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_ghPWw19zv1s2ta5XJwgkVul2acKY7&ipAddress=${inputIp}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    updateUl(data);
  } catch (error) {
    console.error(error);
  } finally {
    searchBtn.disabled = false;
  }
});

//To update the Info Tab
function updateUl(data) {
  locationPin.textContent = data.location.region;
  timezone.textContent = `UTC ${data.location.timezone}`;
  ipAddress.textContent = data.ip;
  isp.textContent = data.isp;
  updateMap(data.location.lat, data.location.lng);
}

// Map Code
let map = null;
const defaultPosition = [47.61038, -122.20068];
const defaultZoom = 13;
function initializeMap() {
  if (map) {
    map.remove();
  }
  map = L.map("map").setView(defaultPosition, defaultZoom);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
}

function updateMap(lat, lng) {
  if (!map) {
    initializeMap();
  }
  map.setView([lat, lng], defaultZoom);

  //Clear existing marker
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  // Add new marker
  const marker = L.marker([lat, lng]).addTo(map);
}

// Initialize map and get initial IP data on page load
document.addEventListener("DOMContentLoaded", () => {
  initializeMap();
});

// Handle window resize
window.addEventListener("resize", () => {
  if (map) {
    map.invalidateSize();
  }
});
