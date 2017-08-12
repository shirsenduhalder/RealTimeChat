<?php
//reset passowrd page
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
	
	$stmt = $user->runQuery("SELECT * FROM user WHERE userID=:uid AND tokenCode=:token");
	$stmt->execute(array(":uid"=>$id,":token"=>$code));
	$rows = $stmt->fetch(PDO::FETCH_ASSOC);
	
	if($stmt->rowCount() == 1)
	{
		if(isset($_POST['btn-reset']))
		{
			$pass = $_POST['password'];
			$confirm = $_POST['password2'];
			
			if($confirm!==$pass)
			{
				$msg = "<div class='wrongalert'>
						<bold>Sorry!</bold> Passwords don't match. 
						</div>";
			}
			else
			{
				$password = md5($confirm);
				$stmt = $user->runQuery("UPDATE user SET userPass=:upass WHERE userID=:uid");
				$stmt->execute(array(":upass"=>$password,":uid"=>$rows['userID']));
				
				$msg = "<div class='alertmessage'>
						Password Changed.
						</div>";
				header("refresh:2;login.php");
			}
		}	
	}
	else
	{
		$msg = "<div class='wrongalert'>
				No Account Found.
				</div>";
				
	}
	
	
}

?>
<!DOCTYPE html>
<html>
  <head>
    <title>Password Reset</title>
    	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
		<link href="https://fonts.googleapis.com/css?family=Quicksand:300|Sail|Open+Sans" rel="stylesheet">
		
		<link href="https://fonts.googleapis.com/css?family=Cutive" rel="stylesheet">
		<link href="https://fonts.googleapis.com/css?family=Lobster|Sacramento" rel="stylesheet">
		<link href='https://fonts.googleapis.com/css?family=Unica+One' rel='stylesheet' type='text/css'>
		<link href='https://fonts.googleapis.com/css?family=Advent+Pro|Poiret+One' rel='stylesheet' type='text/css'>

		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

		<!-- Optional theme -->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		
		<script src="https://cdn.jsdelivr.net/jquery.validation/1.16.0/jquery.validate.min.js"></script>
		<!-- Latest compiled and minified JavaScript -->
		<link rel="stylesheet" type="text/css" href="../common/css/resetpassword.css">
  </head>
  <body>
    <div class="container">
    	<div class='alertmessage'>
			<strong>Hello!</strong>  <?php echo $rows['name'] ?>
		</div>
        <form class="form-signin" method="post">
        	<h3 class="form-signin-heading">Password Reset.</h3>
		        <?php
		        if(isset($msg))
				{
					echo $msg;
				}
				?>
        	<div>
        		<label style = "margin-top:10px;font-size:18px; font-family: 'Unica One', cursive;color: rgba(229,0,101,1);" for="password">Enter your new password</label>
        		<div class="cols-lg-6">
        			<div class="input-group">
        				<span style="background-color:transparent;border-radius:20px;" class="input-group-addon"><i id="icons" class="glyphicon glyphicon-lock"></i></span>
        				<input type="password" class="form-control" placeholder="New Password" name="password" id="password" required />
        			</div>
        		</div>
        		<label style = "margin-top:20px;font-size:18px; font-family: 'Unica One', cursive;color: rgba(229,0,101,1);" for="password2">Confirm your password</label>
        		<div class="cols-lg-6">
        			<div class="input-group">
        				<span style="background-color:transparent;border-radius:20px;" class="input-group-addon"><i id="icons" class="glyphicon glyphicon-lock"></i></span>
        				<input type="password" class="form-control" placeholder="Confirm New Password" name="password2" id="password2" required />
        			</div>
        		</div>
        		
        	</div>
        	<br>
        	<div>
	        	<button id="btn-reset" type="submit" name="btn-reset">Reset Your Password</button>
	        </div>
      </form>

    </div> <!-- /container -->
    <script src="bootstrap/js/jquery-1.9.1.min.js"></script>
    <script src="bootstrap/js/bootstrap.min.js"></script>
  </body>
</html>

