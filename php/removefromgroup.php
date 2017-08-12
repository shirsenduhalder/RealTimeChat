<?php
//removes users from ag roup
	session_start();
	include_once 'Class.User.Php';
	$user = new USER();
	if($user->loggedIn()){
		$groupname = $_POST['groupname'];
		$usernames = $_POST['usernames'];
		echo $usernames;
		for($i=0;$i<sizeof($usernames);$i++){
			$stmt = $user->runQuery('DELETE FROM groupUsers WHERE groupName=:gname AND userName=:uname');
			$stmt->bindparam(':gname',$groupname);
			$stmt->bindparam(':uname',$usernames[$i]);
			$stmt->execute();
		}
	}
?>
