<?php
session_start();
require_once 'Class.User.Php';
$user = new USER();

if($user->loggedIn()!="")
{
	$user->redirect('../mainchat.php');
}

//checks if button is set
if(isset($_POST['btn-submit']))
{
	$email = $_POST['txtemail'];
	
	$stmt = $user->runQuery("SELECT userID FROM user WHERE userEmail=:email LIMIT 1");
	$stmt->execute(array(":email"=>$email));
	$row = $stmt->fetch(PDO::FETCH_ASSOC);	
	if($stmt->rowCount() == 1)
	{
		$id = base64_encode($row['userID']);
		$code = md5(uniqid(rand()));
		
		$stmt = $user->runQuery("UPDATE user SET tokenCode=:token WHERE userEmail=:email");
		$stmt->execute(array(":token"=>$code,"email"=>$email));
		
		$message= "
				   Hello , $email
				   <br /><br />
				   Click below to reset your password. 
				   <br /><br />
				   <a href='resetpassword.php?id=$id&code=$code'>Click here</a>
				   <br /><br />
				   ";
		$subject = "Password Reset";
		
		//sends mail using Class.USer.Php
		$user->sendMail($email,$message,$subject);
		
		$msg = "<div class='alertmessage'>
					We've sent an email to $email. Please click on the password reset link in the email to generate new password. 
			  	</div>";
	}
	else
	{
		$msg = "<div class='wrongalert'>
					<strong>Wrong email!<span><i style='margin-left:6px;' class='fa fa-exclamation-triangle' aria-hidden='true'></i></span></strong> 
					</div>";
	}
}
?>

<!DOCTYPE html>
<html>
  <head>
  	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Forgot Password</title>
		<!-- Latest compiled and minified CSS -->
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
		<link href="https://fonts.googleapis.com/css?family=Quicksand:300|Sail|Open+Sans" rel="stylesheet">
		
		<link href="https://fonts.googleapis.com/css?family=Cutive" rel="stylesheet">
		<link href="https://fonts.googleapis.com/css?family=Lobster|Sacramento" rel="stylesheet">
		<link href='https://fonts.googleapis.com/css?family=Unica+One' rel='stylesheet' type='text/css'>
		<link href='https://fonts.googleapis.com/css?family=Advent+Pro|Poiret+One' rel='stylesheet' type='text/css'>

		<!-- Optional theme -->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		
		<script src="https://cdn.jsdelivr.net/jquery.validation/1.16.0/jquery.validate.min.js"></script>
		<!-- Latest compiled and minified JavaScript -->
		<link rel="stylesheet" type="text/css" href="../common/css/forgotpassword.css">
  </head>
  <body>
  	
    <div class="container">
      <form class="form-signin" method="post">
        <h3 class="form-signin-heading">Forgot Password</h3>        
        	<?php
			if(isset($msg))
			{
				echo $msg;
			}
			else
			{
				?>
              	<div class='alertmessage'>
				Please enter your email address. You will receive a link to create a new password via E-mail.
				</div>  
                <?php
			}
			?>
        
        <div class="form-group cols-lg-6 cols-lg-offset-3">
	        <label style = "font-size:18px; font-family: 'Unica One', cursive;color: rgba(229,0,101,1);" for="txtemail">Enter you E-mail</label>
        		<div class="cols-lg-6">
        			<div class="input-group">
        				<span style="background-color:transparent;border-radius:20px;" class="input-group-addon"><i id="icons" class="glyphicon glyphicon-envelope"></i></span>
        				<input id="txtemail" type="email" class="form-control" placeholder="Email address" name="txtemail" required />
        			</div>
        		</div>
        	</div>
        	<div>
	        	<button id="btn-submit" type="submit" name="btn-submit">Generate new password</button>
	        </div>
      </form>
      <a href="login.php"><i style="margin-top:2px; margin-right:5px;" class="fa fa-arrow-circle-left" aria-hidden="true"></i>Go back</a>
    </div> <!-- /container -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" 
		integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
  </body>
</html>