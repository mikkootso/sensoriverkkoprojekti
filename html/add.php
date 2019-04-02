<?php
   	include('./includes/dbconnect.php');
   	
   	$link = db_connect();

	$temp1=$_POST["temp1"];
	$hum1=$_POST["hum1"];
	
	$query = "INSERT INTO `tempHum` (`temperature`, `humidity`) 
		VALUES ('".$temp1."','".$hum1."')"; 
	
	if ($result = $link->query($query))
		{ echo json_encode("New record created successfully");
		// echo "New record created successfully";
		} else {
			echo json_encode("Some error");
		// echo "Error: " . $sql . "<br>" . $conn->error;
		}   
	
	$link->close();
	
   	//header("Location: index.php");
?>
