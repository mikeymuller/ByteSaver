import { UserStorage } from "./models/UserStorage.js";
import { parseLocation } from "./utilities/locationParser.js";

let CITIES = [];
let cityParam = undefined;
let stateParam = undefined;
let token = localStorage.getItem('token');

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

const searchButtonHandler = function(){
        let locationText = $('.location-input').val();
        let filterValues = {
            "price": $('#price_filter').val().toLowerCase(),
            "rating": $('#rating_filter').val().toLowerCase(),
            "cuisine": $('#cuisine_filter').val().toLowerCase()
        };

        console.log(filterValues);
    
        if(locationText == ''){
            console.log("empty");
        }
        else{
            if(validateCity(locationText)){
                let url = `results.html?type=search&state=${stateParam}&city=${cityParam}&price=${filterValues.price}&rating=${filterValues.rating}&cuisine=${filterValues.cuisine}`;
                window.location.href = url;

            } else {
                console.log("city not found");
            }
        }
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

const listHandler = function(){
    console.log("clicked");
}

const addListsHandler = function(){
    $(".restaurant-list").on("click", function(event){
        listHandler();
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
                let location = parseLocation(lists[index]);
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

const setUpPage = async function(){
    $(".location-search-button").on("click", function(){
        searchButtonHandler();
    });

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