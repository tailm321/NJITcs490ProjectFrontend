//question parameters: id, question, description, args, tests, constraint
//exam parameters: name, id, question, description, args, tests, constraint, points

//gets the list of created exams
function getExams() {
    var req = new XMLHttpRequest();
    //upon getting response
    req.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var rsp = JSON.parse(this.responseText);
            console.log(rsp);

            //clears exam list before repopulating it
            var exams = document.getElementById("examList");
            exams.options.length = 0;
            //sets a default value
            //new Option(text, value, defaultSelected, selected)
            exams.options[0] = new Option("Select Exam", "", true, true);
            //loop to populate exam list with exams in response array
            for (var i = 0; i < rsp.length; i++) {
                exams.options[exams.options.length] = new Option(rsp[i], rsp[i]);
            }
        }
    };
    //opens and sends data to php file
    req.open("GET", "https://web.njit.edu/~tm323/front/getExamNames.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send();
}

//updates the list of questions in the quesition bank
function updateQues(){
    //get the words in the search bar, add it to body to be sent to midend
    var sQ = document.getElementById("search").value;
    var body = "search=" + sQ;
    //also account for selection in difficulty and categories, add to body as neccessary
    var diff = document.getElementById("difficulty").value;
    var cats = document.getElementById("categories").value;
    if(diff !== "" && cats === ""){
      body += "&difficulty=" + diff;
    }
    else if(diff === "" && cats !== ""){
      body += "&category=" + cats;
    }
    else if(diff !== "" && cats !== ""){
      body += "&difficulty=" + diff + "&" + "category=" + cats;
    }
    console.log(body);
    
    var req = new XMLHttpRequest();
    //upon getting response
    req.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            //the list of questions according to sent parameters
            var rsp = JSON.parse(this.responseText);
            console.log(rsp);
          
            //populate the list of questions
            document.getElementById("quesList").innerHTML = "";
            for(var i = 0; i < rsp.length; i++){
                //var divText = document.getElementById("box");
                var listQues = document.createElement("li");
                listQues.setAttribute("value", rsp[i].id);
                var quesDesc = document.createTextNode(rsp[i].description);
                listQues.appendChild(quesDesc);
                document.getElementById("quesList").appendChild(listQues);
            }
        }
    };
    //opens and sends data to php file
    req.open("POST", "https://web.njit.edu/~tm323/front/getQ.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(body);        
}

function createQues(){
    //if null values are found for adding questions in exam, it'll stop and terminate
    var name = document.getElementById('quesName').value;
    var desc = document.getElementById('quesDesc').value;
    var diff = document.getElementById('difficulty').value;
    var cats = document.getElementById('categories').value;
    var cons = document.getElementById('constraints').value;
    var args = document.getElementById('arguments').value;
    var test = document.getElementById('testcases').value;
    var body = "question="+name+"&description="+desc+"&category="+cats+"&difficulty="+diff+"&constraint="+cons+"&args="+encodeURIComponent(args)+"&tests="+encodeURIComponent(test);
    console.log(body);
    
    var req = new XMLHttpRequest();
    //opens and sends data to php file
    req.open("POST", "https://web.njit.edu/~tm323/front/addQ.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(body);
    
    document.getElementById("confMsg").innerHTML = "Question Successfully Created!";
}
//adds a new question to the exam form
function addExamQues() {
    var numQues = document.getElementById("examQues").children.length;
    
    console.log(numQues);
    
    var quesId = document.createElement("input");
    quesId.setAttribute("type", "text");
    quesId.setAttribute("id", "quesId" + (numQues + 1));
    quesId.setAttribute("class", "newQues");
    quesId.setAttribute("placeholder", "Question ID#");
    
    var quesPts = document.createElement("input");
    quesPts.setAttribute("type", "text");
    quesPts.setAttribute("id", "quesPts" + (numQues + 1));
    quesPts.setAttribute("class", "points");
    quesPts.setAttribute("placeholder", "# of points");
    //var nl = document.createElement("br");
    
    //add up to a maximum of 10 questions (numQues - 1)
    if(numQues < 10){
        document.getElementById("examQues").appendChild(quesId);
        document.getElementById("points").appendChild(quesPts);
        //examDiv.appendChild(nl);
    }
    //disables button upon reaching question limit
    numQues = document.getElementById("examQues").children.length;
    console.log(numQues);
    if(numQues == 10) {
        document.getElementById("addQues").classList.add("disabled");
    }
    console.log(quesId);
    console.log(quesPts);
}
function getCats(){
    var req = new XMLHttpRequest();
    //upon getting response, changes html to echo response
    req.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            //receive and store response
            var rsp = JSON.parse(this.responseText);
            console.log(rsp);
            
            var cats = document.getElementById("categories");
            cats.options.length = 0;
            
            cats.options[cats.options.length] = new Option("All","");
            for(var i = 0; i < rsp.length; i++){
                cats.options[cats.options.length] = new Option(rsp[i],rsp[i]);
            }
        }
    }
    //opens and sends data to php file
    req.open("GET", "https://web.njit.edu/~tm323/front/getCategoryNames.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send();
}

function createExam() {
    var req = new XMLHttpRequest();
    //upon getting response, changes html to echo response
    req.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            //receive and store response
            var rsp = JSON.parse(this.responseText);
            console.log(rsp);
            //name, id, ques, desc, args, tests, constraint, points,
            //get the number of questions in the exam
            var numQues = document.getElementById("examQues").children.length;
            
            var examName = document.getElementById("examName").value;
            if(examName == ""){
                document.getElementById("examConf").innerHTML = "Please give the exam a name."
            }
            else{
                //sends the parameters of exam questions one by one to be added to the exam
                for(var i = 1; i <= numQues; i++){
                    var quesId = document.getElementById("quesId" + i).value;
                    var quesPos = quesId - 1;
                    var quesPts = document.getElementById("quesPts" + i).value;
                    
                    createExam2(examName, quesId, rsp[quesPos].question, rsp[quesPos].description, encodeURIComponent(rsp[quesPos].args), encodeURIComponent(rsp[quesPos].tests), rsp[quesPos].constraint, quesPts);
                }
            }
        }
    };
    //opens and sends data to php file
    req.open("POST", "https://web.njit.edu/~tm323/front/getQ.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send();
}
function createExam2(exam, id, ques, desc, args, tests, constraint, points){
    var req = new XMLHttpRequest();
    //upon getting response, changes html to echo response
    req.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            //receive and store response
            var rsp = JSON.parse(this.responseText);
            console.log(rsp);
        }
    }
    //opens and sends data to php file
    req.open("POST", "https://web.njit.edu/~tm323/front/addQToExamAll.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send("name="+exam+"&id="+id+"&question="+ques+"&description="+desc+"&args="+args+"&tests="+tests+"&constraint="+constraint+"&points="+points);
    
    document.getElementById("examConf").innerHTML = "Exam Successfully Created!"
}
//selects the exam to be able to be taken on the student's end
function enableExam(){
    var exam = document.getElementById("examList").value;
    //if(exam == ""){
    //    return;
    //}
    var req = new XMLHttpRequest();
    //opens and sends data to php file
    req.open("POST", "https://web.njit.edu/~tm323/front/selectExam.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send("name="+exam);
    console.log("name="+exam);
}