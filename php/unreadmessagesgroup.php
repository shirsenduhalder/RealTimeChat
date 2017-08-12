<?php
	//retrieves unread messages of a group 
	session_start();
	require_once 'Class.User.Php';
	$user = new USER();
	if($user->loggedIn()){
		$unread = 0;
		$stmt = $user->runQuery('SELECT * FROM user WHERE userID=:uid');
		$stmt->bindparam(':uid',$_SESSION['userSession']);
		$stmt->execute();
		$row=$stmt->fetch(PDO::FETCH_ASSOC);
		$me = $row['name'];
		$stmt = $user->runQuery('SELECT * FROM groupUsers WHERE userName=:me');
		$stmt->bindparam(':me',$me);
		$stmt->execute();
		$row = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$combined = array();
		for($i=0;$i<sizeof($row);$i++){
			$groupname = $row[$i]['groupName'];
			$lastseen = $row[$i]['lastSeenMessage'];
			$stmt = $user->runQuery('SELECT * FROM groupMessages WHERE groupName=:groupname AND sentDate>:lastseen');
			$stmt->bindparam(':groupname',$groupname);
			$stmt->bindparam(':lastseen',$lastseen);
			$stmt->execute();
			$r = $stmt->fetchAll(PDO::FETCH_ASSOC);
			$combined = array_merge($combined,$r);
			$unreadonegroup = sizeof($r);
			$unread = $unread + $unreadonegroup;
		}
		echo json_encode($combined);
	}
?>