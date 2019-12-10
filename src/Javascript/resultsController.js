import { APICaller } from "./models/APICaller.js";
import { UserStorage } from "./models/UserStorage.js";

let RESTAURANTS = [];
let restaurant_ids = [];
let yelp = new APICaller();

let handleListButton = function(button_id, city, state) {

    let button = document.getElementById("list_button_" + button_id);
    let user = new UserStorage();

    if (button.classList.contains("btn-primary")) {
        button.classList.replace("btn-primary", "btn-danger");
        button.innerHTML = "Remove";
        user.addToList(city, state, getRestaurantObject(button_id), localStorage.getItem('token'));

    } else {
        button.classList.replace("btn-danger", "btn-primary");
        button.innerHTML = "Add";
        user.deleteRestaurant(city, state, button_id, localStorage.getItem('token'));
    }
}

export const getRestaurantObject = function(restaurant_id) {
    let restaurant;
    RESTAURANTS.forEach(element => {
        if (element.id == restaurant_id){
            restaurant = element;
        }
    });
    return restaurant;
}
/*
*  Check if an id is in the user's list
*/
export const isInList = function(card_id) {
    return false;
}

export const loadSidePanel = function(data, search) {
    populateList(data, search);
};

let populateList = function(first_list, search) {

    if ($('#results_cards').length) {
        $('#results_cards').empty();
    }

    if (search) {
        $('#side_panel').append('<div id="results_cards"></div>');

        first_list.forEach((item) => {

            let add = `<a href="#" id="list_button_${item.id}" class="btn btn btn-primary text-light btn-block">Add</a>`;
            let remove = `<a href="#" id="list_button_${item.id}" class="btn btn btn-danger text-light btn-block">Remove</a>`;
            let button = isInList(item.id) ? remove : add;
            
            $("#results_cards").append(
                `<div id="card_${item.id}" title="${item.id}" class="card shadow-sm p-3 mb-3 bg-white rounded">
                        <div class="card-body">
                            <h3 class="card-title">${item.name}</h3>
                            <p class="card-text"></p>
                            ` + button + `
                        </div>
                    </div>`
            );
        });
    } else {
        console.log("show list");
    }
    
}

export const loadMainPanel = function(restaurant_id) {
    let restaurant = getRestaurantObject(restaurant_id);

    let categories = `<p>`;
    for (let i = 0; i < restaurant.categories.length - 1; i++){
        categories += `${restaurant.categories[i].title}, `;
    }
    categories += `${restaurant.categories[restaurant.categories.length-1].title}<\p>`;

    $('#main_panel').html(`<h1>${restaurant.name}</h1>
                                <figure class = "figure">
                                    <img src=${restaurant.image_url} class="halfPage">
                                </figure>
    ` + categories);

}

$(document).on('change', '#list_selector', () => {
    loadSidePanel("jamesb3", "Chapel Hill", document.getElementById('list_selector').value);
});

export const makeCardsClickable = function() {
    RESTAURANTS.forEach((item) => {
        $('#card_' + item.id).click(() => {
            loadMainPanel(item.id);
        })
        $('#list_button_' + item.id).click(() => {
            handleListButton(item.id, yelp.getUrlParameter('city'));
        });
    });
}

export const filterRestaurants = function() {
    let cuisine = yelp.getUrlParameter('cuisine');
    RESTAURANTS = cuisine == "blank" ? RESTAURANTS : yelp.filter(RESTAURANTS, [cuisine]);
}

$(function() {

    if (yelp.getUrlParameter('type') == 'search') {
        return new Promise((resolve, reject) => {
            return yelp.search(yelp.getUrlParameter('city'), yelp.getUrlParameter('state')).then((result) => {
                RESTAURANTS = result;
            }).then(() => {
                filterRestaurants();
            }).then(() => {
                loadSidePanel(RESTAURANTS, true);
            }).then(() => {
                makeCardsClickable();
            });
        });
    }
});