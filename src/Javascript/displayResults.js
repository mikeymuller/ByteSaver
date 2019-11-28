import { Side_Panel } from "./models/sidePanel.js";

export const testFun = function(data) {
    alert(data);
}

export const loadSidePanel = function(user, city, list_name) {
   
    let panel = new Side_Panel(user, city);
    let lists = panel.getListNames();
    let first_list = panel.getList(list_name);

    if ($('#list_selector').length) {
        $('#list_selector').remove();
    }

    $("#side_panel").prepend(
        `<select id="list_selector" class="mb-1 custom-select custom-select-lg text-dark">
            <option selected>${list_name}</option>`
    );

    lists.filter((item) => {
        return item != list_name;
    }).forEach((item) => {
        $("#list_selector").append(
            `<option>${item}</option>`
        );
    });
    
    $('#list_selector').append('</select>');
    
    populateList(first_list);
};

export const populateList = function(first_list) {

    if ($('#results_cards').length) {
        $('#results_cards').empty();
    }

    $('#side_panel').append('<div id="results_cards"></div>');

    first_list.forEach((item) => {
        $("#results_cards").append(
               `<div class="card shadow-sm p-3 mb-3 bg-white rounded">
                    <div class="card-body">
                        <h3 class="card-title">${item}</h3>
                        <p class="card-text"></p>
                        <div class="row">
                            <a href="#" class="btn btn-sm btn-primary text-light col-sm-5">Like</a>
                            <p class="col-sm-2"></p>
                            <a href="#" class="btn btn-sm btn-danger text-light col-sm-5">Dislike</a>
                        </div>
                    </div>
                </div>`
        );
    });
}

$(document).on('change', '#list_selector', () => {
    loadSidePanel("jamesb3", "Chapel Hill", document.getElementById('list_selector').value);
});

$(function() {
    loadSidePanel("jamesb3", "Chapel Hill", "Burgers");
});

