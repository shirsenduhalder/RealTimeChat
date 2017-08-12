<?php
	//fetches all messages between a user and another user. User2 is fetched by the POST method.
	function sendMessages(){
		//$_post['user2'] = "Shirsendu Halder";
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