<?php
	session_start();
	//updates last seen message of a group on sending a message in a group
	require_once 'Class.User.Php';
	$user = new USER();
	if($user->loggedIn()){
		$stmt = $user->runQuery("SELECT name FROM user WHERE userID=:uid");
		$stmt->bindparam(":uid",$_SESSION['userSession']);
		$stmt->execute();
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		$me = $row['name'];
		$groupname = $_POST['groupname'];
		$stmt = $user->runQuery('SELECT * FROM groupMessages WHERE groupName=:groupname ORDER BY sentDate DESC');
		$stmt->bindparam(':groupname',$groupname);
		$stmt->execute();
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		$lastseen = $row['sentDate'];
		echo $lastseen;
		$stmt = $user->runQuery('UPDATE groupUsers SET lastSeenMessage=:lastseen WHERE userName=:me AND groupName=:groupname');
		$stmt->bindparam(':lastseen',$lastseen);
		$stmt->bindparam(':me',$me);
		$stmt->bindparam(':groupname',$groupname);
		$stmt->execute();
	}
?>