import { APICaller } from "./models/APICaller.js";
import { UserStorage } from "./models/UserStorage.js";

let RESTAURANTS = [];
let restaurant_ids = [];
let yelp = new APICaller();
let city = yelp.getUrlParameter('city');
let state = yelp.getUrlParameter('state');
let type = yelp.getUrlParameter('type');
let token = localStorage.getItem('token');
let user = new UserStorage();
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

    if ($('#results_cards').length) {
        $('#results_cards').empty();
    }

    if (search) {
        
        $('#side_panel').append(`<nav class="navbar navbar-light bg-light">
                                    <form class="form-inline">
                                        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
                                        <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                                    </form>
                                </nav>
                                <div id="results_cards"></div>`);

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

export const getReviews = async function (alias) {
    let yelp = new APICaller();
    let reviews = await yelp.getReviews(alias);

    let allReviews = [];
    for (let i = 0; i < 3; i++) {
        console.log(reviews);
        allReviews.push(getReviewHTML(yelp.getReviewText(reviews[i]), yelp.getReviewRating(reviews[i]), yelp.getReviewUserName(reviews[i])));
    }
    return allReviews;
}

export const getReviewHTML = function (text, rating, user) {
    let stars = getStarHTML(rating);
    return `<div class="card">
	    <div class="card-body">
	        <div class="row">
        	    <div class="col-md-2">
        	        <img src="https://image.ibb.co/jw55Ex/def_face.jpg" class="img img-rounded img-fluid" alt="Responsive image"/>
        	    </div>
        	    <div class="col-md-10">
        	        <p>
                        <a class="float-left"><strong>${user}</strong></a>
                        <text class="float-right">${stars}</text>
        	       </p>
        	       <div class="clearfix"></div>
        	        <p>${text}</p>
        	    </div>
	        </div>
	    </div>
	</div>`
}

export const getStarHTML = function(rating){
    let stars='';
    for(let i = 1; i < 6; i++){
        if (rating > i){
            stars += '<span class="fa fa-star checked"></span>';
        }
        else {
            stars += '<span class="fa fa-star"></span>';
        }
    }
    return stars;
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

    let stars = getStarHTML(restaurant.rating);

    let reviews = await getReviews(restaurant.alias);
    $('#main_panel').html(`<div class="container">
                            <div class="row">
                                <div class="col-2.5">
                                    <h1 class="display-4">
                                        ${restaurant.name}
                                        <p class="lead"><strong>${categories}</strong></p>
                                    </h1>
                                    <figure class="figure">
                                            <img src=${restaurant.image_url} class="halfPage background-pic">
                                        </figure>
                                </div>
                            </div>
                            <div class="row">
                            <div class="col-xs-6 col-md-2.5 lead"><strong>
                                    <text>${restaurant.location.display_address[0]}</text>
                                    <p>${restaurant.location.display_address[1]}</p>
                                    <p class="lead">${restaurant.display_phone}</p></strong>
                                </div>
                                <div class="col-xs-6 col-md-2 lead">
                                    <p>Price: ${restaurant.price}</p>
                                    <p>
                                        Delivery: ${transactions[0]}
                                    </p>
                                    <p>
                                        Pick-up: ${transactions[2]}
                                    </p>
                                    <p>
                                        Reservations: ${transactions[1]}
                                    </p>
                                </div>
                                
                                
                            </div>
                            <div class="row">
                                <div class="col-xs-12 col-md-2.1 lead">
                                    <p>Rating (out of 5): ${stars}</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xs-12 col-md-12">
                                    ${reviews[0]}
                                    ${reviews[1]}
                                    ${reviews[2]}
                                </div>
                            </div>
                        </div>`);

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