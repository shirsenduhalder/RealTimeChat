<?php
	session_start();
	//fetches all the previous seen group messages
	require_once 'Class.User.Php';
	$user = new USER();
	if($user->loggedIn()){
		$groupname = $_POST['groupname'];
		$lastseen = $_POST['lastdisplay'];
		$stmt=$user->runQuery('SELECT * FROM groupMessages WHERE groupName=:groupname AND sentDate<:lastseen LIMIT 10');
		$stmt->bindparam(':groupname',$groupname);
		$stmt->bindparam(':lastseen',$lastseen);
		$stmt->execute();
		$row = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode($row);
	}
?>