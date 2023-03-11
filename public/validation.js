// const { validate } = require("../models/usermodel");

// // const nameError = document.querySelector("#name-error");
// // const emailError = document.querySelector("#email-error");
// // document.addEventListener("keyup", () => {
// //   const name = document.querySelector("#name").value;
// //   if (name.length == 0) {
// //     nameError.innertext = "Name is required";
// //     return false;
// //   }
// //   if (!name.match(/^[A-Za-z]*\s{1}[A-Za-z]*$/)) {
// //     nameError.innertext = "Write name";
// //     return false;
// //   }
// //   nameError.innertext = "";
// //   return true;
// // });
// // document.addEventListener("keyup", () => {
// //   const name = document.querySelector("#email").value;
// //   if (email.length == 0) {
// //     emailError.innertext = "email is required";
// //     return false;
// //   }
// //   if (!email.match(/^[A-Za-z\._\-[0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)) {
// //     emailError.innertext = "enter valid email";
// //     return false;
// //   }
// //   emailError.innertext = "";
// //   return true;
// // });
    







// // const form = document.getElementById('form')
// // const username = document.getElementById('username')
// // const email = document.getElementById('email')
// // const password = document.getElementById('pass')
// // const password2 = document.getElementById('pass2')

// // form.addEventListener('submit',e =>{
// //   e.preventDefault();

// //   validateInputs()
// // });

// // const setError = (element,message)=>{
// //   const inputcontrol = element.parentElement;
// //   const errorDisplay = inputcontrol.querySelector('.error');

// //   errorDisplay.innertext = message;
// //   inputcontrol.classList.add('error');
// //   inputcontrol.classList.remove('success');
// // }

// // const setSuccess = element=>{
// //   const inputcontrol = element.parentElement;
// //   const errorDisplay = inputcontrol.querySelector('.error')  
  
// //   errorDisplay.innertext = '';
// //   inputcontrol.classList.add('success');
// //   inputcontrol.classList.remove('error');
// // }

// // const isvalidemail = email =>{
// //   const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,::\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// //   return re.test(String(email).toLowerCase());
// // }

// // const validateInputs = ()=>{
// //   const usernamevalue = username.value.trim();
// //   const emailvalue = email.value.trim();
// //   const passwordvalue = password.value.trim();
// //   const password2value = password2.value.trim();

// // if(usernamevalue ===''){
// //   setError(username,'username is required')
// // }else{
// //   setSuccess(username)
// // }

// // if(emailvalue ===''){
// //   setError(email,'email is required');
// // }else if(!isvalidemail(emailvalue)){
// //   setError(email,'provide a valid email adderess')
// // }else{
// //   setSuccess(email);
// // }

// // if(passwordvalue ===''){
// //   setError(password, 'password is required')
// // }else if(passwordvalue.length<8){
// //   setError(password,'password must be atleast 8 characters')
// // }else{
// //   setSuccess(password)
// // }

// // if(password2value ===''){
// //   setError(password2, 'please confirm your password')
// // }else if(password2 !== passwordvalue){
// //   setError(password2,"password doesn't match");
// // }else{
// //   setSuccess(password2)
// // }

// // }; 


// // ////////////////////////////////////

// // var nameError = document.getElementById('name-error');
// // var phoneError = document.getElementById('phone-error');
// // var emailError = document.getElementById('email-error');
// // var messageError = document.getElementById('message-error');
// // var submitError = document.getElementById('submit-error');

// // function validateName(){
// //     var name = document.getElementById('contact-name').value;

// //     if(name.length == 0){
// //         nameError.innerHTML = 'Name is required';
// //         return false;
// //     }
// //     if(!name.match(/^[A-Za-z]\s{1}[A-Za-z]$/)){
// //         nameError.innerHTML = 'Write full Name';
// //         return false;
// //     }
// //     nameError.innerHTML = '<i  class="fa-solid fa-circle-check log"></i>';
// //     return true;
// // }

// // function validatePhone(){
// //     var phone = document.getElementById('phone-no').value;

// //     if(phone.length == 0){
// //         phoneError.innerHTML = 'Phone no is required';
// //         return false;
// //     }
// //     if(phone.length !== 10){
// //         phoneError.innerHTML = 'Phone no should be 10 digits';
// //         return false;
// //     }
// //     if(!phone.match(/^[0-9]{10}$/)){
// //         phoneError.innerHTML = 'only digits please';
// //         return false;
// //     }

// //     phoneError.innerHTML = '<i  class="fa-solid fa-circle-check log"></i>';
// //     return true;
// // }

// // function validateEmail(){
// //     var email = document.getElementById('contact-email').value;

// //     if(email.length == 0){
// //         emailError.innerHTML = 'Email is required';
// //         return false;
// //     }
// //     if(!email.match(/^[A-Za-z\._\-[0-9][@][A-Za-z][\.][a-z]{2,4}$/)){
// //         emailError.innerHTML = 'Email is invalid';
// //         return false;
// //     }

// //     emailError.innerHTML = '<i  class="fa-solid fa-circle-check log"></i>';
// //     return true;
// // }

// // function validateMessage(){
// //     var message = document.getElementById('contact-message').value;

// //     if(message.length <= 20){
// //         messageError.innerHTML = 'need more message';
// //         return false;
// //     }

// //     messageError.innerHTML = '<i  class="fa-solid fa-circle-check log"></i>'
// //     return true;
// // }

// // function validateForm(){
// //     if(!validateName() || !validatePhone() || !validateEmail || !validateMessage()){
// //         submitError.style.display='block';
// //         submitError.innerHTML='Error'
// //         setTimeout(function(){submitError.style.display='none'},3000)
// //         return false;
// //     }
// // }var nameError = document.getElementById('name-error');
// // var phoneError = document.getElementById('phone-error');
// // var emailError = document.getElementById('email-error');
// // var messageError = document.getElementById('message-error');
// // var submitError = document.getElementById('submit-error');

// // function validateName(){
// //     var name = document.getElementById('contact-name').value;

// //     if(name.length == 0){
// //         nameError.innerHTML = 'Name is required';
// //         return false;
// //     }
// //     if(!name.match(/^[A-Za-z]\s{1}[A-Za-z]$/)){
// //         nameError.innerHTML = 'Write full Name';
// //         return false;
// //     }
// //     nameError.innerHTML = '<i  class="fa-solid fa-circle-check log"></i>';
// //     return true;
// // }

// // function validatePhone(){
// //     var phone = document.getElementById('phone-no').value;

// //     if(phone.length == 0){
// //         phoneError.innerHTML = 'Phone no is required';
// //         return false;
// //     }
// //     if(phone.length !== 10){
// //         phoneError.innerHTML = 'Phone no should be 10 digits';
// //         return false;
// //     }
// //     if(!phone.match(/^[0-9]{10}$/)){
// //         phoneError.innerHTML = 'only digits please';
// //         return false;
// //     }

// //     phoneError.innerHTML = '<i  class="fa-solid fa-circle-check log"></i>';
// //     return true;
// // }

// // function validateEmail(){
// //     var email = document.getElementById('contact-email').value;

// //     if(email.length == 0){
// //         emailError.innerHTML = 'Email is required';
// //         return false;
// //     }
// //     if(!email.match(/^[A-Za-z\._\-[0-9][@][A-Za-z][\.][a-z]{2,4}$/)){
// //         emailError.innerHTML = 'Email is invalid';
// //         return false;
// //     }

// //     emailError.innerHTML = '<i  class="fa-solid fa-circle-check log"></i>';
// //     return true;
// // }

// // function validateMessage(){
// //     var message = document.getElementById('contact-message').value;

// //     if(message.length <= 20){
// //         messageError.innerHTML = 'need more message';
// //         return false;
// //     }

// //     messageError.innerHTML = '<i  class="fa-solid fa-circle-check log"></i>'
// //     return true;
// // }

// // function validateForm(){
// //     if(!validateName() || !validatePhone() || !validateEmail || !validateMessage()){
// //         submitError.style.display='block';
// //         submitError.innerHTML='Error'
// //         setTimeout(function(){submitError.style.display='none'},3000)
// //         return false;
// //     }
// // }


var nameError = document.getElementById('nameerror')
var countryError = document.getElementById('countryerror')
var addressError = document.getElementById('addresserror')
var cityError = document.getElementById('cityerror')
var stateError = document.getElementById('stateerror')
var postcodeError = document.getElementById('postcodeerror')
var phoneError = document.getElementById('phoneerror')
var submitError = document.getElementById('submiterror')


function validateName(){
    var name = document.getElementById('firstname').value;
    if(name.length==0){
        nameError.innerHTML = "Name is Required";
        return false;
    }

    nameError.innerHTML = 'Name is Valid';
    return true;
}


function validateCountry(){
    var country = document.getElementById('country').value;
    if(country.length ==0){
        countryError.innerHTML = "Please  give a Country Name";
        return false;
    }

    countryError.innerHTML = "Country name is valid";
    return true;
}

function validateAddress(){
    var address = document.getElementById('address').value;
    if(address.length==0){
        addressError.innerHTML = "please type an address";
        return false;
    }
    addressError.innerHTML = "Address is valid";
    return true;
}

function validateCity(){
    var city = document.getElementById('city').value;
    if(city.length==0){
        cityError.innerHTML = "City Name is Required";
        return false;
    }

    cityError.innerHTML = 'City Name is Valid';
    return true;
}

function validateState(){
    var state = document.getElementById('state').value;
    if(state.length==0){
        stateError.innerHTML = " State Name is Required";
        return false;
    }

    StateError.innerHTML = 'State Name is Valid';
    return true;
}

function validatePostcode(){
    var postcode = document.getElementById('postcode').value;
    if(postcode.length==0){
        postcodeError.innerHTML = "postcode is Required";
        return false;
    }
    if(postcode.length>7){
        postcodeError.innerHTML = "postcode is Invalid";
        return false;
    }

    postcodeError.innerHTML = 'postcode is Valid';
    return true;
}

function validatePhone(){
    var phone = document.getElementById('phone').value;
    if(phone.length==0){
        phoneError.innerHTML = "Phone Number is Required";
        return false;
    }
    if(phone.length>10||phone.length<10){
        phoneError.innerHTML = "Phone Number is Invalid";
        return false;
    }


    phoneError.innerHTML = 'Number is Valid';
    return true;
}

function validateForm(){
    if(!validateName()|| !validateCountry()|| !validateAddress()|| !validateCity()|| !validateState()|| !validatePostcode()|| !validatePhone()){
        submitError.innerHTML = 'please fill all fields';
        return false;
    }
}








// // function validateForm() {
// //   // Get form inputs
// //   var name = document.forms["myForm"]["name"].value.trim();
// //   var category = document.forms["myForm"]["category"].value.trim();
// //   var price = document.forms["myForm"]["price"].value.trim();
// //   var quantity = document.forms["myForm"]["quantity"].value.trim();
// //   var description = document.forms["myForm"]["description"].value.trim();
// //   var rating = document.forms["myForm"]["rating"].value.trim();
  

//   // Define validation variables
//   var nameError = document.getElementById("nameError");
//   var categoryError = document.getElementById("categoryError");
//   var priceError = document.getElementById("priceError");
//   var quantityError = document.getElementById("quantityError");
//   var descriptionError = document.getElementById("descriptionError");
//   var ratingError = document.getElementById("ratingError");
  
//   var isValid = true;

//   // Validate name
//   if (name === "") {
//     nameError.textContent = "Please enter a name";
//     isValid = false;
//   } else {
//     nameError.textContent = "";
//   }

//   // Validate category
//   if (category === "") {
//     categoryError.textContent = "Please select a category";
//     isValid = false;
//   } else {
//     categoryError.textContent = "";
//   }

//   // Validate price
//   if (price === "") {
//     priceError.textContent = "Please enter a price";
//     isValid = false;
//   } else if (isNaN(price)) {
//     priceError.textContent = "Please enter a valid price";
//     isValid = false;
//   } else {
//     priceError.textContent = "";
//   }

//   // Validate quantity
//   if (quantity === "") {
//     quantityError.textContent = "Please enter a quantity";
//     isValid = false;
//   } else if (isNaN(quantity)) {
//     quantityError.textContent = "Please enter a valid quantity";
//     isValid = false;
//   } else {
//     quantityError.textContent = "";
//   }

//   // Validate description
//   if (description === "") {
//     descriptionError.textContent = "Please enter a description";
//     isValid = false;
//   } else {
//     descriptionError.textContent = "";
//   }

//   // Validate rating
//   if (rating === "") {
//     ratingError.textContent = "Please enter a rating";
//     isValid = false;
//   } else if (isNaN(rating)) {
//     ratingError.textContent = "Please enter a valid rating";
//     isValid = false;
//   } else if (rating < 0 || rating > 5) {
//     ratingError.textContent = "Rating must be between 0 and 5";
//     isValid = false;
//   } else {
//     ratingError.textContent = "";
//   }

//   // Validate image
// //   if (image === "") {
// //     imageError.textContent = "Please select an image";
// //     isValid = false;
// //   } else {
// //     imageError.textContent = "";
// //   }

//   return isValid;
// }

// // Add event listener to form submit
// document.forms["myForm"].addEventListener("submit", function(event) {
//   if (!validateForm()) {
//     event.preventDefault(); // Prevent form submission
//   }
// });

// console.log(validateForm)
