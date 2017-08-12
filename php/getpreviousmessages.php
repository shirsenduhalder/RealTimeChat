<?php
	function sendMessages(){
		//fetches all the previous seen private messages
		session_start();
		require_once 'Class.User.Php';
		$user = new USER();
		if($user->loggedIn()){
			$stmt = $user->runQuery("SELECT name FROM user WHERE userID=:uid");
			$stmt->bindparam(":uid",$_SESSION['userSession']);
			$stmt->execute();
			$row = $stmt->fetch(PDO::FETCH_ASSOC);
			$user1 = $row['name'];
			//echo $user1;
			$user2 = $_POST['user2'];
			//$user2 = 'Thumbs Up';
			$sentDate = $_POST['sentTime'];
			//echo $user2;
			$s = $user->runQuery("(SELECT * 
								FROM messages 
								WHERE messageFrom=:user1 
								AND messageTo=:user2 AND sentDate<:time)
								UNION
								(SELECT * 
								FROM messages 
								WHERE messageFrom=:user2 
								AND messageTo=:user1 AND sentDate<:time) 
								ORDER BY sentDate DESC LIMIT 10");
			$s->bindparam(":user1",$user1);
			$s->bindparam(":user2",$user2);
			$s->bindparam(":time",$sentDate);
			$s->execute();
			$r = $s->fetchAll(PDO::FETCH_ASSOC);
			//print_r($r);
			$array = json_encode($r);
			echo $array;
		}
		else{
			$user->redirect('login.php');
		}
	}
	sendMessages();
?>