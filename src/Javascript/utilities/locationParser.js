import { Matcher } from "../models/Matcher.js";

let matcher = new Matcher();

export const parseLocation = function(location){
    if (!location.includes(",")) {
        location = matcher.matchCity()
    }
    let splitLocation = location.split(",");
    let city = splitLocation[0];
    let state = splitLocation[1].toUpperCase();
    let cityParts = city.split(" ");
    let capitalizedCity = [];
    cityParts.forEach(element => {
        capitalizedCity.push(element.charAt(0).toUpperCase() + element.slice(1));
    });
    city = capitalizedCity.join(" ");
    return [city, state];
}