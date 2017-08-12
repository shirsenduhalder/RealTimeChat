<?php
	session_start();
	require_once 'Class.User.Php';
	$user = new USER();
	//$user2 = new USER();
	if(!$user->loggedIn())
	{
		$user->redirect('login.php');
	}

	$stmt = $user->runQuery("SELECT * FROM user WHERE userID=:uid");
	$stmt->execute(array(":uid"=>$_SESSION['userSession']));
	$row = $stmt->fetch(PDO::FETCH_ASSOC);
	$me = $row['name'];
	$s = $user->runQuery("SELECT * FROM messages WHERE messageFrom=:me OR messageTo=:me ORDER BY sentDate");
	$s->bindparam(":me",$me);
	$s->execute();
	$r = $s->fetchAll(PDO::FETCH_ASSOC);
	//print_r($r);
	$to = $r[0]['messageTo'];
	echo $to;
	$stmt = $user->runQuery("(SELECT * FROM messages WHERE messageFrom=:me AND messageTo=:to ORDER BY sentDate) UNION (SELECT * FROM messages WHERE messageFrom=:to AND messageTo=:me ORDER BY sentDate)");
	$stmt->bindparam(":me",$me);
	$stmt->bindparam(":to",$to);
	$stmt->execute();
	$r2 = $stmt->fetchAll(PDO::FETCH_ASSOC);
	print_r($r2);
	echo sizeof($r2);
	for($i=0;$i<sizeof($r2);$i++){
		if(($r2[$i]['messageFrom'])==$row['name']){
			echo 'right';
		}
		else{
			echo 'left';
		}
	}
?>