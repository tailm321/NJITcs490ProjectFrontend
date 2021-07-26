<?php
    header("Content-type: application/json; charset=UTF-8");
    //get the login data from frontend
    $data = file_get_contents("php://input");
    //echo $data
    
    //initialize curl object
    $cu=curl_init();
    //set the location of the url
    curl_setopt($cu, CURLOPT_URL, "https://web.njit.edu/~jps78/addQToExamAll.php");
    //returns response instead of outputting to screen
    curl_setopt($cu, CURLOPT_RETURNTRANSFER, true);
    //sends data as a POST request
    curl_setopt($cu, CURLOPT_POST, true);
    //the array of data that will be sent in the POST
    curl_setopt($cu, CURLOPT_POSTFIELDS, $data);
    
    //obtain response from midend
    $response = curl_exec($cu);
    //close curl object
    curl_close($cu);
    
    //echo response back to frontend
    echo $response;
?>