<?php
	session_start();
	require_once 'Class.User.Php';
	$user = new USER();
	$user1 = new USER();
	//retrieves new messages
	if($user->loggedIn()){
		$s = $user->runQuery('SELECT name FROM user WHERE userID=:uid');
		$s->execute(array(":uid"=>$_SESSION['userSession']));
		$me = $s->fetch(PDO::FETCH_ASSOC);
		//print_r($me['name']);
		$myname = $me['name'];
		$time = $_POST['old'];
		//$time = 1497236865;
		//echo $time;
		$stmt = $user1->runQuery("SELECT message,messageFrom,sentDate,seen FROM messages WHERE sentDate>:time AND messageFrom!=:me AND messageTo=:me");
		$stmt->bindParam(":time",$time);
		$stmt->bindParam(":me",$myname);
		$stmt->execute();
		$row=$stmt->fetchAll(PDO::FETCH_ASSOC);
		$result = json_encode($row);
		echo $result;
	}
?>