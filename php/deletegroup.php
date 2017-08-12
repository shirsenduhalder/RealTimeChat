<?php
	//deletes a group
	session_start();
	include_once 'Class.User.Php';
	$user = new USER();
	if($user->loggedIn()){
		$group = $_POST['groupname'];
		$stmt = $user->runQuery('SELECT name FROM user WHERE userID=:uid');
		$stmt->bindparam(':uid',$_SESSION['userSession']);
		$stmt->execute();
		$row = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$me = $row[0]['name'];
		echo $me;
		$stmt = $user->runQuery('DELETE FROM groupUsers WHERE userName=:me AND groupName=:group');
		$stmt->bindparam(':me',$me);
		$stmt->bindparam(':group',$group);
		$stmt->execute();
	}
?>