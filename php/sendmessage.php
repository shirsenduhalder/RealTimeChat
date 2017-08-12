<?php
	//inserts message in DB on sending a message
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
		//echo $user2;
		$time = time();
		//echo $time;
		$msg = $_POST['msg'];
		//echo $msg;
		$s = $user->runQuery("INSERT INTO messages(messageFrom,messageTo,message,sentDate) VALUES(:name1,:name2, :msg, :time)");
		$s->bindparam(":name1",$user1);
		$s->bindparam(":name2",$user2);
		$s->bindparam(":msg",$msg);
		$s->bindparam(":time",$time);
		$s->execute();
		$seen = 1;
		$s=$user->runQuery('UPDATE messages SET seen=:seen WHERE messageTo=:me AND messageFrom=:user2');
		$s->bindparam(":me",$user1);
		$s->bindparam(":user2",$user2);
		$s->bindparam(':seen',$seen);
		$s->execute();
		$s = $user->runQuery('SELECT userEmail FROM user WHERE name=:to');
		$s->bindparam(':to',$user2);
		$s->execute();
		$r = $s->fetch(PDO::FETCH_ASSOC);
		$to = $r['userEmail'];
		echo $to;
		$from = $user2;
		$subject = 'New Message';
		$message = 'Hi, you have a new message from '.$user1."\r\n".'Message: '.$msg."\r\n".'Sent on: '.date('d-m-Y h:ia');
		$headers = 'From: WSchat@webstaff.jp'."\r\n".
					'Reply-To: WSchat@webstaff.jp'."\r\n".
					'X-Mailer: PHP/'.phpversion();
		if(date('H')<10 && date('H')>19)
			mail($to,$subject,$message,$headers);
	}
	else{
		$user->redirect('login.php');
	}
?>