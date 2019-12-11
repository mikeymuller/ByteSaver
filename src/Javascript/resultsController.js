import { APICaller } from "./models/APICaller.js";
import { UserStorage } from "./models/UserStorage.js";
import { PageBuilder } from "./models/PageBuilder.js";

let RESTAURANTS = [];
let restaurant_ids = [];
let yelp = new APICaller();
let city = yelp.getUrlParameter('city');
let state = yelp.getUrlParameter('state');
let type = yelp.getUrlParameter('type');
let token = localStorage.getItem('token');
let user = new UserStorage();
let pb = new PageBuilder();
let list = {}
user.getList(city, state, token).then((result) => {
    list = result;
});

let handleListButton = function(button_id, city, state) {

    let button = document.getElementById("list_button_" + button_id);

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

export const getRestaurantObject = function (restaurant_id) {
    let restaurant;
    RESTAURANTS.forEach(element => {
        if (element.id == restaurant_id) {
            restaurant = element;
        }
    });
    return restaurant;
}
/*
*  Check if an id is in the user's list
*/
export const isInList = function (card_id) {
    if (list == null) {
        return false;
    } else {
        let found = false;
        Object.keys(list).forEach((item) => {
            if (item == card_id) {
                found = true;
            }
        })
        return found;
    }
}

export const loadSidePanel = function (data, search) {
    populateList(data, search);
};

let populateList = function (first_list, search) {

    if (search) {
        
        $('#side_panel').append(`<nav class="navbar navbar-light bg-light">
                                    <form class="form-inline">
                                        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
                                        <button class="btn btn-outline-primary my-2 my-sm-0" type="submit">Search</button>
                                    </form>
                                 </nav>
                                <div id="results_cards"></div>`);

        first_list.forEach((item) => {
            $("#results_cards").append(pb.getSearchCard(item, isInList(item.id)));
        });
    } else {
        console.log("show list");
    }
}

export const getReviews = async function (alias) {
    let yelp = new APICaller();
    let reviews = await yelp.getReviews(alias);

    let allReviews = [];
    for (let i = 0; i < 3; i++) {
        console.log(reviews);
        allReviews.push(pb.getReviewHTML(yelp.getReviewText(reviews[i]), yelp.getReviewRating(reviews[i]), yelp.getReviewUserName(reviews[i])));
    }
    return allReviews;
}

export const loadMainPanel = async function (restaurant_id) {
    let restaurant = getRestaurantObject(restaurant_id);

    let categories = `<p>`;
    for (let i = 0; i < restaurant.categories.length - 1; i++) {
        categories += `${restaurant.categories[i].title}, `;
    }
    categories += `${restaurant.categories[restaurant.categories.length - 1].title}<\p>`;

    let transactions = ["No", "No", "No"];
    for (let i = 0; i < restaurant.transactions.length - 1; i++) {
        if (restaurant.transactions[i] === "delivery") {
            transactions[0] = "Yes";
        }
        else if (restaurant.transactions[i] === "restaurant_reservations") {
            transactions[1] = "Yes";
        }
        else if (restaurant.transactions[i] === "pickup") {
            transactions[2] = "Yes";
        }
    }

    let stars = pb.getStarHTML(restaurant.rating);

    let reviews = await getReviews(restaurant.alias);
    $('#main_panel').html(pb.getMainPanelHTML(restaurant, categories, stars, reviews, transactions));
}

export const makeCardsClickable = function() {
    RESTAURANTS.forEach((item) => {
        $('#card_' + item.id).click(() => {
            loadMainPanel(item.id);
        })
        $('#list_button_' + item.id).click(() => {
            handleListButton(item.id, yelp.getUrlParameter('city'), yelp.getUrlParameter('state'));
        });
    });
}

export const filterRestaurants = function() {
    
    let cuisine = yelp.getUrlParameter('cuisine');
    let price = yelp.getUrlParameter('price');
    let rating = yelp.getUrlParameter('rating');
    RESTAURANTS = yelp.filterByParameters(RESTAURANTS, price, rating, cuisine);
}

export const autoPopulate = function() {
    loadMainPanel(RESTAURANTS[0].id);   
}

export const buildPage = function() {

    if (yelp.getUrlParameter('type') == 'search') {
        yelp.search(city, state).then((result) => {
            RESTAURANTS = result;
        }).then(() => {
            filterRestaurants();
        }).then(() => {
            if (RESTAURANTS != null) {
                loadSidePanel(RESTAURANTS, true);
            }
        }).then(() => {
            if (RESTAURANTS != null) {
                makeCardsClickable();
            }
        }).then(() => {
            if (RESTAURANTS != null) {
                autoPopulate(0);
            }
        });
    }
}

$(function() {
    buildPage();    
});