import restaurant_lists from "./restaurant_lists.js";

export class Side_Panel {

    constructor(user_id, city_name) {

        this.user_id = user_id;
        this.city_name = city_name;

        this.results = restaurant_lists.filter((item) => {
            return item.User_id == this.user_id;
        })[0].Cities.filter((item) => {
            return item.City_id == this.city_name;
        })[0].Restaurant_lists;
    }

    getListNames() {
        return Object.keys(this.results);
    }

    getList(list_name) {
        return this.results[list_name];
    }
}