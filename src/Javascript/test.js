import { APICaller } from "./models/APICaller.js";
import { UserStorage} from "./models/userCaller.js";

$(function() {
    
    let storage = new UserStorage();

    storage.addToList()
});