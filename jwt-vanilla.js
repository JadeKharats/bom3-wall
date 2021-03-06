var interval;

function logout(){
  localStorage.clear();
  location.reload();
}

function hiddenLogin() {
  var loginElement = document.getElementById("login");
  var logoutElement = document.getElementById("logout");
  var password = document.getElementById("password").value;
  loginElement.classList.add("hidden");
  logoutElement.classList.remove("hidden");
  document.getElementById("password").value = "";
}

function successLogin(token) {
  localStorage.setItem("token", token);
  wipLogin();
  getMoods();
  hiddenLogin();
}

function wipLogin() {
  var errorElement = document.getElementById("error");
  errorElement.innerHTML = "Accès plateforme en cours";
}

function failLogin() {
  var errorElement = document.getElementById("error");
  errorElement.innerHTML = "No token received";
}

function errorLogin() {
  var errorElement = document.getElementById("error");
  errorElement.innerHTML = "Plateforme non joignable";
}

function jsonLoginObject(){
  var user = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  return JSON.stringify({user:{email: user, password: password}});
}

function getLoginUrl() {
  var platform = document.getElementById("platform").value;
  localStorage.setItem("bom_url", platform);
  var loginUrl = platform + "/api/sign_ins";
  return loginUrl;
}

function getMoodsUrl() {
  var MoodUrl = localStorage.getItem("bom_url") + "/api/moods";
  return MoodUrl;
}

function clearWrapper() {
  var wrapperElement = document.getElementById("wrapper");
  wrapperElement.innerHTML="";
}

function stopReload(){
  clearInterval(window.interval);
}

function autoReload(){
  stopReload();
  window.interval = setInterval(getMoods, 3000);
}

function addTimeCard(item) {
  var wrapperElement = document.getElementById("wrapper");
  var box = document.createElement("div");
  var content = document.createElement("div");
  var user = document.createElement("h4");
  var comment = document.createElement("p");

  box.classList.add("box");
  box.classList.add("box" + item.level);
  content.classList.add("content");

  user.textContent = item.user;
  comment.textContent = item.comment;

  content.appendChild(user);
  content.appendChild(comment);
  box.appendChild(content);

  wrapperElement.insertBefore(box, wrapperElement.firstChild);  
}


function login() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", getLoginUrl(), true);
  xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  xhr.addEventListener("load", function() {
    var responseObject = JSON.parse(this.response);
    if (responseObject.token) {
      successLogin(responseObject.token);        
    } else {
      failLogin();      
    }
  });
  xhr.addEventListener("error", function(){
    errorLogin();
  })
  var sendObject = jsonLoginObject();
  xhr.send(sendObject);
}

function getMoods() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", getMoodsUrl(), true);
  xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("token"));
  xhr.addEventListener("load", function() {
    var responseObject = JSON.parse(this.response);
    clearWrapper();
    responseObject.forEach(function(item,i){
      addTimeCard(item);
    });
  });  
  xhr.send();
}


  