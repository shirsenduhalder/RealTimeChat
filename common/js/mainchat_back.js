$('document').ready(function(){
	function mainMethod(){
		var me = $('.username h3 #me').text();
		//Checks whether mainMethod.lastconvo exists every 0.1s. If it does then it displays .send
		setInterval(function(){
			if(!mainMethod.lastconvo){
				$('.send').hide();
			}
			else{
				$('.send').show();
			}
		},100);
		var recentBlink = true;
		var groupSelected = '';
		//Function to refresh list of recent conversations when you did not receive or sent a single message
		if(mainMethod.lastconvo==''){
			setInterval(function(){
				if(mainMethod.lastconvo==''){
					updaterecentlist();
				}
			},1000)
		}
		var intervalarr = new Array();

		$(document.body).on('click','#modalcontainer',function(){
			$('#inputmodal').val('');
		});

		$('#searchmodalbutton').click(function(){
			$('#inputmodal').val('');
		});

		$('#searchmodalbutton').keyup(function(e){
			if(e.keyCode==13){
				searchmodal();
				$('#inputmodal').val('');
			}
		});

		$('#inputmodal').keyup(function(e){
			if(e.keyCode<=1000){
				if($.trim($('#inputmodal').val())!=''){
					searchmodal();
				}
				else{
					$('#inputmodal').val('');
				}
			}
		});

		function searchmodal(){
			var searcharray = $('.user').find('#groupmemberlist').text().split(', ');
			for(var i = 0;i<searcharray.length;i++){
				if(searcharray[i].indexOf($('#inputmodal').val()) != -1){
					//$('#modalList').append('<li>'+searcharray[i]+'</li>');
				}
			}
		}

		//Whenever you click on the search box this clears both the search box and the list
		$('.textBox').click(function(){
			$('#searchBox').val('');
			$('#result').html('');
		});

		//The 3 functions below invokes the search function on keyboard and mouse events
		//Invokes on pressing the search button
		$('#searchBtn').click(function(){
			search();
			$('searchBox').val('');
		});

		//invokes on pressing the enter key
		$('#searchBox').keyup(function(e){
			if(e.keyCode==13){
				search();
				$('searchBox').val('');
			}
		});

		//Invokes on pressing any key
		$('#searchBox').keyup(function(e){
			if(e.keyCode<=1000){
				if($.trim($('#searchBox').val())!=''){
					search();
				}
				else{
					$('#searchBox').val('');
					$('#result').html('');
				}
			}
		});

		//Clears the search list on clicking anywhere in the page
		$('body').click(function(){
			$('#result').html('');
			$('#searchBtn').val('');
		});

		//Clicking on any one name from this list displays his/her chat in the chat section on the right
		$('#result').on('click','#searchresults',function(){
			mainMethod.lastconvo = $(this).text();
			$('#sendform').find('button').attr('id','sendBtn');
			$('#sendform').find('textarea').attr('id','send');
			var imagepath='';
			$.ajax({
				url:'getimage.php',
				type:'POST',
				data:{'username':mainMethod.lastconvo},
				success:function(data){
					imagepath = 'userimages/'+data;
					console.log(imagepath);
					$('.user').html($('<img src="'+imagepath+'"><div id="namecontainer"> <p id="name">'+mainMethod.lastconvo+'</p></div><button style="height:30px;width:30px;background-color:transparent;border-radius:20px; margin:25px 20px 0px 0px; float:right" type="button" class="moreMessages"><i style="font-size:40px;" class="fa fa-arrow-circle-up" aria-hidden="true"></i></button>'));
				},
			});
			updatemessages();
			updateScrollinstant();
			$('#result').html('');
		});

		//Searches the users from the database and displays a list
		function search(){
			var title = $("input[name='searchBox']").val();
			if(title!=''){
				$.ajax({
					url:'search.php',
					type:'POST',
					data:{'search':title},
					success:function(data){
						if(data!=''){
							$('#result').html('');
							data = JSON.parse(data);
							for(var i = 0;i<data.length;i++){
								$('#result').append('<li id="searchresults">'+data[i]['name']+'</li>');
								//$('#searchBox').val('');
							}
						}
						else{
							$('#result').html('<li style="color:rgba(255,255,255,0.6);">No such user</li>');
						}
					},
					error:function(data){
						console.log(data);
					}
				});
			}
		}

		//These two functions display the profile picture of the person with whom you are talking with if you click on his/her profile picture
		//This assigns the source of image
		$(document.body).on('click','.user img',function(){
			var s = this.src;
			console.log(s);
			imagedisplay(s);
		});

		//This creates a modal which has the image in between
		function imagedisplay(source){
			var modal = document.getElementById('myModal');
			var modalImg = document.getElementById("img01");
			modal.style.display = "block";
			modal.style.cursor = 'pointer';
			modalImg.src = source;
			modalImg.style.cursor = 'default';
			var span = document.getElementsByClassName("close")[0];
			span.onclick = function() { 
			    modal.style.display = "none";
			}
			window.onclick = function(event) {
			    if (event.target == modal) {
			        modal.style.display = "none";
			    }
			}
		}

		//updates the recentlist and also shows the number of unread messages
		updaterecentlist();
		function updaterecentlist(){
			$.ajax({
				url:'recent.php',
				dataType:'json',
				success:function(data){
					$('#recentlist').html(data);
				},
				error:function(data){
					console.log(data);
				}
			});
		}

		//Displays the list of recent users you had a conversation with
		$('#recentradio').click(function(){
			mainMethod.tab = 'recent';
			recentBlink = false;
			$('#recentlabel').html("<i style='font-weight:normal' class='fa fa-clock-o' aria-hidden='true'></i>   Recent")
			$('#content').html('');
			$('#content').html('<div> <div id="recent"> <div id="mainrecent"> <ul id="recentlist" class="list-unstyled"> </ul> </div> </div> </div>');				
			updaterecentlist();
		});

		//If you click on any person from the recentlist, the mainMethod.lastconvo is updated and the user bar takes to the chat history of this person
		$(document.body).on('click','#content #recent #mainrecent #recentlist li',function(event){
			mainMethod.lastconvo = $(this).find('.header_sec').text();
			$('#sendform').find('button').attr('id','sendBtn');
			$('#sendform').find('textarea').attr('id','send');
			console.log($(this).find('.header_sec').text());
			$(this).html('<div class="chat-body clearfix"><div class="header_sec">'+($(this).find('.header_sec').text())+'</strong><span style="float:right" class="badge"></div><div>');
			$.ajax({
				url:'getimage.php',
				type:'POST',
				data:{'username':mainMethod.lastconvo},
				success:function(data){
					$('.user').html($('<img src="userimages/'+data+'"><div id="namecontainer"> <p id="name">'+mainMethod.lastconvo+'</p></div><button style="height:30px;width:30px;background-color:transparent;border-radius:20px;margin:25px 20px 0px 0px; float:right" type="button" class="moreMessages"><i style="font-size:40px;" class="fa fa-arrow-circle-up" aria-hidden="true"></i></button>'));
				}
			});
			updatemessagesothers();
			mainMethod.number = 10;
			updateScrollinstant();
			intervalarr.forEach( clearInterval );
		});
		updateScrollinstant();

		//Displays the list of online users
		onlineusers();
		function onlineusers(){
			$("#onlineradio").click(function(){
				mainMethod.tab = 'online';
				recentBlink = true;
				$.ajax({
					url:'onlineusers.php',
					type:'GET',
					dataType:'json',
					success: function(data){
						if(data.length > 0){
							console.log(data.length);
							$('#content').html('');
							$('#content').html('<div id="contactlist"> <ul class="list-unstyled" id="showusers"> </ul> </div>');
							for(var i=0;i<data.length;i++){
								(function(i){
									var thisName = data[i].name;
									$.ajax({
										//async:false,
										url:'getimage.php',
										type:'POST',
										data:{'username':thisName},
										success:function(data2){
											$('#showusers').append($("<li class='"+ thisName +"' '><div class='chat-body clearfix'><div class='header_sec'><img style='margin-right:7px;margin-bottom:3px;height:30px;width:30px;border-radius:15px;' src='userimages/"+data2+"'></img>"+thisName+"</strong><i style='font-size:16px; margin-right:5px; margin-top:5px;float:right; color:#32CD32' class='fa fa-circle' aria-hidden='true'></i></div><div></div></div></li>"));
										},
										error:function(){
											console.log(data2);
										}
									});
								})(i);
							}
						}
						else{
							$("#showusers").html("");
							$('#showusers').append($("<li style='border-radius:10px; background-color:#E5D3D5;color:#000; margin-bottom:5px;' class='left clearfix names'><div class='chat-body clearfix'><div class='header_sec'><strong class='primary-font'>No online users found.</strong></div><div></div></div></li>"));
						}
					},
					error:function(data){
						console.log(data);
					}
				});
			});
		}

		//Displays all users in the database
		allusers();
		function allusers(){
			$("#allradio").click(function(){
				recentBlink = true;
				mainMethod.tab = 'all';
				$.ajax({
					url:'allusers.php',
					type:'GET',
					dataType:'json',
					success:function(data){
						if(data.length > 0){
							$('#content').html('');
							$('#content').html('<div id="contactlist"> <ul class="list-unstyled" id="showusers"> </ul> </div>');
							for(var i=0;i<data.length;i++){
								(function(i){
									var thisName = data[i].name;
									$.ajax({
										//async:false,
										url:'getimage.php',
										type:'POST',
										data:{'username':thisName},
										success:function(data2){
											$('#showusers').append($("<li class='"+ thisName +"' '><div class='chat-body clearfix'><div class='header_sec'><img style='margin-right:7px;margin-bottom:3px;height:30px;width:30px;border-radius:15px;' src='userimages/"+data2+"'></img>"+thisName+"</strong></div><div></div></div></li>"));
										},
										error:function(){
											console.log(data2);
										}
									});
								})(i);
							}
						}
					}
				});
			});
		}

		//If you click on any person from the contactlist, the mainMethod.lastconvo is updated and the user bar takes to the chat history of this person
		$(document.body).on('click','#content #contactlist #showusers li',function(event){
			mainMethod.lastconvo = $(this).attr('class');
			$('#sendform').find('button').attr('id','sendBtn');
			$('#sendform').find('textarea').attr('id','send');
			console.log(mainMethod.lastconvo);
			$.ajax({
				url:'getimage.php',
				type:'POST',
				data:{'username':mainMethod.lastconvo},
				success:function(data){
					$('.user').html($('<img src="userimages/'+data+'"><div id="namecontainer"> <p id="name">'+mainMethod.lastconvo+'</p></div><button style="height:30px;width:30px;background-color:transparent;border-radius:20px;margin:25px 20px 0px 0px; float:right" type="button" class="moreMessages"><i style="font-size:40px;" class="fa fa-arrow-circle-up" aria-hidden="true"></i></button>'));
				}
			});
			updatemessages();
			mainMethod.number = 10;
			updateScrollinstant();
			console.log(mainMethod.number);
	
		});

		$('#groupsradio').click(function(){
			mainMethod.tab = 'groups';
			recentBlink = true;
			$('#content').html('');
			$('#content').append('<div><button id="newgroup">Create new group</button></div><div id="grouplist"><ul id="groupsul" class="list-unstyled"></ul></div>')
			updategroups();
		});

		var groupmembers = [];

		$(document.body).on('click','#newgroup',function(){
			$(this).remove();
			$('#content').html('');
			groupmembers.splice(0,groupmembers.length)
			console.log(groupmembers);
			$('#content').append('<section class="groupnamecontainer"> <div class="groupnameinput"> <input id="groupname" type="text" class="form-control" placeholder="Enter the name of group" name="groupname" required /> </div> <div class="groupnamebutton"> <button type="button" type="submit" name="groupnamebutton" id="groupnamebutton"><i id="groupsendicon" class="fa fa-telegram" aria-hidden="true"></i></button> </div></section>')	
			$.ajax({
				url:'allusers.php',
				type:'GET',
				dataType:'json',
				success:function(data){
					if(data.length > 0){
						$('#content').append('<div id="grouplist"> <ul class="list-unstyled" id="showgroupusers"> </ul> </div>');
						for(var i=0;i<data.length;i++){
							(function(i){
								var thisName = data[i].name;
								$.ajax({
									//async:false,
									url:'getimage.php',
									type:'POST',
									data:{'username':thisName},
									success:function(data2){
										$('#showgroupusers').append($("<li class='"+ thisName +"' '><div class='chat-body clearfix'><div class='header_sec'><img style='border: 1px solid rgba(25,12,38,1);margin-right:7px;margin-bottom:3px;height:30px;width:30px;border-radius:15px;' src='userimages/"+data2+"'></img>"+thisName+"</strong></div><div></div></div></li>"));
									},
									error:function(){
										console.log(data2);
									}
								});
							})(i);
						}
					}
				}
			});
		});
		
		$(document.body).on('click','#content #grouplist #showgroupusers > li',function(){
			if(!$(this).attr('data-toggled') || $(this).attr('data-toggled') == 'off'){
				$(this).attr('data-toggled','on');
				$(this).css({'background-color':'rgba(25,12,38,0.7)','border-color':'rgba(25,12,38,0.7)','color':'rgba(255,255,255,1)'});
				var name = $(this).attr('class');
				if(groupmembers.length == 0){
					groupmembers.push(name);
					groupmembers.toString();
				}
				else{
					var toAdd = true;
					for(var i = 0;i<groupmembers.length;i++){
						if(groupmembers[i] == name)
							toAdd = false;
					}
					if(toAdd == true){
						groupmembers.push(name);
					}
				}
			}
			else if($(this).attr('data-toggled') == 'on'){
				$(this).attr('data-toggled','off');
				$(this).css({'background-color':'transparent','border-color':'rgba(25,12,38,0.8)','color':'rgba(25,12,38,0.8)'});
				var removename = $(this).attr('class');
				var index = -1;
				for(var j=0;j<groupmembers.length;j++){
					if(groupmembers[j] == removename)
						index = j;
				}
				groupmembers.splice(index,1);
			}
		});
		
		$(document.body).on('click','#content #groupnamebutton',function(){
			
			if($.trim($('#content #groupname').val()).length==0){
				$('#content #groupname').val('');
				alert('Enter a name for the group');
			}
			else{
				var gName = $('#content #groupname').val();
				$('#content #groupname').val('');
				var mem = JSON.stringify(groupmembers);
				var mems = JSON.parse(mem);
				if(mems.length > 0){
					$.ajax({
						url:'creategroup.php',
						type:'POST',
						data:{'members':mems,'groupname':gName},
						success:function(data){
							console.log('Done');
							setTimeout(function(){
								$('#content').html('');
								$('#content').append('<div><button id="newgroup">Create new group</button></div><div id="grouplist"><ul id="groupsul" class="list-unstyled"></ul></div>')
								updategroups();
							},500);
						},
						error:function(data){
							console.log(data);
						}
					});
				}
				else{
					alert('Select atleast one user to form a group');
				}
			}
		});

		function updategroups(){
			$.ajax({
				url:'updategroups.php',
				type:'POST',
				success:function(data){
					if(JSON.parse(data).length== 0){
						$('#groupsul').html('');
						$('#groupsul').append($('<p>No groups. Create a group.</p>'))
					}
					else{
						var groups = JSON.parse(data);
						$('#groupsul').html('');
						for(var i=0;i<groups.length;i++){
							$('#groupsul').append($("<li class='"+ groups[i].groupName +"' '><div class='chat-body clearfix'><div class='header_sec'>"+groups[i].groupName+"</strong></div><div></div></div></li>"));
						}
					}
				},
				error:function(data){
					console.log(data);
				}
			});
		}

		function updategroup(groupname){
			groupSelected = groupname;
			$.ajax({
				url:'groupmembers.php',
				type:'POST',
				data:{'me':me,'groupname':groupSelected},
				success:function(data){
					$('.user').html($('<table><tr><td colspan="2"><div id="usergroupname"><h3 style:"margin-bottom:0px;">'+groupname+'</h3></td><td colspan="2" rowspan=2><div><i id="moreMessagesgroup" style="font-size:40px;" class="fa fa-arrow-circle-up" aria-hidden="true"></i><button class="btn dropdown-toggle type="button" id="removeusersbutton" data-toggle="dropdown"><i id="removeusers" class="fa fa-minus-square" aria-hidden="true"><span class="tooltiptext">Remove users</span></i></button><button class="btn dropdown-toggle type="button" id="addusersbutton" data-toggle="dropdown"><i id="addusers" class="fa fa-plus-square" aria-hidden="true"><span class="tooltiptext">Add users</span></i></button><button class="btn" type="button"><i id="deletegroup" class="fa fa-times" aria-hidden="true"><span class="tooltiptext">Delete group</span></i></button></div></td></tr></table><div id="groupmemberlist" style:"padding-right:100px;">'+data+'You</div>'));
				},
				error:function(data){
					console.log(data);
				}
			});
		}

		$(document.body).on('click','#content #groupsul li',function(){
			var groupname = $(this).find('.header_sec').text();
			updategroup(groupname);
			//<button style="height:30px;width:30px;background-color:transparent;border-radius:20px;margin:25px 20px 0px 0px; float:right" type="button" class="moreMessages"><i style="font-size:40px;" class="fa fa-arrow-circle-up" aria-hidden="true"></i></button>
			$('#sendBtn').attr('id','sendBtnGroup');
			$('#sendform').find('textarea').attr('id','sendGroup');
			updategroupmessages();
		});

		$(document.body).on('click','#sendBtnGroup',function(){
			submitmessagegroupclick();
		});

		function submitmessagegroupclick(){
			var message = $('#sendGroup').val();
			console.log(message);
			if($.trim(message).length==0){
				$('#sendGroup').val('');
			}
			else{
				$.ajax({
					url:'sendmessagegroup.php',
					type:'GET',
					data:{'groupname':groupSelected,'msg':message},
					success:function(data){
						$('#messages').html('');
						$('#sendGroup').val('');
						console.log('done');
						updategroupmessages();
						updateScrollinstant();
						//updaterecentlist();
					},
					error:function(data){
						console.log(data);
					}
				});
			}
		}

		$(document.body).on('keypress','#sendGroup',function(e){
			if(e.keyCode == 13){
				submitmessagegroupenter();
			}
		});

		function submitmessagegroupenter(){
			var message = $('#sendGroup').val();
			if($.trim(message).length!=0){
				$.ajax({
					url:'sendmessagegroup.php',
					type:'GET',
					data:{'groupname':groupSelected,'msg':message},
					success:function(data){
						$('#messages').html('');
						$('#sendGroup').val('');
						$('textarea').attr("placeholder","Enter your message");
						$('textarea').css({"background-color":"transparent"});
						updategroupmessages();
						updateScrollinstant();
						//updaterecentlist();
					},
					error:function(data){
						console.log(data);
					}
				});
			}
			else{
				$('#send').val('');
				$('#send').blur();
			}
		}

		var members = [];

		$(document.body).on('click','#modalList li',function(){
			if(!$(this).attr('data-toggled') || $(this).attr('data-toggled') == 'off'){
				$(this).attr('data-toggled','on');
				$(this).css({'background-color':'rgba(25,12,38,0.7)','border-color':'rgba(25,12,38,0.7)','color':'rgba(255,255,255,1)'});
				var name = $(this).text();
				if(members.length == 0){
					members.push(name);
					members.toString();
				}
				else{
					var toAdd = true;
					for(var i = 0;i<members.length;i++){
						if(members[i] == name)
							toAdd = false;
					}
					if(toAdd == true){
						members.push(name);
					}
				}
			}
			else if($(this).attr('data-toggled') == 'on'){
				$(this).attr('data-toggled','off');
				$(this).css({'background-color':'transparent','border-color':'rgba(25,12,38,0.8)','color':'rgba(25,12,38,0.8)'});
				var removename = $(this).text();
				var index = -1;
				for(var j=0;j<members.length;j++){
					if(members[j] == removename)
						index = j;
				}
				members.splice(index,1);
			}
		});

		//Adding users to a group
		function addusermodal(){
			var modal = document.getElementById('myModal2');
			modal.style.display = "block";
			modal.style.cursor = 'pointer';
			var span = document.getElementById("close2");
			span.onclick = function() { 
			    modal.style.display = "none";
			    mainMethod.addusersclicked = false;
			}
			window.onclick = function(event) {
			    if (event.target == modal) {
			        modal.style.display = "none";
			        mainMethod.addusersclicked = false;
			    }
			}
		}

		$('.user').on('click','#addusersbutton',function(){
			displayaddmodal();
		});
		
		function displayaddmodal(){
			if(mainMethod.addusersclicked==false){
				mainMethod.addusersclicked=true;
				var groupmemberarray = $('.user').find('#groupmemberlist').text();
				var memberarray = groupmemberarray.split(', ');
				$.ajax({
					url:'allusers.php',
					type:'post',
					success:function(data){
						$('#modalList').html('');
						$('#modalcontainer > #modaldescription').html('Add users to the group');
						$('#searchmodal').show();
						data = JSON.parse(data);
						if(data.length > memberarray.length-1){
							for(var i=0;i<data.length;i++){
							var inthegroup = false;
							var name = data[i].name;
							for(var j = 0;j<memberarray.length-1;j++){
								if(data[i].name == memberarray[j]){
									inthegroup = true;
								}
							}
							if(inthegroup == false){
								(function(i){
									var thisName = data[i].name;
									$.ajax({
										//async:false,
										url:'getimage.php',
										type:'POST',
										data:{'username':thisName},
										success:function(data2){
											$('#modalList').append('<li><img style="border-radius:50%;height:30px;width:30px;" src="userimages/'+data2+'">'+thisName+'</li>');
											addusermodal();	
										},
										error:function(){
											console.log(data2);
										}
									});
								})(i);
							}
						}
						$('#modalbutton').show();
						$('#modalbutton').html('<button type="submit" id="modaladdbutton">Add users</button>');
						}
						else{
							$('#modalcontainer >div').html('No more users to add');
							$('#modalbutton').hide();
							addusermodal();
						}
					}
				});
			}
		}

		$(document.body).on('click','#modalbutton #modaladdbutton',function(){
			var modal = $('#myModal2');
			console.log(groupSelected);
			$.ajax({
				url:'addtogroup.php',
				type:'post',
				data:{'groupname':groupSelected,'usernames':members},
				success:function(data){
					console.log(data);
				},
				error:function(data){
					console.log(data);
				}
			});
			updategroup(groupSelected);
			$('#modalcontainer > div').html('');
			$('#modalList').html('');
			$('#modalbutton').hide();
			$('#searchmodal').hide();
			for(var i=0;i<members.length;i++){
				$('#modalcontainer > div').html("<p style='text-decoration:none;'>Members added.</p>");
			}
			console.log(members);
			members = [];
		});

		function removeusermodal(){
			var modal = document.getElementById('myModal2');
			modal.style.display = "block";
			modal.style.cursor = 'pointer';
			var span = document.getElementById("close2");
			span.onclick = function() { 
			    modal.style.display = "none";
			}
			window.onclick = function(event) {
			    if (event.target == modal) {
			        modal.style.display = "none";
			    }
			}
		}

		$('.user').on('click','#removeusersbutton',function(){
			var removemembers = $('.user').find('#groupmemberlist').text().split(', ');
			$('#modalList').html('');
			$('#modalcontainer > #modaldescription').html('Remove users from the group');
			$('#searchmodal').hide();
			for(var i=0;i<removemembers.length-1;i++){
				(function(i){
					$.ajax({
						url:'getimage.php',
						type:'POST',
						data:{'username':removemembers[i]},
						success:function(data2){
							$('#modalList').append('<li><img style="border-radius:50%;height:30px;width:30px;" src="userimages/'+data2+'">'+removemembers[i]+'</li>');
							removeusermodal();	
						},
						error:function(){
							console.log(data2);
						}
					});
				})(i);
			}
			$('#modalbutton').show();
			$('#modalbutton').html('<button type="submit" id="modalremovebutton">Remove users</button>');
			console.log('Remove');
		});

		$(document.body).on('click','#modalbutton #modalremovebutton',function(){
			var modal = $('#myModal2');
			$.ajax({
				url:'removefromgroup.php',
				type:'post',
				data:{'groupname':groupSelected,'usernames':members},
				success:function(data){
					console.log(data);
				},
				error:function(data){
					console.log(data);
				}
			});
			updategroup(groupSelected);
			$('#modalcontainer > div').html('');
			$('#modalList').html('');
			$('#modalbutton').hide();
			$('#searchmodal').hide();
			for(var i=0;i<members.length;i++){
				$('#modalcontainer > div').html("<p style='text-decoration:none;'>Members removed.</p>");
			}
			members = [];
		});

		//Leave a group
		var groupDisplay = '';

		$(document.body).on('click','.user #deletegroup',function(){
			//$('#messages').html('');
			var group = $('.user').find('#usergroupname h3').text();
			$.ajax({
				url:'deletegroup.php',
				type:'post',
				data:{'groupname':group},
				success:function(data){
					console.log(data);
					$('.user').html('');
					$('#messages').html('');
					updategroups();
				},
				error:function(data){
					console.log(data);
				}
			});
		});

		//A up button on the user bar which adds old messages and also dynamically displays a downBtn in the bottom right corner of the chat section
		$(document.body).on('click','.user .moreMessages',function(){
			getNextMessages();
			$('#chatspace').animate({scrollTop:0},500);
			if(mainMethod.track > 7)
				$('#down').html($('<button type="button" id="downBtn"><i class="fa fa-arrow-circle-down" aria-hidden="true"></i></button>'));
		});

		//Invokes a function that updates messages every second
		update();
		function update(){
			setInterval(function(){
				updatenew();
			},1000);
		}

		//Function that updates new messages which are received after mainMethod.latest and also shows unread messages
		function updatenew(){
			$.ajax({
				url:'getmessages.php',
				type:'POST',
				data:{'user2':mainMethod.lastconvo},
				success:function(data){
					data = JSON.parse(data);
					dataLength = data.length;
					if(data.length > 0){
						$.ajax({
							url:'newmessages.php',
							type:'POST',
							dataType:'json',
							data:{'old':mainMethod.latest},
							success:function(data){
								var size = data.length;
								if(size > 0){
									if(recentBlink == true){
										recentBlink=false;
										$('#recentlabel').css('width','auto')
										$('#recentlabel').html('<i style="font-weight:normal" class="fa fa-clock-o" aria-hidden="true"></i>   Recent<i id="unreadradio" class="fa fa-circle" aria-hidden="true">')
									}
									list = $('#recentlist li');
									list.each(function(idx,li){
										var otherUsername = $(this).find('.header_sec').text();
										mainMethod.recenttrack[otherUsername] = true;
									});

									for(var i = 0;i<size;i++){
										if(mainMethod.lastconvo==data[i].messageFrom){
											if(mainMethod.lasttext!=data[i].message){
												mainMethod.latest = data[i].sentDate;
												mainMethod.lasttext = data[i].message;
												mainMethod.activenumber++;
												if(mainMethod.moreBoolean == true && mainMethod.activenumber == 1){
													
													$('#messages').append($('<button style="width:auto; height:30px;" id="morebutton"><span id="unreadactive">'+mainMethod.activenumber+'</span><i style="margin-left:4px;" class="fa fa-arrow-circle-down" aria-hidden="true"><hr></button>'));
													blink();
													mainMethod.moreBoolean = false;
												}
												if(mainMethod.moreBoolean == false && mainMethod.activenumber!=$('#morebutton').find('#unreadactive').text()){
													$('#morebutton').find('#unreadactive').text(mainMethod.activenumber);
												}
												$('#messages').append($('<div class="textbox"> <div class="lefttext"> <p>'+data[i].message+'</p> </div> </div><br><br><br><br>'));
											}
										}
										else{
											if(!mainMethod.recenttrack[data[i].messageFrom]){
												mainMethod.recenttrack[data[i].messageFrom] = true;
												$('#recentlist').prepend('<li  class='+data[i].messageFrom+'><div class="chat-body clearfix"><div class="header_sec">'+data[i].messageFrom+'</div></li>');
											}
											else{
												/*list = $("#recentlist li");
												var countnew = 0;
												list.each(function(idx,li){
													if(data[i].messageFrom == $(this).find('.header_sec').text()&&data[i].seen==0){
														countnew++;
														$(this).html('<div class="chat-body clearfix"><div class="header_sec">'+($(this).find('.header_sec').text())+'</div><span class="unreadnumber" style="color:white;font-size:14px;padding-left:20px;display:inline-block;float:left">'+countnew+' unread</span></div>');
													}
												});*/
												updaterecentlist();
											}
										}
									}
								}
							},
							error:function(data){
								console.log(data);
							}
						});
					}
				}
			});
		}

		function updategroupmessages(){
			$('#messages').html('');
			$.ajax({
				url:'getgroupmessages.php',
				type:'POST',
				data:{'group':groupSelected},
				success:function (data){
					data = JSON.parse(data);
					dataLength = data.length;
					if(data.length>0){
						if(dataLength){
							if(data.length>=mainMethod.number){
								mainMethod.track = 10;
								length = mainMethod.number;
								for(var i=length-1;i>=0;i--){
									if(data[i].messageFrom!=me){
										$('messages').html('');
										$('#messages').append($('<div class="textbox"><div class="lefttext"><div class="from">'+data[i].messageFrom+'</div> <p>'+data[i].message+'</p> </div> </div><br><br><br><br><br>'));
									}
									else{
										$('messages').html('');
										$('#messages').append($('<div class="textbox"> <div class="righttext"> <p>'+data[i].message+'</p> </div> </div><br><br><br><br><br>'));
									}
								}
							}
							else{
								length = data.length;
								mainMethod.track = length;
								for(var i=length-1;i>=0;i--){
									if(data[i].messageFrom!=me){
										$('messages').html('');
										$('#messages').append($('<div class="textbox"><div class="lefttext"><div class="from">'+data[i].messageFrom+'</div><p>'+data[i].message+'</p> </div> </div><br><br><br><br><br>'));
									}
									else{
										$('messages').html('');
										$('#messages').append($('<div class="textbox"> <div class="righttext"> <p>'+data[i].message+'</p> </div> </div><br><br><br><br><br>'));
									}
								}
							}
						}
						//updateScroll();
					}
					else{
						$('#messages').html('<div class="firstmessage"><h2 style="padding:30px;">Send a message to start a conversation with '+name+'</h2><div/>');
					}
				},
				error:function(data){
					console.log(data);
				}
			})
		}

		//Fetches all messages from database but display only 10 messages. Only 10 messsages because mainMethod.number is set to 10. That can be changed anytime.
		function updatemessages(){
			$('#messages').html(
				$.ajax({
					url:'getmessages.php',
					type:'POST',
					data:{'user2':mainMethod.lastconvo},
					success:function (data){
						data = JSON.parse(data);
						dataLength = data.length;
						if(data.length>0){
							if(dataLength){
								if(data.length>=mainMethod.number){
									mainMethod.track = 10;
									mainMethod.lastmessage = data[mainMethod.number-1].sentDate;
									if(mainMethod.latest < data[0].sentDate){
										mainMethod.latest = data[0].sentDate;
									}
									length = mainMethod.number;
									for(var i=length-1;i>=0;i--){
										if(data[i].messageFrom==mainMethod.lastconvo){
											$('messages').html('');
											$('#messages').append($('<div class="textbox"> <div class="lefttext"> <p>'+data[i].message+'</p> </div> </div><br><br><br><br>'));
										}
										else{
											$('messages').html('');
											$('#messages').append($('<div class="textbox"> <div class="righttext"> <p>'+data[i].message+'</p> </div> </div><br><br><br><br>'));
										}
									}
								}
								else{
									length = data.length;
									mainMethod.track = length;
									console.log(mainMethod.track);
									mainMethod.lastmessage = data[length-1].sentDate;
									if(mainMethod.latest < data[0].sentDate){
										mainMethod.latest = data[0].sentDate;
									}
									console.log(mainMethod.latest);
									for(var i=length-1;i>=0;i--){
										if(data[i].messageFrom==mainMethod.lastconvo){
											$('messages').html('');
											$('#messages').append($('<div class="textbox"> <div class="lefttext"> <p>'+data[i].message+'</p> </div> </div><br><br><br><br>'));
										}
										else{
											$('messages').html('');
											$('#messages').append($('<div class="textbox"> <div class="righttext"> <p>'+data[i].message+'</p> </div> </div><br><br><br><br>'));
										}
									}
								}
							}
							//updateScroll();
						}
						else{
							$('#messages').html('<div class="firstmessage"><h2 style="padding:30px;">Send a message to start a conversation with '+name+'</h2><div/>');
						}
					},
					error:function(data){
						console.log(data);
					}
				})
			);
		}

		function updatemessagesothers(){
			$('#messages').html(
				$.ajax({
					url:'getmessagesothers.php',
					type:'POST',
					data:{'user2':mainMethod.lastconvo},
					success:function (data){
						data = JSON.parse(data);
						dataLength = data.length;
						if(data.length>0){
							if(dataLength){
								if(data.length>=mainMethod.number){
									mainMethod.track = 10;
									mainMethod.lastmessage = data[mainMethod.number-1].sentDate;
									if(mainMethod.latest < data[0].sentDate){
										mainMethod.latest = data[0].sentDate;
									}
									length = mainMethod.number;
									for(var i=length-1;i>=0;i--){
										if(data[i].messageFrom==mainMethod.lastconvo){
											$('messages').html('');
											$('#messages').append($('<div class="textbox"> <div class="lefttext"> <p>'+data[i].message+'</p> </div> </div><br><br><br><br>'));
										}
										else{
											$('messages').html('');
											$('#messages').append($('<div class="textbox"> <div class="righttext"> <p>'+data[i].message+'</p> </div> </div><br><br><br><br>'));
										}
									}
								}
								else{
									length = data.length;
									mainMethod.track = length;
									console.log(mainMethod.track);
									mainMethod.lastmessage = data[length-1].sentDate;
									if(mainMethod.latest < data[0].sentDate){
										mainMethod.latest = data[0].sentDate;
									}
									console.log(mainMethod.latest);
									for(var i=length-1;i>=0;i--){
										if(data[i].messageFrom==mainMethod.lastconvo){
											$('messages').html('');
											$('#messages').append($('<div class="textbox"> <div class="lefttext"> <p>'+data[i].message+'</p> </div> </div><br><br><br><br>'));
										}
										else{
											$('messages').html('');
											$('#messages').append($('<div class="textbox"> <div class="righttext"> <p>'+data[i].message+'</p> </div> </div><br><br><br><br>'));
										}
									}
								}
							}
						}
						else{
							$('#messages').html('<div class="firstmessage"><h2 style="padding:30px;">Send a message to start a conversation with '+name+'</h2><div/>');
						}
					},
					error:function(data){
						console.log(data);
					}
				})
			);
		}

		//Works when the moreMessages button on the user bar is clicked. Total 10 older messages gets added everytime you click this. If you have less than 10 messages it will show them all
		function getNextMessages(){
			$.ajax({
				url:'getnextmessages.php',
				type:'POST',
				data:{'user2':mainMethod.lastconvo,'sentTime':mainMethod.lastmessage},
				success:function(data){
					data = JSON.parse(data);
					var newLength = data.length;
					mainMethod.extra = newLength;
					mainMethod.number = mainMethod.number + mainMethod.extra;
					if(newLength > 0){
						mainMethod.lastmessage = data[newLength - 1].sentDate;
						if(data.length>0){
							for(var i = 0;i<newLength;i++){
									if(data[i].messageFrom==mainMethod.lastconvo){
										$('messages').html('');
										$('#messages').prepend($('<div class="textbox"> <div class="lefttext"> <p>'+data[i].message+'</p> </div> </div><br><br><br><br>'));
									}
									else{
										$('messages').html('');
										$('#messages').prepend($('<div class="textbox"> <div class="righttext"> <p>'+data[i].message+'</p> </div> </div><br><br><br><br>'));
									}
								}
						}
					}
					else{
						mainMethod.extra = 0;
						mainMethod.number = mainMethod.number + mainMethod.extra;
						console.log(mainMethod.number);
					}
				},
				error:function(data){
					console.log(data);
				}
			});
		}

		initialsubmit();
		function initialsubmit(){
			if(mainMethod.lastconvo!=''){
				updatemessages();
			}
			else{
				$('.user').html('<div><p style="padding-top:7px;text-align:center; color:rgba(25,12,38,1); margin-top:15px;">No conversations yet</p></div>');
			}
		}

		//Both the functions are used to scroll to the bottom of the chat section page
		//Slow : Used when the downBtn is clicked
		function updateScroll(){
			$("#chatspace").animate({ scrollTop: $('#chatspace').prop("scrollHeight")}, 500);
		}

		//Fast : Used when you are directed to a new user when you click on the result of any list (Recent, Online, All, Search)
		function updateScrollinstant(){
			$("#chatspace").animate({ scrollTop: $('#chatspace').prop("scrollHeight")}, 100);
		}

		//Desktop Notifications (unused)
		document.addEventListener('DOMContentLoaded',function(){
			if(!Notification){
				alert('Notifications not supported');
				return;
			}
			if(Notification.permission!=='granted')
				Notification.requestPermission();
		});

		//Function to send desktop notifications (unused)
		function notifyMe(){
			if(Notification.permission!=='granted')
				Notification.requestPermission();
			else{
				var notification = new Notification('New messages',{
					body:"Hey! You have new messages"
				});
				notification.onclick = function(){
					mainMethod.notificationbox = 0;
					window.open('mainchat.php');
					setTimeout(function(){
						notification.close();
					},1000);
				};
			}
		}

		//A small button which appears dynamically when .moreMessages button is clicked. This button scrolls to the bottom of the chat section
		$(document.body).on('click','#downBtn',function(){
			$("#chatspace").animate({ scrollTop: $('#chatspace').prop("scrollHeight")}, 500);
		});

		//This function that helps the number of new messages received button blink
		var blink = function() {
	    	$('#morebutton').animate({
		        opacity: '0'
		    }, function(){
		        $(this).animate({
		            opacity:'1'
		        }, blink);
		    });
		}

		//A small button which appears when the person you are talking with sends a message. This appears after the last message that you received/sent and blinks until it gets clicked.
		$(document.body).on('click','#chatspace #morebutton',function(){
			updatemessagesothers();
			mainMethod.activenumber = 0;
			$('#morebutton').remove();
			updaterecentlist();
			mainMethod.moreBoolean = true;
			$("#chatspace").animate({ scrollTop: $('#chatspace').prop("scrollHeight")}, 500);
		});

		//Changes the CSS of typing area on click
		$('textarea').click(function(){
			$(this).css({"background-color":"rgba(255,225,230,0.1)","color":"#fff"});
		});

		//Changes the CSS while it is inactive
		$('textarea').blur(function(){
			$(this).css({"background-color":"transparent"});
			$(this).attr("placeholder","Enter your message");
		});

		//Invokes a function which writes messages to database on clicking the send button
		$(document.body).on('click','#sendBtn',function(){
			if(!mainMethod.lastconvo){
				('#send').val('');
				alert('Select a person whom you want to talk with');
			}
			else{
				submitmessageclick();
			}
		});

		//Writes messages to the database on pressing send button
		function submitmessageclick(){
			var message = $('#send').val();
			console.log(message);
			console.log(mainMethod.lastconvo);
			if($.trim(message).length==0){
				$('#send').val('');
			}
			else{
				$.ajax({
					url:'sendmessage.php',
					type:'GET',
					data:{'user2':mainMethod.lastconvo,'msg':message},
					success:function(data){
						$('#messages').html('');
						$('#send').val('');
						updatemessages();
						updateScrollinstant();
						updaterecentlist();
					},
					error:function(data){
						console.log(data);
					}
				});
			}
		}
	
		//Invokes a function which writes messages to database on clicking the enter key
		$(document.body).on('keypress','#send',function(e){
			if(e.keyCode == 13){
				if(!mainMethod.lastconvo){
					('#send').val('');
					alert('Select a person whom you want to talk with');
				}
				else{
					submitmessageenter();
				}
			}
		});

		//Writes message to database on pressing enter key
		function submitmessageenter(){
			var message = $('#send').val();
			console.log(message);
			console.log(mainMethod.lastconvo);
			if($.trim(message).length!=0){
				$.ajax({
					url:'sendmessage.php',
					type:'GET',
					data:{'user2':mainMethod.lastconvo,'msg':message},
					success:function(data){
						$('#messages').html('');
						$('#send').val('');
						$('textarea').attr("placeholder","Enter your message");
						$('textarea').css({"background-color":"transparent"});
						updatemessages();
						updateScrollinstant();
						updaterecentlist();
					},
					error:function(data){
						console.log(data);
					}
				});
			}
			else{
				$('#send').val('');
				$('#send').blur();
			}
		}
	}
	mainMethod.activenumber = 0;

	//A dictionary which checks whether a user is already present in the recentlist. If true then it does not add it again. If false it adds it and changes the value to true
	mainMethod.recenttrack = {};

	//To get the name of the person you had the last conversation with to display in the chat section.On refresh this is set to the person who last sent you a message or you sent somebody.
	//This gets updated when you click on any users from the list of the radio buttons.
	mainMethod.lastconvo = $('.user #name').text();

	//This is a track of the first message that appears on the screen of the recent user. getNextmessages() send this data to retrieve messages which are less than the timestamp of this
	mainMethod.lastmessage = 0;

	//This is a track of the timestamp of the last message that you have seen
	mainMethod.latest = 0;

	//Number of messages that updatemessages() should make show
	mainMethod.number = 10;

	//Number of messages that updatenew
	mainMethod.extra = 0;

	//This checks whether the blinking moremessages is present on the page. If it is this stops it from adding another one.
	mainMethod.moreBoolean = true;

	//unused
	mainMethod.notificationbox = 0;

	mainMethod.tab ='recent';
	mainMethod.addusersclicked = false;

	//This stores the last text that you have seen from others. This gets updated when you either click on the blinking button moremessages or when a user has unread messages in the 
	//recentlist and you click on it
	mainMethod.lasttext = $('.textbox:last-child').text();
	var one = new mainMethod;
});


//Can be used

/*$.ajax({
	url:'mygroups.php',
	type:'POST',
	success:function(data){
		$('.user').html('');
		groupDisplay = data;
		if(groupDisplay.length > 0){
			$.ajax({
				url:'groupmembers.php',
				type:'POST',
				data:{'me':me,'groupname':groupDisplay},
				success:function(data){
					console.log(data.length);
					$('.user').html($('<table><tr><td colspan="2"><div id="usergroupname"><h3 style:"margin-bottom:0px;">'+groupDisplay+'</h3></td><td colspan="2" rowspan=2><div><i id="moreMessagesgroup" style="font-size:40px;" class="fa fa-arrow-circle-up" aria-hidden="true"></i><i id="removeusers" class="fa fa-minus-square" aria-hidden="true"><span class="tooltiptext">Remove users</span></i><i id="addusers" class="fa fa-plus-square" aria-hidden="true"><span class="tooltiptext">Add users</span></i><i id="deletegroup" class="fa fa-times" aria-hidden="true"><span class="tooltiptext">Delete group</span></i></div></td></tr><tr style:"padding-right:100px;"><td colspan="3">'+data+'You</td></tr></table>'));
					$.ajax({
						url:'getgroupmessages.php',
						type:'POST',
						data:{'group':groupDisplay},
						success:function (data){
							data = JSON.parse(data);
							dataLength = data.length;
							if(data.length>0){
								if(dataLength){
									if(data.length>=mainMethod.number){
										mainMethod.track = 10;
										length = mainMethod.number;
										for(var i=length-1;i>=0;i--){
											if(data[i].messageFrom!=me){
												$('messages').html('');
												$('#messages').append($('<div class="textbox"><div class="lefttext"><div class="from">'+data[i].messageFrom+'</div> <p>'+data[i].message+'</p> </div> </div><br><br><br><br><br>'));
											}
											else{
												$('messages').html('');
												$('#messages').append($('<div class="textbox"> <div class="righttext"> <p>'+data[i].message+'</p> </div> </div><br><br><br><br><br>'));
											}
										}
									}
									else{
										length = data.length;
										mainMethod.track = length;
										for(var i=length-1;i>=0;i--){
											if(data[i].messageFrom!=me){
												$('messages').html('');
												$('#messages').append($('<div class="textbox"><div class="lefttext"><div class="from">'+data[i].messageFrom+'</div><p>'+data[i].message+'</p> </div> </div><br><br><br><br><br>'));
											}
											else{
												$('messages').html('');
												$('#messages').append($('<div class="textbox"> <div class="righttext"> <p>'+data[i].message+'</p> </div> </div><br><br><br><br><br>'));
											}
										}
									}
								}
								//updateScroll();
							}
						},
						error:function(data){
							console.log(data);
						}
					})
				},
				error:function(data){
					console.log(data);
				}
			});
		}
		else{
			$('.user').html('');
			$('#messages').html('<div class="firstmessage"><h2 style="padding:30px;">Create a group</h2><div/>');
		}
		setTimeout(function(){
			a();
		},500);
	},
	error:function(data){
		console.log(data);
	}
});*/