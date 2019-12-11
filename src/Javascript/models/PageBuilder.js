export class PageBuilder {
    
    getSearchCard(item, isInList) {
        let add = `<a href="#" id="list_button_${item.id}" class="btn btn btn-primary text-light btn-block">Add</a>`;
        let remove = `<a href="#" id="list_button_${item.id}" class="btn btn btn-danger text-light btn-block">Remove</a>`;
        let button = isInList ? remove : add;
        let card = "";

        card +=`<div id="card_${item.id}" title="${item.id}" class="card shadow-sm p-3 mb-3 bg-white rounded">
                    <div class="card-body">
                        <h3 class="card-title">${item.name}</h3>
                        <p class="card-text"></p>
                        ` + button + `
                    </div>
                </div>`;

        return card;
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

    getMainPanelHTML(restaurant, categories, stars, reviews, transactions) {
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
    </div>`
    }
}