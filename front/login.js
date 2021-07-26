//handles user login, navigates user to different front page depending on if they are a student or instructor
function loginFunc(form){
    var req = new XMLHttpRequest();
    //document.getElementById('loginMsg').innerHTML = form.pass.value;
    console.log("ucid="+form.ucid.value+"&pass="+form.pass.value);
    //upon getting response, changes html to echo response
    req.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            
            //document.getElementById('loginMsg').innerHTML = form.pass.value;
            //check if response indicates whether person logging in is instructor or student
            var rsp = JSON.parse(this.responseText);
            //loginRsp = "test";
  
            console.log(rsp['Login']);
            if(rsp.Login == 'teacher'){
                window.location.replace("frontIns.html");
            }
            else if(rsp.Login == 'student'){
                window.location.replace("frontStu.html");
            }
            else {              
                document.getElementById('loginMsg').innerHTML = "Invalid Login: Please recheck UCID or password.";
            }
        }
    };
    //opens and sends login data to php file
    req.open("POST", "login.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send("ucid="+form.ucid.value+"&pass="+form.pass.value);    
}
