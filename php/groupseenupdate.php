<?php
	session_start();
	include_once 'Class.User.Php';
	$user = new USER();
	//updates groupseen after user sees the notification
	if($user->loggedIn()){
		$s = $user->runQuery("SELECT * FROM user WHERE userID=:uid");
		$s->execute(array(":uid"=>$_SESSION['userSession']));
		$row = $s->fetch(PDO::FETCH_ASSOC);
		$me = $row['name'];
		$seen = 1;
		$stmt = $user->runQuery('UPDATE groupUsers SET seen=:seen WHERE userName=:me');
		$stmt->bindparam(':me',$me);
		$stmt->bindparam(':seen',$seen);
		$stmt->execute();
	}
?>