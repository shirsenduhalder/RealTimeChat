$('document').ready(function(){
	//vslidation rules for signup form
	$('#signupform').validate({
		rules:{
			name:{
				required:true
			},
			txtemail:{
				required:true,
				email:true
			},
			txtpass:{
				required:true,
				minlength:8
			},
			txtpass2:{
				required:true,
				equalTo:'#txtpass'
			},
			txtuname:{
				required:true,
				minlength:3
			},
		},
		messages:{
			name:{
				required:"You have to enter a name"
			},
			txtemail:{
				required:"Enter a mail",
				email:"Enter a valid email"
			},
			txtpass:{
				required:"You have to enter a password",
				minlength:"Length should be 8 or more characters"
			},
			txtpass2:{
				required:"You have to confirm your password",
				equalTo:"Passwords do not match!"
			},
			txtuname:{
				required:"Username is necessary",
				minlength:"Minimum length should be 3"
			},
		}
	});
});