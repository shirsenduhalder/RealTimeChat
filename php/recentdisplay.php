<?php
	session_start();
	//used for displaying the recent conversations along with unread messages
	require_once 'Class.User.Php';
	$user = new USER();
	if($user->loggedIn()){
		$stmt = $user->runQuery('SELECT * FROM user WHERE userID=:uid');
		$stmt->bindparam(':uid',$_SESSION['userSession']);
		$stmt->execute();
		$myrow = $stmt->fetch(PDO::FETCH_ASSOC);
		$me = $myrow['name'];
		//echo $me;
		$names = json_decode($_POST['unorderednames']);
		for($i=0;$i<sizeof($names);$i++){
			if($names[$i]->groupName){
				$row = [];
				$groupname = $names[$i]->groupName;
				$lastseen = $names[$i]->sentDate;
				$stmt = $user->runQuery('SELECT * FROM groupMessages WHERE groupName=:groupname AND sentDate>:lastseen');
				$stmt->bindparam(':groupname',$groupname);
				$stmt->bindparam(':lastseen',$lastseen);
				$stmt->execute();
				$row = $stmt->fetchALL(PDO::FETCH_ASSOC);
				//echo ($row[1]['sentDate']);
				$names[$i]->unread = sizeof($row);
				if(sizeof($row)>0)	
					$names[$i]->sentDate = $row[sizeof($row)-1]['sentDate'];
			}
			else{
				$row =[];
				$seen = 0;
				$user2 = $names[$i]->name;
				//echo $user2;
				$stmt = $user->runQuery('SELECT * FROM messages WHERE messageFrom=:user2 AND messageTo=:user1 AND seen=:seen');
				$stmt->bindparam(':user1',$me);
				$stmt->bindparam(':user2',$user2);
				$stmt->bindparam(':seen',$seen);
				$stmt->execute();
				$row=$stmt->fetchALL(PDO::FETCH_ASSOC);
				$names[$i]->unread = sizeof($row);
			}
		}
		function sortnames($a,$b){
			return $b->sentDate - $a->sentDate;
		}
		usort($names,'sortnames');
		//echo sizeof($names);
		$recentlist = [];
		/*for($i=0;$i<sizeof($names);$i++){
			if($names[$i]->groupName){
				if($names[$i]->unread>0){
					$line = "<li  class='". $names[$i]->groupName ."'><div class='chat-body clearfix'><div class='header_sec'><i  class='fa fa-users' aria-hidden='true'></i>".$names[$i]->name ."</div><span class='unreadnumber' style='color:white;font-size:14px;padding-left:20px;display:inline-block;float:left'>".$names[$i]->unread." unread</span><div></li>";
					$recentlist[$i] = $line;
				}
				else{
					$line = '<li  class="'. $names[$i]->groupName .'"><div class="chat-body clearfix"><div class="header_sec"><i  class="fa fa-users" aria-hidden="true"></i>'.$names[$i]->name .'</div><div></li>';
					$recentlist[$i] = $line;
				}
			}
			else{
				if($names[$i]->unread > 0){
					$line = '<li  class="'. $names[$i]->name .'"><div class="chat-body clearfix"><div class="header_sec">'.$names[$i]->name .'</div><span class="unreadnumber" style="color:white;font-size:14px;padding-left:20px;display:inline-block;float:left">'.$names[$i]->unread.' unread</span><div></li>';
					$recentlist[$i] = $line;
				}
				else{
					$line = '<li  class="'. $names[$i]->name .'"><div class="chat-body clearfix"><div class="header_sec">'.$names[$i]->name .'</div><div></li>';
					$recentlist[$i] = $line;
				}
			}
		}*/
		echo json_encode($names);
	}
?>