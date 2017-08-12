<?php
//logsout using Class.User.Php
	session_start();
	require_once 'Class.User.Php';
	$newuser = new USER();

	if(!$newuser->loggedIn())
	{
		$newuser->redirect('login.php');
	}

	if($newuser->loggedIn()!="")
	{
		$stmt = $newuser->runQuery("SELECT * FROM user WHERE userID=:uid");
		$stmt->execute(array(":uid"=>$_SESSION['userSession']));
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		$status = "N";
		$email = $row['userEmail'];
		$stmt = $newuser->runQuery("UPDATE user SET active=:status WHERE userEmail = :uemail");
		$stmt -> bindParam(":uemail",$email);
		$stmt -> bindParam(":status",$status);
		$stmt -> execute();
		$newuser->logout(); 
		$newuser->redirect('login.php');
	}
?>