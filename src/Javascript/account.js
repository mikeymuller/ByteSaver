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
        window.location.href = "homepage.html";
    }).catch(error => {
        $('#message').html('<div><strong>Account already exists</strong></div>');
    });
   });
