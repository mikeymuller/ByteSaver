export class Side_Panel {

    constructor(user_id, city_name, data) {

        this.user_id = user_id;
        this.city_name = city_name;
        this.data = data;
    }
    
    /* 
    * TO DO:
    *   Link listnames to data/users
    *   Change getList() to return all information
    *   Add more specific list options to cards
    */

    getListNames() {
        return ["All"];
    }

    getList(list_name) {
        let restaurants = [];
        this.data.forEach((item) => {
            restaurants.push(item.name);
        })
        return restaurants;
    }
}