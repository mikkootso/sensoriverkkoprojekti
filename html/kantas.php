<?php
//Ref: https://www.dyclassroom.com/chartjs/chartjs-how-to-draw-line-graph-using-data-from-mysql-table-and-php
//and https://teamtreehouse.com/community/how-do-you-store-your-mysql-user-credentials-in-a-secure-way

//from javascript caller
$msg=$_GET["msg"];
$alku=$_GET["alku"];
$loppu=$_GET["loppu"];

//setting header to json
header('Content-Type: application/json');

//include the function to define the variable $connection
require_once('./includes/dbconnect.php');
//$msg = 12;

//$start = 'NOW() - INTERVAL 1 DAY';
//$stop = 'NOW()';
//$mysqltime = date ("Y-m-d H:i:s", $phptime);
$datetimenow = date_create()->format('Y-m-d H:i:s');

$someDays = '30';
$userVal='2019-04-06 20:52:05'; 
$next_due_date = date('Y-m-d H:i:s', strtotime("+30 days"));

// select sql query date range
switch ($msg) {
  case "0":
    $start = $alku;
    $stop = $loppu;
    break;
  case "1":
    $start = date('Y-m-d H:i:s', strtotime("-1 days"));
    $stop = date_create()->format('Y-m-d H:i:s');
    break;
  case "7":
    $start = date('Y-m-d H:i:s', strtotime("-7 days"));
    $stop = date_create()->format('Y-m-d H:i:s');
    break;
  case "30":
    $start = date('Y-m-d H:i:s', strtotime("-30 days"));
    $stop = date_create()->format('Y-m-d H:i:s');
    break;
  case "365":
    $start = date('Y-m-d H:i:s', strtotime("-365 days"));
    $stop = date_create()->format('Y-m-d H:i:s');
    break;
  default:
    $start = date('Y-m-d H:i:s', strtotime("-1 days"));
    $stop = date_create()->format('Y-m-d H:i:s');
}


//query to get all data from the table
//$query = sprintf("SELECT timeStamp, temperature, humidity FROM tempHum");

//query to get limited data from the table, order is: latest data last
//$query = sprintf("SELECT * FROM grow ORDER BY timeStamp DESC LIMIT 10");
//$query = sprintf("SELECT * FROM (SELECT timeStamp, temperature, humidity FROM tempHum ORDER BY timeStamp DESC LIMIT 145)as results ORDER BY results.timeStamp ASC");
//$query = sprintf("SELECT * FROM (SELECT timeStamp, temp1, hum1 FROM grow ORDER BY timeStamp DESC LIMIT 10)as results ORDER BY results.timeStamp ASC");
//$query1 = sprintf("SELECT * FROM grow WHERE timestamp > (SELECT MAX( timestamp ) FROM grow) - INTERVAL 1 DAY");
$query1 = sprintf("SELECT * FROM grow WHERE (timestamp >= '$start' AND timestamp <= '$stop')");

//SELECT * FROM `table` WHERE timestamp >= CURDATE() // select current date data only
// timestamp < CURDATE() - INTERVAL 1 DAY // last 24 h
//$query2 = sprintf("SELECT * FROM water WHERE timestamp = (SELECT MAX( timestamp ) FROM water)");
$query2 = sprintf("SELECT * FROM (SELECT * FROM water ORDER BY timeStamp DESC LIMIT 10)as results ORDER BY results.timeStamp ASC");
$query3 = sprintf("SELECT * FROM (SELECT * FROM grow ORDER BY timeStamp DESC LIMIT 10)as results ORDER BY results.timeStamp ASC");
//execute query
$result1 = $connection->query($query1);
$result2 = $connection->query($query2);
$result3 = $connection->query($query3);

//loop through the returned data
$data1 = array();
$data2 = array();
$data3 = array();
foreach ($result1 as $row1) {
  $data1[] = $row1;
}
foreach ($result2 as $row2) {
  $data2[] = $row2;
}
foreach ($result3 as $row3) {
  $data3[] = $row3;
}
$data = array();
$data[] = $data1;
$data[] = $data2;
$data[] = $data3;
$data[] = $start;
$data[] = $stop;
$data[] = $msg;

//free memory associated with result
$result1->close();
$result2->close();
$result3->close();

//close connection
$connection->close();

//now print the data
print json_encode($data);