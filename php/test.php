<?php
//random unused
	session_start();
	require_once 'Class.User.Php';
	$newuser = new USER();
	if($newuser->loggedIn()!=""){
		$stmt = $newuser->runQuery("SELECT * FROM user WHERE userID=:uid");
		$stmt->execute(array(":uid"=>$_SESSION['userSession']));
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		echo $row['name'];
	}
?>