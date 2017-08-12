<?php
	function sendMessages(){
		//fetches all messages between a user and another user. User2 is fetched by the POST method.
		session_start();
		require_once 'Class.User.Php';
		$user = new USER();
		if($user->loggedIn()){
			$stmt = $user->runQuery("SELECT name FROM user WHERE userID=:uid");
			$stmt->bindparam(":uid",$_SESSION['userSession']);
			$stmt->execute();
			$row = $stmt->fetch(PDO::FETCH_ASSOC);
			$user1 = $row['name'];
			$user2 = $_POST['user2'];
			//echo $user1;
			$seen = 1;
			//echo $seen;
			$seenupdate = $user->runQuery('UPDATE messages SET seen=:seen WHERE messageTo=:user1 AND messageFrom=:user2');
			$seenupdate->bindparam(":seen",$seen);
			$seenupdate->bindparam(":user1",$user1);
			$seenupdate->bindparam(":user2",$user2);
			$seenupdate->execute();
			$s = $user->runQuery("(SELECT * 
								FROM messages 
								WHERE messageFrom=:user1 
								AND messageTo=:user2)
								UNION
								(SELECT * 
								FROM messages 
								WHERE messageFrom=:user2 
								AND messageTo=:user1) 
								ORDER BY sentDate DESC");
			$s->bindparam(":user1",$user1);
			$s->bindparam(":user2",$user2);
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