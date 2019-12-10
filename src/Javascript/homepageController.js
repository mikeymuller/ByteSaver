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
                if (choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
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



async function setUpSavedLists() {

     let searchedCities = axios.get("http://localhost:3000/user/lists/",
                    {headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}}, 
      ).then((results) => {
       let lists = results.data.result; 

       for(let i = 0; i < lists.length; i++) {
            let e = document.createElement("div"); 
            e.innerHTML = lists[i]; 
            e.classList.add("list")
            $(".my_lists").append(e);
            e.addEventListener('click', function() {
                getListDetails(lists[i])
            }); 
           }
        
     }).catch((err) => {
        let e = document.createElement("div"); 
        e.innerHTML = "You do not have any saved lists!" 
        e.classList.add("no-lists")
        $(".my_lists").append(e); 
     })

}


async function getListDetails(listName) {
    console.log(listName); 


    let searchedCities = axios.get('http://localhost:3000/user/lists/' + listName,
                    {headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}}, 
     ).then((results) => { 
        addListDetails(results.data.result, listName); 
}); 

}

export const addListDetails = function(resturants, listName) {
    console.log(resturants)

    $(".my_lists").empty(); 
    $(".my_lists").prepend("List: " + listName)
    $(".my_lists").append('<br>')
    for(let i = 0; i < resturants.length; i++) {
        let e = document.createElement("div"); 
            e.innerHTML = resturants[i]; 
            e.classList.add("resturant"); 
            e.classList.add("col"); 
            $(".my_lists").append(e);
    }

    let e = document.createElement("button"); 
    e.innerHTML = "Back to my lists"
    $(".my_lists").append(e);
    e.addEventListener('click', function() {
        $(".my_lists").empty(); 
        setUpSavedLists()
    })

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

async function loadMostPopularSearches() {
    $(".popular-searches").append('<br>'); 

    //first get request gets the objects {city: count}, second request gets the city to use as the key for the objects 
    let searchedCities = axios.get('http://localhost:3000/private/cities/', 
                    {headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}}, 
      ).then((results) => {
        let counts = results.data.result; 

        let searchedCities = axios.get('http://localhost:3000/private/cities', 
                    {headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}}, 
        ).then((results) => {
            
            let cities = results.data.result; 

            //put all the counts into an array aand sort them 
           let sorted_counts = []; 
           for(let i = 0; i < counts.length; i++) { 
                sorted_counts[i] = cities[counts[i]];
           } 
           sorted_counts.sort(); 
           
           //get the top 3 counts from the sorted array 
           let top3 =[]; 
           let j = 0; 
           for(let i = sorted_counts.length -1; i>=0; i--) {
               top3[j] = sorted_counts[i]; 

               j++; 
               if(j == 3) {
                   break; 
               }
           }

           //goes throuogh the cities and if the city's count is in the top3, add it to the most popular cities
           for(let i = counts.length - 1; i >= 0 ; i--) {
                console.log(i)
               if(top3.includes(cities[counts[i]])) {
                   
                let city = counts[i]; 
                let e = document.createElement("div"); 
                e.innerText = counts[i]; 
                e.classList.add("popularcity")
                e.addEventListener('click', function() {
                    validateCity(counts[i]); 
                    window.location.href = `results.html?state=${stateParam}&city=${cityParam}`;
                })
                $(".popular-searches").append(e); 
                   
               }


           }
     }); 

})
}



$().ready(function() {
    setUpPage();
    setUpAutocompleter();
    loadMostPopularSearches(); 
    setUpSavedLists(); 
});


