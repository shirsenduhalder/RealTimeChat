<?php
//updates the last seen message of a group on clicking the groupmore button
	session_start();
	require_once 'Class.User.Php';
	$user = new USER();
	if($user->loggedIn()){
		$stmt = $user->runQuery("SELECT name FROM user WHERE userID=:uid");
		$stmt->bindparam(":uid",$_SESSION['userSession']);
		$stmt->execute();
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		$me = $row['name'];
		$groupname = $_POST['groupname'];
		$lastseen = $_POST['sentDate'];
		echo $lastseen;
		$stmt = $user->runQuery('UPDATE groupUsers SET lastSeenMessage=:lastseen WHERE userName=:me AND groupName=:groupname');
		$stmt->bindparam(':lastseen',$lastseen);
		$stmt->bindparam(':me',$me);
		$stmt->bindparam(':groupname',$groupname);
		$stmt->execute();
	}
?>