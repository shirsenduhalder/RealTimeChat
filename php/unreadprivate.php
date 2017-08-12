<?php
	session_start();
	//echos number of unread private messages
	include_once 'Class.User.Php';
	$user = new USER();
	if($user->loggedIn()){
		$stmt = $user->runQuery('SELECT name FROM user WHERE userID=:uid');
		$stmt->bindparam(':uid',$_SESSION['userSession']);
		$stmt->execute();
		$row= $stmt->fetch(PDO::FETCH_ASSOC);
		$me = $row['name'];
		$seen = 0;
		$stmt = $user->runQuery('SELECT message FROM messages WHERE messageTo=:me AND seen=:seen');
		$stmt ->bindparam(':me',$me);
		$stmt->bindparam(':seen',$seen);
		$stmt->execute();
		$row = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo sizeof($row);
	}
?>