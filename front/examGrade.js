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
            console.log(examRsp);
            //fills out the table for the initial question
            fillTable();
        }
    };
    //opens and sends data to php file
    req.open("POST", "https://web.njit.edu/~tm323/front/getExam.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send("name="+examName);
}
//fills out the grading table with the relevent info of the specified question in the response array
function fillTable(){
    var examQues = examRsp[currQues];
    var grade = examQues.grade;
    var testPts = Math.floor((examQues.points)/(examQues.tests.length));
    console.log(testPts);
    document.getElementById("ques").textContent = (currQues+1) + ". " + examQues.description + ". Constraint: " + examQues.constraint;
    document.getElementById("ans").textContent = examQues.answer;
    document.getElementById("bonusInput").value = 0;
    document.getElementById("ptsInput").value = grade;
    document.getElementById("comInput").value = examQues.comment;
    console.log(examQues.deductions);
    console.log("grade: " + grade);
    //populate testcases
    for(var i = 0; i < 6; i++){
        document.getElementById("tc"+(i+1)).style.backgroundColor = "yellow";
        document.getElementById("tc"+(i+1)+"Arg").textContent = "N/A";
        document.getElementById("tc"+(i+1)+"Test").textContent = "Expected: N/A";
        document.getElementById("tc"+(i+1)+"Input").value = "0";
        document.getElementById("tc"+(i+1)+"Input").readOnly = true;
    }
    //handles the deductions for constraint
    switch(examQues.deductions[0]){
        //correct, applies to all others
        case "0":
            document.getElementById("con").style.backgroundColor = "green";
            document.getElementById("conArg").textContent = "Used";
            document.getElementById("conTest").textContent = "Expected: " + "'" + examQues.constraint + "'";
            document.getElementById("conInput").value = "-0";
            break;
        //missing, applies to all others
        case "1":
            document.getElementById("con").style.backgroundColor = "red";
            document.getElementById("conArg").textContent = "Missing";
            document.getElementById("conTest").textContent = "Expected: " + "'" + examQues.constraint + "'";
            document.getElementById("conInput").value = "-3";
            break;
        //"2", no contraint for question
        default:
            document.getElementById("con").style.backgroundColor = "yellow";
            document.getElementById("conArg").textContent = "N/A";
            document.getElementById("conTest").textContent = "Expected: N/A";
            document.getElementById("conInput").value = "-0";
            document.getElementById("conInput").readOnly = true;
    }
    //checks for colon in function header
    switch(examQues.deductions[1]){
        case "0":
            document.getElementById("cln").style.backgroundColor = "green";
            document.getElementById("clnArg").textContent = "Used";
            document.getElementById("clnTest").textContent = "Expected: ':'";
            document.getElementById("clnInput").value = "-0";
            break;
        case "1":
            document.getElementById("cln").style.backgroundColor = "red";
            document.getElementById("clnArg").textContent = "Missing";
            document.getElementById("clnTest").textContent = "Expected: ':'";
            document.getElementById("clnInput").value = "-3";
            break;
    }
    //checks for the proper header name
    switch(examQues.deductions[2]){
        case "0":
            document.getElementById("hdr").style.backgroundColor = "green";
            document.getElementById("hdrArg").textContent = "Used";
            document.getElementById("hdrTest").textContent = "Expected: " + "'" + examQues.question + "'";
            document.getElementById("hdrInput").value = "-0";
            break;
        case "1":
            document.getElementById("hdr").style.backgroundColor = "red";
            document.getElementById("hdrArg").textContent = "Missing";
            document.getElementById("hdrTest").textContent = "Expected: " + examQues.question;
            document.getElementById("hdrInput").value = "-3";
            break;
    }
    console.log(examQues.tests);
    console.log(examQues.args);
    //testcases
    for(var i = 0; i < examQues.tests.length; i++){
        switch(examQues.deductions[i+3]){
            case "0":
                document.getElementById("tc"+(i+1)).style.backgroundColor = "green";
                document.getElementById("tc"+(i+1)+"Arg").textContent = "Student input: " + examQues.args[i];
                document.getElementById("tc"+(i+1)+"Test").textContent = "Expected output: " + "'" + examQues.tests[i] + "'";
                document.getElementById("tc"+(i+1)+"Input").value = testPts;
                document.getElementById("tc"+(i+1)+"Input").readOnly = false;
                break;
            case "1":
                document.getElementById("tc"+(i+1)).style.backgroundColor = "red";
                document.getElementById("tc"+(i+1)+"Arg").textContent = "Student input: " + examQues.args[i];
                document.getElementById("tc"+(i+1)+"Test").textContent = "Expected output: " + "'" + examQues.tests[i] + "'";
                document.getElementById("tc"+(i+1)+"Input").value = "0";
                document.getElementById("tc"+(i+1)+"Input").readOnly = false;
                break;
        }
    }
    var sum = calcSum();
    var bonus = grade - sum;
    document.getElementById("bonusInput").value = bonus;
    
    console.log("sum: " + sum);
    console.log("bonus: " + bonus);
    
    //var bonus = calcBonus();
    //disables/enables prev/next buttons as needed
    if(currQues == 0){
        document.getElementById("prev").classList.add("disabled");
    }
    else{
        document.getElementById("prev").classList.remove("disabled");
    }
    if(currQues == (examRsp.length - 1)){
        document.getElementById("next").classList.add("disabled");
    }
    else{
        document.getElementById("next").classList.remove("disabled");
    }
}
//calculates sum of all question components excluding bonus
function calcSum(){
    var sum = 0;
    for(var i = 0; i < 6; i++){
        sum += +document.getElementById("tc"+(i+1)+"Input").value;
    }
    sum += +document.getElementById("conInput").value + +document.getElementById("clnInput").value + +document.getElementById("hdrInput").value;
    
    return sum;
}
//calculates total question points
function calcTotal(){
    var total = 0;
    //var grade = examRsp[currQues].grade;
    for(var i = 0; i < 6; i++){
        total += +document.getElementById("tc"+(i+1)+"Input").value;
    }
    total += +document.getElementById("conInput").value + +document.getElementById("clnInput").value + +document.getElementById("hdrInput").value;
    total += +document.getElementById("bonusInput").value;
    console.log("total " + total);
    document.getElementById("ptsInput").value = total;
}
//repopulates the grading table with the info of the next question in the response array
function nextQues(){
    currQues += 1;
    fillTable(currQues);
}
//repopulates the grading table with the info of the previous question in the response array
function prevQues(){
    currQues -= 1;
    fillTable(currQues);
}
function gradeQues(){
    var examQues = examRsp[currQues];
    var quesId = examQues.id;
    var deductions = examQues.deductions;
    var grade = document.getElementById("ptsInput").value;
    //console.log(deductions);
    
    var req = new XMLHttpRequest();
    //upon getting response, changes html to echo response
    req.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            //receive and store response
            var rsp = JSON.parse(this.responseText);
            console.log(rsp);
        }
    };
    //opens and sends data to php file
    req.open("POST", "https://web.njit.edu/~tm323/front/updateExamQGrade.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send("name="+examName+"&id="+quesId+"&grade="+grade+"&deductions="+deductions);
    //console.log("name="+examName+"&id="+quesId+"&grade="+grade+"&deductions="+deductions);
}
function addComm(){
    var id = examRsp[currQues].id;
    var com = document.getElementById("comInput").value;
    console.log(com);

    var req = new XMLHttpRequest();
    //upon getting response, changes html to echo response
    req.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            //receive and store response
            var rsp = JSON.parse(this.responseText);
            console.log(rsp);
        }
    };
    //opens and sends data to php file
    req.open("POST", "https://web.njit.edu/~tm323/front/addComment.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send("name="+examName+"&id="+id+"&comment="+com);
}