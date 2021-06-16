// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBody = document.querySelector(".modal-body");
const dataSendCloseBtn = document.querySelector(".btn-close");
//const formData = document.querySelectorAll(".formData");
const copyright = document.querySelector(".copyrights");
const form = document.getElementById("form");
const formTransmitted = document.getElementById("confirmation");
const locationInputData = document.getElementsByName("location");

let firstIsOk = false;
let lastIsOk = false;
let emailIsOk = false;

dataSendCloseBtn.addEventListener("click", closeModal);

// close modal form
function closeModal() {
  //modalbg.style.display = "none";
  //reset modal when closing after data sended
  if (formTransmitted.style.display === "flex") {
    form.reset();
    modalBody.style.display = "block";
    dataSendCloseBtn.style.display = "none";
    formTransmitted.style.display = "none";
  }
}

//insert copyright with automatically good actual year
const year = new Date().getFullYear();
copyright.textContent = "©" + year + " Influence Systems Consulting Limited";

//verify if a field is missing to secure website, alert message to user, and refresh page
function fieldIsMissing() {
  const allFields = ["first", "last", "email"];
  //verify if a field is missing from data into array allFields
  allFields.forEach((field) => {
    const input = document.querySelector(`#${field}`);
    if (!input) {
      alert(`Merci de ne pas effacer les champs du formulaire ! La page va se rafraîchir !`);
      //refresh page
      document.location.reload();
    }
  });
}
/***** endof  fieldIsMissing function     **********/

/***** function to control minLength of inputs ******/
function minLengthIsOK(field, data, size) {
  if (data.length < size) {
    setStatus(field, `Merci de renseigner au minimum ${size} charactères.`, "error");
  } else {
    setStatus(field, null, "success");
    if (field.name === "first") {
      firstIsOk = true;
    } else if (field.name === "last") {
      lastIsOk = true;
    }
  }
}

//function verify is data inputs validate the conditions required
function validateFields(field) {
  // Check presence of values
  if (field.value.trim() === "") {
    setStatus(field, `Le Champ ${field.parentElement.querySelector("label").innerText} ne peut être vide.`, "error");
  }
  // check for a valid email address
  else if (field.type === "email") {
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (regex.test(field.value)) {
      setStatus(field, null, "success");
      emailIsOk = true;
    } else {
      setStatus(field, "Merci de renseigner une adresse email valide.", "error");
    }
  }
  //check minLength of first and last field
  else if (field.id === "first" || field.id === "last") {
    minLengthIsOK(field, field.value, 2);
  } //everything is good
  else {
    setStatus(field, null, "success");
  }
}
/*****endfo ValidateFields function*******/

function setStatus(field, message, status) {
  //create new div element with error class
  const newDivError = document.createElement("div");
  newDivError.className = "error";

  //success status => remove all CSS styling for error
  if (status === "success") {
    //normal color for Bordercolor with no error
    field.style.borderColor = "#ccc";

    //remove div with error message
    const elt = field.parentElement.querySelector("div.error");
    if (elt) {
      elt.remove();
    }
  }

  //error status => indicate visually error to user
  if (status === "error") {
    //Red color for borderColor to indicate an error to user
    field.style.borderColor = "red";
    //adding new div element with error message
    field.parentElement.appendChild(newDivError);
    field.parentElement.querySelector(".error").innerText = message;
  }
}
/***endof setstatus function *****/

//checking inputs
function checkInputs() {
  //create data Object to receive all entries from form and permit to send data with easy way to back end
  const formData = new FormData(form);
  const entries = formData.entries();
  const data = Object.fromEntries(entries);
  //get all fields of form to check if nothing is missing
  const fields = Object.keys(data);
  //console.log(data, fields);

  //verify if someone modify input form before sending data
  fieldIsMissing();

  /*analyze inputs data to alert users by error message if something is wrong
  if a city is not selected and terms of usage not accepted
  fields will be an array without inputs from radio element and checkbox element
  and fields.length === 5 (5 inputs: first, last, email, birthdate, and quantity)
  minimum required is 7 inputs 
  */

  fields.forEach((field) => {
    const input = document.querySelector(`#${field}`);
    validateFields(input);
  });

  /* end of analyse inputs data */

  if (data.first && firstIsOk && data.last && lastIsOk && data.email && emailIsOk) {
    modalBody.style.display = "none";
    dataSendCloseBtn.style.display = "block";
    formTransmitted.style.display = "flex"; ///
    /*****here send information to backend data format Json ***/
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.onload = function () {
      console.log(xhr.responseText);
      if (xhr.responseText == "success") {
        alert("email sent");
      } else {
        alert("quelque chose s'est mal passé");
      }
    };
    xhr.send(JSON.stringify(data));
    //console.log(JSON.stringify(data));

    /*// POST request using fetch()
    fetch("http://127.0.0.1:5500", {
      // Adding method type
      method: "POST",

      // Adding body or contents to send
      body: JSON.stringify(data),

      // Adding headers to the request
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    // Converting to JSON
      .then((response) => response.json())

      // Displaying results to console
      .then((json) => console.log(json));*/

    return true;
  } else {
    return false;
  }
}

/**** endof checkInputs function */

function validate(e) {
  e.preventDefault();
  checkInputs();
}
