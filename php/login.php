<?php
//login page
session_start();
require_once 'Class.User.Php';
$user_login = new USER();

if($user_login->loggedIn())
{
	$user_login->redirect('../index.php');
}

if(isset($_POST['btn-login']))
{
	$email = trim($_POST['txtemail']);
	$upass = trim($_POST['txtupass']);
	
	if($user_login->login($email,$upass))
	{	
		$status = "Y";
		$stmt = $user_login->runQuery("UPDATE user SET active=:status WHERE userEmail = :uemail");
		$stmt -> bindParam(":uemail",$email);
		$stmt -> bindParam(":status",$status);
		$stmt -> execute();
		$user_login->redirect("../index.php");
	}
}
?>

<!DOCTYPE html>
<html>
  <head>
  	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  	
    <title>Log In</title>
		<!-- Latest compiled and minified CSS -->
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link href="https://fonts.googleapis.com/css?family=Quicksand:300|Sail" rel="stylesheet">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
		<link href="https://fonts.googleapis.com/css?family=Cutive" rel="stylesheet">
		<link href="https://fonts.googleapis.com/css?family=Lobster|Sacramento|Open+Sans" rel="stylesheet">
		<link href='https://fonts.googleapis.com/css?family=Unica+One' rel='stylesheet' type='text/css'>
		<link href='https://fonts.googleapis.com/css?family=Advent+Pro|Poiret+One' rel='stylesheet' type='text/css'>

		<!-- Optional theme -->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		
		<script src="https://cdn.jsdelivr.net/jquery.validation/1.16.0/jquery.validate.min.js"></script>
		<!-- Latest compiled and minified JavaScript -->
		<link rel="stylesheet" type="text/css" href="../common/css/login.css">
  </head>
  <body id="login">
    <div class="container cols-lg-4 cols-lg-offset-2">
		<?php 
		if(isset($_GET['inactive']))
		{
			?>
            <div class='wrongalert'>
				<bold>Sorry!</bold> This Account is not activated.
				<p>Go to your Inbox and Activate it. </p>
			</div>
            <?php
		}
		?>
        <form class="form-signin" method="post">
        <?php
        if(isset($_GET['error']))
		{
			?>
            <div class='wrongalert'>
				<bold>Wrong Details!</bold> 
			</div>
            <?php
		}
		?>
        <h3 style = "margin-bottom:30px;" id="form-signin-heading"><h3 style='font-weight:normal;'>Log In</h3></h2>
	        <div class="form-group cols-lg-6 cols-lg-offset-3">
	        <label style = "font-size:18px; font-family: 'Unica One', cursive;color: rgba(25,12,38,1);" for="txtemail"><h3>Enter your E-mail</h3></label>
        		<div class="cols-lg-6">
        			<div class="input-group">
        				<span class="input-group-addon"><i class="glyphicon glyphicon-envelope bleh"></i></span>
        				<input id="txtemail" type="email" class="form-control" placeholder="Email address" name="txtemail" required />
        			</div>
        		</div>
        	</div>
        	<div class="form-group">
	        <label style = "font-size:18px; font-family: 'Unica One', cursive;color: rgba(25,12,38,1);" for="txtemail"><h3>Enter your password</h3></label>
        		<div class>
        			<div class="input-group">
        				<span class="input-group-addon"><i class="glyphicon glyphicon-lock bleh"></i></span>
        				<input id="txtpassword" type="password" class="form-control" placeholder="Password" name="txtupass" required />
        			</div>
        		</div>
        	</div>
		        
	        <div>
	        	<button id="btn-login" type="submit" name="btn-login">Log in</button>
	        </div>
	        <br>
	        <div class="links">
	        	<a href="index.php" class="link1"><b>Sign Up</b></a>
	        	<a href="forgotpassword.php" class="link2"><b>Forgot Password?</b></a>
	        </div>
        </div>
      </form>

    </div>
  </body>
</html>