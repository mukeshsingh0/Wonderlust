document.addEventListener("DOMContentLoaded", () => {
  const mapDataDiv = document.getElementById("map-data");
  if (!mapDataDiv) return;

  const mapData = JSON.parse(mapDataDiv.getAttribute("data-json"));

  const map = L.map("map").setView([mapData.lat, mapData.lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  L.marker([mapData.lat, mapData.lng]).addTo(map).bindPopup(mapData.title).openPopup();
});
