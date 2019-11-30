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
        $('#loginMessage').html('<div><strong>Invalid username or password</strong></div>');
    });
}

$(document).on('click', "#signIn", async function(event){
    event.preventDefault();
    $('#message').html('');
    if ($('#inputPassword').val() !== $('#inputRetypePassword').val()) {
        $('#message').html('<div><strong>Passwords do not match</strong></div>');
    }
    else if ($('#inputPassword').val().length < 8 || !(/\d/.test($('#inputPassword').val()))){
        $('#message').html('<div><strong>Password must be 8 characters long and contain a number</strong></div>');
    }
    else {
        let r = new axios.post('http://localhost:3000/account/create',
        {
            name: $('#inputUsername').val(),
            pass: $('#inputPassword').val(),
            data: {
                email: $('#inputEmail').val(),
                firstName: $('#inputFirstName').val(),
                lastName: $('#inputLastName').val()
            }
        });
        r.then(response => {
            loginUser($('#inputUsername').val(), $('#inputPassword').val());
        }).catch(error => {
            $('#message').html('<div><strong>Username taken. Please choose another username</strong></div>');
        });
    }
   });

$(document).on('click', "#login", async function(event){
    event.preventDefault();
    $('#message').html('');
    loginUser($('#inputUsername').val(), $('#inputPassword').val())
});

