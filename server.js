const {
    response
} = require('express');
const express = require('express');
const fs = require('fs');
const app = express();
const fetch = require('node-fetch');
const formidable = require('formidable');
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
        if (address[0] == '"') {
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
    response.json({
        people_array
    });
});

app.post('/dropped', (request, response) => {
    const people_array = [];
    let form = new formidable.IncomingForm();
    // parse in incoming file
    form.parse(request, async (err, fields, files) => {
        // find the temporaty path of file that came in and read it in to tempFile
        const tempFile = await fs.readFileSync(files.file.path, 'utf-8');
        // console.log(tempFile);

        // parse out the rows/cols of file and make people array of objects
        const people = [];
        const rows = tempFile.split('\r\n');
        rows.splice(0, 1);
        for (row of rows) {
            const cols = row.split('",');
            let address = cols[0];
            let length = address.length;
            if (address[0] == '"') {
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
        for (person of people) {
            const url = `http://api.positionstack.com/v1/forward?access_key=${process.env.POSITION_API_KEY}&query=${person.address}`;
            const position_response = await fetch(url);
            const json = await position_response.json();
            if (json.data) {
                person.latitude = json.data[0].latitude;
                person.longitude = json.data[0].longitude;
                person.pos_label = json.data[0].label;
            }
            // add coordinate info to people_array to send back
            people_array.push(person);
        }
        console.log(people_array);
        response.json({
            people_array
        });
    });
});