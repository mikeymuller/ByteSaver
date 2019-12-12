export class UserStorage {

    async addToList(city, state, restaurant, token){
        let id = restaurant.id;
        let r = axios.post(`http://localhost:3000/user/lists/${city},${state}/restaurants/${id}`,
        {
            data: {
                restaurant,
                isLiked: false
            }
        },
        {headers: {Authorization: 'Bearer ' + token}}, 
        );

        return;
    }

    async getCitysWithLists(token){
        let result = [];
        await axios.get(`http://localhost:3000/user/lists/`,
        {headers: {Authorization: 'Bearer ' + token}}, 
        ).then( r =>{
            result = r.data.result;
        }).catch(error => {
            console.log("No lists");
        });
    
        return result;
    }

    async getList(city, state, token){
        let result = null;
        await axios.get(`http://localhost:3000/user/lists/${city},${state}/restaurants`,
        {headers: {Authorization: 'Bearer ' + token}}, 
        ).then( r =>{
            result = r.data.result;
        }).catch(error => {
            console.log("City not found");
        });
    
        return result;
    }

    async getRestaurant(city, state, restaurantId, token){
        let result = null;
        let id = restaurantId;
        await axios.get(`http://localhost:3000/user/lists/${city},${state}/restaurants/${id}/restaurant`,
        {headers: {Authorization: 'Bearer ' + token}}, 
        ).then( r =>{
            result = r.data.result;
        }).catch(error => {
            console.log("Restaurant not found");
        });
    
        return result;
    }

    async deleteList(city, state, token){
        let result = null;
        await axios.delete(`http://localhost:3000/user/lists/${city},${state}`,
        {headers: {Authorization: 'Bearer ' + token}}, 
        ).then( r =>{
            result = r.data.result;
        }).catch(error => {
            console.log("City not found");
        });

        return result;
    }

    async deleteRestaurant(city, state, restaurantId, token){
        let result = null;
        let id = restaurantId;
        await axios.delete(`http://localhost:3000/user/lists/${city},${state}/restaurants/${id}`,
        {headers: {Authorization: 'Bearer ' + token}}, 
        ).then( r =>{
            result = r.data.result;
        }).catch(error => {
            console.log("Restaurant not found");
        });

        return result;
    }

    async toggleLikeRestaurant(like, city, state, restaurantId, token){
        let id = restaurantId;
        let r = axios.post(`http://localhost:3000/user/lists/${city},${state}/restaurants/${id}/isLiked`,
        {
            data: like
        },
        {headers: {Authorization: 'Bearer ' + token}}, 
        );

        return;
    }

    async getRestaurantLikeStatus(city, state, restaurantId, token){
        let result = null;
        let id = restaurantId;
        await axios.get(`http://localhost:3000/user/lists/${city},${state}/restaurants/${id}/isLiked`,
        {headers: {Authorization: 'Bearer ' + token}}, 
        ).then( r =>{
            result = r.data.result;
        }).catch(error => {
            console.log("Restaurant not found");
        });
    
        return result;
    }

    async getDislikeList(token){
        let result = null;
        await axios.get(`http://localhost:3000/user/lists/dislikedRestaurants`,
        {headers: {Authorization: 'Bearer ' + token}}, 
        ).then( r =>{
            result = r.data.result;
        }).catch(error => {
            console.log("City not found");
        });
    
        return result;
    }

    async addToDislikeList(restaurant, token){
        let id = restaurant.id;
        let r = axios.post(`http://localhost:3000/user/lists/dislikedRestaurants/${id}`,
        {
            data: {
                restaurant
            }
        },
        {headers: {Authorization: 'Bearer ' + token}}, 
        );
        return;
    }

    async dislikeRestaurant(city, state, restaurantId, token){
        let id = restaurantId;
        let restaurant = await this.getRestaurant(city, state, id, token);
        let r = await this.deleteRestaurant(city, state, id, token);
        let r2 = await this.addToDislikeList(restaurant, token);
        return;
    }

}