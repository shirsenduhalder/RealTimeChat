<?php
    session_start();
    require_once "Class.User.Php";
    $user = new USER();
    //used for searching users in the modal
    if($user->loggedIn()){
        $stmt = $user->runQuery("SELECT name FROM user WHERE userID=:uid");
        $stmt->bindparam(":uid",$_SESSION['userSession']);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $me = $row['name'];
        $title = $_POST['search'];
        $s = $user -> runQuery("SELECT * FROM user WHERE name LIKE '%$title%' AND name!=:uid");;
        $s->bindparam(":uid",$me);
        $s->execute();
        $rows = $s->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($rows);
    }
?>
