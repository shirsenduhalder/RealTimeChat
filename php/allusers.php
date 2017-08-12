<?php
	//returns all users present 
	function returnAllUsers(){
		session_start();
		require_once "Class.User.Php";
		$user = new USER();
		if($user->loggedIn()){
			$status = 'Y';
			$stmt = $user->runQuery("SELECT name FROM user WHERE userID = :uid");
			$stmt -> bindParam(":uid",$_SESSION['userSession']);
			$stmt -> execute();
			$r = $stmt->fetch(PDO::FETCH_ASSOC);
			$name = $r['name'];
			$stmt = $user->runQuery("SELECT name FROM user WHERE userStatus=:status AND name!=:myname");
			$stmt->bindParam(":status",$status);
			$stmt->bindParam(":myname",$name);
			$stmt->execute();
			$row = $stmt->fetchAll(PDO::FETCH_ASSOC);
			$array = json_encode($row);
			echo $array;
		}
	}
	returnAllUsers();
?>