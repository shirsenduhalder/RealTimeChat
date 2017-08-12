<?php
	session_start();
	//used for getting the last seen message of a group by a particular user
	require_once 'Class.User.Php';
	$user = new USER();
	if($user->loggedIn()){
		$stmt = $user->runQuery("SELECT name FROM user WHERE userID=:uid");
		$stmt->bindparam(":uid",$_SESSION['userSession']);
		$stmt->execute();
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		$me = $row['name'];
		$group = $_POST['groupname'];
		$stmt = $user->runQuery('SELECT lastSeenMessage FROM groupUsers WHERE userName=:me AND groupName=:group');
		$stmt->bindparam(':me',$me);
		$stmt->bindparam(':group',$group);
		$stmt->execute();
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		echo $row['lastSeenMessage'];
	}
?>