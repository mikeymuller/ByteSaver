const express = require('express');
const cors = require('cors')
const app = express();
const yelp = require('yelp-fusion');
const client = yelp.client('GfsZc4h-ESg3ARcmBhqJzbjILIrhlMPFM_gO2O75dJzgM5MoXgh4FE9y9Zc2CTqlSiYTgl-eI_ZVJzp3ohENFHpEZi4_E88REYFz11zo5xrQFKTTWbkANTXxC-DZXXYx');

app.use(cors())

app.get('/', (req,res) =>{
    res.send("API page");
});

app.get('/api/search', async (req,res) =>{
    let routeParams = req.query;
    let state= routeParams.state;
    let city = routeParams.city;
    await client.search({
        term: 'restaurants',
        location: `${city}, ${state}`,
        sort_by: 'rating',
        limit : 50
        }).then(response => {
        searchResponse = response.jsonBody.businesses;
        }).catch(e => {
        console.log(e);
        });    
    res.send(searchResponse);
});


const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Listening on port ${port}...`));