import { UserStorage } from "./models/UserStorage.js";
import { PrivateStorage } from "./models/PrivateStorage.js";
import { parseLocation } from "./utilities/locationParser.js";
import { APICaller } from "./models/APICaller.js";
import { Matcher } from "./models/Matcher.js";

let CITIES = [];
let cityParam = undefined;
let stateParam = undefined;
let privateStorage = new PrivateStorage();
let token = localStorage.getItem('token');
let yelp = new APICaller();
let matcher = new Matcher();


export const setUpAutocompleter = function(){ 
        new axios.get(`http://localhost:3000/public/CITIES`,{
            headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}
        }, 
        ).then( (result) =>{
            CITIES = result.data.result;
        }).catch(error => {
            console.log("Restaurants not found");
        });
    
    let $locationInput = $('.location-input');
     
    $locationInput.autoComplete({
        minChars: 1,
        delay: 200,
        source: function(term, suggest){
            term = term.toLowerCase();
            var choices = CITIES;
            var matches = [];
            for (let i=0; i<choices.length; i++)
                if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
            suggest(matches);
        },
        onSelect: function(e, term, item){
            console.log(term);
        }
    });
}

export const filterRestaurants = function(RESTAURANTS, cuisine, price, rating) {

    return yelp.filterByParameters(RESTAURANTS, price, rating, cuisine);
}

const searchButtonHandler = async function(){
    let locationText = $('.location-input').val();
    let filterValues = {
        "price": $('#price_filter').val().toLowerCase(),
        "rating": $('#rating_filter').val().toLowerCase(),
        "cuisine": $('#cuisine_filter').val().toLowerCase()
    };

    console.log(filterValues);

    if(locationText == ''){
        console.log("empty");
        noRestaurantsFound();
    }
    else{
        let there_is_an_issue = false;
        if (!locationText.includes(",")) {
            locationText = matcher.matchCity(CITIES, locationText);
            if (typeof locationText === 'undefined') {
                there_is_an_issue = true;
            }
            console.log(locationText);
        }
        if (!there_is_an_issue) {
            if(validateCity(locationText)){
                await privateStorage.incrementCity(cityParam, stateParam, token);
                let url = `results.html?type=search&state=${stateParam}&city=${cityParam}&price=${filterValues.price}&rating=${filterValues.rating}&cuisine=${filterValues.cuisine}`;
                let returned_restaurants = [];
                yelp.search(cityParam,stateParam).then((result) => {
                    returned_restaurants = filterRestaurants(result, filterValues.cuisine, filterValues.price, filterValues.rating);
                }).then(() => {
                    if (returned_restaurants == null) {
                        noRestaurantsFound();
                    } else if (returned_restaurants.length == 0) {
                        noRestaurantsFound();
                    } else {
                        window.location.href = url;
                    }
                });
            } else {
                noRestaurantsFound();
            }
        } else {
            noRestaurantsFound();
        }
        
    }
}

const noRestaurantsFound = function() {
    console.log('No restaurants returned');
    $('#search_error_message').html(`<p style="color: red">Your search did not return any results.</p>`);
}

const validateCity = function(input){

    let result = false;
    for(let i =0; i< CITIES.length; i++){
        let city = CITIES[i];
        let splitString = city.split(",");
        let cityName = splitString[0].toLowerCase().trim();
        let stateName = splitString[1].toLowerCase().trim();
        let inputCityName = input.split(",")[0].toLowerCase().trim();
        let inputstateName = input.split(",")[1].toLowerCase().trim();
        if(stateName == inputstateName && cityName == inputCityName){
            cityParam = cityName;
            stateParam = stateName;
            result = true;
            break;
        }
    }
    return result;
}

const listHandler = async function(event){
    console.log($(event.target).text());
    let list_name = $(event.target).text();
    console.log(list_name);
    if (list_name.trim() != "Disliked") {
        let list_parts = list_name.split(" ");
        let stateParam = list_parts[list_parts.length-1];
        let cityParam = '';
        for(let i = 0; i < list_parts.length - 1; i++) {
            cityParam += list_parts[i];
            if (i < list_parts.length - 2) {
                cityParam += " ";
            }
        }
        console.log(stateParam);
        console.log(cityParam);
        console.log("clicked");

        let filterValues = {
            "price": "blank",
            "rating": "blank",
            "cuisine": "blank"
        };

        console.log(filterValues);
        console.log(cityParam + ", " + stateParam);
        if(validateCity(cityParam + ", " + stateParam)){
            let url = `results.html?type=list&state=${stateParam.toLocaleLowerCase()}&city=${cityParam.toLocaleLowerCase()}&price=${filterValues.price}&rating=${filterValues.rating}&cuisine=${filterValues.cuisine}`;
            window.location.href = url;

        } else {
            console.log("city not found");
        }
    } else {
        let url = `results.html?type=disliked&state=blank&city=blank&price=blank&rating=blank&cuisine=blank`;
        window.location.href = url;
    }
    
    
}

const addListsHandler = function(){
    $(".restaurant-list").on("click", function(event){
        listHandler(event);
    });
}

const renderListTiles = function(lists){
    let numLists = lists.length;
    let numRows = Math.ceil(numLists / 3);
    let divText = "<div></div>";

    let $myLists = $('.my_lists');
    for(let i = 0; i < numRows; i++){
        let $row = $(divText).addClass("row");
        for(let j = 0; j < 3; j++){
            let index = i*3+j;
            let $col = $(divText).addClass("col").addClass("restaurant-column");
            if(index < numLists){
                let location = null;
                if(lists[index] != "disliked"){
                    if (!lists[index].includes(",")) {
                        location = matcher.matchCity(lists[index]);
                    } else {
                        location = parseLocation(lists[index]);
                    }
                }
                else{
                    location = ["Disliked",""]
                }
                let $city = $(`<span>${location[0]}</span> <br>`).css("font-size", "2em");
                let $state = $(`<span>${location[1]}</span>`).css("font-size", "1.5em");
                $col.append($city);
                $col.append($state); 
                $col.addClass("restaurant-list");
            }
            $row.append($col);
        }
        $myLists.append($row);
    }
}

const renderDefaultLists = function(){
    let $myLists = $('.my_lists');
    let divText = "<div></div>";
    let $row = $(divText).addClass("row");
    let $col = $(divText).addClass("col");
    $col.addClass("default-list");
    $col.append("Search for and save restaurants to create a list!");
    $row.append($col);
    $myLists.append($row);
}

const renderMostPopularCities = async function(){
    let cities = await privateStorage.getMostPopularCities(token)
    .catch(err=>{
        console.log("No cities for popular searches");
    });
    let $popSearches = $(".popular-searches");
    if(cities[0] !== undefined){
        cities.forEach(city =>{
            let location = parseLocation(city);
            location = location[0] + ', ' + location[1];
            let $popLocation = $(`<span>${location}</span>`).addClass("popular-location");
            $popSearches.append($popLocation);
        });
    }
    else{
        let $popLocation = $(`<span>None!</span>`).addClass("popular-location");
        $popSearches.append($popLocation);
    }
}

const setUpPage = async function(){
    $(".location-search-button").on("click", function(){
        searchButtonHandler();
    });

    renderMostPopularCities();
    
    console.log("here");
    let userStorage = new UserStorage();
    let lists = await userStorage.getCitysWithLists(token);

    

    if(lists.length != 0){
        renderListTiles(lists);
    }
    else{
        renderDefaultLists();
    }
    addListsHandler();
}

$().ready(function() {
    setUpPage();
    setUpAutocompleter();
});