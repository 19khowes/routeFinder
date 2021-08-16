const express = require('express');
const fs = require('fs');
const app = express();
const fetch = require('node-fetch');
require('dotenv').config();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.get('/getcoords', async (request, response) => {
    // Read in csv and put people and addresses into an array of objects called people
    const people = [];
    const csv = await fs.readFileSync('examplecsv - Sheet1.csv', 'utf8');
    const rows = csv.split('\r\n');
    rows.splice(0, 1);
    for (row of rows) {
        const cols = row.split('",');
        let address = cols[0];
        let length = address.length;
        if (address[0] == '"'){
            address = address.slice(1, address.length);
        }
        const person = {
            name: cols[1],
            address: address
        }
        people.push(person);
    }
    // console.log(people);

    // Go through array of people and get their coordinates based on address
    const people_array = [];
    for (person of people) {
        const url = `http://api.positionstack.com/v1/forward?access_key=${process.env.POSITION_API_KEY}&query=${person.address}`;
        const position_response = await fetch(url);
        const json = await position_response.json();
        person.latitude = json.data[0].latitude;
        person.longitude = json.data[0].longitude;
        person.pos_label = json.data[0].label;
        people_array.push(person);
    }
    // const position_response = await fetch(`http://api.positionstack.com/v1/forward?access_key=${process.env.POSITION_API_KEY}&query=1600%20Pennsylvania%20Ave%20NW,%20Washington%20DC`);
    // response.json(json);

    // Send back people array
    console.log(people_array);
    response.json({people_array});
});