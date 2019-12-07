export class APICaller {

    async search(city, state){
        let res = undefined;
        await axios({
            url: `http://localhost:3001/api/search?city=${city}&state=${state}`,
            method: 'GET',
            }).then(response => {
            res = response;
            }).catch(e => {
            console.log(e);
            });
        return res.data;
    }

    async getReviews(alias){
        let res = undefined;
        await axios({
            url: `http://localhost:3001/api/reviews/${alias}`,
            method: 'GET',
            }).then(response => {
            res = response;
            }).catch(e => {
            console.log(e);
            });
        return res.data;
    }

    /**
     * Returns list of restaurants that match array of filters.
     * Filters must be in form of array.
     * @param {*} list 
     * @param {*} filters 
     */
    filter(list, filters){
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