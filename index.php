<?php
    session_start();
    require_once '../Chat/php/Class.User.Php';
    $user = new USER();

    if(!$user->loggedIn())
    {
    	$user->redirect('php/login.php');
    }

    $stmt = $user->runQuery("SELECT * FROM user WHERE userID=:uid");
    $stmt->execute(array(":uid"=>$_SESSION['userSession']));
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    //retrieving the name of the logged in user
?>

<!DOCTYPE html>
<html>
    <head>
        <!-- CDN links and CSS -->
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Main chat</title>
        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
        <link rel="stylesheet" type="text/css" href="common/css/mainchat.css">
         <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" rel="stylesheet">
         <link href="common/css/emoji.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Cutive" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Josefin+Slab:700|Sail|Quicksand:700" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Italianno|Lobster|Sacramento" rel="stylesheet">
        <link href='https://fonts.googleapis.com/css?family=Unica+One' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/balloon-css/0.4.0/balloon.min.css">
        <link href='https://fonts.googleapis.com/css?family=Advent+Pro|Poiret+One' rel='stylesheet' type='text/css'>
        <link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.15.1/moment.js"></script>
        <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    </head>
    <body>
        <!--main-->
        <div class="main">
            <div class="jumbotron">
                <div class="description">
                    <!-- logo -->
                    
                    <!-- User Details and Edit and logout options-->
                    <div id='details'>
                        <h3>Welcome, <span id='me'><?php echo $row['name']; ?></span></h3>
                        <img id="myimage" src="common/images/userimages/<?php echo $row['userPicture']?>">  
                        <div class="options">
                            <ul>
                                <li><a href="php/picture.php">Edit</a></li>
                                <li><a href="php/logout.php">Logout</a></li>
                            </ul>   
                        </div>
                    </div> 
                </div>
                <!-- Chat side bar-->
                <div style="margin-left:10px;" class="chat-container">
                    <div class="col-md-3" id = "chat-side-bar">
                        <div id="row" style="background:transparent" >
                            <div id="custom-search-input">
                                <div class="textBox">
                                    <input style="border-radius: 20px; width: 97%; height: 40px;" type="text" name="searchBox" id="searchBox" class="form-control" placeholder="Search" />
                                    <div>
                                        <ul id="result" class="list-unstyled">
                                    </ul>
                                    </div>
                                </div>                
                            </div>
                            <!-- Radio buttons -->
                            <div id='radiodiv'>
                                <div class="radios"> 
                                    <input type="radio" name="size" id="recentradio" value="small" checked />
                                    <label data-balloon="Recent contacts" data-balloon-pos="down" for="recentradio" id='recentlabel'><i style='font-weight:normal' class="fa fa-clock-o" aria-hidden="true"></i></label>
                                      
                                    <input type="radio" name="size" id="onlineradio" value="small" />
                                    <label data-balloon="Online!" data-balloon-pos="down" for="onlineradio" id='onlinelabel'><i id='onlineradioicon' class="fa fa-circle" aria-hidden="true"></i></label>
                                      
                                    <input type="radio" name="size" id="allradio" value="small" />
                                    <label data-balloon="All contacts" data-balloon-pos="down" for="allradio"><i class="fa fa-user" aria-hidden="true"></i></label>
                                    
                                    <input type="radio" name="size" id="groupsradio" value="small" />
                                    <label data-balloon="Groups" data-balloon-pos="down" for="groupsradio" id='groupslabel'><i class="fa fa-users" aria-hidden="true"></i></label>
                                </div>
                            </div>
                            <div id='content'>
                                    <div> <div id="recent"> <div id="mainrecent"> <ul id="recentlist" class="list-unstyled"> </ul> </div> </div> </div>
                                
                            </div>
                        </div>
                    </div>
                    <!-- Hidden modals -->
                    <div id="myModal" class="modal">
                        <span class="close">&times;</span>
                        <img class="modal-content" id="img01">
                    </div>
                    <div id="myModal2" class="modal">
                        <span id="close2">&times;</span>
                        <div id="modalcontainer">
                            <div id="modaldescription"></div>
                            <div id='searchmodal'>
                                <button id="modalgoback">Go back</button>
                                <input style="float:left;" type="text" name="inputmodal" id="inputmodal" class="form-control" placeholder="Search" />
                            </div>
                            <ul id='modalList' class='list-unstyled'></ul>
                        </div>
                        <div id='modalbutton'></div>
                    </div>
                    <!-- Chat section -->
                    <div class="col-md-9" id="chat-section">
                        <div>
                            <!-- Displays name of other users or groups -->
                            <div class="user">

                                <?php
                                    include 'php/getfirst.php';
                                ?>
                            </div>
                            <div id="chatspacebackground">
                                <!-- Main chatspace -->
                                <div id="chatspace">
                                    <!-- Messages are appended here -->
                                    <div id="messages">
                                        <?php
                                            if($to!=$row['name']){
                                                $stmt = $user->runQuery("(SELECT * FROM messages WHERE messageFrom=:me AND messageTo=:to) UNION (SELECT * FROM messages WHERE messageFrom=:to AND messageTo=:me) ORDER BY sentDate");
                                                $stmt->bindparam(":me",$me);
                                                $stmt->bindparam(":to",$to);
                                                $stmt->execute();
                                                $r2 = $stmt->fetchAll(PDO::FETCH_ASSOC);
                                                for($i=0;$i<sizeof($r2);$i++){
                                                    if(($r2[$i]['messageFrom'])==$row['name']){
                                                        $msg = $r2[$i]['message'];
                                                        echo '<div class="textbox"><div class="righttext">';
                                                        echo '<p>'; 
                                                        echo $msg;
                                                        echo '</p>';
                                                        echo '<span class="time">'.date('d m Y H:i A').'</span>';
                                                        echo '</div></div><br>';
                                                    }
                                                    else{
                                                        $msg2 = $r2[$i]['message']; 
                                                        echo '<div class="textbox"><div class="lefttext">';
                                                        echo '<p>'; 
                                                        echo $msg2;
                                                        echo '</p>';
                                                        echo '<span class="time">'.date('d m Y H:i A').'</span>';
                                                        echo '</div></div><br>';
                                                    }
                                                }
                                            }
                                            else{
                                                $stmt = $user->runQuery("(SELECT * FROM messages WHERE messageFrom=:me AND messageTo=:to) UNION (SELECT * FROM messages WHERE messageFrom=:to AND messageTo=:me) ORDER BY sentDate");
                                                $stmt->bindparam(":me",$me);
                                                $stmt->bindparam(":to",$from);
                                                $stmt->execute();
                                                $r2 = $stmt->fetchAll(PDO::FETCH_ASSOC);
                                                for($i=0;$i<sizeof($r2);$i++){
                                                    if(($r2[$i]['messageFrom'])==$row['name']){
                                                        $msg = $r2[$i]['message'];
                                                        echo '<div class="textbox"><div class="righttext">';
                                                        echo '<p>'; 
                                                        echo $msg;
                                                        echo '</p>';
                                                        echo '<span class="time">'.date('d m Y H:i A').'</span>';
                                                        echo '</div></div><br>';
                                                    }
                                                    else{
                                                        $msg2 = $r2[$i]['message']; 
                                                        echo '<div class="textbox"><div class="lefttext">';
                                                        echo '<p>'; 
                                                        echo $msg2;
                                                        echo '</p>';
                                                        echo '<span class="time">'.date('d m Y H:i A').'</span>';
                                                        echo '</div></div><br>';
                                                    }
                                                }
                                            }
                                        ?>
                                    </div>
                                </div>
                                <!-- Down button -->
                                <div id="down"><i id="downBtn" class="fa fa-arrow-circle-down" aria-hidden="true"></i></div>
                                    <!-- Text area -->
                                    <div class="send">
                                        <form id='sendform' action="get">
                                            <textarea placeholder='Enter your message' rows='2' id='send' class="sendtext" onblur="this.placeholder = 'Enter your message'" onfocus="this.placeholder = ''" name='send' data-emojiable="true"></textarea>
                                            <button type='button' type='submit' name='sendBtn' id="sendBtn"><i id="icon" class="fa fa-telegram" aria-hidden="true"></i></button>
                                        </form>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Scripts -->
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.15.1/moment.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js" integrity="sha256-T0Vest3yCU7pafRw9r+settMBX6JkKN06dqBnpQ8d30=" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/jquery.validation/1.16.0/jquery.validate.min.js"></script>
        <script type="text/javascript" src="common/js/mainchat.js"></script>
        <script src="common/js/config.js"></script>
        <script src="common/js/util.js"></script>
        <script src="common/js/jquery.emojiarea.js"></script>
        <script src="common/js/emoji-picker.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-3-typeahead/4.0.2/bootstrap3-typeahead.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" 
        integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.15.1/moment.js"></script>
    </body>
</html>