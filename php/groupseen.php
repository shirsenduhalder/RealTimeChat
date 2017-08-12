<?php
	session_start();
	include_once 'Class.User.Php';
	//used to let the user know that they have been added to a new group
	$user = new USER();
	if($user->loggedIn()){
		$s = $user->runQuery("SELECT * FROM user WHERE userID=:uid");
		$s->execute(array(":uid"=>$_SESSION['userSession']));
		$row = $s->fetch(PDO::FETCH_ASSOC);
		$me = $row['name'];
		$notseen = 0;
		$stmt = $user->runQuery('SELECT groupName FROM groupUsers WHERE userName=:me AND seen=:notseen');
		$stmt->bindparam(':me',$me);
		$stmt->bindparam(':notseen',$notseen);
		$stmt->execute();
		$row = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$result = json_encode($row);
		echo $result;
	}
?>