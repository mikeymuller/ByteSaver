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
        let priceFilter = document.getElementsByClassName('price')[0].value; 
        let ratingFilter = document.getElementsByClassName('rating')[0].value; 
        let radiusFilter = document.getElementsByClassName('radius')[0].value; 
        let cuisineFilter = document.getElementsByClassName('cuisine')[0].value; 
    
        if(locationText == ''){
            console.log("empty");
        }
        else{
            if(validateCity(locationText)){
    

                /*Public data store - post every time there is a new location searched*/
                new axios.post('http://localhost:3000/public/cities', 
                {
                    data: locationText, 
                    type: "merge", 
                })
                .then(response => console.log(response))
                .catch(error => console.log(error))


    /* 
    Private data store
    Will first check if location already exists with a get request, get the count, and post the count +1. 
    If the location doesn't exist, it will throw a 401 error and go to the catch block. Post the location with a count of 1. 
    */
     let searchedCities = axios.get('http://localhost:3000/private/cities' + '/' + locationText, 
                    {headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}}, 
      ).then((results) => {
        axios.post('http://localhost:3000/private/cities' + '/' + locationText, 
        {
            data:  results.data.result + 1,
        },
        {headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}}, 
        )
                  window.location.href = `results.html?state=${stateParam}&city=${cityParam}`;
 
         
     }).catch((err) => {
        console.log(err)
        axios.post('http://localhost:3000/private/cities' + '/' + locationText, 
        {
            data:  1,
        },
        {headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}}, 
        ) 
        .then(res => 
              window.location.href = `results.html?state=${stateParam}&city=${cityParam}`
            )
        .catch(err => console.log(err));

     })

                
                window.location.href = `results.html?state=${stateParam}&city=${cityParam}&type=search`;
            }
           else{
                console.log("city not found");
            }
        }
    }

$().ready(function() {
    setUpAutocompleter();
});