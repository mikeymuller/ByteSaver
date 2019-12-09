export class UserStorage {

    async addToList(city, restaurant, token){
        let id = restaurant.id;
        let r = axios.post(`http://localhost:3000/user/lists/${city}/restaurants/${id}`,
        {
            data: restaurant
        },
        {headers: {Authorization: 'Bearer ' + token}}, 
        );

        return;
    }

    async getList(city, token){
        let result = null;
        await axios.get(`http://localhost:3000/user/lists/${city}/restaurants`,
        {headers: {Authorization: 'Bearer ' + token}}, 
        ).then( r =>{
            result = r.data.result;
        }).catch(error => {
            console.log("City not found");
        });
    
        return result;
    }

    async getRestaurant(city, restaurantId, token){
        let result = null;
        let id = restaurantId;
        await axios.get(`http://localhost:3000/user/lists/${city}/restaurants/${id}`,
        {headers: {Authorization: 'Bearer ' + token}}, 
        ).then( r =>{
            result = r.data.result;
        }).catch(error => {
            console.log("Restaurant not found");
        });
    
        return result;
    }

    async deleteList(city, token){
        let result = null;
        await axios.delete(`http://localhost:3000/user/lists/${city}`,
        {headers: {Authorization: 'Bearer ' + token}}, 
        ).then( r =>{
            result = r.data.result;
        }).catch(error => {
            console.log("City not found");
        });

        return result;
    }

    async deleteRestaurant(city, restaurantId, token){
        let result = null;
        let id = restaurantId;
        await axios.delete(`http://localhost:3000/user/lists/${city}/restaurants/${id}`,
        {headers: {Authorization: 'Bearer ' + token}}, 
        ).then( r =>{
            result = r.data.result;
        }).catch(error => {
            console.log("Restaurant not found");
        });

        return result;
    }

}