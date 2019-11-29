$(document).on('click', "#signIn", async function(event){
    event.preventDefault();
    $('#message').html('');
    let r = new axios.post('http://localhost:3000/account/create',
    {
        name: $('#inputFirstName').val(),
        pass: $('#inputPassword').val(),
        data: {
            email: $('#inputEmail').val(),
            username: $('#inputUsername').val(),
        }
    });
    r.then(response => {
        loginUser($('#inputFirstName').val(), $('#inputPassword').val());
    }).catch(error => {
        $('#message').html('<div><strong>Account already exists</strong></div>');
    });
   });

function loginUser(name, pass){
    let r = new axios.post('http://localhost:3000/account/login',
    {
        name: name,
        pass: pass,
    });
    r.then(response => {
        localStorage.setItem('token', response.data.jwt);
        window.location.href = "homepage.html";
    }).catch(error => {
        $('#message').html('<div><strong>Invalid username or password</strong></div>');
    });
}

$(document).on('click', "#login", async function(event){
    
});

