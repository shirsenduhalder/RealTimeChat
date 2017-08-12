<?php
	//returns all online users
	function returnUsers(){
		session_start();
		require_once "Class.User.Php";
		$user = new USER();
		$user2 = new USER();
		if($user->loggedIn()){
			$stmt = $user->runQuery("SELECT name FROM user WHERE userID = :uid");
			$stmt -> bindParam(":uid",$_SESSION['userSession']);
			$stmt -> execute();
			$row = $stmt->fetch(PDO::FETCH_ASSOC);
			$myname = $row['name'];
			$status = 'Y';
			$s = $user2->runQuery("SELECT name FROM user WHERE active=:stat AND name!=:myname");
			$s->bindParam(":stat",$status);
			$s->bindParam(":myname",$myname);
			$s->execute();
			$r = $s->fetchAll(PDO::FETCH_ASSOC);
			$array = json_encode($r);
			echo $array;
			//return $array;
		}
	}
	returnUsers();
?>