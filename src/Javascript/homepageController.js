let CITIES = [];
let cityParam = undefined;
let stateParam = undefined;

export const setUpAutocompleter = function(){ 
    console.log(localStorage.getItem('token'));
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