export default class Yelp{
    /*constructor(apiKey){
        this.client = new YelpClient(apiKey);
    }*/

    businessSearch(){

        return axios({
            method: 'GET',
            url: 'https://api.yelp.com/v3/businesses/search',
            headers: {
                'Authorization': 'Bearer GfsZc4h-ESg3ARcmBhqJzbjILIrhlMPFM_gO2O75dJzgM5MoXgh4FE9y9Zc2CTqlSiYTgl-eI_ZVJzp3ohENFHpEZi4_E88REYFz11zo5xrQFKTTWbkANTXxC-DZXXYx',
                'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                'Access-Control-Allow-Origin' : '*',
            },
            params: {
                term: "restaurants",
                location:"portland, or"
            },
            mode: 'no-cors',
          });

        /*
        this.client.search({
            term: 'restaurants',
            location: `${city}, ${state}`,
          }).then(response => {
            return response.jsonBody;
          }).catch(e => {
            console.log(e);
          });
          */
    }
}

