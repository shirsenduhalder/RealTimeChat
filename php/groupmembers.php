<?php
	session_start();
	//retrieves all group member of a given group
	require_once 'Class.User.Php';
	$user = new USER();
	if($user->loggedIn()){
		$me = $_POST['me'];
		$groupname = $_POST['groupname'];
		$stmt = $user->runQuery('SELECT userName FROM groupUsers WHERE groupName = :gname AND userName!=:me');
		$stmt->bindparam(':gname',$groupname);
		$stmt->bindparam(':me',$me);
		$stmt->execute();
		$row = $stmt->fetchAll(PDO::FETCH_ASSOC);
		if(sizeof($row)!=0){
			for($i=0;$i<sizeof($row);$i++){
				echo $row[$i]['userName'].', ';
			}
		}
	}
?>