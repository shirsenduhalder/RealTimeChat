<?php
	//adds users to groups
	session_start();
	include_once 'Class.User.Php';
	$user = new USER();
	if($user->loggedIn()){
		$groupname = $_POST['groupname'];
		$usernames = $_POST['usernames'];
		echo $usernames;
		for($i=0;$i<sizeof($usernames);$i++){
			$stmt = $user->runQuery('INSERT INTO groupUsers(groupName,userName) VALUES(:gname,:uname)');
			$stmt->bindparam(':gname',$groupname);
			$stmt->bindparam(':uname',$usernames[$i]);
			$stmt->execute();
		}
	}
?>
