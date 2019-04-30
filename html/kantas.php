<?php
//Ref: https://www.dyclassroom.com/chartjs/chartjs-how-to-draw-line-graph-using-data-from-mysql-table-and-php
//and https://teamtreehouse.com/community/how-do-you-store-your-mysql-user-credentials-in-a-secure-way

//setting header to json
header('Content-Type: application/json');

//include the function to define the variable $connection
require_once('./includes/dbconnect.php');

//query to get all data from the table
//$query = sprintf("SELECT timeStamp, temperature, humidity FROM tempHum");

//query to get limited data from the table, order is: latest data last
//$query = sprintf("SELECT * FROM grow ORDER BY timeStamp DESC LIMIT 10");
$query1 = sprintf("SELECT * FROM grow WHERE timestamp > (SELECT MAX( timestamp ) FROM grow) - INTERVAL 1 DAY");
//$query = sprintf("SELECT * FROM (SELECT timeStamp, temperature, humidity FROM tempHum ORDER BY timeStamp DESC LIMIT 145)as results ORDER BY results.timeStamp ASC");
//$query = sprintf("SELECT * FROM (SELECT timeStamp, temp1, hum1 FROM grow ORDER BY timeStamp DESC LIMIT 10)as results ORDER BY results.timeStamp ASC");

//SELECT * FROM `table` WHERE timestamp >= CURDATE() // select current date data only
// timestamp < CURDATE() - INTERVAL 1 DAY // last 24 h
$query2 = sprintf("SELECT * FROM water WHERE timestamp = (SELECT MAX( timestamp ) FROM water)");

//execute query
$result1 = $connection->query($query1);
$result2 = $connection->query($query2);

//loop through the returned data
$data1 = array();
$data2 = array();
foreach ($result1 as $row1) {
  $data1[] = $row1;
}
foreach ($result2 as $row2) {
  $data2[] = $row2;
}
$data = array();
$data[] = $data1;
$data[] = $data2;

//free memory associated with result
$result1->close();
$result2->close();

//close connection
$connection->close();

//now print the data
print json_encode($data);