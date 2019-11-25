const CITIES = ['Portland, OR', 'Boston, MA', 'Chapel Hill, NC'];
let cityParam = undefined;
let stateParam = undefined;

export const setUpAutocompleter = function(){ 

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

const searchButtonHandler = function(){
    let locationText = $('.location-input').val();
    if(locationText == ''){
        console.log("empty");
    }
    else{
        if(validateCity(locationText)){
            window.location.href = `restaurantSearch.html?state=${stateParam}&city=${cityParam}`;
        }
        else{
            console.log("city not found");
        }
    }
}

export const setUpPage=function(){
    $(".location-search-button").on("click", function(){
        searchButtonHandler();
    });
}

const validateCity = function(input){
    let result = false;
    CITIES.forEach(city =>{
        let splitString = city.split(",");
        let cityName = splitString[0].toLowerCase().trim();
        let stateName = splitString[1].toLowerCase().trim();
        let inputName = input.split(",")[0].toLowerCase().trim();
        if(city == input || cityName == inputName){
            cityParam = cityName;
            stateParam = stateName;
            result = true;
            return;
        }
    });
    return result;
}


$().ready(function() {
    setUpPage();
    setUpAutocompleter();
});