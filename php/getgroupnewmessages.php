<?php
	//fetches new group messages by selecting all messages whose sentdate is greater than seenDate
	session_start();
	require_once 'Class.User.Php';
	$user = new USER();
	if($user->loggedIn()){
		$group = $_POST['group'];
		$seenDate = $_POST['seenDate'];
		$s = $user->runQuery("SELECT * FROM groupMessages WHERE groupName=:gname AND sentDate>:seenDate ORDER BY sentDate DESC");
		$s->bindparam(':seenDate',$seenDate);
		$s->bindparam(':gname',$group);
		$s->execute();
		$r = $s->fetchAll(PDO::FETCH_ASSOC);
		//print_r($r);
		$array = json_encode($r);
		echo $array;
	}
	else{
		$user->redirect('login.php');
	}
?>
