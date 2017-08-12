<?php
	//creates a new group
	session_start();
	include_once 'Class.User.Php';
	$user = new USER();
	if($user->loggedIn()){
		$groupname = $_POST['groupname'];
		$s = $user->runQuery("SELECT * FROM user WHERE userID=:uid");
		$s->execute(array(":uid"=>$_SESSION['userSession']));
		$row = $s->fetch(PDO::FETCH_ASSOC);
		$me = $row['name'];
		$seen = 1;
		$s = $user->runQuery('INSERT INTO groupUsers(groupName,userName,seen) VALUES(:gname,:me,:seen)');
		$s->bindparam(':gname',$groupname);
		$s->bindparam(':me',$me);
		$s->bindparam(':seen',$seen);
		$s->execute();
		$members = $_POST['members'];
		$seen = 0;
		for($i=0;$i<sizeof($members);$i++){
			$member = $members[$i];
			echo $member;
			$stmt = $user->runQuery('INSERT INTO groupUsers(groupName,userName,seen) VALUES(:gname,:uname,:seen)');
			$stmt->bindparam(':gname',$groupname);
			$stmt->bindparam(':uname',$member);
			$stmt->bindparam(':seen',$seen);
			$stmt->execute();
		}
		echo $groupname;
		//echo $members[0];
	}
?>