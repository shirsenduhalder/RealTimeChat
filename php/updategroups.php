<?php
	//updates the groups a user is in
	session_start();
	include_once 'Class.User.Php';
	$user = new USER();
	if($user->loggedIn()){
		$s = $user->runQuery("SELECT * FROM user WHERE userID=:uid");
		$s->execute(array(":uid"=>$_SESSION['userSession']));
		$row = $s->fetch(PDO::FETCH_ASSOC);
		$me = $row['name'];
		$stmt = $user->runQuery('SELECT groupName,seen,lastSeenMessage FROM groupUsers WHERE userName=:me ORDER BY lastSeenMessage DESC');
		$stmt->bindparam(':me',$me);
		$stmt->execute();
		$groups = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$size = sizeof($groups);
		for($i=0;$i<$size;$i++){
			$lastseenmessage = $groups[$i]['lastSeenMessage'];
			$groupname = $groups[$i]['groupName'];
			$s = $user->runQuery("SELECT * FROM groupMessages WHERE groupName=:gname AND sentDate>:lastseenmessage ORDER BY sentDate DESC");
			$s->bindparam(':lastseenmessage',$lastseenmessage);
			$s->bindparam(':gname',$groupname);
			$s->execute();
			$r = $s->fetchAll(PDO::FETCH_ASSOC);
			$groups[$i]['unread'] = sizeof($r);
			//echo sizeof($r);
		}
		$groupsall = json_encode($groups);
		echo $groupsall;
	}
?>
