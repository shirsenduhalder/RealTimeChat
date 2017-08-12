<?php
    session_start();
    //searches name from the database
    require_once "Class.User.Php";
    $user = new USER();
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
        if($s->rowCount()>0){
            echo json_encode($rows);
        }
    }
?>
