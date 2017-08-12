<?php
	session_start();
	//sends the list of recent conversation
	require_once "Class.User.Php";
	$user = new USER();
	if($user->loggedIn()){
		$stmt = $user->runQuery('SELECT name FROM user WHERE userID=:uid');
		$stmt->bindparam(":uid",$_SESSION['userSession']);
		$stmt->execute();
		$row1 = $stmt->fetch(PDO::FETCH_ASSOC);
		$me = $row1['name'];
		$stmt = $user->runQuery('SELECT message,messageFrom,messageTo,seen,sentDate FROM messages WHERE messageFrom=:me OR messageTo=:me ORDER BY sentDate DESC');
		$stmt->bindparam(":me",$me);
		$stmt->execute();
		$row2 = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$stmt = $user->runQuery('SELECT userName,lastSeenMessage AS sentDate,groupName FROM groupUsers WHERE userName=:me');
		$stmt->bindparam(':me',$me);
		$stmt->execute();
		$row3 = $stmt->fetchAll(PDO::FETCH_ASSOC);
		//print_r($row2);
		$temparray = array();
		$list = array();
		for($i=0;$i<sizeof($row2);$i++){
			if($row2[$i]['messageFrom']==$me){
				$temparray[$i] = array('name'=>$row2[$i]['messageTo'],'sentDate'=>$row2[$i]['sentDate'],'unread'=>0);
			}
			else{
				$temparray[$i] = array('name'=>$row2[$i]['messageFrom'],'sentDate'=>$row2[$i]['sentDate'],'unread'=>0);
			}
		}
		$final = array_merge($temparray,$row3);
		echo json_encode($final);
		/*for($j=0;$j<sizeof($recentlist);$j++){
			$stmt = $user->runQuery('SELECT userPicture FROM user WHERE name=:recentuser');
			$stmt->bindparam(':recentuser',$recentlist[$j]);
			$stmt->execute();
			$row = $stmt->fetch(PDO::FETCH_ASSOC);
			$unreadcount = 0;
			for($i=0;$i<sizeof($row2);$i++){
				if($row2[$i]['messageFrom']==$recentlist[$j] && $row2[$i]['seen']==0){
					$unreadcount++;
				}
				if($unreadcount > 0){
					$line = '<li  class='. $recentlist[$j] .'><div class="chat-body clearfix"><div class="header_sec">'.$recentlist[$j].'</div><span class="unreadnumber" style="color:white;font-size:14px;padding-left:20px;display:inline-block;float:left">'.$unreadcount.' unread</span><div></li>';
					$list[$j] = $line;
				}
				else{
					$line = '<li  class='. $recentlist[$j] .'><div class="chat-body clearfix"><div class="header_sec">'.$recentlist[$j].'</div><div></li>';
					$list[$j] = $line;
				}
			}
		}*/

		//echo (json_encode($list));
	}
?>