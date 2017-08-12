<?php
	session_start();
	require_once 'Class.User.Php';
	$user = new USER();
	//retrieves the number of groups a user is a part of
	if($user->loggedIn()){
		$stmt = $user->runQuery("SELECT name FROM user WHERE userID=:uid");
		$stmt->bindparam(':uid',$_SESSION['userSession']);
		$stmt->execute();
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		$me = $row['name'];
		$stmt = $user->runQuery('SELECT groupName,seen FROM groupUsers WHERE userName=:me');
		$stmt->bindparam(':me',$me);
		$stmt->execute();
		$row = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo $row[0]['groupName'];
	}
?>