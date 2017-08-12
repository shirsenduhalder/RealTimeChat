<?php
	require_once 'Class.User.Php';
	$user = new USER();
    //used for displaying the latest converstaion in the chatspace
	if($user->loggedIn()){
  	$stmt = $user->runQuery("SELECT name FROM user WHERE userID=:uid");
  	$stmt->bindparam(":uid",$_SESSION['userSession']);
  	$stmt->execute();
  	$row = $stmt->fetch(PDO::FETCH_ASSOC);
  	$me = $row['name'];
    $s = $user->runQuery("SELECT * FROM messages WHERE messageFrom=:me OR messageTo=:me ORDER BY sentDate DESC");
    $s->bindparam(":me",$me);
    $s->execute();
    $r = $s->fetchAll(PDO::FETCH_ASSOC);
    $to = $r[0]["messageTo"];
    $from = $r[0]["messageFrom"];
    if($to==$me){
        $stmt = $user->runQuery('SELECT userPicture FROM user WHERE name=:fro');
        $stmt->bindparam(':fro',$from);
        $stmt->execute();
        $a = $stmt->fetch(PDO::FETCH_ASSOC);
        $img = $a['userPicture'];
        $path = 'common/images/userimages/'.$img;
        if(file_exists($path)){
            echo '<img src="'.$path.'"> <div id="name">'.$from.'</div><i id="moreMessages" class="fa fa-arrow-circle-up" aria-hidden="true"></i>';
        }
        else{
          echo '<img src="common/images/userimages/default.png"> <div id="name">'.$from.'</div><i id="moreMessages" class="fa fa-arrow-circle-up" aria-hidden="true"></i>';
        }
    } 
    else{
        $stmt = $user->runQuery('SELECT name,userPicture FROM user WHERE name=:fro');
        $stmt->bindparam(':fro',$to);
        $stmt->execute();
        $a = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $img = $a[0]['userPicture'];
        $path = "common/images/userimages/".$img;
        if(file_exists($path)){
            echo '<img src="'.$path.'"> <div id="name">'.$to.'</div><i id="moreMessages" class="fa fa-arrow-circle-up" aria-hidden="true"></i>';
        }
        else{
            echo '<img src="common/images/userimages/default.png"><div id="name">'.$to.'</div><i id="moreMessages" class="fa fa-arrow-circle-up" aria-hidden="true"></i>';
        }  
    }
  }
?>