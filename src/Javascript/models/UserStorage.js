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

}