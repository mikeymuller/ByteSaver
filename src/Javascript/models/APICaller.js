export class APICaller {

    async search(city, state){
        let res = undefined;
        await axios({
            url: `http://localhost:3001/api/search?city=${city}&state=${state}`,
            method: 'GET',
            }).then(response => {
            res = response;
            console.log(res);
            }).catch(e => {
            console.log(e);
            });;
        return res.data;
    }

    getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };
    
    toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
}