// make the request to the login endpoint
function getToken() {
    var loginUrl = "https://beta-bom3.herokuapp.com/api/sign_ins"
    var xhr = new XMLHttpRequest();
    var userElement = document.getElementById('username');
    var passwordElement = document.getElementById('password');
    var tokenElement = document.getElementById('token');
    var user = userElement.value;
    var password = passwordElement.value;
  
    xhr.open('POST', loginUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.addEventListener('load', function() {
      var responseObject = JSON.parse(this.response);
      console.log(responseObject);
      if (responseObject.token) {
        tokenElement.innerHTML = "Token received";
        localStorage.setItem('token', responseObject.token);
        setInterval(getMoods, 3000)
      } else {
        tokenElement.innerHTML = "No token received";
      }
    });
  
    var sendObject = JSON.stringify({user:{email: user, password: password}});
  
    console.log('going to send', sendObject);
  
    xhr.send(sendObject);
  }


function getMoods() {

    var url = "https://beta-bom3.herokuapp.com/api/moods"
    var xhr = new XMLHttpRequest();
    var resultElement = document.getElementById('result');
    var wrapperElement = document.getElementById('wrapper');
    
    xhr.open('GET', url, true);
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

    box.classList.add("box" + item.level);
    card.classList.add("card");
    content.classList.add("content");

    user.textContent = item.user;
    comment.textContent = item.comment;

    content.appendChild(user);
    content.appendChild(comment);
    card.appendChild(content);
    box.appendChild(card);

    wrapperElement.insertBefore(box, wrapperElement.firstChild);  
  }