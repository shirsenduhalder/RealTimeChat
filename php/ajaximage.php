<?php
	session_start();
	require_once "Class.User.Php";
	$user = new USER();
	if($user->loggedIn()){
		$stmt = $user->runQuery("SELECT * FROM user WHERE userID=:uid");
		$stmt->execute(array(":uid"=>$_SESSION['userSession']));
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		$path = "/Chat/common/images/userimages/";
		$username = $row['userID'];
		$valid_formats = array("jpg","JPG", "png", "gif", "bmp","jpeg");
		//echo $path.$username;
		if(isset($_FILES['picture']['type']))
		{	
			$name = $_FILES['picture']['name'];
			$size = $_FILES['picture']['size'];
			if(strlen($name))
			{
				list($txt, $ext) = explode(".", $name);
				if(in_array($ext,$valid_formats))
				{
					if($size<(2*1024*1024))
					{
						$actual_image_name = $username.".".$ext;
						$tmp = $_FILES['picture']['tmp_name'];
						if(move_uploaded_file($tmp, $path.$actual_image_name))
						{
							$stmt = $user->runQuery("UPDATE user SET userPicture=:image WHERE userID = :uid");
							$stmt -> bindParam(":uid",$username);
							$stmt -> bindParam(":image",$actual_image_name);
							$stmt -> execute();
							$s = $user->runQuery("SELECT * FROM user WHERE userID=:uid");
							$s->execute(array(":uid"=>$_SESSION['userSession']));
							$r = $s->fetch(PDO::FETCH_ASSOC);
							echo $r['userPicture'];
						}
						else
							echo 'Failed';
					}
					else
						echo 'Maximum size of image allowed is 2MB';
				}
				else
					echo 'Invalid file format';
			}
			else
				echo 'Please select an image';
		exit;
		}
	}
?>

