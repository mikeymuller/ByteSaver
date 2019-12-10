import { StateFormatter } from "./StateFormatter.js";
import data from "./../../../data/public.json";
const fs = require("fs");

console.log(data[0]);

let newData = [];
let sf = new StateFormatter();

data.forEach((item) => {
    newData.push(item.city + ", " + sf.formatState(item.state));
});

for (let i = 0; i < 5; i++) {
    console.log(newData[i]);
}

let stringData = "[\n";
newData.forEach((item) => {
    stringData += "\"" + item + "\",\n";
});
stringData += "]";

fs.writeFile("newData.json", stringData, (err) => {});