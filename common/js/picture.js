$(document).ready(function(){


	$('#profileimage').on('mouseenter',function(){
		$('#changeinf').html('<p>Click to change your image</p>');
		setTimeout(function(){
			$('#changeinf').html('');
		},1000);
	});
	$('#profileimage').on('mouseleave',function(){
		$('#changeinf').html('');
	});

	$('#picture').on('change',function(){
		var value = document.getElementById('picture');
		var fReader = new FileReader();
		fReader.readAsDataURL(value.files[0]);
		fReader.onloadstart = function(event){
			console.log('Start');
		}
		fReader.onloadend = function(event){
			var img = document.getElementById('profileimage');
			img.src = event.target.result;
			if(img.src==''){
				alert('Select an imaage to change');
			}
			else{
				console.log(img.src);
			}
			console.log('end');
		}
	});

	$('#uploadimage').on('submit',function(){
		$.ajax({
			url:'/Chat/php/ajaximage.php',
			type:'POST',
			data:new FormData(this),
			contentType:false,
			cache:false,
			processData:false,
			success:function(data){
				alert(data);
				$('#picture-label').html('<img id="profileimage" src = "'+data+'">')
			},
			error:function(data){
				alert(data);
			}
		});
	});
	
	$('#pictureupload').click(function(){
		window.location.reload();
	});

	/*$('#uploadimage').on('submit',function(){
		$.post(
			"ajaximage.php",
			new FormData(this),
			function(data){
				console.log(data);
				$('#profileimage').attr('src','userimages/'+data);
			}
		);
	});*/
	
	var oldname = '';
	myname();
	function myname(){
		$.ajax({
			url:'me.php',
			success:function(data){
				console.log(data);
				oldname = data;
			}
		});
	}

	function submitname(){
		$('#submitname').click(function(){
			var realname = $('#changename').val();
			$.ajax({
				url:'me.php',
				success:function(data){
					console.log(data);
					oldname = data;
				}
			});
			if(realname==""){
				alert('Name cannot be blank');
			}
			else{
				$.ajax({
					url:'/Chat/php/changename.php',
					type:'POST',
					data:{'newname':realname,'oldname':oldname},
					success:function(data){
						$('#changename').val('');
					},
					error:function(data){
						alert(data);
					}
				});
			}
		});

		$('#changename').on('keyup',function (e){
			if(e.keyCode == 13){
				var name = $('#changename').val();
				$.ajax({
					url:'me.php',
					success:function(data){
						console.log(data);
						oldname = data;
					}
				});
				if(name==""){
					alert('Name cannot be blank');
				}
				else{	
					$.ajax({
						url:'/Chat/php/changename.php',
						type:'POST',
						data:{'newname':name,'oldname':oldname},
						success:function(data){
							$('#changename').val('');
						},
						error:function(data){
							alert(data);
						}
					});
				}
			}
		});
	}

	$('#changename').focus(function(){
		submitname();
		$('#iconusername').css('color','rgb(178,20,99)');
	})

	function submitusername(){
		$('#submitusername').click(function(){
			var name = $('#changeusername').val();
			if(name == ''){
				alert('Name cannot be blank');
			}
			else{
				$.ajax({
					url:'/Chat/php/changeusername.php',
					type:'POST',
					data:{'username':name},
					success:function(data){
						$('#changeusername').val('');
					},
					error:function(data){
						alert(data);
					}
				});
			}
		});

		$('#changeusername').on('keyup',function (e){
			if(e.keyCode == 13){
				var name = $('#changeusername').val();
				if(name==''){
					alert('Name cannot be blank');
				}
				else{
					$.ajax({
						url:'/Chat/php/changeusername.php',
						type:'POST',
						data:{'username':name},
						success:function(data){
							$('#changeusername').val('');
						},
						error:function(data){
							alert(data);
						}
					});
				}
			}
		});
	}

	$('#changeusername').focus(function(){
		submitusername();
	})
});