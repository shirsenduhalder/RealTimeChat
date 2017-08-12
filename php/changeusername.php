<?php
//changes the username of a person
	session_start();
	require_once 'Class.User.Php';
	$user = new USER();
	if($user->loggedIn()){
		$newname = $_POST['username'];
		$stmt = $user->runQuery('UPDATE user SET userName=:nname WHERE userID=:uid');
		$stmt->bindparam(':uid',$_SESSION['userSession']);
		$stmt->bindparam(':nname',$newname);
		$stmt->execute();
		echo 'You have successfully changed your name';
	}
?>