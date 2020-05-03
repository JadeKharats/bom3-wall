function getToken() {

    var xhr = new XMLHttpRequest();
    var userElement = document.getElementById('username');
    var passwordElement = document.getElementById('password');
    var platformElement = document.getElementById('platform');
    var errorElement = document.getElementById('error');
    var loginElement = document.getElementById('login');
    var user = userElement.value;
    var password = passwordElement.value;
    var platform = platformElement.value;

    localStorage.setItem('bom_url', platform);

    var loginUrl = platform + "/api/sign_ins"
  
    xhr.open('POST', loginUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.addEventListener('load', function() {
      var responseObject = JSON.parse(this.response);
      console.log(responseObject);
      if (responseObject.token) {
        localStorage.setItem('token', responseObject.token);
        loginElement.classList.add("hidden");
        // getMoods();
        setInterval(getMoods, 3000);        
      } else {
        errorElement.innerHTML = "No token received";
      }
    });
  
    var sendObject = JSON.stringify({user:{email: user, password: password}});
  
    console.log('going to send', sendObject);
  
    xhr.send(sendObject);
  }


function getMoods() {

    var MoodUrl = localStorage.getItem('bom_url') + "/api/moods"
    var xhr = new XMLHttpRequest();
    var wrapperElement = document.getElementById('wrapper');
    
    xhr.open('GET', MoodUrl, true);
    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
    xhr.addEventListener('load', function() {
      var responseObject = JSON.parse(this.response);
      console.log(responseObject);
      wrapperElement.innerHTML="";
      responseObject.forEach(function(item,i){
        console.log(item);
        addTimeCard(item);
      });
    });

    
    xhr.send();
  }

  function addTimeCard(item) {
    var wrapperElement = document.getElementById('wrapper');
    var box = document.createElement("div");
    var card = document.createElement("div");
    var content = document.createElement("div");
    var user = document.createElement("h4");
    var comment = document.createElement("p");

    box.classList.add("box");
    box.classList.add("box" + item.level);
    card.classList.add("card");
    content.classList.add("content");

    user.textContent = item.user;
    comment.textContent = item.comment;

    content.appendChild(user);
    content.appendChild(comment);
    box.appendChild(content);

    wrapperElement.insertBefore(box, wrapperElement.firstChild);  
  }