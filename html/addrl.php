<?php
   	include('./includes/dbconnect.php');
   	
   	$link = db_connect();

	$ec=$_POST["ec"];
	$ph=$_POST["ph"];
	$temp=$_POST["temp"];
	
	$query = "INSERT INTO `water` (`ec`, `ph`, `temp`) 
		VALUES ('".$ec."','".$ph."','".$temp."')"; 
	
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
