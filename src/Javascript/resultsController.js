import { APICaller } from "./models/APICaller.js";

let RESTAURANTS = [];

let handleListButton = function(button_id) {

    let button = document.getElementById("list_button_" + button_id);

    if (button.classList.contains("btn-primary")) {
        button.classList.replace("btn-primary", "btn-danger");
        button.innerHTML = "Remove"
    } else {
        button.classList.replace("btn-danger", "btn-primary");
        button.innerHTML = "Add"
    }
}

/*
*  Check if an id is in the user's list
*/
export const isInList = function(card_id) {
    return false;
}

export const loadSidePanel = function(data) {
    populateList(data);
};

let populateList = function(first_list) {

    if ($('#results_cards').length) {
        $('#results_cards').empty();
    }

    $('#side_panel').append('<div id="results_cards"></div>');

    first_list.forEach((item) => {

        let add = `<a href="#" id="list_button_${item.id}" class="btn btn btn-primary text-light btn-block">Add</a>`;
        let remove = `<a href="#" id="list_button_${item.id}" class="btn btn btn-danger text-light btn-block">Remove</a>`;
        let button = isInList(item.id) ? remove : add;
        
        $("#results_cards").append(
               `<div id="restaurant_card" name="${item.id}" class="card shadow-sm p-3 mb-3 bg-white rounded">
                    <div class="card-body">
                        <h3 class="card-title">${item.name}</h3>
                        <p class="card-text"></p>
                        ` + button + `
                    </div>
                </div>`
        );
    });
}

$(function() {
    
    let yelp = new APICaller();

    return new Promise((resolve, reject) => {
        return yelp.search(yelp.getUrlParameter('city'), yelp.getUrlParameter('state')).then((result) => {
            RESTAURANTS = result;
            loadSidePanel(RESTAURANTS);
        }).then(() => {
            RESTAURANTS.forEach((item) => {
                $('#list_button_' + item.id).click(() => {
                    handleListButton(item.id);
                });
            });
        });
    });
});