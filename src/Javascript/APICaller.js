
export default async function search(city, state){
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