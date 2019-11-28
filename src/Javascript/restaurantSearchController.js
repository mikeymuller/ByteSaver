import search from './APICaller.js';

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

async function setUp(){
    
    let city = getUrlParameter('city');
    let state = getUrlParameter('state');
    $('.main').append(`<h1> Calling Restaurants in ${getUrlParameter('city')}</h1>`);

    //Example call to yelp Api
    let yelpAPIresponse = await search(city,state);
    console.log(yelpAPIresponse);
}

$().ready(function() {
    setUp();
});