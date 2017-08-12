<?php
	//retrieves the user's name
	session_start();
	include_once 'Class.User.Php';
	$user = new USER();
	if($user->loggedIn()){
		$stmt = $user->runQuery('SELECT name FROM user WHERE userID=:uid');
		$stmt->bindparam(':uid',$_SESSION['userSession']);
		$stmt->execute();
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		echo $row['name'];
	}
?>