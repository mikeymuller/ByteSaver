import { APICaller } from "./models/APICaller.js";

let RESTAURANTS = [];

export const testFun = function(data) {
    alert(data);
}

export const loadSidePanel = function(user, city, list_name, data) {
   
    populateList(data);
};

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

let populateList = function(first_list) {

    if ($('#results_cards').length) {
        $('#results_cards').empty();
    }

    $('#side_panel').append('<div id="results_cards"></div>');

    first_list.forEach((item) => {

        let button = '';
        if (isInList(item.id)) {
            button = `<a href="#" id="list_button_${item.id}" class="btn btn btn-primary text-light btn-block">Add to list</a>`;
        } else {
            button = `<a href="#" id="list_button_${item.id}" class="btn btn btn-danger text-light btn-block">Remove from list</a>`;
        }
        console.log(button);
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

/*
*  Check if an id is in the user's list
*/
export const isInList = function(card_id) {
    return true;
}

$(document).on('change', '#list_selector', () => {
    loadSidePanel("jamesb3", "Chapel Hill", document.getElementById('list_selector').value);
});

$(function() {
    
    let username = '';
    let yelp = new APICaller();

    return new axios.get('http://localhost:3000/account/status', {
        "headers": {
            "Authorization": "Bearer " + localStorage.getItem('token')
        }
    }).then((results) => {
        username = results.data.user.name;
    }).then(() => {
        return yelp.search(yelp.getUrlParameter('city'), yelp.getUrlParameter('state')).then((result) => {
            RESTAURANTS = result;
            console.log(RESTAURANTS);
            loadSidePanel(username, yelp.toTitleCase(yelp.getUrlParameter('city')), "All", result);
            RESTAURANTS.forEach((item) => {
                $('#list_button_' + item.id).click(() => {
                    console.log(item.id);
                    handleListButton(item.id);
                })
            })
        });
    });
});

