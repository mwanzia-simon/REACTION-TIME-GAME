const userBtn = document.querySelector("#user");

userBtn.addEventListener("click", () => {
  window.open("signup.html", "_self");
});

const API_URL = "http://localhost:3000";

//Signin details
const signinForm = document.querySelector("#signinForm");
const signinEmail = document.querySelector("#signinEmail");
const signinPassword = document.querySelector("#signinPassword");

//signup details
const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
