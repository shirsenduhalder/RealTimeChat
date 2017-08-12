<?php
	session_start();
	//retrieves profile picture of the logged in user
	require_once "Class.User.Php";
	$user = new USER();
	if($user->loggedIn()){
		$stmt= $user->runQuery('SELECT name,userPicture FROM user WHERE userID=:uid');
		$stmt->bindparam(":uid",$_SESSION['userSession']);
		$stmt->execute();
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		$picture = $row['userPicture'];
		echo '../common/images/userimages/'.$picture;
	}
?>