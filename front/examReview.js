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
    var testPts = Math.floor((examQues.points)/(examQues.tests.length));
    console.log(testPts);
    document.getElementById("ques").textContent = (currQues+1) + ". " + examQues.description + ". Constraint: " + examQues.constraint;
    document.getElementById("ans").textContent = examQues.answer;
    document.getElementById("bonusInput").value;    
    document.getElementById("ptsInput").value = examQues.grade;
    document.getElementById("bonusInput").value = "0";
    document.getElementById("comInput").value = examQues.comment;
    console.log(examQues.deductions);
    console.log(examQues.grade);
    //populate testcases
    for(var i = 0; i < 6; i++){
        document.getElementById("tc"+(i+1)).style.backgroundColor = "yellow";
        document.getElementById("tc"+(i+1)+"Res").textContent = "N/A";
        document.getElementById("tc"+(i+1)+"Input").value = "0";
        document.getElementById("tc"+(i+1)+"Input").readOnly = true;
    }
    //handles the deductions for constraint
    switch(examQues.deductions[0]){
        //correct, applies to all others
        case "0":
            document.getElementById("con").style.backgroundColor = "green";
            document.getElementById("conRes").textContent = "Correct adherence to constraint";
            document.getElementById("conInput").value = "-0";
            break;
        //missing, applies to all others
        case "1":
            document.getElementById("con").style.backgroundColor = "red";
            document.getElementById("conRes").textContent = "Did not adhere to constraint";
            document.getElementById("conInput").value = "-3";
            break;
        //"2", no contraint for question
        default:
            document.getElementById("con").style.backgroundColor = "yellow";
            document.getElementById("conRes").textContent = "N/A";
            document.getElementById("conInput").value = "-0";
            document.getElementById("conInput").readOnly = true;
    }
    //checks for colon in function header
    switch(examQues.deductions[1]){
        case "0":
            document.getElementById("cln").style.backgroundColor = "green";
            document.getElementById("clnRes").textContent = "Correct use of colon in header";
            document.getElementById("clnInput").value = "-0";
            break;
        case "1":
            document.getElementById("cln").style.backgroundColor = "red";
            document.getElementById("clnRes").textContent = "Missing/incorrect use of colon in header";
            document.getElementById("clnInput").value = "-3";
            break;
    }
    //checks for the proper header name
    switch(examQues.deductions[2]){
        case "0":
            document.getElementById("hdr").style.backgroundColor = "green";
            document.getElementById("hdrRes").textContent = "Correct function name in header";
            document.getElementById("hdrInput").value = "-0";
            break;
        case "1":
            document.getElementById("hdr").style.backgroundColor = "red";
            document.getElementById("hdrRes").textContent = "Missing/incorrect function name in header";
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
                document.getElementById("tc"+(i+1)+"Res").textContent = "Passed testcase " + (i+1);
                document.getElementById("tc"+(i+1)+"Input").value = testPts;
                break;
            case "1":
                document.getElementById("tc"+(i+1)).style.backgroundColor = "red";
                document.getElementById("tc"+(i+1)+"Res").textContent = "Failed testcase " + (i+1);
                document.getElementById("tc"+(i+1)+"Input").value = "0";
                break;
        }
    }
    //extrapolates the amount of bonus points for the question by comparing the grade with the points for each part
    var sum = 0;
    var grade = examRsp[currQues].grade;
    for(var i = 0; i < 6; i++){
        sum += +document.getElementById("tc"+(i+1)+"Input").value;
    }
    sum += +document.getElementById("conInput").value + +document.getElementById("clnInput").value + +document.getElementById("hdrInput").value;
    var bonus = examRsp[currQues].grade - sum;
    console.log("bonus: " + bonus);
    document.getElementById("bonusInput").value = bonus;
    
    //disables/enables prev/next buttons as needed
    console.log("currQues = " + currQues);
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
//calculates bonus
function calcBonus(){
    var bonus = 0;
    var grade = examRsp[currQues].grade;
    for(var i = 0; i < 6; i++){
        bonus += +document.getElementById("tc"+(i+1)+"Input").value;
    }
    bonus += +document.getElementById("conInput").value + +document.getElementById("clnInput").value + +document.getElementById("hdrInput").value;
    return bonus;
    console.log(bonus);
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