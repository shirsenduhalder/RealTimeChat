<?php
	//insert message in DB on sending a message in group
	session_start();
	require_once 'Class.User.Php';
	$user = new USER();
	if($user->loggedIn()){
		$stmt = $user->runQuery("SELECT name FROM user WHERE userID=:uid");
		$stmt->bindparam(":uid",$_SESSION['userSession']);
		$stmt->execute();
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		$user1 = $row['name'];
		$name = $_POST['groupname'];
		$time = time();
		//echo $time;
		$msg = $_POST['msg'];
		//echo $msg;
		$s = $user->runQuery("INSERT INTO groupMessages(groupName,messageFrom,message,sentDate) VALUES(:gname,:msgfrom, :msg, :time)");
		$s->bindparam(":gname",$name);
		$s->bindparam(":msgfrom",$user1);
		$s->bindparam(":msg",$msg);
		$s->bindparam(":time",$time);
		$s->execute();
		//echo $time;
		$s=$user->runQuery('SELECT * FROM groupUsers WHERE groupName=:name AND userName!=:user1');
		$s->bindparam(':name',$name);
		$s->bindparam(':user1',$user1);
		$s->execute();
		$r=$s->fetchAll(PDO::FETCH_ASSOC);
		print_r($r);
		$subject = 'New Message';
		$message = 'Hi, you have a new group message.'."\r\n".'Group: '.$name."\r\n".'From: '.$user1."\r\n".'Message: '.$msg."\r\n".'Sent on: '.date('d-m-Y h:ia');
		$headers = 'From: WSchat@webstaff.jp'."\r\n".
					'Reply-To: WSchat@webstaff.jp'."\r\n".
					'X-Mailer: PHP/'.phpversion();
		if(date('H')<10 && date('H')>19)
			for($i=0;$i<sizeof($r);$i++){
				$membername = $r[$i]['userName'];
				echo $membername;
				$s = $user->runQuery('SELECT userEmail FROM user WHERE name=:membername');
				$s->bindparam(':membername',$membername);
				$s->execute();
				$row = $s->fetch(PDO::FETCH_ASSOC);
				$to = $row['userEmail'];
				echo $to;
				//mail($to,$subject,$message,$headers);
			}
	}
	else{
		$user->redirect('login.php');
	}
?>