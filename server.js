const express = require('express');
const app = express();
const fetch = require('node-fetch');
require('dotenv').config();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.get('/getcoords/:address', async (request, response) => {
    const address = request.params.address;
    // const position_response = await fetch(`http://api.positionstack.com/v1/forward?access_key=${process.env.POSITION_API_KEY}&query=1600%20Pennsylvania%20Ave%20NW,%20Washington%20DC`);
    const url = `http://api.positionstack.com/v1/forward?access_key=${process.env.POSITION_API_KEY}&query=${address}`;
    console.log(url);
    const position_response = await fetch(url);
    const json = await position_response.json();
    console.log(json);
    response.json({address_sent: address});
});

