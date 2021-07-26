//parameters: answer, args, comment, constraint, deductions, description, grade, id, name, points, question, tests
var examName = "";
var examRsp = [];
var currQues = 0;
//gets the name of the exam currently enabled to be taken by the student
function getExam(){
    var req = new XMLHttpRequest();
    //upon getting response, changes html to echo response
    req.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            //receive and store response
            var rsp = JSON.parse(this.responseText);
            console.log(rsp);
            
            examName = rsp.name;
            document.getElementById("examName").innerHTML = examName;
            getExamQues(examName);
        }
    };
    //opens and sends data to php file
    req.open("GET", "https://web.njit.edu/~tm323/front/getExamToTake.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send();
}
//gets the questions of the specified exam
function getExamQues(examName){
    var req = new XMLHttpRequest();
    //upon getting response, changes html to echo response
    req.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            //receive and store response
            var rsp = JSON.parse(this.responseText);
            console.log(rsp);
            //var quesDiv = document.createElement("div");
            
            //for every question in the exam, record its ID, and display its description and a textbox for the student's answer
            console.log(rsp.length);
            examRsp = rsp;
            //fills out the table for the initial question
            for(var i = 0; i < examRsp.length; i++){
                var quesDesc = document.createElement("p");
                quesDesc.innerHTML = (i+1) + ". " + examRsp[i].description + ". Constraint: " + examRsp[i].constraint;
                var quesAns = document.createElement("textarea");
                //quesAns.addEventListener("keydown", insertTab(this, event));
                quesAns.setAttribute("class", "bigTextBox");
                quesAns.setAttribute("id", "ansBox"+(i+1));
                
                document.getElementById("examAns").appendChild(quesDesc);
                document.getElementById("examAns").appendChild(quesAns);
            }
            //fillTable(currQues);
        }
    };
    //opens and sends data to php file
    req.open("POST", "https://web.njit.edu/~tm323/front/getExam.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send("name="+examName);
}
//submits student exam answers
function submitExam(){
    for(var i = 0; i < examRsp.length; i++){
        var id = examRsp[i].id
        var answer = document.getElementById("ansBox"+(i+1)).value;
        console.log(answer);
        submitExam2(id, answer);
    }
}
function submitExam2(id, answer){
    var req = new XMLHttpRequest();
    
    //opens and sends data to php file
    req.open("POST", "https://web.njit.edu/~tm323/front/answerExamQ.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send("name="+examName+"&id="+id+"&answer="+encodeURIComponent(answer));
    console.log("name="+examName+"&id="+id+"&answer="+encodeURIComponent(answer));
    //sends the student away after exam is submitted
    window.location.replace('https://web.njit.edu/~tm323/front/login.html');
}
function insertTab(){
    var textareas = document.getElementsByTagName('textarea');
    var count = textareas.length;
    for(var i=0;i<count;i++){
        textareas[i].onkeydown = function(e){
            if(e.keyCode==9 || e.which==9){
                e.preventDefault();
                var s = this.selectionStart;
                this.value = this.value.substring(0,this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
                this.selectionEnd = s+1; 
            }
        }
    }
}