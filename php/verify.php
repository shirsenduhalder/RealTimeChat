<?php
//verification page
require_once 'Class.User.Php';
$user = new USER();

if(empty($_GET['id']) && empty($_GET['code']))
{
	$user->redirect('login.php');
}

if(isset($_GET['id']) && isset($_GET['code']))
{
	$id = base64_decode($_GET['id']);
	$code = $_GET['code'];
	
	$statusY = "Y";
	$statusN = "N";
	
	$stmt = $user->runQuery("SELECT userID,userStatus FROM user WHERE userID=:uID AND tokenCode=:code LIMIT 1");
	$stmt->execute(array(":uID"=>$id,":code"=>$code));
	$row=$stmt->fetch(PDO::FETCH_ASSOC);
	if($stmt->rowCount() > 0)
	{
		if($row['userStatus']==$statusN)
		{
			$stmt = $user->runQuery("UPDATE user SET userStatus=:status WHERE userID=:uID");
			$stmt->bindparam(":status",$statusY);
			$stmt->bindparam(":uID",$id);
			$stmt->execute();	
			
			$msg = "
		           <div class='alertmessage'>
					Congratulations!Your account is now activated.
			       </div>
			       <div class='links'><a class='link' href='login.php'>Login here</a></div>	
			       ";	
		}
		else
		{
			$msg = "
		           <div class='wrongalert'>
				   <strong>Sorry!</strong> Your account is already activated.
			       </div>
			       <div class='links'><a class='link' href='login.php'>Login here</a></div>	
			       ";
		}
	}
	else
	{
		$msg = "
		       <div class='wrongalert'>
			   <strong>Sorry!</strong> You don't have any account. Sign up to use our services.
			   </div>
			    <div class='links'><a class='link' href='index.php'>Sign Up.</a></div>
			   ";
	}	
}

?>
<!DOCTYPE html>
<html>
  <head>
  	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
		<link href="https://fonts.googleapis.com/css?family=Quicksand:300|Sail" rel="stylesheet">
		
		<link href="https://fonts.googleapis.com/css?family=Cutive" rel="stylesheet">
		<link href="https://fonts.googleapis.com/css?family=Lobster|Sacramento" rel="stylesheet">
		<link href='https://fonts.googleapis.com/css?family=Unica+One' rel='stylesheet' type='text/css'>
		<link href='https://fonts.googleapis.com/css?family=Advent+Pro|Poiret+One' rel='stylesheet' type='text/css'>

		<!-- Optional theme -->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		
		<script src="https://cdn.jsdelivr.net/jquery.validation/1.16.0/jquery.validate.min.js"></script>
		<!-- Latest compiled and minified JavaScript -->
		<link rel="stylesheet" type="text/css" href="../common/css/verify.css">
  </head>
  <body>
    <div class="container">
		<?php if(isset($msg)) { echo $msg; } ?>
    </div
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" 
		integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
  </body>
</html>