<?php
	//changes the name of a person
	session_start();
	require_once 'Class.User.Php';
	$user = new USER();
	if($user->loggedIn()){
		$newname = $_POST['newname'];
		$oldname = $_POST['oldname'];
		$stmt = $user->runQuery('UPDATE user SET name=:nname WHERE userID=:uid');
		$stmt->bindparam(':uid',$_SESSION['userSession']);
		$stmt->bindparam(':nname',$newname);
		$stmt->execute();
		$stmt=$user->runQuery('UPDATE messages SET messageFrom=:newname WHERE messageFrom=:oldname');
		$stmt->bindparam(':oldname',$oldname);
		$stmt->bindparam(':newname',$newname);
		$stmt->execute();
		$stmt=$user->runQuery('UPDATE messages SET messageTo=:newname WHERE messageTo=:oldname');
		$stmt->bindparam(':oldname',$oldname);
		$stmt->bindparam(':newname',$newname);
		$stmt->execute();
		$stmt=$user->runQuery('UPDATE groupUsers SET userName=:newname WHERE userName=:oldname');
		$stmt->bindparam(':oldname',$oldname);
		$stmt->bindparam(':newname',$newname);
		$stmt->execute();
		$stmt=$user->runQuery('UPDATE groupMessages SET messageFrom=:newname WHERE messageFrom=:oldname');
		$stmt->bindparam(':oldname',$oldname);
		$stmt->bindparam(':newname',$newname);
		$stmt->execute();
		echo 'You have successfully changed your Username';
	}
?>