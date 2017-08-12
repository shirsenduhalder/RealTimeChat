<?php
//database connection file
	class Database{
		private $host = "localhost";
		private $databasename = "authentication";
		private $user = "root";
		private $password = "";
		public $connection; 

		public function dbconnection(){
			$this->connection = null;
			try{
				$this->connection = new PDO("mysql:host=".$this->host.";dbname=".$this->databasename,$this->user,$this->password);
				$this->connection->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
			}
			catch(PDOException $e){
				echo "connection error: " .$e->getMessage();
			}
			return $this->connection;
		}
	}
?>