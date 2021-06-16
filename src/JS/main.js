//------------------------------------EXCEL------------------------------------
$('#create-excel-btn').click(function(){
    var wb = XLSX.utils.table_to_book(document.getElementById('tableToExcel'), {sheet:"Scanned References"});
    wb.Props = {
        Title: "Scans",
        Subject: "Scan",
        Author: "Patrik Melander",
        CreatedDate: new Date(2021,06,09)
    };

    var wbout = XLSX.write(wb, {bookType:'xlsx', type: 'binary'});

    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      }
    
    

    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'scans.xlsx');
});

//------------------------------------Click Actions------------------------------------

$('#clear-scans').click(function(){
localStorage.clear()


});

$('#new-user').click(() => {
    $('#regModal').modal('show')
})

$('#nav-sign-in').click(() => {
    if (JSON.parse(sessionStorage.getItem('loggedIn')) === null){
        $('#loginModal').modal('show')
    }
})
$('#reg-add-account').click(() => {
    registrateAccount();
})
$('#validate-sign-in').click(() => {
    validateSignIn()
})

$('#update').click(() => {
    updateUserInfo();
})

$('#update-password').click(() => {
    updateUserPassword();
})

$('#delete-user').click(() => {
    swal({
        title: "Warning!",
        text: "Are you sure you wanna delete your account?",
        icon: "warning",
        buttons: ["No, I wanna keep racing", "Yes" ],
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            swal({
                text: 'Please enter your password',
                content: "input",
                button: {
                  text: "Done",
                  closeModel: false,
                },
              })
              .then(input => {
                deleteAccount(input)
              })
        } else {
          swal("Good! Keep on walking!");
        }
      });
})

//------------------------------------Validate Login------------------------------------
const validateSignIn = () => { 
    const email = $('#sign-in-email')
    const password = $('#sign-in-password')
    
    axios.get(`${validateLogin}login?email=${email.val()}&password=${password.val()}`)
    .then(resp => {
        if(resp.status == 200){
            sessionStorage.setItem('loggedIn', JSON.stringify(resp.data));
            checkIfLoggedIn()
            $('#loginModal').modal('hide')
            email.val('')
            password.val('')
            window.location.replace("./html/index.html");
            
        }
        if(resp.status == 204){
            swal("Warning", "Could not find any user with matching credentials", "warning");
            email.val('')
            password.val('')
        }
    })
    .catch(() => {
        swal("Warning", "wrong email \nor password!", "warning");
        password.val('')
    })
}
//------------------------------------Sign out------------------------------------

const signOut = () => {
    $('#nav-sign-in').text('Sign in');
    sessionStorage.removeItem('loggedIn')
    $('#nav-sign-in').attr('data-bs-target', '#loginModal')
    window.location.replace("../../index.html");
}

//------------------------------------Register New User------------------------------------

const registrateAccount = () => {
    let regFirstName = $('#reg-firstName')
    let regLastName = $('#reg-lastName')
    let regEmail = $('#reg-email')
    let regPassword = $('#reg-password')

    const newAccount = {
        "firstName": regFirstName.val(),
        "lastName": regLastName.val(),
        "password": regPassword.val(),
        "email": regEmail.val()
    }

    axios.post(addAccount, newAccount)
    .then((resp)=> {
        swal("Welcome!", `${resp.data.firstName} you have joined the race`, "success")
        .then(()=> {
            regFirstName.val('')
            regLastName.val('')
            regEmail.val('')
            regPassword.val('')
        })
        .then(() => {
            $('#regModal').modal('hide')
        })
    })
    .catch((err)=> {
        swal("Warning!", `${err.response.data.message}`, "warning")
        .then(()=> {
            regEmail.val('')
            regPassword.val('')
        })
    })
}

//------------------------------------DELETE USER------------------------------------
/**
 * deletes a user from the database if email and password matches user
 * then remove user from sessionStorage and sends user to homescreen
 * @param {String} password 
 */
 const deleteAccount = (password) => {
    const userEmail = JSON.parse(sessionStorage.getItem('loggedIn')).email
    

    axios.get(`${deleteUser}?email=${userEmail}&password=${password}`)
    .then(resp => {
        swal("Your account has been deleted. We are sad to see you go, but we will be here and waiting for you when you wanna get back into it!", {
        icon: "success",
        })
        .then(()=> {
            sessionStorage.removeItem('loggedIn')
            window.location.href = "../../../";
        })
    })
    .catch(err => {
        swal("Wrong password, please try again", {
            icon: "error",
          })
    })
}

const fillUserInfo = () => {
    const user = JSON.parse(sessionStorage.getItem('loggedIn'))
    $('#firstname').val(user.firstName)
    $('#lastname').val(user.lastName)
    $('#email').val(user.email)
}

//-----------------------------------UPDATE USER INFO------------------------------------
 const updateUserInfo = () => {
    axios.post(updateUser, {
        "firstName": $('#firstname').val(),
        "lastName": $('#lastname').val(),
        "email": $('#email').val()
    })
    .then(resp => {
        sessionStorage.setItem('loggedIn', JSON.stringify(resp.data))
        swal("Account updated.", {
            icon: "success",
        })
    })
    .catch(() => {
        swal("Something went wrong, try again.", {
            icon: "warning",
        })
    })
}

const updateUserPassword = () => {
    const user = JSON.parse(sessionStorage.getItem('loggedIn'))
    const newPassword = $('#new-Password')
    const confirmPassword = $('#confirm-Password')

    if(newPassword.val() === confirmPassword.val()){
        axios.get(`${updatePassword}?email=${user.email}&password=${newPassword.val()}`)
        .then(() => {
            newPassword.val('')
            confirmPassword.val('')
            swal("Password updated", {
                icon: "success",
            })
        })
        .catch(() => {
            swal("Something went wrong, try again.", {
                icon: "warning",
            })
        })
    }else{
        swal("Password doesn't match, try again.", {
            icon: "warning",
        })
        confirmPassword.val('')
    }
}





