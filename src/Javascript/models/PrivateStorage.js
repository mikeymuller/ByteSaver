export class PrivateStorage {

    async getCityCount(city, state, token){
        let result = null;
        await axios.get(`http://localhost:3000/private/${city},${state}/count`,
        {headers: {Authorization: 'Bearer ' + token}}, 
        ).then( r =>{
            result = r.data.result;
        }).catch(error => {

        });
        return result;
    }

    async incrementCity(city, state, token){
        let cityCount = await this.getCityCount(city, state, token);
        if(cityCount == null){
            cityCount =0 ;
        }
        cityCount += 1;
        let r = axios.post(`http://localhost:3000/private/${city},${state}`,
        {
            data:{
                count: cityCount
            }
        },
        {headers: {Authorization: 'Bearer ' + token}}, 
        );

        return;
    }

    async getMostPopularCities(token){
        let cities = null;
        await axios.get(`http://localhost:3000/private/`,
        {headers: {Authorization: 'Bearer ' + token}}, 
        ).then( r =>{
            cities = r.data.result;
        }).catch(error => {

        });
        let result = [];
        let one = await this.findMostPopularCity(cities,token);
        result.push(one);
        cities = this.removeFromArray(one, cities)
        let two = await this.findMostPopularCity(cities,token);
        result.push(two);
        cities = this.removeFromArray(two, cities)
        let three = await this.findMostPopularCity(cities,token);
        result.push(three);
        return result;
    }

    removeFromArray(element, array){
        let index = array.indexOf(element);
        if (index >= 0) {
          array.splice( index, 1 );
        }
        return array;
    }

    async findMostPopularCity(cities, token){
        let mostPop = undefined;
        let max = 0;
        for(let i=0; i< cities.length; i++){
            let split = cities[i].split(',');
            let count = await this.getCityCount(split[0], split[1], token);
            if(count > max){
                max = count;
                mostPop = cities[i];
            }
        }  
        return mostPop;
    }

}