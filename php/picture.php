<?php
	//edit profile page
	session_start();
	require_once "Class.User.Php";
	$user_home = new USER();
	if(!$user_home->loggedIn()){
		$user_home->redirect('login.php');
	}
	$stmt = $user_home->runQuery("SELECT * FROM user WHERE userID=:uid");
	$stmt->execute(array(":uid"=>$_SESSION['userSession']));
	$row = $stmt->fetch(PDO::FETCH_ASSOC);
	$path = "../common/images/userimages/";
	$name = $row['name'];
	$path = $path.$row['userPicture'];
?>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Profile Picture</title>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
		<link href="https://fonts.googleapis.com/css?family=Quicksand:300|Sail" rel="stylesheet">
		<link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
		<link href="https://fonts.googleapis.com/css?family=Cutive" rel="stylesheet">
		<link href="https://fonts.googleapis.com/css?family=Lobster|Sacramento|Italiana" rel="stylesheet">
		<link href='https://fonts.googleapis.com/css?family=Unica+One' rel='stylesheet' type='text/css'>
		<link href='https://fonts.googleapis.com/css?family=Advent+Pro|Poiret+One|Bad+Script' rel='stylesheet' type='text/css'>

		<!-- Optional theme -->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		
		<script src="https://cdn.jsdelivr.net/jquery.validation/1.16.0/jquery.validate.min.js"></script>
		<!-- Latest compiled and minified JavaScript -->
		<link rel="stylesheet" type="text/css" href="../common/css/picture.css">
		<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-3-typeahead/4.0.2/bootstrap3-typeahead.js"></script>
		<script type="text/javascript" src="../common/js/picture.js"></script>
	</head>
	<body>
		
		<?php $name = $row['name'];?>
		<div class="container">
			<div>
				<a id='goback'href="../index.php"><i style="margin-right:4px; margin-top:2px;" class="fa fa-arrow-circle-left" aria-hidden="true"></i>Go back</a>
				<p id='heading'>Change your details</p>
				<br>
				<div class="col-sm-12 form-container">
					<!--changes picture-->
					<form clas="cols-lg-6" id="uploadimage" action="" method="post" enctype="multipart/form-data">
						<div class="desc">
							<div style = "font-size:18px; font-family: 'Unica One', cursive;color: rgba(229,0,101,1);" id="changedescription"><p>Change your image</p></div><br>
							<label id="picture-label" for="picture" class="control-label"><img id="profileimage" src = "<?php echo $path?>"></label>
							<input class="input-group" type="file" name="picture" id="picture">
							<div id='changeinf'></div>
							<div id='changestatus'></div>
							<br>
							<button id='pictureupload' type='submit' value='Upload' class='submit'>Upload</button>
							<div style="font-size:22px;font-family: 'Sacramento', cursive; color: rgba(229,0,101,0.6);" id="photo"></div>
						</div>
					</form>
					<div class="form-group cols-lg-6 cols-lg-offset-3">
						<!--changes username-->
				        <label style = "font-size:18px; font-family: 'Unica One', cursive;color: rgba(229,0,101,1);" for="txtemail">Change your username</label>
			        	<div>
			        		<div class="input-group">
			        			<span style="background-color:transparent;border-radius:20px;" class="input-group-addon"><i id="iconusername" class="glyphicon glyphicon-user"></i></span>
			        			<input id="changeusername" type="text" class="form-control" placeholder="New username" name="changeusername" required />
        					</div>
        					<button id="submitusername" type='submit'>Submit Username</button>
        					<div class='success' id='successusername'></div>
        				</div>
        				<br>
        				<!--changes name-->
        				<label style = "font-size:18px; font-family: 'Unica One', cursive;color: rgba(229,0,101,1);" for="txtemail">Change your name</label>
			        	<div>
			        		<div class="input-group">
			        			<span style="background-color:transparent;border-radius:20px;" class="input-group-addon"><i id="iconname" class="glyphicon glyphicon-pencil"></i></span>
			        			<input id="changename" type="text" class="form-control" placeholder="New name" name="changename" required />
			        		</div>
			        		<button id="submitname" type='submit'>Submit Name</button>
			        		<div class='success' id='successname'></div>
        				</div>
        			</div>
				</div>
			</div>
		</div>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" 
		integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
	</body>
</html>