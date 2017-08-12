<?php
	//fetches the picture url of a user
	require_once 'Class.User.Php';
	$user = new USER();
	$name = $_POST['username'];
	//$name = 'John Doe';
	$stmt = $user->runQuery('SELECT userPicture FROM user WHERE name=:username');
	$stmt->bindparam(":username",$name);
	$stmt->execute();
	$row = $stmt->fetch(PDO::FETCH_ASSOC);
	echo $row['userPicture'];
?>