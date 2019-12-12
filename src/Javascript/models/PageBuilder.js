export class PageBuilder {
    
    getSearchCard(item, isInList, search) {
        let add = `<button href="#" id="list_button_${item.id}" class="btn btn btn-primary text-light btn-block">Add</button>`;
        let remove = `<button href="# "id="list_button_${item.id}" class="btn btn btn-danger text-light btn-block">Remove</button>`;
        let like = `<button href="#" id="like_button_${item.id}" class="btn btn btn-primary text-light btn-block list-page empty-like"><i class="far fa-thumbs-up empty-like" id="inside_like_button_${item.id}"></i></button>`;
        let dislike = `<button href="#" id="dislike_button_${item.id}" class="btn btn btn-primary text-light btn-block list-page dislike"><i class="far fa-thumbs-down"></i></button>`;
        let button = isInList ? remove : add;
        let card = "";

        if (search) {
            card +=`<div id="card_${item.id}" title="${item.id}" class="card shadow-sm p-3 mb-3 bg-white rounded">
                    <div class="card-body">
                        <h3 class="card-title">${item.name}</h3>
                        <p class="card-text"></p>
                        ` + button + `
                    </div>
                </div>`;

            return card;
        } else {
            card +=`<div id="card_${item.id}" title="${item.id}" class="card shadow-sm p-3 mb-3 bg-white rounded">
                    <div class="card-body">
                        <h3 class="card-title">${item.name}</h3>
                        <p class="card-text"></p>
                        <div class="form-inline">
                        ${like} ${dislike} ${remove}
                        <div>
                    </div>
                </div>`;

            return card;
        }
        
    }

    getReviewHTML(text, rating, user) {
        let stars = this.getStarHTML(rating);
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

    getStarHTML(rating){
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

    loadFilterHTML(){
        let cuisines = ['American','Asian Fusion','Belgian','Bistros','Breakfast/Brunch','Burgers',  'Cafes','Cajun/Creole','Carribean','Chinese','Comfort Food',  'Cuban',
        'Delis','Diners','Fast Food','Food Court','Diners','French','Gluten-Free','Halal','Indian','Italian','Diners','Japenese','Korean','Kosher','Latin American','Malaysian','Mediteranean',
        'Mexican','Peruvian','Pizza','Portuguese','Salad','Sandwiches','Seafood','Southern','Spanish','Steakhouse','Sushi','Tapas','Tex-Mex','Thai','Vegan','Vegetarian','Vietnamese' ];

        let cuisineDropdownOptions = '';
        cuisines.forEach((item) => {
            cuisineDropdownOptions += `<p class="dropdown-item" href="#">${item}</p>`
        });

        return `
                <form class="form-inline">
                    <div>
                        <button class="btn btn-outline-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Price
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" id="filtered-price">
                            <p class="dropdown-item">$</p>
                            <p class="dropdown-item">$$</p>
                            <p class="dropdown-item">$$$</p>
                            <p class="dropdown-item">$$$$</p>
                        </div>
                    </div>
                    <div>
                        <button class="btn btn-outline-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Rating
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" id="filtered-rating">
                            <p class="dropdown-item" value=1 href="#">1 star</p>
                            <p class="dropdown-item" value=2 href="#">2 stars</p>
                            <p class="dropdown-item" value=3 href="#">3 stars</p>
                            <p class="dropdown-item" value=4 href="#">4 stars</p>
                            <p class="dropdown-item" value=5 href="#">5 stars</p>
                        </div>
                    </div>
                    <div>
                        <button class="btn btn-outline-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Cuisine
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" id="filtered-cuisine">
                            ${cuisineDropdownOptions}
                        </div>
                    </div>
          </form>`
    }

    getMainPanelHTML(restaurant, categories, stars, reviews, transactions) {
        let address = '';
        restaurant.location.display_address.forEach((item) => {
            address += `<p class="lead">${item}</p>`;
        });

        return `<div class="container">
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
                <p class="lead decrease-margins"><strong>${address}</strong></p>
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
    </div>`
    }
}

$('.dropdown-menu a').click(function(){
    $('#selected').text($(this).text());
  });