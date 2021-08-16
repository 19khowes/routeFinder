let mymap = L.map('map').setView([41.750694, -111.816532], 5);

let newmarker;

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaG93ZXNrYWRlIiwiYSI6ImNrczllaWV1dzBzMnUyeG56ZG1jOHk4dXIifQ.Im7XZC_A12MSAGzRcTwhAg', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiaG93ZXNrYWRlIiwiYSI6ImNrczllaWV1dzBzMnUyeG56ZG1jOHk4dXIifQ.Im7XZC_A12MSAGzRcTwhAg'
}).addTo(mymap);

const addressInput = document.getElementById('address-input');
const submitButton = document.getElementById('submit');

submitButton.addEventListener('click', async () => {
    const option = {
        method: 'POST',
    };
    const response = await fetch(`/getcoords/${addressInput.value.trim()}`);
    const json = await response.json();
    const data = json.data[0];
    const lat = data.latitude;
    const lon = data.longitude;
    const label = data.label;
    console.log(lat, lon);
    // Create marker for coordinates
    newmarker = L.marker([lat, lon]).addTo(mymap);
    newmarker.bindPopup(label);
    // // console.log(latInput.value, lonInput.value);
});