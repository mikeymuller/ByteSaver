# ByteSaver
The best restaurant tracking app you will ever see.

## API backend
### Set up local host
1. Make sure to `npm install` all dependencies.
2. In terminal, type `npx nodemon API/app.js` to start server on port 3001.
### Calling backend API from frontend javascript
All calls to the backend API can be made through the **APICaller.js** file. Whenever you want to get data from yelp, make sure to first import the desired function from the APICaller file.

 `import search from './APICaller.js';`. 

Then, call the function with the required parameters. 

`let yelpAPIresponse = await search(city,state);`

Important: In order to await the promised resposne, you must make the function that uses the APICaller method an **async** function.

### Format of the returned data
As of right now, all requests to API return an array with the first 50 yelp business objects, ranked by rating. Click [here](https://www.yelp.com/developers/documentation/v3/business_search) and scroll down to see the attribute for each restaurant object. 

## Style
1. Please make sure to `npm install --save-dev @fortawesome/fontawesome-free` to download icons.
