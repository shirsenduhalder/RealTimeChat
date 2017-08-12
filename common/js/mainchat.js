var idleTime = 0;
$('document').ready(function(){
	//Uncomment this for the autologout feature
	/*var idleInterval = setInterval(timerIncrement, 60000); // 1 minute

    //Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        idleTime = 0;
    });
    function timerIncrement() {
	    idleTime = idleTime + 1;
	    if (idleTime > 15) { // 15 minutes
	        window.location.replace('/Chat/php/logout.php');
	    }
	}*/

	//Focus on the textarea when document is loaded
	if($('#send').length > 0){
		$('#send').focus();
	}

	//Setting window name for notifications
	window.name='index';

	function mainMethod(){
		//Username
		var me = $('#me').text();

		//mainMethod.lastconvo is the last person who had a conversation with. Value is retreived from database.
		//Initially checks Checks whether mainMethod.lastconvo exists every 0.1s. If it does then it displays .send
		setInterval(function(){
			if(!mainMethod.lastconvo){
				$('.send').hide();
			}
			else{
				$('.send').show();
			}
		},100);

		//recentBlink is the boolean for the recentradio button
		var recentBlink = false;
		//groupBlink is the boolean for the groupradio button
		var groupBlink = true;
		//groupchatspace is the boolean for the chatspace to set to group mode
		var groupchatspace = false;

		//Function to refresh list of recent conversations when you did not receive or sent a single message
		if(mainMethod.lastconvo==''){
			setInterval(function(){
				if(mainMethod.lastconvo==''){
					updaterecentlist();
				}
			},1000)
		}
		var intervalarr = new Array();

		//group modal function
		$(document.body).on('click','#modalcontainer',function(){
			$('#inputmodal').val('');
		});

		//group add users modal search invoker
		$('#inputmodal').keyup(function(e){
			if(e.keyCode<=1000){
				if($.trim($('#inputmodal').val())!=''){
					$('#modalList').html('');
					searchmodal();
				}
				else{
					addall();
					$('#inputmodal').val('');
				}
			}
		});

		//group add users modal search function
		function searchmodal(){
			var memberarray = $('.user').find('#groupmemberlist').text().split(', ');
			var str = $('#inputmodal').val();
			$.ajax({
				url:'/Chat/php/modalsearch.php',
				type:'post',
				data:{'search':str},
				success:function(data){
					data = JSON.parse(data);
					if(data.length > 0){
						$('#modalList').html('');
						for(var i=0;i<data.length;i++){
							var inthegroup = false;
							var name = data[i].name;
							for(var j = 0;j<memberarray.length-1;j++){
								if(name == memberarray[j]){
									inthegroup = true;
								}
							}
							if(inthegroup == false){
								(function(i){
									var thisName = data[i].name;
									$.ajax({
										//async:false,
										url:'/Chat/php/getimage.php',
										type:'POST',
										data:{'username':thisName},
										success:function(data){
											$('#modalList').append('<li><img style="border-radius:50%;height:30px;width:30px;" src="/Chat/common/images/userimages/'+data+'">'+thisName+'</li>');
											//addusermodal();	
										},
										error:function(){
											console.log(data2);
										}
									});
								})(i);
							}
						}
					}
					else{
						$('#modalcontainer > #modaldescription').html('No such user');
						$('#modalbutton').hide();
						//addusermodal();
					}
				}
			});
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
			mainMethod.lastconvo = $(this).text(); //last conversation person
			groupchatspace = false; //groupchatspace boolean
			mainMethod.groupchatspace = 0;
			$('#sendform').find('button').attr('id','sendBtn');
			$('#sendform').find('textarea').attr('id','send');
			var imagepath='';
			$.ajax({
				url:'/Chat/php/getimage.php',
				type:'POST',
				data:{'username':mainMethod.lastconvo},
				success:function(data){
					imagepath = '/Chat/common/images/userimages/'+data;
					console.log(imagepath);
					$('.user').html($('<img src="'+imagepath+'"><p id="name">'+mainMethod.lastconvo+'</p><i id="moreMessages" class="fa fa-arrow-circle-up" aria-hidden="true"></i></button>'));
				},
			});
			updatemessages();
			$("#chatspace").animate({ scrollTop: $(document).height() }, 100);
  			return false;
			$('#result').html('');
			$('#send').focus();
		});

		//Searches the users from the database and displays a list
		function search(){
			var title = $("input[name='searchBox']").val();
			if(title!=''){
				$.ajax({
					url:'/Chat/php/search.php',
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
				url:'/Chat/php/recent.php',
				dataType:'json',
				success:function(data){
					$('#recentlist').html('');
					var names = [];
					for(var i=0;i<data.length;i++){
						if(data[i].name){
							if(i==0)
								names.push(data[i]);
							else{
								var check = false;
								for(var j=0;j<names.length;j++){
									if(names[j].name==data[i].name){
										check = true;
									}
								}
								if(check==false)
									names.push(data[i]);
							}
						}
						else{
							data[i]['unread'] = 0;
							names.push(data[i]);
						}
					}
					//console.log(names);
					$.ajax({
						url:'/Chat/php/recentdisplay.php',
						type:'POST',
						data:{'unorderednames':JSON.stringify(names)},
						success:function(data){
							data = JSON.parse(data);
							//$('#recentlist').html(data);
							//console.log(data[0].name);
							for(var i=0;i<data.length;i++){
								if(data[i].groupName){
									if(data[i].unread>0){
										$('#recentlist').append($("<li  class='"+data[i].groupName+"'><div class='chat-body clearfix'><div class='header_sec'><i  class='fa fa-users' aria-hidden='true'></i>"+data[i].groupName+"</div><span class='unreadnumber' style='color:white;font-size:14px;padding-left:20px;display:inline-block;float:left'>"+data[i].unread+" unread</span><div></li>"));
									}
									else{
										$('#recentlist').append($('<li  class="'+data[i].groupName+'"><div class="chat-body clearfix"><div class="header_sec"><i  class="fa fa-users" aria-hidden="true"></i>'+data[i].groupName+'</div><div></li>'));
									}
								}
								else{
									if(data[i].unread > 0){
										$('#recentlist').append($('<li  class="'+data[i].name+'"><div class="chat-body clearfix"><div class="header_sec">'+data[i].name+'</div><span class="unreadnumber" style="color:white;font-size:14px;padding-left:20px;display:inline-block;float:left">'+data[i].unread+' unread</span><div></li>'));
									}
									else{
										$('#recentlist').append($('<li  class="'+data[i].name+'"><div class="chat-body clearfix"><div class="header_sec">'+data[i].name+'</div><div></li>'));
									}
								}
							}
						}
					});
					//$('#recentlist').html('<li>'+names+'</li>');
				},
				error:function(data){
					console.log(data);
				}
			});
		}

		//Invokes a function that displays the list of recent users/groups you had a conversation with
		$('#recentradio').click(function(){
			mainMethod.tab = 'recent';
			recentBlink = false;
			groupBlink = true;
			$('#recentlabel').html("<i style='font-weight:normal' class='fa fa-clock-o' aria-hidden='true'></i>")
			$('#content').html('');
			$('#content').html('<div> <div id="recent"> <div id="mainrecent"> <ul id="recentlist" class="list-unstyled"> </ul> </div> </div> </div>');				
			updaterecentlist();
		});

		//If you click on any person from the recentlist, the mainMethod.lastconvo is updated and the user bar takes to the chat history of this person
		$(document.body).on('click','#content #recent #recentlist li',function(event){
			if($(this).find('.header_sec > i').length==0){
				mainMethod.lastconvo = $(this).find('.header_sec').text();
				$('#sendform').find('button').attr('id','sendBtn');
				$('#sendform').find('textarea').attr('id','send');
				mainMethod.groupchatspace = 0;
				groupchatspace = false;
				console.log($(this).find('.header_sec').text());
				$(this).html('<div class="chat-body clearfix"><div class="header_sec">'+($(this).find('.header_sec').text())+'</strong><span style="float:right" class="badge"></div><div>');
				$.ajax({
					url:'/Chat/php/getimage.php',
					type:'POST',
					data:{'username':mainMethod.lastconvo},
					success:function(data){
						$('.user').html($('<img src="/Chat/common/images/userimages/'+data+'"><p id="name">'+mainMethod.lastconvo+'</p><i id="moreMessages" class="fa fa-arrow-circle-up" aria-hidden="true"></i></button>'));
					}
				});
				updatemessagesothers();
				mainMethod.number = 10;
				$("#chatspace").animate({ scrollTop: $(document).height() }, 100);
				$('#send').focus();
	  			return false;
				intervalarr.forEach( clearInterval );
			}
			else{
				mainMethod.groupchatspace = 1;
				mainMethod.activenumbergroup = 0;
				mainMethod.groupmorebutton = true;
				mainMethod.foroldgroupmessages = 0;
				var groupname = $(this).find('.header_sec').text();
				updategroup(groupname);
				groupchatspace = true;
				mainMethod.grouptimestamp = 0;
				$.ajax({
					url:'/Chat/php/updategrouplastseen.php',
					type:'post',
					data:{'groupname':mainMethod.groupSelected},
					success:function(data){
						console.log(data);
					}
				});
				updaterecentlist();
				$.ajax({
					url:'/Chat/php/getgrouplastseen.php',
					type:'POST',
					data:{'groupname':mainMethod.groupSelected},
					success:function(data){
						mainMethod.lastseengroup = data;
						$.ajax({
							url:'/Chat/php/getgroupmessages.php',
							type:'POST',
							data:{'group':mainMethod.groupSelected,'seenDate':mainMethod.lastseengroup},
							success:function (data){
								data = JSON.parse(data);
								$('#messages').html('');
								dataLength = data.length;
								if(mainMethod.groupchatspace > 0){
									if(data.length>0){
										mainMethod.lasttext = data[data.length-1].message;
										if(dataLength){
											if(data.length>=mainMethod.number){
												mainMethod.track = 10;
												length = mainMethod.number;
												mainMethod.foroldgroupmessages = data[data.length -length].sentDate;
												for(var i=data.length-length;i<data.length;i++){
													if(data[i].messageFrom!=me){
														date = data[i].sentDate;
														var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
														if(isUrl(data[i].message)){
															encodeURI(data[i].message);
															$('#messages').append($('<div class="textbox"> <div class="lefttext"> <div class="from">'+data[i].messageFrom+'</div><p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a></p> <span class="time">'+formatted+'</span></div> </div><br>'));
														}
														else
															$('#messages').append($('<div class="textbox"> <div class="lefttext"> <div class="from">'+data[i].messageFrom+'</div><p>'+data[i].message+'</p> <span class="time">'+formatted+'</span></div> </div><br>'));
													}
													else{
														date = data[i].sentDate;
														var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
														if(isUrl(data[i].message)){
															encodeURI(data[i].message);
															$('#messages').append($('<div class="textbox"> <div class="righttext"> <p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a></p><span class="time">'+formatted+'</span> </div> </div><br>'));
														}
														else
															$('#messages').append($('<div class="textbox"> <div class="righttext"> <p>'+data[i].message+'</p><span class="time">'+formatted+'</span> </div> </div><br>'));
													}
												}
											}
											else{
												length = data.length;
												mainMethod.track = length;
												mainMethod.foroldgroupmessages = data[0].sentDate;
												for(var i=0;i<data.length;i++){
													if(data[i].messageFrom!=me){
														date = data[i].sentDate;
														var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
														if(isUrl(data[i].message)){
															encodeURI(data[i].message);
															$('#messages').append($('<div class="textbox"> <div class="lefttext"> <div class="from">'+data[i].messageFrom+'</div><p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a></p> <span class="time">'+formatted+'</span></div> </div><br>'));
														}
														else
															$('#messages').append($('<div class="textbox"> <div class="lefttext"> <div class="from">'+data[i].messageFrom+'</div><p>'+data[i].message+'</p> <span class="time">'+formatted+'</span></div> </div><br>'));
													}
													else{
														date = data[i].sentDate;
														var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
														$('#messages').append($('<div class="textbox"> <div class="righttext"> <p>'+data[i].message+'</p><span class="time">'+formatted+'</span> </div> </div><br>'));
													}
												}
											}
										}
									}
								}
								setInterval(function(){
									$.ajax({
										url:'/Chat/php/getgrouplastseen.php',
										type:'POST',
										data:{'groupname':mainMethod.groupSelected},
										success:function(data){
											mainMethod.lastseengroup = data;
											$.ajax({
												url:'/Chat/php/getgroupnewmessages.php',
												type:'POST',
												data:{'group':mainMethod.groupSelected,'seenDate':mainMethod.lastseengroup},
												success:function (data){
													data = JSON.parse(data);
													dataLength = data.length;
													if(($('.user').find('#groupmemberlist').text().length > 0)){
														if(data.length>0 && mainMethod.grouptimestamp < data[0].sentDate){
															for(var i=data.length-1;i>=0;i--){
																if($('.user').find('#usergroupname').text()==data[i].groupName){
																	if(mainMethod.grouptimestamp<data[i].sentDate){
																		mainMethod.grouptimestamp = data[i].sentDate;
																		mainMethod.activenumbergroup++;
																		if(mainMethod.groupmorebutton == true &&  mainMethod.activenumbergroup== 1){
																			$('#messages').append('<button id="groupmore"><span id="groupunread">'+mainMethod.activenumbergroup+'</span> Unread</button>');
																			mainMethod.groupmorebutton = false;
																		}
																		if(mainMethod.groupmorebutton == false && mainMethod.activenumbergroup!=$('#groupmore').find('#groupunread').text()){
																			$('#groupmore').find('#groupunread').text(mainMethod.activenumbergroup);
																		}
																		date = data[i].sentDate;
																		var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
																		if(isUrl(data[i].message)){
																			encodeURI(data[i].message);
																			$('#messages').append($('<div class="textbox"> <div class="lefttext"><div class="from">'+data[i].messageFrom+'</div> <p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a></p> <span class="time">'+formatted+'</span></div> </div><br>'));
																		}
																		else
																			$('#messages').append($('<div class="textbox"> <div class="lefttext"><div class="from">'+data[i].messageFrom+'</div> <p>'+data[i].message+'</p> <span class="time">'+formatted+'</span></div> </div><br>'));
																	}
																}
															}
														}
													}
												},
												error:function(data){
													console.log(data);
												}
											});
										},
										error:function(data){
											console.log(data);
										}
									});
								},1000);
							},
							error:function(data){
								console.log(data);
							}
						});
					},
					error:function(data){
						console.log(data);
					}
				});
					if(groupchatspace == true){
						$("#chatspace").animate({ scrollTop: $('#chatspace').prop("scrollHeight")}, 300);
					}
				$('#sendBtn').attr('id','sendBtnGroup');
				$('#sendform').find('textarea').attr('id','sendGroup');
				$('#sendGroup').focus();
				}
		});
		updateScroll();

		//function to display the list of online users when clicked on the online radio
		onlineusers();
		function onlineusers(){
			$("#onlineradio").click(function(){
				mainMethod.tab = 'online';
				recentBlink = true;
				groupBlink = true;
				$.ajax({
					url:'/Chat/php/onlineusers.php',
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
										url:'/Chat/php/getimage.php',
										type:'POST',
										data:{'username':thisName},
										success:function(data2){
											$('#showusers').append($("<li class='"+ thisName +"' '><div class='chat-body clearfix'><div class='header_sec'><img style='margin-right:7px;margin-bottom:3px;height:30px;width:30px;border-radius:15px;' src='/Chat/common/images/userimages/"+data2+"'></img>"+thisName+"</strong><i style='font-size:16px; margin-right:5px;float:right; color:#32CD32' class='onlineicon fa fa-circle' aria-hidden='true'></i></div><div></div></div></li>"));
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

		//function to display the list of all users when clicked on the all radio
		allusers();
		function allusers(){
			$("#allradio").click(function(){
				recentBlink = true;
				groupBlink = true;
				mainMethod.tab = 'all';
				$.ajax({
					url:'/Chat/php/allusers.php',
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
										url:'/Chat/php/getimage.php',
										type:'POST',
										data:{'username':thisName},
										success:function(data2){
											$('#showusers').append($("<li class='"+ thisName +"' '><div class='chat-body clearfix'><div class='header_sec'><img style='margin-right:7px;margin-bottom:3px;height:30px;width:30px;border-radius:15px;' src='/Chat/common/images/userimages/"+data2+"'></img>"+thisName+"</strong></div><div></div></div></li>"));
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

		//If you click on any person from the contactlist, the mainMethod.lastconvo is updated and the chatspace is updated with conversation with this person
		$(document.body).on('click','#content #contactlist #showusers li',function(event){
			mainMethod.lastconvo = $(this).attr('class');
			recentBlink = true;
			groupBlink = true;
			groupchatspace = false;
			mainMethod.groupchatspace = 0;
			$('#sendform').find('button').attr('id','sendBtn');
			$('#sendform').find('textarea').attr('id','send');
			console.log(mainMethod.lastconvo);
			$.ajax({
				url:'/Chat/php/getimage.php',
				type:'POST',
				data:{'username':mainMethod.lastconvo},
				success:function(data){
					$('.user').html($('<img src="/Chat/common/images/userimages/'+data+'"> <p id="name">'+mainMethod.lastconvo+'</p><i id="moreMessages" class="fa fa-arrow-circle-up" aria-hidden="true"></i>'));
				}
			});
			updatemessages();
			mainMethod.number = 10;
			$('#send').focus();
			$("#chatspace").animate({ scrollTop: $(document).height() }, 100);
  			return false;
			console.log(mainMethod.number);
	
		});

		//Invokes a function that updates the group tab every one second. 
		updategrouptab();
		function updategrouptab(){
			setInterval(function(){
				updategroupsradio();
			},1000);
		}

		//Function(groupradio): If there are unread messages, a black label with number of unread messages is displayed
		function updategroupsradio(){
			$.ajax({
				url:'/Chat/php/unreadgroup.php',
				type:'post',
				success:function(data){
					data = parseInt(data);
					if(data>0 && groupBlink == true){
						$('#groupslabel').css('width','auto')
						$('#groupslabel').html('<i style="font-weight:normal" class="fa fa-users" aria-hidden="true"></i><span class="w3-badge w3-black unreadradio1">'+data+'</span>')
					}
					else{
						$('#groupslabel').html('<i style="font-weight:normal" class="fa fa-users" aria-hidden="true"></i>')
					}
				}
			});
		}

		//This function updates the number of unread messages in the title bar
		setInterval(function(){
			$.ajax({
				url:'/Chat/php/unreadprivate.php',
				success:function(data){
					mainMethod.totalunreadprivate =parseInt(data);;
				}
			});
			$.ajax({
				url:'/Chat/php/unreadgroup.php',
				success:function(data){
					parseInt(data);
					mainMethod.totalunreadgroup =parseInt(data);;
				}
			});
			var unreadtotal = mainMethod.totalunreadgroup+mainMethod.totalunreadprivate;
			if(unreadtotal > 0){
				$('title').text('('+unreadtotal+') Main chat');
			}
			if(unreadtotal==0){
				$('title').text('Main chat');
			}
		},1000)

		//Invokes a function that updates the recent tab every one second. 
		updaterecenttab();
		function updaterecenttab(){
			setInterval(function(){
				updaterecentradio();
			},1000);
		}

		//Function(recentradio): If there are unread messages, a black label with number of unread messages is displayed
		function updaterecentradio(){
			$.ajax({
				url:'/Chat/php/newmessagetab.php',
				type:'post',
				success:function(data){
					if(data>0 && recentBlink == true){
						$('#recentlabel').css('width','auto');
						$.ajax({
							url:'/Chat/php/unreadprivate.php',
							success:function(data){
								var unreadprivate = data;
								$('#recentlabel').html('<i style="font-weight:normal" class="fa fa-clock-o" aria-hidden="true"></i><span class="unreadradio1 w3-badge w3-black">'+unreadprivate+'</span>');
							}
						});
					}
				}
			});
		}

		//updates groupseen notification in the database to seen
		$(document.body).on('click','#content #groupnotification',function(){
			$(this).hide();
			$.ajax({
				url:'/Chat/php/groupseenupdate.php',
				success:function(data){
					console.log(data);
				},
				error:function(data){
					console.log(data);
				}
			});
		})

		//updates the groupsul. Displays the list of groups a user is a part of
		$('#groupsradio').click(function(){
			mainMethod.tab = 'groups';
			recentBlink = true;
			groupBlink = false;
			$('#content').html('');
			$('#content').append('<div id="groupnotification"><div></div><button id="newgroup">Create new group</button></div><div id="grouplist"><ul id="groupsul" class="list-unstyled"></ul></div>')
			$.ajax({
				url:'/Chat/php/groupseen.php',
				type:'post',
				success:function(data){
					data = JSON.parse(data);
					var unseengroups = '';
					if(data.length>0){
						for(var i=0;i<data.length;i++){
							if(i==data.length - 1){
								unseengroups = unseengroups + data[i].groupName;
							}
							else{
								unseengroups = unseengroups + data[i].groupName + ', ';
							}
						}
						$('#groupnotification').html($('<div id="groupbox" class="alert alert-success alert-dismissable fade in">New groups: '+unseengroups+'</div>'));
					}
				}
			});
			//setInterval(function(){
				$.ajax({
					url:'/Chat/php/updategroups.php',
					type:'POST',
					success:function(data){
						if(JSON.parse(data).length== 0){
							$('#groupsul').html('');
							$('#groupsul').append($('<p>No groups. Create a group.</p>'));
						}
						else{
							var groups = JSON.parse(data);
							$('#groupsul').html('');
							for(var i=0;i<groups.length;i++){
								if(groups[i].unread > 0)
									$('#groupsul').append($("<li class='"+ groups[i].groupName +"' '><div class='chat-body clearfix'><div class='header_sec'><i  class='fa fa-users' aria-hidden='true'></i>"+groups[i].groupName+"</strong></div><span id='groupsunread'>"+groups[i].unread+" unread</span><div></div></div></li>"));
								else
									$('#groupsul').append($("<li class='"+ groups[i].groupName +"' '><div class='chat-body clearfix'><div class='header_sec'><i  class='fa fa-users' aria-hidden='true'></i>"+groups[i].groupName+"</strong></div><div></div></div></li>"));
							}
						}
					},
					error:function(data){
						console.log(data);
					}
				});
			//},500);
		});
		
		//array for the list of groupmembers used while creating a new group
		var groupmembers = [];

		//Displaying the list of users you can add to a particular group
		$(document.body).on('click','#content #newgroup',function(){
			$(this).remove();
			$('#content').html('');
			groupmembers.splice(0,groupmembers.length)
			console.log(groupmembers);
			$('#content').append('<section class="groupnamecontainer"> <div class="groupnameinput"> <input id="groupname" type="text" class="form-control" placeholder="Enter the name of group" name="groupname" required /> </div> <div class="groupnamebutton"> <button type="button" type="submit" name="groupnamebutton" id="groupnamebutton"><i id="groupsendicon" class="fa fa-telegram" aria-hidden="true"></i></button> </div></section>')	
			$.ajax({
				url:'/Chat/php/allusers.php',
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
									url:'/Chat/php/getimage.php',
									type:'POST',
									data:{'username':thisName},
									success:function(data2){
										$('#showgroupusers').append($("<li class='"+ thisName +"' '><div class='chat-body clearfix'><div class='header_sec'><img style='border: 1px solid rgba(229,0,101,1);margin-right:7px;margin-bottom:3px;height:30px;width:30px;border-radius:15px;' src='/Chat/common/images/userimages/"+data2+"'></img>"+thisName+"</strong></div><div></div></div></li>"));
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

		//actions to select the users of a group. This updates the groupmember array
		$(document.body).on('click','#content #grouplist #showgroupusers > li',function(){
			if(!$(this).attr('data-toggled') || $(this).attr('data-toggled') == 'off'){
				$(this).attr('data-toggled','on');
				$(this).css({'background-color':'rgba(229,0,101,0.7)','border-color':'rgba(229,0,101,0.7)','color':'rgba(255,255,255,1)'});
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
				$(this).css({'background-color':'transparent','border-color':'rgba(229,0,101,0.8)','color':'rgba(229,0,101,0.8)'});
				var removename = $(this).attr('class');
				var index = -1;
				for(var j=0;j<groupmembers.length;j++){
					if(groupmembers[j] == removename)
						index = j;
				}
				groupmembers.splice(index,1);
			}
		});
		
		//On clicking the groupnamebutton the database gets updated and the group list also is updated
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
						url:'/Chat/php/creategroup.php',
						type:'POST',
						data:{'members':mems,'groupname':gName},
						success:function(data){
							console.log('Done');
							setTimeout(function(){
								$('#content').html('');
								$('#content').append('<div><button id="newgroup">Create new group</button></div><div id="grouplist"><ul id="groupsul" class="list-unstyled"></ul></div>')
								$.ajax({
									url:'/Chat/php/updategroups.php',
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
												if(groups[i].unread > 0)
													$('#groupsul').append($("<li class='"+ groups[i].groupName +"' '><div class='chat-body clearfix'><div class='header_sec'><i  class='fa fa-users' aria-hidden='true'></i>"+groups[i].groupName+"</strong></div><span id='groupsunread'>"+groups[i].unread+" unread</span><div></div></div></li>"));
												else
													$('#groupsul').append($("<li class='"+ groups[i].groupName +"' '><div class='chat-body clearfix'><div class='header_sec'><i  class='fa fa-users' aria-hidden='true'></i>"+groups[i].groupName+"</strong></div><div></div></div></li>"));
											}
										}
									},
									error:function(data){
										console.log(data);
									}
								});
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
		
		//Function used to update the .user when a groupname is clicked from the chat-side-bar
		function updategroup(groupname){
			mainMethod.groupSelected = groupname;
			$.ajax({
				url:'/Chat/php/groupmembers.php',
				type:'POST',
				data:{'me':me,'groupname':mainMethod.groupSelected},
				success:function(data){
					$('.user').html($('<div id="usergroupname">'+groupname+'</div><i id="moreMessagesgroup" class="fa fa-arrow-circle-up" aria-hidden="true"></i><button class="btn dropdown-toggle type="button" id="removeusersbutton" data-toggle="dropdown"><i id="removeusers" class="fa fa-minus-square" aria-hidden="true"><span class="tooltiptext">Remove users</span></i></button><button class="btn dropdown-toggle type="button" id="addusersbutton" data-toggle="dropdown"><i id="addusers" class="fa fa-plus-square" aria-hidden="true"><span class="tooltiptext">Add users</span></i></button><button class="btn" type="button"><i id="deletegroup" class="fa fa-times" aria-hidden="true"><span class="tooltiptext">Delete group</span></i></button><div id="groupmemberlist" style:"padding-right:100px;">'+data+'You</div>'));
				},
				error:function(data){
					console.log(data);
				}
			});
		}

		//updategroupmessages();

		//actions when a group name is clicked in the groupsul
		$(document.body).on('click','#content #groupsul li',function(){
			mainMethod.groupchatspace = 1;
			mainMethod.activenumbergroup = 0;
			mainMethod.groupmorebutton = true;
			mainMethod.foroldgroupmessages = 0;
			var groupname = $(this).find('.header_sec').text();
			updategroup(groupname);
			groupchatspace = true;
			mainMethod.grouptimestamp = 0;
			$.ajax({
				url:'/Chat/php/updategrouplastseen.php',
				type:'post',
				data:{'groupname':mainMethod.groupSelected},
				success:function(data){
					console.log(data);
				}
			});
			$.ajax({
				url:'/Chat/php/updategroups.php',
				type:'POST',
				success:function(data){
					if(JSON.parse(data).length== 0){
						$('#groupsul').html('');
						$('#groupsul').append($('<p>No groups. Create a group.</p>'));
					}
					else{
						var groups = JSON.parse(data);
						$('#groupsul').html('');
						for(var i=0;i<groups.length;i++){
							if(groups[i].unread > 0)
								$('#groupsul').append($("<li class='"+ groups[i].groupName +"' '><div class='chat-body clearfix'><div class='header_sec'><i  class='fa fa-users' aria-hidden='true'></i>"+groups[i].groupName+"</strong></div><span id='groupsunread'>"+groups[i].unread+" unread</span><div></div></div></li>"));
							else
								$('#groupsul').append($("<li class='"+ groups[i].groupName +"' '><div class='chat-body clearfix'><div class='header_sec'><i  class='fa fa-users' aria-hidden='true'></i>"+groups[i].groupName+"</strong></div><div></div></div></li>"));
						}
					}
				},
				error:function(data){
					console.log(data);
				}
			});
			$.ajax({
				url:'/Chat/php/getgrouplastseen.php',
				type:'POST',
				data:{'groupname':mainMethod.groupSelected},
				success:function(data){
					mainMethod.lastseengroup = data;
					$.ajax({
						url:'/Chat/php/getgroupmessages.php',
						type:'POST',
						data:{'group':mainMethod.groupSelected,'seenDate':mainMethod.lastseengroup},
						success:function (data){
							data = JSON.parse(data);
							$('#messages').html('');
							dataLength = data.length;
							if(mainMethod.groupchatspace > 0){
								if(data.length>0){
									mainMethod.lasttext = data[data.length-1].message;
									if(dataLength){
										if(data.length>=mainMethod.number){
											mainMethod.track = 10;
											length = mainMethod.number;
											mainMethod.foroldgroupmessages = data[data.length -length].sentDate;
											for(var i=data.length-length;i<data.length;i++){
												if(data[i].messageFrom!=me){
													date = data[i].sentDate;
													var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
													if(isUrl(data[i].message)){
														encodeURI(data[i].message);
														$('#messages').append($('<div class="textbox"> <div class="lefttext"> <div class="from">'+data[i].messageFrom+'</div><p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a></p> <span class="time">'+formatted+'</span></div> </div><br>'));
													}
													else
														$('#messages').append($('<div class="textbox"> <div class="lefttext"> <div class="from">'+data[i].messageFrom+'</div><p>'+data[i].message+'</p> <span class="time">'+formatted+'</span></div> </div><br>'));
												}
												else{
													date = data[i].sentDate;
													var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
													if(isUrl(data[i].message)){
														encodeURI(data[i].message);
														$('#messages').append($('<div class="textbox"> <div class="righttext"> <p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a></p><span class="time">'+formatted+'</span> </div> </div><br>'));
													}
													else
														$('#messages').append($('<div class="textbox"> <div class="righttext"> <p>'+data[i].message+'</p><span class="time">'+formatted+'</span> </div> </div><br>'));
												}
											}
										}
										else{
											length = data.length;
											mainMethod.track = length;
											mainMethod.foroldgroupmessages = data[0].sentDate;
											for(var i=0;i<data.length;i++){
												if(data[i].messageFrom!=me){
													date = data[i].sentDate;
													var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
													if(isUrl(data[i].message)){
														encodeURI(data[i].message);
														$('#messages').append($('<div class="textbox"> <div class="lefttext"> <div class="from">'+data[i].messageFrom+'</div><p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a></p> <span class="time">'+formatted+'</span></div> </div><br>'));
													}
													else
														$('#messages').append($('<div class="textbox"> <div class="lefttext"> <div class="from">'+data[i].messageFrom+'</div><p>'+data[i].message+'</p> <span class="time">'+formatted+'</span></div> </div><br>'));
												}
												else{
													date = data[i].sentDate;
													var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
													$('#messages').append($('<div class="textbox"> <div class="righttext"> <p>'+data[i].message+'</p><span class="time">'+formatted+'</span> </div> </div><br>'));
												}
											}
										}
									}
								}
							}
							setInterval(function(){
								$.ajax({
									url:'/Chat/php/getgrouplastseen.php',
									type:'POST',
									data:{'groupname':mainMethod.groupSelected},
									success:function(data){
										mainMethod.lastseengroup = data;
										$.ajax({
											url:'/Chat/php/getgroupnewmessages.php',
											type:'POST',
											data:{'group':mainMethod.groupSelected,'seenDate':mainMethod.lastseengroup},
											success:function (data){
												data = JSON.parse(data);
												dataLength = data.length;
												if(($('.user').find('#groupmemberlist').text().length > 0)){
													if(data.length>0 && mainMethod.grouptimestamp < data[0].sentDate){
														for(var i=data.length-1;i>=0;i--){
															if($('.user').find('#usergroupname').text()==data[i].groupName){
																if(mainMethod.grouptimestamp<data[i].sentDate){
																	mainMethod.grouptimestamp = data[i].sentDate;
																	mainMethod.activenumbergroup++;
																	if(mainMethod.groupmorebutton == true &&  mainMethod.activenumbergroup== 1){
																		$('#messages').append('<button id="groupmore"><span id="groupunread">'+mainMethod.activenumbergroup+'</span> Unread</button>');
																		mainMethod.groupmorebutton = false;
																	}
																	if(mainMethod.groupmorebutton == false && mainMethod.activenumbergroup!=$('#groupmore').find('#groupunread').text()){
																		$('#groupmore').find('#groupunread').text(mainMethod.activenumbergroup);
																	}
																	date = data[i].sentDate;
																	var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
																	if(isUrl(data[i].message)){
																		encodeURI(data[i].message);
																		$('#messages').append($('<div class="textbox"> <div class="lefttext"><div class="from">'+data[i].messageFrom+'</div> <p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a></p> <span class="time">'+formatted+'</span></div> </div><br>'));
																	}
																	else
																		$('#messages').append($('<div class="textbox"> <div class="lefttext"><div class="from">'+data[i].messageFrom+'</div> <p>'+data[i].message+'</p> <span class="time">'+formatted+'</span></div> </div><br>'));
																}
															}
														}
													}
												}
											},
											error:function(data){
												console.log(data);
											}
										});
									},
									error:function(data){
										console.log(data);
									}
								});
							},1000);
						},
						error:function(data){
							console.log(data);
						}
					});
				},
				error:function(data){
					console.log(data);
				}
			});
			setTimeout(function(){
				if(groupchatspace == true){
					$("#chatspace").animate({ scrollTop: $('#chatspace').prop("scrollHeight")}, 300);
				}
			},1000);
			$('#sendBtn').attr('id','sendBtnGroup');
			$('#sendform').find('textarea').attr('id','sendGroup');
			$('#sendGroup').focus();
		});
		
		//invokes submitmessagegroupclick()
		$(document.body).on('click','#sendBtnGroup',function(){
			submitmessagegroupclick();
		});

		/*function updategrouplastseensend(){
			$.ajax({
				url:'updategrouplastseen.php',
				type:'POST',
				data:{'groupname':mainMethod.groupSelected},
				success:function(data){
					mainMethod.lastseengroup = data;
				},
				error:function(data){
					console.log(data);
				}
			});
		}*/

		//Function that submits message in a group conversation on click
		function submitmessagegroupclick(){
			var message = $('#sendGroup').val();
			console.log(message);
			//if length is 0 then nothing happens
			if($.trim(message).length==0){
				$('#sendGroup').val('');
			}
			else{
				var msg = $.trim(message);
				var atrate = "@";
				//the calculator function in a textarea. No database involvement.
				if(msg.charAt(0)==atrate){
					var res = msg.split(" ");
					function cleanArray(actual) {
					  var newArray = new Array();
					  for (var i = 0; i < actual.length; i++) {
					    if (actual[i]) {
					      newArray.push(actual[i]);
					    }
					  }
					  return newArray;
					}
					var cleanres = cleanArray(res);
					var result = 0;
					var opindex = 0;
					if(cleanres.length==4){
						if(cleanres[2]=="+"){
							var number1 = parseInt(cleanres[1]);
							var number2 = parseInt(cleanres[3]);
							result = number1 + number2;
						}
						if(cleanres[2]=="-"){
							var number1 = parseInt(cleanres[1]);
							var number2 = parseInt(cleanres[3]);
							result = number1-number2;
						}
						if(cleanres[2]=="*"){
							var number1 = parseInt(cleanres[1]);
							var number2 = parseInt(cleanres[3]);
							result = number1*number2;
						}
						if(cleanres[2]=="/"){
							var number1 = parseInt(cleanres[1]);
							var number2 = parseInt(cleanres[3]);
							result = number1/number2;
						}
					}
					else if(cleanres.length == 2){
						if(cleanres[1].indexOf('+')!=-1){
							opindex = cleanres[1].indexOf('+');
							number1=parseInt(cleanres[1].substring(0,opindex));
							number2=parseInt(cleanres[1].substring(opindex+1,cleanres[1].length));
							result = number1 + number2;
						}
						if(cleanres[1].indexOf('-')!=-1){
							opindex = cleanres[1].indexOf('-');
							number1=parseInt(cleanres[1].substring(0,opindex));
							number2=parseInt(cleanres[1].substring(opindex+1,cleanres[1].length));
							result = number1 - number2;
						}
						if(cleanres[1].indexOf('/')!=-1){
							opindex = cleanres[1].indexOf('/');
							number1=parseInt(cleanres[1].substring(0,opindex));
							number2=parseInt(cleanres[1].substring(opindex+1,cleanres[1].length));
							result = number1 / number2;
						}
						if(cleanres[1].indexOf('*')!=-1){
							opindex = cleanres[1].indexOf('*');
							number1=parseInt(cleanres[1].substring(0,opindex));
							number2=parseInt(cleanres[1].substring(opindex+1,cleanres[1].length));
							result = number1 * number2;
						}
					}
					else if(cleanres.length==3){
						if(cleanres[1].indexOf('+')==-1){
							if(cleanres[2].indexOf('+')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2].substring(1,cleanres[2].length));
								result = number1 + number2;
							}
						}
						if(cleanres[1].indexOf('-')==-1){
							if(cleanres[2].indexOf('-')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2].substring(1,cleanres[2].length));
								result = number1 - number2;
							}
						}
						if(cleanres[1].indexOf('/')==-1){
							if(cleanres[2].indexOf('/')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2].substring(1,cleanres[2].length));
								result = number1 / number2;
							}
						}
						if(cleanres[1].indexOf('*')==-1){
							if(cleanres[2].indexOf('*')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2].substring(1,cleanres[2].length));
								result = number1 * number2;
							}
						}
						if(cleanres[2].indexOf('+')==-1){
							if(cleanres[1].indexOf('+')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2]);
								result = number1 + number2;
							}
						}
						if(cleanres[2].indexOf('-')==-1){
							if(cleanres[1].indexOf('-')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2]);
								result = number1 - number2;
							}
						}
						if(cleanres[2].indexOf('/')==-1){
							if(cleanres[1].indexOf('/')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2]);
								result = number1 / number2;
							}
						}
						if(cleanres[2].indexOf('*')==-1){
							if(cleanres[1].indexOf('*')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2]);
								result = number1 * number2;
							}
						}
					}
					var currentdate = new Date(); 
					var month= currentdate.getMonth();
					var monthletter = dict[month].value;
					var hours = currentdate.getHours();
				    var hours = (hours+24)%24; 
				    var mid='am';
				    if(hours==0){ //At 00 hours we need to show 12 am
				    	hours=12;
				    }
				    else if(hours>12)
				    {
					    hours=hours%12;
					    mid='pm';
				    }
				    if(hours<10){
				    	hours = '0'+hours;
				    }
				    var minutes = currentdate.getMinutes();
				    if(minutes <10){
				    	minutes = '0'+minutes;
				    }
				    var year = currentdate.getFullYear();
				    year = year.toString();
				    year = year.substring(2,4);

				    var date =  currentdate.getDate();
				    if(date<10){
				    	date = '0'+date;
				    }
				    var datetime = date+ " "
				                + monthletter + " " 
				                + year + " "  
				                + hours + ":"  
				                + minutes + ' '+mid;
					$('#messages').append('<div class="textbox"> <div class="righttext"> <p>'+msg+'</p> <span class="time">'+datetime+'</span></div> </div><br>');
					$("#chatspace").animate({ scrollTop: $(document).height() },100);
					setTimeout(function(){
						$('#messages').append($('<div class="textbox"> <div class="lefttext"> <p><span style="text-decoration:underline;">Chatbot calculator</span>: '+result+'</p><span class="time">'+datetime+'</span> </div> </div><br>'));
						$("#chatspace").animate({ scrollTop: $(document).height() },100);
					},200);
					$('#sendGroup').val('');
					return false;
				}
				//the part where database gets updated and message is inserted in it
				else{
					//checks and encodes url
					if(isUrl(message)){
						encodeURI(message);
					}
					$.ajax({
						url:'/Chat/php/sendmessagegroup.php',
						type:'POST',
						data:{'groupname':mainMethod.groupSelected,'msg':message},
						success:function(data){
							$.ajax({
								url:'/Chat/php/updategrouplastseen.php',
								type:'POST',
								data:{'groupname':mainMethod.groupSelected},
								success:function(data){
									mainMethod.lastseengroup = data;
								},
								error:function(data){
									console.log(data);
								}
							});
							$('#messages').html('');
							$('#sendGroup').val('');
							console.log('done');
							//updategrouplastseensend();
							updategroupmessages();
							//updateScroll();
							updaterecentlist();
							$("#chatspace").animate({ scrollTop: $(document).height() }, 200);
	  						return false;
						},
						error:function(data){
							console.log(data);
						}
					});
				}
			}
		}

		//invokes submitmessagegroupenter
		$(document.body).on('keypress','#sendGroup',function(e){
			if(e.keyCode == 13){
				if(e.shiftKey==false){
					submitmessagegroupenter();
				}
			}
		});

		function submitmessagegroupenter(){
			var message = $('#sendGroup').val();
			console.log(message);
			//if length is 0 nothing happens
			if($.trim(message).length==0){
				$('#sendGroup').val('');

			}
			else{
				var msg = $.trim(message);
				var atrate = "@";
				//calculator function. No DB involvement
				if(msg.charAt(0)==atrate){
					var res = msg.split(" ");
					function cleanArray(actual) {
					  var newArray = new Array();
					  for (var i = 0; i < actual.length; i++) {
					    if (actual[i]) {
					      newArray.push(actual[i]);
					    }
					  }
					  return newArray;
					}
					var cleanres = cleanArray(res);
					var result = 0;
					var opindex = 0;
					if(cleanres.length==4){
						if(cleanres[2]=="+"){
							var number1 = parseInt(cleanres[1]);
							var number2 = parseInt(cleanres[3]);
							result = number1 + number2;
						}
						if(cleanres[2]=="-"){
							var number1 = parseInt(cleanres[1]);
							var number2 = parseInt(cleanres[3]);
							result = number1-number2;
						}
						if(cleanres[2]=="*"){
							var number1 = parseInt(cleanres[1]);
							var number2 = parseInt(cleanres[3]);
							result = number1*number2;
						}
						if(cleanres[2]=="/"){
							var number1 = parseInt(cleanres[1]);
							var number2 = parseInt(cleanres[3]);
							result = number1/number2;
						}
					}
					else if(cleanres.length == 2){
						if(cleanres[1].indexOf('+')!=-1){
							opindex = cleanres[1].indexOf('+');
							number1=parseInt(cleanres[1].substring(0,opindex));
							number2=parseInt(cleanres[1].substring(opindex+1,cleanres[1].length));
							result = number1 + number2;
						}
						if(cleanres[1].indexOf('-')!=-1){
							opindex = cleanres[1].indexOf('-');
							number1=parseInt(cleanres[1].substring(0,opindex));
							number2=parseInt(cleanres[1].substring(opindex+1,cleanres[1].length));
							result = number1 - number2;
						}
						if(cleanres[1].indexOf('/')!=-1){
							opindex = cleanres[1].indexOf('/');
							number1=parseInt(cleanres[1].substring(0,opindex));
							number2=parseInt(cleanres[1].substring(opindex+1,cleanres[1].length));
							result = number1 / number2;
						}
						if(cleanres[1].indexOf('*')!=-1){
							opindex = cleanres[1].indexOf('*');
							number1=parseInt(cleanres[1].substring(0,opindex));
							number2=parseInt(cleanres[1].substring(opindex+1,cleanres[1].length));
							result = number1 * number2;
						}
					}
					else if(cleanres.length==3){
						if(cleanres[1].indexOf('+')==-1){
							if(cleanres[2].indexOf('+')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2].substring(1,cleanres[2].length));
								result = number1 + number2;
							}
						}
						if(cleanres[1].indexOf('-')==-1){
							if(cleanres[2].indexOf('-')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2].substring(1,cleanres[2].length));
								result = number1 - number2;
							}
						}
						if(cleanres[1].indexOf('/')==-1){
							if(cleanres[2].indexOf('/')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2].substring(1,cleanres[2].length));
								result = number1 / number2;
							}
						}
						if(cleanres[1].indexOf('*')==-1){
							if(cleanres[2].indexOf('*')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2].substring(1,cleanres[2].length));
								result = number1 * number2;
							}
						}
						if(cleanres[2].indexOf('+')==-1){
							if(cleanres[1].indexOf('+')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2]);
								result = number1 + number2;
							}
						}
						if(cleanres[2].indexOf('-')==-1){
							if(cleanres[1].indexOf('-')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2]);
								result = number1 - number2;
							}
						}
						if(cleanres[2].indexOf('/')==-1){
							if(cleanres[1].indexOf('/')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2]);
								result = number1 / number2;
							}
						}
						if(cleanres[2].indexOf('*')==-1){
							if(cleanres[1].indexOf('*')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2]);
								result = number1 * number2;
							}
						}
					}
					var currentdate = new Date(); 
					var month= currentdate.getMonth();
					var monthletter = dict[month].value;
					var hours = currentdate.getHours();
				    var hours = (hours+24)%24; 
				    var mid='am';
				    if(hours==0){ //At 00 hours we need to show 12 am
				    	hours=12;
				    }
				    else if(hours>12)
				    {
					    hours=hours%12;
					    mid='pm';
				    }
				    if(hours<10){
				    	hours = '0'+hours;
				    }
				    var minutes = currentdate.getMinutes();
				    if(minutes <10){
				    	minutes = '0'+minutes;
				    }
				    var year = currentdate.getFullYear();
				    year = year.toString();
				    year = year.substring(2,4);

				    var date =  currentdate.getDate();
				    if(date<10){
				    	date = '0'+date;
				    }
				    var datetime = date+ " "
				                + monthletter + " " 
				                + year + " "  
				                + hours + ":"  
				                + minutes + ' '+mid;
					$('#messages').append('<div class="textbox"> <div class="righttext"> <p>'+msg+'</p> <span class="time">'+datetime+'</span></div> </div><br>');
					$("#chatspace").animate({ scrollTop: $(document).height() },100);
					setTimeout(function(){
						$('#messages').append($('<div class="textbox"> <div class="lefttext"> <p><span style="text-decoration:underline;">Chatbot calculator</span>: '+result+'</p><span class="time">'+datetime+'</span> </div> </div><br>'));
						$("#chatspace").animate({ scrollTop: $(document).height() },100);
					},200);
					$('#sendGroup').val('');
					return false;
				}
				//db involvement. Inserts message into database
				else{
					//encodes and checks for if url
					if(isUrl(message)){
						encodeURI(message);
					}
					$.ajax({
						url:'/Chat/php/sendmessagegroup.php',
						type:'POST',
						data:{'groupname':mainMethod.groupSelected,'msg':message},
						success:function(data){
							$.ajax({
								url:'/Chat/php/updategrouplastseen.php',
								type:'POST',
								data:{'groupname':mainMethod.groupSelected},
								success:function(data){
									mainMethod.lastseengroup = data;
								},
								error:function(data){
									console.log(data);
								}
							});
							$('#messages').html('');
							$('#sendGroup').val('');
							console.log('done');
							updaterecentlist();
							//updategrouplastseensend();
							updategroupmessages();
							//updateScroll();
							$("#chatspace").animate({ scrollTop: $(document).height() }, 200);
	  						return false;
						},
						error:function(data){
							console.log(data);
						}
					});
				}
			}
		}

		//array used for modal which is created on clicking on the add/remove users button on the .user bar of a group conversation
		var members = [];

		//actions to add users to the members array
		$(document.body).on('click','#modalList li',function(){
			if(!$(this).attr('data-toggled') || $(this).attr('data-toggled') == 'off'){
				$(this).attr('data-toggled','on');
				$(this).css({'background-color':'rgba(229,0,101,0.7)','border-color':'rgba(229,0,101,0.7)','color':'rgba(255,255,255,1)'});
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
				$(this).css({'background-color':'transparent','border-color':'rgba(229,0,101,0.8)','color':'rgba(229,0,101,0.8)'});
				var removename = $(this).text();
				var index = -1;
				for(var j=0;j<members.length;j++){
					if(members[j] == removename)
						index = j;
				}
				members.splice(index,1);
			}
		});

		//modal function
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

		//displaying users that can be added to the group (modal)
		function addall(){
			var memberarray = $('.user').find('#groupmemberlist').text().split(', ');
			$('#modalList').html('');
			$.ajax({
				url:'/Chat/php/allusers.php',
				type:'post',
				success:function(data){
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
										url:'/Chat/php/getimage.php',
										type:'POST',
										data:{'username':thisName},
										success:function(data2){
											$('#modalList').append('<li><img style="border-radius:50%;height:30px;width:30px;" src="/Chat/common/images/userimages/'+data2+'">'+thisName+'</li>');
											//addusermodal();	
										},
										error:function(){
											console.log(data2);
										}
									});
								})(i);
							}
						}
					}
					else{
						$('#modalcontainer >div').html('No more users to add');
						$('#modalbutton').hide();
						//addusermodal();
					}
				}
			});
		}


		$(document.body).on('click','#searchmodal #modalgoback',function(){
			addall();
		});

		//displays the modal for adding users
		$('.user').on('click','#addusersbutton',function(){
			var groupmemberarray = $('.user').find('#groupmemberlist').text();
			var memberarray = groupmemberarray.split(', ');
			$.ajax({
				url:'/Chat/php/allusers.php',
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
									url:'/Chat/php/getimage.php',
									type:'POST',
									data:{'username':thisName},
									success:function(data2){
										$('#modalList').append('<li><img style="border-radius:50%;height:30px;width:30px;" src="/Chat/common/images/userimages/'+data2+'">'+thisName+'</li>');
										addusermodal();	
									},
									error:function(){
										console.log(data2);
									}
								});
							})(i);
						}
					}
					$('#searchmodal').show();
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
		});
		
		//add button insude the modal which writes to the database
		$(document.body).on('click','#modalbutton #modaladdbutton',function(){
			var modal = $('#myModal2');
			console.log(mainMethod.groupSelected);
			$.ajax({
				url:'/Chat/php/addtogroup.php',
				type:'post',
				data:{'groupname':mainMethod.groupSelected,'usernames':members},
				success:function(data){
					console.log(data);
				},
				error:function(data){
					console.log(data);
				}
			});
			updategroup(mainMethod.groupSelected);
			$('#modalcontainer > #modaldescription').html('');
			$('#modalList').html('');
			$('#modalbutton').hide();
			$('#searchmodal').hide();
			$('#modalcontainer > #modaldescription').html("<p style='text-decoration:none;'>Members added.</p>");
			console.log(members);
			members = [];
		});

		//modal function 
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

		//displays the modal and the users of a group
		$('.user').on('click','#removeusersbutton',function(){
			var removemembers = $('.user').find('#groupmemberlist').text().split(', ');
			$('#modalList').html('');
			$('#modalcontainer > #modaldescription').html('Remove users from the group');
			$('#searchmodal').hide();
			if(removemembers.length>1){	
				for(var i=0;i<removemembers.length-1;i++){
					(function(i){
						$.ajax({
							url:'/Chat/php/getimage.php',
							type:'POST',
							data:{'username':removemembers[i]},
							success:function(data2){
								$('#modalList').append('<li><img style="border-radius:50%;height:30px;width:30px;" src="/Chat/common/images/userimages/'+data2+'">'+removemembers[i]+'</li>');
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
			}
			else{
				$('#modalcontainer > #modaldescription').html('No users to remove');
				$('#searchmodal').hide();
				addusermodal();
				$('#modalbutton').hide();
			}
			console.log('Remove');
		});
	
		//database actions of removing user from a group
		$(document.body).on('click','#modalbutton #modalremovebutton',function(){
			var modal = $('#myModal2');
			$.ajax({
				url:'/Chat/php/removefromgroup.php',
				type:'post',
				data:{'groupname':mainMethod.groupSelected,'usernames':members},
				success:function(data){
					console.log(data);
				},
				error:function(data){
					console.log(data);
				}
			});
			updategroup(mainMethod.groupSelected);
			$('#modalcontainer > #modaldescription').html('');
			$('#modalList').html('');
			$('#modalbutton').hide();
			$('#searchmodal').hide();
			$('#modalcontainer > #modaldescription').html("<p style='text-decoration:none;'>Members removed.</p>");
			members = [];
		});

		//Leave a group
		var groupDisplay = '';

		//displays an alert box. If clicked yes then deletes a group
		$(document.body).on('click','.user #deletegroup',function(){
			//$('#messages').html('');
			var group = $('.user').find('#usergroupname').text();
			var confirmation = confirm('Are you sure to leave '+group+'?')
			if(confirmation == true){
				$.ajax({
					url:'/Chat/php/deletegroup.php',
					type:'post',
					data:{'groupname':group},
					success:function(data){
						console.log(data);
						$('.user').html('');
						$('#messages').html('');
						$.ajax({
							url:'/Chat/php/updategroups.php',
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
										if(groups[i].unread > 0)
											$('#groupsul').append($("<li class='"+ groups[i].groupName +"' '><div class='chat-body clearfix'><div class='header_sec'><i  class='fa fa-users' aria-hidden='true'></i>"+groups[i].groupName+"</strong></div><span id='groupsunread'>"+groups[i].unread+" unread</span><div></div></div></li>"));
										else
											$('#groupsul').append($("<li class='"+ groups[i].groupName +"' '><div class='chat-body clearfix'><div class='header_sec'><i  class='fa fa-users' aria-hidden='true'></i>"+groups[i].groupName+"</strong></div><div></div></div></li>"));
									}
								}
							},
							error:function(data){
								console.log(data);
							}
						});
					},
					error:function(data){
						console.log(data);
					}
				});
			updaterecentlist();
			}
		});

		//A up button on the user bar which adds old messages and also dynamically displays a downBtn in the bottom right corner of the chat section
		$(document.body).on('click','.user #moreMessages',function(){
			getPreviousMessages();
			$('#chatspace').animate({scrollTop:0},500);
			//if(mainMethod.track > 7)
			//	$('#down').html($('<i id="downBtn" class="fa fa-arrow-circle-down" aria-hidden="true"></i>'));
		});

		$(document.body).on('click','.user #moreMessagesgroup',function(){
			getPreviousGroupMessages();
			var element = document.getElementById('chatspace');
			/*if(element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth){
				$('#chatspace').animate({scrollTop:0},500);
				$('#down').html($('<i id="downBtn" class="fa fa-arrow-circle-down" aria-hidden="true"></i>'));
			}*/
		});

		//Works when the moreMessages button on the user bar is clicked. Total 10 older messages gets added everytime you click this. If you have less than 10 messages it will show them all
		function getPreviousMessages(){
			$.ajax({
				url:'/Chat/php/getpreviousmessages.php',
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
										date = data[i].sentDate;
										var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
										if(isUrl(data[i].message)){
												encodeURI(data[i].message);
												$('#messages').append($('<div class="textbox"> <div class="lefttext"> <p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a></p> <span class="time">'+formatted+'</span></div> </div><br>'));
											}
											else
												$('#messages').append($('<div class="textbox"> <div class="lefttext"> <p>'+data[i].message+'</p> <span class="time">'+formatted+'</span></div> </div><br>'));
									}
									else{
										date = data[i].sentDate;
										var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
										if(isUrl(data[i].message)){
											encodeURI(data[i].message);
											$('#messages').prepend($('<div class="textbox"> <div class="righttext"> <p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a></p><span class="time">'+formatted+'</span> </div> </div><br>'));
										}
										else
											$('#messages').prepend($('<div class="textbox"> <div class="righttext"> <p>'+data[i].message+'</p><span class="time">'+formatted+'</span> </div> </div><br>'));
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

		//Works when the moreMessagesgroup button on the user bar is clicked. Total 10 older messages gets added everytime you click this. If you have less than 10 messages it will show them all
		function getPreviousGroupMessages(){
			var lastgroupmessage = mainMethod.foroldgroupmessages;
			var myname = me;
			$.ajax({
				url:'/Chat/php/getpreviousgroupmessages.php',
				type:'post',
				data:{'lastdisplay':lastgroupmessage,'groupname':mainMethod.groupSelected},
				success:function(data){
					data = JSON.parse(data);
					if(data.length > 0){
						mainMethod.foroldgroupmessages = data[0].sentDate;
						for(var i = data.length-1;i>=0;i--){
							if(data[i].messageFrom==myname){
								date = data[i].sentDate;
								var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
								if(isUrl(data[i].message)){
									encodeURI(data[i].message);
									$('#messages').prepend($('<div class="textbox"> <div class="righttext"> <p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a></p><span class="time">'+formatted+'</span> </div> </div><br>'));
								}
								else
									$('#messages').prepend($('<div class="textbox"> <div class="righttext"> <p>'+data[i].message+'</p><span class="time">'+formatted+'</span> </div> </div><br>'));
							}
							else{
								date = data[i].sentDate;
								var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
								if(isUrl(data[i].message)){
									encodeURI(data[i].message);
									$('#messages').prepend($('<div class="textbox"><div class="lefttext"><div class="from">'+data[i].messageFrom+'</div> <p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a>'+data[i].message+'</p><span class="time">'+formatted+'</span> </div> </div><br>'));
								}
								$('#messages').prepend($('<div class="textbox"><div class="lefttext"><div class="from">'+data[i].messageFrom+'</div> <p>'+data[i].message+'</p><span class="time">'+formatted+'</span> </div> </div><br>'));
							}
						}
					}
					console.log(data);
				}
			});
		}

		//Invokes a function that updates private messages every second
		update();
		function update(){
			setInterval(function(){
				updatenew();
			},1000);
		}

		//Invokes a function that updates group messages every second
		function updategroupnew(){
			setInterval(function(){
				groupnewmessages();
			},1000);
		}

		//check variables

		var forrecent = ''; //used for updating of recentlist
		var fornotif = ''; //used for desktop notifications
		//Function that updates new messages which are received after mainMethod.latest and also shows unread messages
		function updatenew(){
			$.ajax({
				url:'/Chat/php/getmessages.php',
				type:'POST',
				data:{'user2':mainMethod.lastconvo},
				success:function(data){
					data = JSON.parse(data);
					dataLength = data.length;
					if(data.length > 0){
						$.ajax({
							url:'/Chat/php/newmessages.php',
							type:'POST',
							dataType:'json',
							data:{'old':mainMethod.latest},
							success:function(data){
								if(data.length > 0){
									var checknotif = data[data.length-1].message;
									//Checks if the message in last notification is not equal to the lastest message retrieved from the db. If not only then displays a notification
									if(fornotif!=checknotif){
										fornotif = checknotif;
										//desktop notification
										if(Notification.permission!=='granted')
											Notification.requestPermission();
										else{
											var notification = new Notification('WSChat',{
												body:data[data.length-1].messageFrom+": "+data[data.length-1].message,
												icon:"/Chat/favicon.ico"
											});
											notification.onclick = function(){
												mainMethod.notificationbox = 0;
												var isChrome = !!window.chrome && !!window.chrome.webstore;
												var newWindow = null;
												if(isChrome){
													if ((newWindow == null) || (newWindow.closed)  )
													  {
													    window.focus('/Chat/index.php','index');
													    notification.close();
													    mainMethod.notificationbox =0;
													  }
												}
												else{
													launchApplication('/Chat/index.php','index');
													mainMethod.notificationbox = 0;
													notification.close();
												}					
											};
										}
									}
								}
								var size = data.length;
								if(size > 0){
									list = $('#recentlist li');
									list.each(function(idx,li){
										var otherUsername = $(this).find('.header_sec').text();
										mainMethod.recenttrack[otherUsername] = true;
									});

									for(var i = 0;i<size;i++){
										if(mainMethod.lastconvo==data[i].messageFrom && ($('.user').find('#name').text()==mainMethod.lastconvo)){
											if(mainMethod.lasttext!=data[i].message){
												mainMethod.latest = data[i].sentDate;
												mainMethod.lasttext = data[i].message;
												mainMethod.activenumber++;
												updaterecentlist();
												//moremessages button insertion and check
												if(mainMethod.moreBoolean == true && mainMethod.activenumber == 1){
													
													$('#messages').append($('<button style="width:auto; height:30px;" id="morebutton"><span id="unreadactive">'+mainMethod.activenumber+'</span><i style="margin-left:4px;" class="fa fa-arrow-circle-down" aria-hidden="true"><hr></button>'));
													blink();
													mainMethod.moreBoolean = false;
												}
												if(mainMethod.moreBoolean == false && mainMethod.activenumber!=$('#morebutton').find('#unreadactive').text()){
													$('#morebutton').find('#unreadactive').text(mainMethod.activenumber);
												}
												date = data[i].sentDate;
												var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
												if(isUrl(data[i].message)){
													encodeURI(data[i].message);
													$('#messages').append($('<div class="textbox"> <div class="lefttext"> <p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a></p> <span class="time">'+formatted+'</span></div> </div><br>'));
												}
												else
													$('#messages').append($('<div class="textbox"> <div class="lefttext"> <p>'+data[i].message+'</p> <span class="time">'+formatted+'</span></div> </div><br>'));
											}
										}
										else{
											if(!mainMethod.recenttrack[data[i].messageFrom]){
												mainMethod.recenttrack[data[i].messageFrom] = true;
												$('#recentlist').prepend('<li  class='+data[i].messageFrom+'><div class="chat-body clearfix"><div class="header_sec">'+data[i].messageFrom+'</div></li>');
											}
											else{
												if(forrecent!=data[data.length-1].message){
													updaterecentlist();
													forrecent = data[data.length-1].message;
												}
											}
										}
									}
								}
							},
							error:function(data){
								//console.log(data);
							}
						});
					}
				}
			});
		}

		//function that updates the group messages
		function updategroupmessages(){
			$.ajax({
				url:'/Chat/php/getgrouplastseen.php',
				type:'POST',
				data:{'groupname':mainMethod.groupSelected},
				success:function(data){
					//last seen message of the selected group.
					mainMethod.lastseengroup = data;
					$.ajax({
						url:'/Chat/php/getgroupmessages.php',
						type:'POST',
						data:{'group':mainMethod.groupSelected,'seenDate':mainMethod.lastseengroup},
						success:function (data){
							data = JSON.parse(data);
							$('#messages').html('');
							dataLength = data.length;
							if(mainMethod.groupchatspace > 0){
								if(data.length>0){
									mainMethod.lasttext = data[data.length-1].message;
									mainMethod.unreadgroup = data.length;
									if(dataLength){
										if(data.length>=mainMethod.number){
											length = mainMethod.number;
											mainMethod.foroldgroupmessages=data[data.length - length].sentDate;
											mainMethod.track = 10;
											for(var i=data.length-length;i<data.length;i++){
												if(data[i].messageFrom!=me){
													date = data[i].sentDate;
													var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
													if(isUrl(data[i].message)){
														encodeURI(data[i].message);
														$('#messages').append($('<div class="textbox"><div class="lefttext"><div class="from">'+data[i].messageFrom+'</div> <p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a></p><span class="time">'+formatted+'</span> </div> </div><br>'));
													}
													else
														$('#messages').append($('<div class="textbox"><div class="lefttext"><div class="from">'+data[i].messageFrom+'</div> <p>'+data[i].message+'</p><span class="time">'+formatted+'</span> </div> </div><br>'));
												}
												else{
													date = data[i].sentDate;
													var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
													if(isUrl(data[i].message)){
														encodeURI(data[i].message);
														$('#messages').append($('<div class="textbox"> <div class="righttext"> <p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a></p><span class="time">'+formatted+'</span> </div> </div><br>'));
													}
													else
														$('#messages').append($('<div class="textbox"> <div class="righttext"> <p>'+data[i].message+'</p><span class="time">'+formatted+'</span> </div> </div><br>'));
												}
											}
										}
										else{
											length = data.length;
											mainMethod.track = length;
											mainMethod.foroldgroupmessages=data[0].sentDate;
											for(var i=0;i<data.length;i++){
												if(data[i].messageFrom!=me){
													date = data[i].sentDate;
													var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
													if(isUrl(data[i].message)){
														encodeURI(data[i].message);
														$('#messages').append($('<div class="textbox"><div class="lefttext"><div class="from">'+data[i].messageFrom+'</div> <p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a></p><span class="time">'+formatted+'</span> </div> </div><br>'));
													}
													else
														$('#messages').append($('<div class="textbox"><div class="lefttext"><div class="from">'+data[i].messageFrom+'</div> <p>'+data[i].message+'</p><span class="time">'+formatted+'</span> </div> </div><br>'));
												}
												else{
													date = data[i].sentDate;
													var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
													if(isUrl(data[i].message)){
														encodeURI(data[i].message);
														$('#messages').append($('<div class="textbox"> <div class="righttext"> <p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a></p><span class="time">'+formatted+'</span> </div> </div><br>'));
													}
													else
														$('#messages').append($('<div class="textbox"> <div class="righttext"> <p>'+data[i].message+'</p><span class="time">'+formatted+'</span> </div> </div><br>'));
												}
											}
										}
										$("#chatspace").animate({ scrollTop: $('#chatspace').prop("scrollHeight")}, 100);
									}
								}
							}
						},
						error:function(data){
							console.log(data);
						}
					});
				},
				error:function(data){
					//console.log(data);
				}
			});

		}

		//console.log(mainMethod.lasttext);

		//update group last seen message on clicking of the button
		$(document.body).on('click','#chatspace #groupmore',function(){
			$('#chatspace').find('#groupmore').remove();
			mainMethod.groupmorebutton = true;
			//updateScroll();
			var objDiv = document.getElementById("chatspace");
			objDiv.scrollTop = objDiv.scrollHeight;
			console.log(mainMethod.grouptimestamp);
			$.ajax({
				url:'/Chat/php/updategrouplastseenbutton.php',
				type:'post',
				data:{'groupname':mainMethod.groupSelected,'sentDate':mainMethod.grouptimestamp},
				success:function(data){
					console.log(data);
				},
				error:function(data){
					console.log(data);
				}
			});
			updaterecentlist();
		});

		//check variables
		var groupnotifcheck = ''; //notification check
		var grouplatest = 0; //timestamp of the last message
		//groupdesktopnotification
		setInterval(function(){
			$.ajax({
				url:'/Chat/php/unreadmessagesgroup.php',
				success:function(data){
					data = JSON.parse(data);
					function sortByKey(array, key) {
						return array.sort(function(a, b) {
						    var x = a[key]; var y = b[key];
						    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
						});
					}
					sortByKey(data,'sentDate');
					console.log(data);
					if(data.length > 0){
						//updates recentlist only if sentDate of latest message is greater than grouplatest 
						if(data[data.length-1].sentDate!=grouplatest){
							updaterecentlist();
							grouplatest = data[data.length-1].sentDate;
						}
						if(data[data.length-1].message!=groupnotifcheck){
							groupnotifcheck = data[data.length-1].message;
							if(Notification.permission!=='granted')
								Notification.requestPermission();
							else{
								var notification = new Notification('WSChat',{
									body:'Group: '+data[data.length-1].groupName+'\n'+'Message: '+data[data.length-1].message,
									icon:"/Chat/favicon.ico"
								});
								notification.onclick = function(){
									mainMethod.notificationbox = 0;
									var isChrome = !!window.chrome && !!window.chrome.webstore;
									var newWindow = null;
									if(isChrome){
										if ((newWindow == null) || (newWindow.closed)  )
										  {
										    window.focus('/Chat/index.php','index');
										    notification.close();
										    mainMethod.notificationbox =0;
										  }
									}
									else{
										launchApplication('/Chat/index.php','index');
										mainMethod.notificationbox = 0;
										notification.close();
									}					
								};
							}
						}
					}
				}
			});
		},1000);
		
		//updates new group messages and also appends the button which shows number of unread messages
		function groupnewmessages(){
			$.ajax({
				url:'/Chat/php/getgrouplastseen.php',
				type:'POST',
				data:{'groupname':mainMethod.groupSelected},
				success:function(data){
					mainMethod.lastseengroup = data;
					$.ajax({
						url:'/Chat/php/getgroupnewmessages.php',
						type:'POST',
						data:{'group':mainMethod.groupSelected,'seenDate':mainMethod.lastseengroup},
						success:function (data){
							data = JSON.parse(data);
							dataLength = data.length;
							mainMethod.unreadgroup = dataLength;
							if(($('.user').find('#groupmemberlist').text().length > 0)){
								if(data.length>0 && mainMethod.grouptimestamp < data[0].sentDate){
									mainMethod.foroldgroupmessages = data[data.length-1].sentDate;
									for(var i=data.length-1;i>=0;i--){
										if($('.user').find('#usergroupname').text()==data[i].groupName){
											if(mainMethod.grouptimestamp<data[i].sentDate){
												mainMethod.grouptimestamp = data[i].sentDate;
												mainMethod.activenumbergroup++;
												if(mainMethod.groupmorebutton == true &&  mainMethod.activenumbergroup== 1){
													$('#messages').append('<button id="groupmore"><span id="groupunread">'+mainMethod.activenumbergroup+'</span> Unread</button>');
													mainMethod.groupmorebutton = false;
												}
												if(mainMethod.groupmorebutton == false && mainMethod.activenumbergroup!=$('#groupmore').find('#groupunread').text()){
													$('#groupmore').find('#groupunread').text(mainMethod.activenumbergroup);
												}
												date = data[i].sentDate;
												var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
												if(isUrl(data[i].message)){
													encodeURI(data[i].message);
													$('#messages').append($('<div class="textbox"><div class="lefttext"><div class="from">'+data[i].messageFrom+'</div> <p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a></p><span class="time">'+formatted+'</span> </div> </div><br>'));
												}
												else
													$('#messages').append($('<div class="textbox"><div class="lefttext"><div class="from">'+data[i].messageFrom+'</div> <p>'+data[i].message+'</p><span class="time">'+formatted+'</span> </div> </div><br>'));
											}
										}
									}
								}
							}
						},
						error:function(data){
							//console.log(data);
						}
					});
				},
				error:function(data){
					//console.log(data);
				}
			});
		}

		//Fetches all messages from database but display only 10 messages. Only 10 messsages because mainMethod.number is set to 10. That can be changed anytime.
		function updatemessages(){
			$('#messages').html(
				$.ajax({
					url:'/Chat/php/getmessages.php',
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
											date = data[i].sentDate;
											var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
											if(isUrl(data[i].message)){
												encodeURI(data[i].message);
												$('#messages').append($('<div class="textbox"> <div class="lefttext"> <p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a></p> <span class="time">'+formatted+'</span></div> </div><br>'));
											}
											else
												$('#messages').append($('<div class="textbox"> <div class="lefttext"> <p>'+data[i].message+'</p> <span class="time">'+formatted+'</span></div> </div><br>'));
										}
										else{
											$('messages').html('');
											date = data[i].sentDate;
											var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
											if(isUrl(data[i].message)){
												encodeURI(data[i].message);
												$('#messages').append($('<div class="textbox"> <div class="righttext"> <p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a></p><span class="time">'+formatted+'</span> </div> </div><br>'));
											}
											else
												$('#messages').append($('<div class="textbox"> <div class="righttext"> <p>'+data[i].message+'</p><span class="time">'+formatted+'</span> </div> </div><br>'));
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
											date = data[i].sentDate;
											var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
											if(isUrl(data[i].message)){
												encodeURI(data[i].message);
												$('#messages').append($('<div class="textbox"> <div class="lefttext"> <p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a></p> <span class="time">'+formatted+'</span></div> </div><br>'));
											}
											else
												$('#messages').append($('<div class="textbox"> <div class="lefttext"> <p>'+data[i].message+'</p> <span class="time">'+formatted+'</span></div> </div><br>'));
										}
										else{
											date = data[i].sentDate;
											var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
											if(isUrl(data[i].message)){
												encodeURI(data[i].message);
												$('#messages').append($('<div class="textbox"> <div class="righttext"> <p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a></p><span class="time">'+formatted+'</span> </div> </div><br>'));
											}
											else
												$('#messages').append($('<div class="textbox"> <div class="righttext"> <p>'+data[i].message+'</p><span class="time">'+formatted+'</span> </div> </div><br>'));
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

		//I have no idea whuy this was written but it is being used somewhere
		function updatemessagesothers(){
			$('#messages').html(
				$.ajax({
					url:'/Chat/php/getmessagesothers.php',
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
											date = data[i].sentDate;
											var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
											if(isUrl(data[i].message)){
												encodeURI(data[i].message);
												$('#messages').append($('<div class="textbox"> <div class="lefttext"> <p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a></p> <span class="time">'+formatted+'</span></div> </div><br>'));
											}
											else
												$('#messages').append($('<div class="textbox"> <div class="lefttext"> <p>'+data[i].message+'</p> <span class="time">'+formatted+'</span></div> </div><br>'));
										}
										else{
											$('messages').html('');
											date = data[i].sentDate;
											var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
											if(isUrl(data[i].message)){
												encodeURI(data[i].message);
												$('#messages').append($('<div class="textbox"> <div class="righttext"> <p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a></p><span class="time">'+formatted+'</span> </div> </div><br>'));
											}
											else
												$('#messages').append($('<div class="textbox"> <div class="righttext"> <p>'+data[i].message+'</p><span class="time">'+formatted+'</span> </div> </div><br>'));
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
											date = data[i].sentDate;
											var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
											if(isUrl(data[i].message)){
												encodeURI(data[i].message);
												$('#messages').append($('<div class="textbox"> <div class="lefttext"> <p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a></p> <span class="time">'+formatted+'</span></div> </div><br>'));
											}
											else
												$('#messages').append($('<div class="textbox"> <div class="lefttext"> <p>'+data[i].message+'</p> <span class="time">'+formatted+'</span></div> </div><br>'));
										}
										else{
											date = data[i].sentDate;
											var formatted = moment.unix(date).format("DD MMM YY hh:mm a");
											if(isUrl(data[i].message)){
												encodeURI(data[i].message);
												$('#messages').append($('<div class="textbox"> <div class="righttext"> <p><a target="_blank" href="'+data[i].message+'">'+data[i].message+'</a></p> <span class="time">'+formatted+'</span></div> </div><br>'));
											}
											else
												$('#messages').append($('<div class="textbox"> <div class="righttext"> <p>'+data[i].message+'</p><span class="time">'+formatted+'</span> </div> </div><br>'));
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

		//updates messages on page load
		initialsubmit();
		function initialsubmit(){
			if(mainMethod.lastconvo!=''){
				updatemessages();
			}
			else{
				$('.user').html('<div><p style="padding-top:7px;text-align:center; color:rgba(229,0,101,1); margin-top:15px;">No conversations yet</p></div>');
			}
		}

		//Both the functions are used to scroll to the bottom of the chat section page
		//Slow : Used when the downBtn is clicked
		function updateScroll(){
			$("#chatspace").animate({ scrollTop: $('#chatspace').prop("scrollHeight")}, 300);
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
				var notification = new Notification('WSChat',{
					body:"Hey! You have new messages",
					icon:"/Chat/favicon.ico"
				});
				notification.onclick = function(){
					mainMethod.notificationbox = 0;
					var isChrome = !!window.chrome && !!window.chrome.webstore;
					var newWindow = null;
					if(isChrome){
						if ((newWindow == null) || (newWindow.closed)  )
						  {
						    window.focus('/Chat/index.php','index');
						    notification.close();
						    mainMethod.notificationbox =0;
						  }
					}
					else{
						launchApplication('/Chat/index.php','index');
						mainMethod.notificationbox = 0;
						notification.close();
					}					
				};
			}
		}

		function launchApplication(l_url, l_windowName)
		{
		  if ( typeof launchApplication.winRefs == 'undefined' )
		  {
		    launchApplication.winRefs = {};
		  }
		  if ( typeof launchApplication.winRefs[l_windowName] == 'undefined' || launchApplication.winRefs[l_windowName].closed )
		  {
		    var l_width = screen.availWidth;
		    var l_height = screen.availHeight;

		    var l_params = 'status=1' +
		                   ',resizable=1' +
		                   ',scrollbars=1' +
		                   ',width=' + l_width +
		                   ',height=' + l_height +
		                   ',left=0' +
		                   ',top=0';

		    launchApplication.winRefs[l_windowName] = window.open(l_url, l_windowName, l_params);
		    launchApplication.winRefs[l_windowName].moveTo(0,0);
		    launchApplication.winRefs[l_windowName].resizeTo(l_width, l_height);
		  } else {
		    launchApplication.winRefs[l_windowName].focus()
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
			$("#chatspace").animate({ scrollTop: $(document).height() }, 100);
  			updaterecentlist();
			mainMethod.moreBoolean = true;
		});

		//Changes the CSS of typing area on click
		$('textarea').click(function(){
			$(this).css({"background-color":"rgba(255,225,230,0.1)","color":"#fff"});
		});

		//Changes the CSS of text area while it is inactive
		$('textarea').blur(function(){
			$(this).attr("placeholder","Enter your message");
			$(this).css("background-color","rgba(229,0,101,0.2)");
		});

		//dictionary to convert the month number into letters
		var dict = [];
		dict.push({
			key:   "0",
    		value: "Jan"
		});
		dict.push({
			key:   "1",
    		value: "Feb"
		});
		dict.push({
			key:   "2",
    		value: "Mar"
		});
		dict.push({
			key:   "3",
    		value: "Apr"
		});
		dict.push({
			key:   "4",
    		value: "May"
		});
		dict.push({
			key:   "5",
    		value: "Jun"
		});
		dict.push({
			key:   "6",
    		value: "Jul"
		});
		dict.push({
			key:   "7",
    		value: "Aug"
		});
		dict.push({
			key:   "8",
    		value: "Sep"
		});
		dict.push({
			key:   "9",
    		value: "Oct"
		});
		dict.push({
			key:   "10",
    		value: "Nov"
		});
		dict.push({
			key:   "11",
    		value: "Dec"
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
			if($.trim(message).length!=0){
				var msg = $.trim(message);
				var atrate = "@";
				//calculator function. No DB involved
				if(msg.charAt(0)==atrate){
					var res = msg.split(" ");
					function cleanArray(actual) {
					  var newArray = new Array();
					  for (var i = 0; i < actual.length; i++) {
					    if (actual[i]) {
					      newArray.push(actual[i]);
					    }
					  }
					  return newArray;
					}
					var cleanres = cleanArray(res);
					var result = 0;
					var opindex = 0;
					if(cleanres.length==4){
						if(cleanres[2]=="+"){
							var number1 = parseInt(cleanres[1]);
							var number2 = parseInt(cleanres[3]);
							result = number1 + number2;
						}
						if(cleanres[2]=="-"){
							var number1 = parseInt(cleanres[1]);
							var number2 = parseInt(cleanres[3]);
							result = number1-number2;
						}
						if(cleanres[2]=="*"){
							var number1 = parseInt(cleanres[1]);
							var number2 = parseInt(cleanres[3]);
							result = number1*number2;
						}
						if(cleanres[2]=="/"){
							var number1 = parseInt(cleanres[1]);
							var number2 = parseInt(cleanres[3]);
							result = number1/number2;
						}
					}
					else if(cleanres.length == 2){
						if(cleanres[1].indexOf('+')!=-1){
							opindex = cleanres[1].indexOf('+');
							number1=parseInt(cleanres[1].substring(0,opindex));
							number2=parseInt(cleanres[1].substring(opindex+1,cleanres[1].length));
							result = number1 + number2;
						}
						if(cleanres[1].indexOf('-')!=-1){
							opindex = cleanres[1].indexOf('-');
							number1=parseInt(cleanres[1].substring(0,opindex));
							number2=parseInt(cleanres[1].substring(opindex+1,cleanres[1].length));
							result = number1 - number2;
						}
						if(cleanres[1].indexOf('/')!=-1){
							opindex = cleanres[1].indexOf('/');
							number1=parseInt(cleanres[1].substring(0,opindex));
							number2=parseInt(cleanres[1].substring(opindex+1,cleanres[1].length));
							result = number1 / number2;
						}
						if(cleanres[1].indexOf('*')!=-1){
							opindex = cleanres[1].indexOf('*');
							number1=parseInt(cleanres[1].substring(0,opindex));
							number2=parseInt(cleanres[1].substring(opindex+1,cleanres[1].length));
							result = number1 * number2;
						}
					}
					else if(cleanres.length==3){
						if(cleanres[1].indexOf('+')==-1){
							if(cleanres[2].indexOf('+')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2].substring(1,cleanres[2].length));
								result = number1 + number2;
							}
						}
						if(cleanres[1].indexOf('-')==-1){
							if(cleanres[2].indexOf('-')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2].substring(1,cleanres[2].length));
								result = number1 - number2;
							}
						}
						if(cleanres[1].indexOf('/')==-1){
							if(cleanres[2].indexOf('/')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2].substring(1,cleanres[2].length));
								result = number1 / number2;
							}
						}
						if(cleanres[1].indexOf('*')==-1){
							if(cleanres[2].indexOf('*')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2].substring(1,cleanres[2].length));
								result = number1 * number2;
							}
						}
						if(cleanres[2].indexOf('+')==-1){
							if(cleanres[1].indexOf('+')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2]);
								result = number1 + number2;
							}
						}
						if(cleanres[2].indexOf('-')==-1){
							if(cleanres[1].indexOf('-')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2]);
								result = number1 - number2;
							}
						}
						if(cleanres[2].indexOf('/')==-1){
							if(cleanres[1].indexOf('/')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2]);
								result = number1 / number2;
							}
						}
						if(cleanres[2].indexOf('*')==-1){
							if(cleanres[1].indexOf('*')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2]);
								result = number1 * number2;
							}
						}
					}
					var currentdate = new Date(); 
					var month= currentdate.getMonth();
					var monthletter = dict[month].value;
					var hours = currentdate.getHours();
				    var hours = (hours+24)%24; 
				    var mid='am';
				    if(hours==0){ //At 00 hours we need to show 12 am
				    	hours=12;
				    }
				    else if(hours>12)
				    {
					    hours=hours%12;
					    mid='pm';
				    }
				    if(hours<10){
				    	hours = '0'+hours;
				    }
				    var minutes = currentdate.getMinutes();
				    if(minutes <10){
				    	minutes = '0'+minutes;
				    }
				    var year = currentdate.getFullYear();
				    year = year.toString();
				    year = year.substring(2,4);

				    var date =  currentdate.getDate();
				    if(date<10){
				    	date = '0'+date;
				    }
				    var datetime = date+ " "
				                + monthletter + " " 
				                + year + " "  
				                + hours + ":"  
				                + minutes + ' '+mid;
					$('#messages').append('<div class="textbox"> <div class="righttext"> <p>'+msg+'</p> <span class="time">'+datetime+'</span></div> </div><br>');
					
					setTimeout(function(){
						$('#messages').append($('<div class="textbox"> <div class="lefttext"> <p><span style="text-decoration:underline;">Chatbot calculator</span>: '+result+'</p><span class="time">'+datetime+'</span> </div> </div><br>'));
						$("#chatspace").animate({ scrollTop: $(document).height() },1);
					},200);
					console.log('Bot');
					$('#send').val('');
					$("#chatspace").animate({ scrollTop: $(document).height() },100);
	  				return false;
				}
				//Writes message to a database
				else{
					//encodes and checks if a message is url
					if(isUrl(msg)){
						encodeURI(msg);
					}
					$.ajax({
						url:'/Chat/php/sendmessage.php',
						type:'GET',
						data:{'user2':mainMethod.lastconvo,'msg':message},
						success:function(data){
							$('#messages').html('');
							$('#send').val('');
							$('textarea').attr("placeholder","Enter your message");
							updatemessages();
							//updateScrollinstant();
							updaterecentlist();
							$("#chatspace").animate({ scrollTop: $(document).height() },100);
	  						return false;
	  						console.log(data);
						},
						error:function(data){
							console.log(data);
						}
					});
				}
			}
			else{
				$('#send').val('');
			}
		}


		//Invokes a function which writes messages to database on clicking the enter key
		$(document.body).on('keypress','#send',function(e){
			if(e.keyCode == 13){
				if(e.shiftKey==false){
					if(!mainMethod.lastconvo){
						('#send').val('');
						alert('Select a person whom you want to talk with');
					}
					else{
						submitmessageenter();
					}
				}
			}
		});

		//function to check if a string is an URL
		function isUrl(s) {
		   var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
		   return regexp.test(s);
		}

		//Writes message to database on pressing enter key
		function submitmessageenter(){
			var message = $('#send').val();
			if($.trim(message).length!=0){
				var msg = $.trim(message);
				var atrate = "@";
				//calculator function
				if(msg.charAt(0)==atrate){
					var res = msg.split(" ");
					function cleanArray(actual) {
					  var newArray = new Array();
					  for (var i = 0; i < actual.length; i++) {
					    if (actual[i]) {
					      newArray.push(actual[i]);
					    }
					  }
					  return newArray;
					}
					var cleanres = cleanArray(res);
					var result = 0;
					var opindex = 0;
					if(cleanres.length==4){
						if(cleanres[2]=="+"){
							var number1 = parseInt(cleanres[1]);
							var number2 = parseInt(cleanres[3]);
							result = number1 + number2;
						}
						if(cleanres[2]=="-"){
							var number1 = parseInt(cleanres[1]);
							var number2 = parseInt(cleanres[3]);
							result = number1-number2;
						}
						if(cleanres[2]=="*"){
							var number1 = parseInt(cleanres[1]);
							var number2 = parseInt(cleanres[3]);
							result = number1*number2;
						}
						if(cleanres[2]=="/"){
							var number1 = parseInt(cleanres[1]);
							var number2 = parseInt(cleanres[3]);
							result = number1/number2;
						}
					}
					else if(cleanres.length == 2){
						if(cleanres[1].indexOf('+')!=-1){
							opindex = cleanres[1].indexOf('+');
							number1=parseInt(cleanres[1].substring(0,opindex));
							number2=parseInt(cleanres[1].substring(opindex+1,cleanres[1].length));
							result = number1 + number2;
						}
						if(cleanres[1].indexOf('-')!=-1){
							opindex = cleanres[1].indexOf('-');
							number1=parseInt(cleanres[1].substring(0,opindex));
							number2=parseInt(cleanres[1].substring(opindex+1,cleanres[1].length));
							result = number1 - number2;
						}
						if(cleanres[1].indexOf('/')!=-1){
							opindex = cleanres[1].indexOf('/');
							number1=parseInt(cleanres[1].substring(0,opindex));
							number2=parseInt(cleanres[1].substring(opindex+1,cleanres[1].length));
							result = number1 / number2;
						}
						if(cleanres[1].indexOf('*')!=-1){
							opindex = cleanres[1].indexOf('*');
							number1=parseInt(cleanres[1].substring(0,opindex));
							number2=parseInt(cleanres[1].substring(opindex+1,cleanres[1].length));
							result = number1 * number2;
						}
					}
					else if(cleanres.length==3){
						if(cleanres[1].indexOf('+')==-1){
							if(cleanres[2].indexOf('+')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2].substring(1,cleanres[2].length));
								result = number1 + number2;
							}
						}
						if(cleanres[1].indexOf('-')==-1){
							if(cleanres[2].indexOf('-')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2].substring(1,cleanres[2].length));
								result = number1 - number2;
							}
						}
						if(cleanres[1].indexOf('/')==-1){
							if(cleanres[2].indexOf('/')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2].substring(1,cleanres[2].length));
								result = number1 / number2;
							}
						}
						if(cleanres[1].indexOf('*')==-1){
							if(cleanres[2].indexOf('*')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2].substring(1,cleanres[2].length));
								result = number1 * number2;
							}
						}
						if(cleanres[2].indexOf('+')==-1){
							if(cleanres[1].indexOf('+')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2]);
								result = number1 + number2;
							}
						}
						if(cleanres[2].indexOf('-')==-1){
							if(cleanres[1].indexOf('-')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2]);
								result = number1 - number2;
							}
						}
						if(cleanres[2].indexOf('/')==-1){
							if(cleanres[1].indexOf('/')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2]);
								result = number1 / number2;
							}
						}
						if(cleanres[2].indexOf('*')==-1){
							if(cleanres[1].indexOf('*')!=-1){
								number1 = parseInt(cleanres[1]);
								number2 = parseInt(cleanres[2]);
								result = number1 * number2;
							}
						}
					}
					var currentdate = new Date(); 
					var month= currentdate.getMonth();
					var monthletter = dict[month].value;
					var hours = currentdate.getHours();
				    var hours = (hours+24)%24; 
				    var mid='am';
				    if(hours==0){ //At 00 hours we need to show 12 am
				    	hours=12;
				    }
				    else if(hours>12)
				    {
					    hours=hours%12;
					    mid='pm';
				    }
				    if(hours<10){
				    	hours = '0'+hours;
				    }
				    var minutes = currentdate.getMinutes();
				    if(minutes <10){
				    	minutes = '0'+minutes;
				    }
				    var year = currentdate.getFullYear();
				    year = year.toString();
				    year = year.substring(2,4);

				    var date =  currentdate.getDate();
				    if(date<10){
				    	date = '0'+date;
				    }
				    var datetime = date+ " "
				                + monthletter + " " 
				                + year + " "  
				                + hours + ":"  
				                + minutes + ' '+mid;
					$('#messages').append('<div class="textbox"> <div class="righttext"> <p>'+msg+'</p> <span class="time">'+datetime+'</span></div> </div><br>');
					
					setTimeout(function(){
						$('#messages').append($('<div class="textbox"> <div class="lefttext"> <p><span style="text-decoration:underline;">Chatbot calculator</span>: '+result+'</p><span class="time">'+datetime+'</span> </div> </div><br>'));
						$("#chatspace").animate({ scrollTop: $(document).height() },1);
					},200);
					$('#send').val('');
					$("#chatspace").animate({ scrollTop: $(document).height() },100);
	  				return false;
				}
				//databse involvemnet. writes the message to database
				else{
					//checks and encodes if message is an URL
					if(isUrl(msg)){
						encodeURI(msg);
					}
					$.ajax({
						url:'/Chat/php/sendmessage.php',
						type:'POST',
						data:{'user2':mainMethod.lastconvo,'msg':message},
						success:function(data){
							$('#messages').html('');
							$('#send').val('');
							$('textarea').attr("placeholder","Enter your message");
							updatemessages();
							//updateScrollinstant();
							updaterecentlist();
							$("#chatspace").animate({ scrollTop: $(document).height() },100);
	  						return false;
	  						console.log(data);
						},
						error:function(data){
							console.log(data);
						}
					});
				}
			}
			else{
				$('#send').val('');
			}
		}
	}
	//variables to store the number of unread messages of private chat and group which is displayed below the name in the list
	mainMethod.activenumber = 0;
	mainMethod.activenumbergroup = 0;
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
	mainMethod.groupmorebutton = true;
	//unused
	mainMethod.notificationbox = 0;

	//last seen message timestamp of a mainMethod.groupSelected
	mainMethod.lastseengroup = 0;

	//Initial tab when page is loaded
	mainMethod.tab ='recent';

	//Check bool used for adding memebr to a group using the  modal
	mainMethod.addusersclicked = false;

	//last prepended message timestamp of the groupSelected
	mainMethod.foroldgroupmessages = 0;

	//Variable for storing the recent group clicked
	mainMethod.groupSelected = '';
	//This stores the last text that you have seen from others. This gets updated when you either click on the blinking button moremessages or when a user has unread messages in the 
	//recentlist and you click on it
	mainMethod.lasttext = $('.textbox:last-child').text();

	//Variable to check if a user message is to be displayed or group message
	mainMethod.groupchatspace = 0;

	//variable to check the last group message displayed in the chatspace
	mainMethod.grouptimestamp = 0;
	mainMethod.unreadgroup = 0;

	//variable which is used to store the number of unread private messages
	mainMethod.totalunreadprivate = 0;

	//variable used to store the number of unread group messages
	mainMethod.totalunreadgroup = 0;
	var one = new mainMethod;
});
