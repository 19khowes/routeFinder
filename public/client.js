// map things
let mymap = L.map('map').setView([43.6735741,-111.9326901], 10);

let newmarker;

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaG93ZXNrYWRlIiwiYSI6ImNrczllaWV1dzBzMnUyeG56ZG1jOHk4dXIifQ.Im7XZC_A12MSAGzRcTwhAg', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiaG93ZXNrYWRlIiwiYSI6ImNrczllaWV1dzBzMnUyeG56ZG1jOHk4dXIifQ.Im7XZC_A12MSAGzRcTwhAg'
}).addTo(mymap);


// non map things
const addressInput = document.getElementById('address-input');
const submitButton = document.getElementById('submit');
let dropArea = document.getElementById('drop-area');

submitButton.addEventListener('click', async () => {
    const option = {
        method: 'POST',
    };
    const response = await fetch('/getcoords');
    const json = await response.json();
    const people = json.people_array;

    for (person of people) {
        console.log(person.latitude, person.longitude);
        const lat = person.latitude;
        const lon = person.longitude;
        const label = person.pos_label;
        const name = person.name;
        newmarker = L.marker([lat, lon]).addTo(mymap);
        newmarker.bindPopup(`${name}: ${label}`);
    }

    // const data = json.data[0];
    // const lat = data.latitude;
    // const lon = data.longitude;
    // const label = data.label;
    // console.log(lat, lon);
    // // Create marker for coordinates
    // newmarker = L.marker([lat, lon]).addTo(mymap);
    // newmarker.bindPopup(label);
    // // // console.log(latInput.value, lonInput.value);
});

dropArea.addEventListener('dragenter', preventDefaults, false);
dropArea.addEventListener('dragover', preventDefaults, false);
dropArea.addEventListener('dragleave', preventDefaults, false);
dropArea.addEventListener('drop', preventDefaults, false);

function preventDefaults(event) {
    event.preventDefault();
    event.stopPropagation();
}

dropArea.addEventListener('dragenter', highlight, false);
dropArea.addEventListener('dragover', highlight, false);

dropArea.addEventListener('dragleave', unhighlight, false);
dropArea.addEventListener('drop', unhighlight, false);

function highlight(event) {
    dropArea.classList.add('highlight')
}

function unhighlight(event) {
    dropArea.classList.remove('highlight')
}

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(event) {
    let transfer = event.dataTransfer;
    let files = transfer.files;

    handleFiles(files);
}

function handleFiles(files) {
    ([...files]).forEach(uploadFile);
}

async function uploadFile(file) {
    // console.log(file);
    let url = '/dropped'; // Put url for sending to server
    let formData = new FormData();

    formData.append('file', file);
    console.log(formData);
    let options = {
        method: 'POST',
        // headers: {
        //     'Content-Type': 'multipart/form-data'
        // },
        body: formData
    }

    const response = await fetch(url, options);
    const json = await response.json();
    // json here contains people_array with people's longitude/latitude and all that
    console.log(json);

    // mapping out the people array    
    const people = json.people_array;
    for (person of people) {
        console.log(person);
        const lat = person.latitude;
        const lon = person.longitude;
        const label = person.pos_label;
        const name = person.name;
        newmarker = L.marker([lat, lon]).addTo(mymap);
        newmarker.bindPopup(`${name}: ${label}`);
    }
}