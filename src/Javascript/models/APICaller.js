import {UserStorage} from "./UserStorage.js";
let token = localStorage.getItem('token');

export class APICaller {
    async search(city, state){
        let res = null;
        await axios({
            url: `http://localhost:3001/api/search?city=${city}&state=${state}`,
            method: 'GET',
            }).then(response => {
            res = response;
            }).catch(e => {
            console.log(e);
            });
        if (res != null) {
            
            return this.removeDislikedRestaurants(res.data);
        } else {
            console.log("No results found.");
            return null;
        }
    }

    async removeDislikedRestaurants(restaurants){
        let result = restaurants.slice(0);
        let userStorage = new UserStorage();
        let dislikedRestaurants = await userStorage.getDislikeList(token);
        Object.keys(dislikedRestaurants).forEach((item) => {
            for(let i =0; i < restaurants.length; i++){
                if(restaurants[i].id == dislikedRestaurants[item].restaurant.id ){
                    let index = result.findIndex((element) => element.id == restaurants[i].id);
                    result.splice(index,1);
                }
            }
        });
        return result;
    }

    async getReviews(alias){
        let res = null;
        await axios({
            url: `http://localhost:3001/api/reviews/${alias}`,
            method: 'GET',
            }).then(response => {
            res = response;
            }).catch(e => {
            });
        if (res != null) {
            return res.data;
        } else {
            console.log("No reviews found.");
            return null;
        }
    }

    filterByParameters(list, price, rating, cuisine) {
        let cuisineResult = cuisine == "blank" ? list : this.filterByCuisine(list, [cuisine]);
        let priceResult = price == "blank" ? cuisineResult : this.filterByPrice(cuisineResult, price);
        let ratingResult = rating == "blank" ? priceResult : this.filterByRating(priceResult, rating);
        return ratingResult;
    }

    /**
     * Returns list of restaurants that match array of filters.
     * Filters must be in form of array.
     * @param {*} list 
     * @param {*} filters 
     */
    filterByCuisine(list, filters){
        let result = [];
        list.forEach(restaurant => {
            let resCategories = restaurant.categories;
            resCategories.forEach(resCategory =>{
                filters.forEach(filter =>{
                    if(filter == resCategory.alias){
                        result.push(restaurant);
                    }
                });
            });
        });
        if(result.length == 0){
            return null;
        }
        else{
            return result;
        }
    }

    filterByPrice(list, price) {
        let result = [];
        list.forEach((item) => {
            if (item.price != null) {
                if (this.getRestaurantPrice(item) == price) {
                    result.push(item);
                }
            }
        })
        return result;
    }

    filterByRating(list, rating) {
        let result = [];
        list.forEach((item) => {
            if (item.rating != null) {
                if (Math.floor(this.getRestaurantRating(item)) == rating) {
                    result.push(item);
                }
            }
        });
        return result;
    }

    getRestaurantImageUrl(restaurant){
        return restaurant.image_url;
    }

    getRestaurantRating(restaurant){
        return restaurant.rating;
    }

    getRestaurantPrice(restaurant){
        return restaurant.price.length;
    }

    getRestaurantImageUrl(restaurant){
        return restaurant.image_url;
    }

    getReviewText(review){
        return review.text;
    }

    getReviewRating(review){
        return review.rating;
    }

    getReviewUserName(review){
        return review.user.name;
    }


    getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };
    
    toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
}