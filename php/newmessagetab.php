<?php
	session_start();
	require_once 'Class.User.Php';
	$user = new USER();
	//used for displaying unread messages
	if($user->loggedIn()){
		$s = $user->runQuery('SELECT name FROM user WHERE userID=:uid');
		$s->execute(array(":uid"=>$_SESSION['userSession']));
		$r = $s->fetch(PDO::FETCH_ASSOC);
		$me = $r['name'];
		$unread = 0;
		$stmt = $user->runQuery("SELECT message FROM messages WHERE seen=:unread AND messageTo=:me");
		$stmt->bindparam(':unread',$unread);
		$stmt->bindparam(':me',$me);
		$stmt->execute();
		$row = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$size = sizeof($row);
		echo $size;
	}
?>