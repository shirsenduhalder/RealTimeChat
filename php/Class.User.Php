<?php
require '../admin/databaseconnection.php';

class USER
{	

	private $connection;
	
	//connection to the database
	public function __construct()
	{
		$database = new Database();
		$db = $database->dbconnection();
		$this->connection = $db;
    }
	
	//running sql queries using PDO
	public function runQuery($sql)
	{
		$stmt = $this->connection->prepare($sql);
		return $stmt;
	}
	
	//return last inserted ID
	public function lasdID()
	{
		$stmt = $this->connection->lastInsertId();
		return $stmt;
	}
	
	//signup function
	public function signup($realname,$uname,$email,$upass,$code)
	{
		try
		{							
			$password = md5($upass);
			$stmt = $this->connection->prepare("INSERT INTO user(name,userName,userEmail,userPass,tokenCode) 
			                                             VALUES(:real_name,:user_name, :user_mail, :user_pass, :active_code)");
			$stmt->bindparam(":real_name",$realname);
			$stmt->bindparam(":user_name",$uname);
			$stmt->bindparam(":user_mail",$email);
			$stmt->bindparam(":user_pass",$password);
			$stmt->bindparam(":active_code",$code);
			$stmt->execute();	
			return $stmt;
		}
		catch(PDOException $ex)
		{
			echo $ex->getMessage();
		} 
	}
	
	//login function
	public function login($email,$upass)
	{
		try
		{
			$stmt = $this->connection->prepare("SELECT * FROM user WHERE userEmail=:email_id");
			$stmt->execute(array(":email_id"=>$email));
			$userRow=$stmt->fetch(PDO::FETCH_ASSOC);
			
			if($stmt->rowCount() == 1)
			{
				if($userRow['userStatus']=="Y")
				{
					if($userRow['userPass']==md5($upass))
					{
						$_SESSION['userSession'] = $userRow['userID'];
						return true;
					}
					else
					{
						header("Location: login.php?error");
						exit;
					}
				}
				else
				{
					header("Location: login.php?inactive");
					exit;
				}	
			}
			else
			{
				header("Location: login.php?error");
				exit;
			}		
		}
		catch(PDOException $ex)
		{
			echo $ex->getMessage();
		}
	}
	
	//checks whether user is logged in or not
	public function loggedIn()
	{
		if(isset($_SESSION['userSession']))
		{
			return true;
		}
	}
	
	//redirection function
	public function redirect($url)
	{
		header("Location: $url");
	}
	
	//logout fucntion
	public function logout()
	{
		session_destroy();
		$_SESSION['userSession'] = false;
	}
	
	//sends mail
	function sendMail($email,$message,$subject)
	{						
		require_once('../mailer/class.phpmailer.php');
		$mail = new PHPMailer;
		$mail->IsSMTP(); 
		$mail->CharSet="UTF-8";
		$mail->SMTPDebug  = 0;                     
		$mail->SMTPAuth   = true;                  
		$mail->SMTPSecure = "ssl";                 
		$mail->Host       = "smtp.gmail.com";      
		$mail->Port       = 465;  
		$mail->SetFrom('youremail','yourname');           
		$mail->Username="youremail";  
		$mail->Password="yourpassword";         
		$mail->AddReplyTo("youremail","yourname");
		$mail->Subject    = $subject;
		$mail->MsgHTML($message);
		$mail->AddAddress($email);
		$mail->Send();
	}	
}