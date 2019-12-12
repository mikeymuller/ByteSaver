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
let price = "blank";
let rating = "blank";
let cuisine = "blank";
let list = {};
user.getList(city, state, token).then((result) => {
    list = result;
    console.log("LIST");
    console.log(list);
});

let handleListButton = function(button_id, city, state) {

    let button = document.getElementById("list_button_" + button_id);

    if (button.classList.contains("btn-primary")) {
        button.replaceWith('');
        button.classList.replace("btn-primary", "btn-danger");
        button.innerHTML = "Remove";
        user.addToList(city, state, getRestaurantObject(button_id), localStorage.getItem('token'));

    } else {
        let card = document.getElementById('card_'+button_id);
        card.replaceWith('');
        user.deleteRestaurant(city, state, button_id, localStorage.getItem('token')).then((filler) => {
            user.getList(city, state, token).then((result) => {
                if (Object.keys(result).length == 0) {
                    user.deleteList(city, state, token).then(() => {
                        console.log("deleted list");
                        window.location.href = "homepage.html";
                    });
                }
            })
        });
    }
}

let handleLikeButton = function (button_id, city, state){
    let button = document.getElementById("inside_like_button_" + button_id);
    if (button.classList.contains("empty-like")) {
        button.classList.replace('far','fas');
        button.classList.replace('empty-like', 'like');
        user.toggleLikeRestaurant(true, city, state, button_id, localStorage.getItem('token'));
    } else {
        button.classList.replace('fas','far');
        button.classList.replace('like', 'empty-like');
        user.toggleLikeRestaurant(false, city, state, button_id, localStorage.getItem('token'));
    }
}

let handleDislikeButton = function (button_id, city, state){
    let card = document.getElementById('card_'+button_id);
    card.replaceWith('');
    user.dislikeRestaurant(city, state, button_id, localStorage.getItem('token')).then((filler) => {
        user.getList(city, state, token).then((result) => {
            if (Object.keys(result).length == 0) {
                user.deleteList(city, state, token).then(() => {
                    console.log("deleted list");
                    window.location.href = "homepage.html";
                });
            }
        })
    });
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
export const isInList = function (card_id, search) {
    if (list == null) {
        return false;
    } else if (search) {
        let found = false;
        Object.keys(list).forEach((item) => {
            if (item.restaurant == card_id) {
                found = true;
            }
        })
        return found;
    } else if (!search) {
        let found = false;
        RESTAURANTS.forEach((item) =>{
            if (item.id == card_id) {
                found = true;
            }
        })
        return found;
    }
}

export const loadSidePanel = function (data, search, dislike) {
    populateList(data, search, dislike);
};

let populateList = function (first_list, search, dislike) {
   if (search){
    $('#side_panel').append(`<div id="results_cards"></div>`);
    }
    else {
    $('#side_panel').append(`<nav class="navbar navbar-light">
                                <div class="form-inline">
                                    <input class="form-control mr-sm-2" placeholder="Search restaurants" id="find-restaurant">
                                    <button class="btn btn-outline-primary my-2 my-sm-0" id="filter-search">Search</button>
                                </div>
                                ${pb.loadFilterHTML()}
                                </nav>
                            <div id="results_cards"></div>`);
    }
    first_list.forEach((item) => {
        $("#results_cards").append(pb.getSearchCard(item, isInList(item.id, search), search, dislike));
    });
    
}

const filterButtonHandler = async function(){
        console.log("herre");
        let restaurant = $('#find-restaurant').val();

        if (restaurant){
            let res =[];
            console.log(RESTAURANTS);
             RESTAURANTS.forEach((item)=>{
                if(item.name.toLowerCase().trim() === restaurant.toLowerCase().trim()){
                    res.push(item);
                }
                else return "none";
            })
            if (res === "none"){
                console.log("no hit boss");
            }
            else {
                $('#side_panel').replaceWith('<div id="side_panel" class="sidenav shadow-lg p-3 mb-5 bg-white rounded"></div>');
                loadSidePanel(res, false, false);
                makeCardsClickable();
                autoPopulate(0);
                addFilterProperties();
            }
        }
        else {
            $('#side_panel').replaceWith('<div id="side_panel" class="sidenav shadow-lg p-3 mb-5 bg-white rounded"></div>');
            let res = yelp.filterByParameters(RESTAURANTS, price, rating, cuisine);
            console.log(res);
            loadSidePanel(res, false, false);
            makeCardsClickable();
            autoPopulate(0);
            addFilterProperties();
        }
    }

const addFilterProperties = function(){
    price = 'blank';
    rating = 'blank';
    cuisine = 'blank';
    $("#filtered-price p").click( function() {
        price = $(this).text().length;
    });
    $("#filtered-rating p").click( function() {
        rating = $(this).text().charAt(0);
    });
    $("#filtered-cuisine p").click( function() {
        cuisine = $(this).text().toLowerCase();
    });
    $("#filter-search").on("click", function(){
        filterButtonHandler(price, rating, cuisine);
    });
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
        $('#like_button_' + item.id).click(() => {
            handleLikeButton(item.id, yelp.getUrlParameter('city'), yelp.getUrlParameter('state'));
        });
        $('#dislike_button_' + item.id).click(() => {
            handleDislikeButton(item.id, yelp.getUrlParameter('city'), yelp.getUrlParameter('state'));
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
    console.log(RESTAURANTS);
    console.log(RESTAURANTS[0]);
    loadMainPanel(RESTAURANTS[0].id);
}

export const showNoResults = function() {
    $('#side_panel').append(`<h1>NO RESULTS</h1>`);
    window.location.href = 'homepage.html';
}

export const buildPage = function() {

    if (yelp.getUrlParameter('type') == 'search') {
        yelp.search(city, state).then((result) => {
            RESTAURANTS = result;
        }).then(() => {
            RESTAURANTS.length != 0 ? filterRestaurants() : console.log("RESTAURANTS is null, not filtering.");
        }).then(() => {
            RESTAURANTS.length != 0 ? loadSidePanel(RESTAURANTS, true, false) : console.log("RESTAURANTS is null, not loading side panel.");
        }).then(() => {
            RESTAURANTS.length != 0 ? makeCardsClickable() : console.log("RESTAURANTS is null, not making cards clickable.");
        }).then(() => {
            if (RESTAURANTS != null) {
                autoPopulate(0);
            }
        });
    } else if (yelp.getUrlParameter('type') == 'disliked') {
        user.getDislikeList(token).then((result) => {
            Object.keys(result).forEach((item) => {
                RESTAURANTS.push(result[item].restaurant);
            });
        }).then(() => {
            console.log(RESTAURANTS);
            RESTAURANTS.length != 0 ? loadSidePanel(RESTAURANTS, true, true) : console.log("RESTAURANTS is null, not loading side panel.");
        }).then(() => {
            RESTAURANTS.length != 0 ? makeCardsClickable() : console.log("RESTAURANTS is null, not making cards clickable.");
        }).then(() => {
            RESTAURANTS != null ? autoPopulate(0) : console.log("RESTAURANTS is null.");
        }).then(() => {
            $("#filtered-price p").click( function() {
                price = $(this).text().length;
            });
            $("#filtered-rating p").click( function() {
                rating = $(this).text().charAt(0);
            });
            $("#filtered-cuisine p").click( function() {
                cuisine = $(this).text().toLowerCase();
            });
        }).then(() => {
            $("#filter-search").on("click", function(){
                filterButtonHandler(price, rating, cuisine);
            });
        })
    } else {
        user.getList(city, state, token).then((result) => {
            Object.keys(result).forEach((item) => {
                RESTAURANTS.push(result[item].restaurant);
            });
        }).then(() => {
            console.log(RESTAURANTS);
        }).then(() => {
            RESTAURANTS.length != 0 ? loadSidePanel(RESTAURANTS, false, false) : console.log("RESTAURANTS is null, not loading side panel.");
        }).then(() => {
            RESTAURANTS.length != 0 ? makeCardsClickable() : console.log("RESTAURANTS is null, not making cards clickable.");
        }).then(() => {
            RESTAURANTS != null ? autoPopulate(0) : console.log("RESTAURANTS is null.");
        }).then(() => {
            $("#filtered-price p").click( function() {
                price = $(this).text().length;
            });
            $("#filtered-rating p").click( function() {
                rating = $(this).text().charAt(0);
            });
            $("#filtered-cuisine p").click( function() {
                cuisine = $(this).text().toLowerCase();
            });
        }).then(() => {
            $("#filter-search").on("click", function(){
                filterButtonHandler(price, rating, cuisine);
            });
        });
    }
}

$(function() {
    buildPage();    
});