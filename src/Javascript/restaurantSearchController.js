import Yelp from "./yelpService.js";

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function setUp(){
    let yelp = new Yelp();
    
    let city = getUrlParameter('city');
    let state = getUrlParameter('state');
    $('.main').append(`<h1> Restaurants in ${getUrlParameter('city')}</h1>`);
    let result = yelp.businessSearch();
    console.log(result);
    //$('.main').append(`<p>${result}</p>`);
}

$().ready(function() {
    setUp();
});