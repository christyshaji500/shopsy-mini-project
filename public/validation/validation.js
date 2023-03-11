const form = document.getElementById('formregister');
const username =document.getElementById('username');
const email = document.getElementById('email');
const number = document.getElementById('number')
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

form.addEventListener('submit',(e)=>{
    checkInputs()
   if ( checkerror()){
    form.submit;
   }
else {e.preventDefault();
}
})


function checkInputs(){
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const numberValue = number.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();

    if(usernameValue === ''){
     setErrorFor(username," Cannot be blank")
     
    }else{
          setSuccessFor(username)
    }
    if(emailValue== ''){
        setErrorFor(email,"Enter email address")
    }
    else if(!isEmail(emailValue)){
       setErrorFor(email,"Email not valid")
    }
    else{
        setSuccessFor(email)
    }
    if(numberValue===''){
        setErrorFor(number,"Enter contact number")
    }
    else if(!isNumber(numberValue)){
        setErrorFor(number,"Number not valid")
    }
    else if(!notNumber(numberValue)){
        setErrorFor(number,"Number not valid")
    }
    else{
        setSuccessFor(number)
    }
    if(passwordValue===''){
        setErrorFor(password,'Enter a password')
    }
    else{
        setSuccessFor(password)
    }
    if (password2Value===''){
        setErrorFor(password2,"Enter password again")
    }
    else if(passwordValue!== password2Value){
        setErrorFor(password2,"Passwords not matching")        
    }
    else{
        setSuccessFor(password2)
        
    }
    return true;
    }

    
    
function setErrorFor(input,message){
    const inputControl = input.parentElement;
    const small = inputControl.querySelector('small');

    //add messege in small tag
    small.innerText =message;

    //add error class
    inputControl.className = 'input-control error';
   // return false;
}
function setSuccessFor(input){
    const inputControl = input.parentElement;
    inputControl.className = 'input-control success';
    //return true;
}
function isEmail(email){
    const regularEx =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regularEx.test(String(email).toLowerCase());
}
function isNumber(number){
    const regularEx = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/
    return regularEx.test(String(number))

}
function notNumber(){
   const error = document.getElementById('number')
   if(error.length>10|| error.length<10){
    return false
   }else{
    return true
   }

}
function checkerror(){
    const errrormessage = document.getElementsByClassName('input-control error');
    if(errrormessage.length >0){
        return false
    }
    else{
        return true
    }
}