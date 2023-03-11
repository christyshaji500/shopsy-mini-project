const form = document.getElementById('formeditaddrress');
const firstname =document.getElementById('firstname');
const lastname =document.getElementById('lastname');
const country = document.getElementById('country');
const address = document.getElementById('address');
const state = document.getElementById('state');
const zip = document.getElementById('zip');
const phone = document.getElementById('phone');

form.addEventListener('submit',(e)=>{
    checkInputs()
   if ( checkerror()){
    form.submit;
   }
else {e.preventDefault();
}
})


function checkInputs(){
    const firstnameValue = firstname.value.trim();
    const lastnameValue = lastname.value.trim();
    const countryValue = country.value.trim();
    const addressdValue = address.value.trim();
    const stateValue = state.value.trim();
    const zipValue = zip.value.trim();
    const phoneValue = phone.value.trim();

    if(firstnameValue === ''){
     setErrorFor(firstname," Cannot be blank")
     
    }else{
          setSuccessFor(firstname)
    }
    if(lastnameValue== ''){
        setErrorFor(lastname,"Enter second name")
    }
    else{
        setSuccessFor(lastname)
    }
    if(phoneValue===''){
        setErrorFor(phone,"Enter contact number")
    }
    else if(!isNumber(phoneValue)){
        setErrorFor(phone,"Number not valid")
    }
    else if(!notNumber(phoneValue)){
        setErrorFor(phone,"Number not valid")
    }
    else{
        setSuccessFor(phone)
    }
    if(countryValue===''){
        setErrorFor(country,'Enter a password')
    }
    else{
        setSuccessFor(country)
    }
    if (addressdValue===''){
        setErrorFor(address,"Enter address")
    }
    else{
        setSuccessFor(password2)
    }
    if(stateValue === ''){
        setErrorFor(state,"enter state")        
    }
    else{
        setSuccessFor(state)   
    }
    if(zipValue === ''){
        setErrorFor(zip,"enter state")        
    }
    else{
        setSuccessFor(zip)   
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