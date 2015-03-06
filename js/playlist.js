(function($) {
	
	$.extend(mejs.MepDefaults, {
    nextText: 'Next Track',
    previousText: 'Previous Track',
	playlistItems : null,
	loopText : "Toggle Loop",
  });

   //define the button classes 
   var forwardClass = "mejs-forward-button";
		
   var backwardClass = "mejs-backward-button";
   
   playlistDataSelector = ".mejs-playlist-data";
   
   //show debug msg 
   function debugMsg(msg){
	   if(mejs.MepDefaults.debug == true){
		   console.log(msg);
	   }//end if
   }//end dhow debug mesg 
           
    $.extend(MediaElementPlayer.prototype, {
	
	//set the playlist Items url 
    playlistItemsData : null,
	
	//currentItemIndex 
	currentItemIndex : 0,
	
	//lets set the default loop text 
    loopStatus : "none",
	
	//build forward button 
	buildbackward : function(player, controls, layers, media) {
  
	var backwardButton = $("<span class='mejs-button'><button title='"+mejs.MepDefaults.previousText+"' type='button' class='"+backwardClass+"'>"+mejs.MepDefaults.previousText+"</button></span>");
     
	 //append to control 
	 backwardButton.appendTo(this.controls);
	 
	 	//if the backward button is pressed 
		//backward event listener
		$("."+backwardClass).on("click",function(){
		 thisClass.playPrevItem();	//playPrevItem
		});
	
    },//end build forward button 	
      
    //lets build forward button 
    buildforward : function(player, controls, layers, media) {
    
	var forwardButton = $("<span class='mejs-button'><button title='"+mejs.MepDefaults.nextText+"' type='button' class='"+forwardClass+"'>"+mejs.MepDefaults.nextText+"</button></span>");
     
	 //append to control 
	 forwardButton.appendTo(this.controls);
	 
	 //forward button event Listener 
	$("."+forwardClass).on("click",function(){
	 thisClass.playNextItem("manual");	// manual means setting the playNextTriggerType to manual,used to enhance looping decision
	});//end forward event Listener 
	
    },//end build forward button 	
     
	//////////Build Loop 
    buildloop : function(player, controls, layers, media){
		 
	 //loop none 
	 var loopNone = "mejs-loop-none";
	 
	 //loop all
	 var loopAll = "mejs-loop-all";
	 
	 //loop Single 
	 var loopSingle = "mejs-loop-single";
	 
	 //this class
	 thisClass = this;
	 
	//loopText
    var loopText = this.options.loopText;
	 
   //the loop dom 
   var loopDom = "<span  class='mejs-button mejs-loop'><button type='submit' class='"+loopNone+" mejs-loop-button' title='"+loopText+"'>"+loopText+"</button></span>";	

     //lets append to loop 
	$(loopDom).appendTo(this.controls);
	
   //lets listen to events 
   $(document).on("click",".mejs-loop-button",function(evt){
    
	var loopButt = $(this);
	
	//lets get the current Loop status 
	if(thisClass.loopStatus == "none"){//if cur loop is none 
	 
	 //remove the class and add the add loopAll 
	 loopButt.removeClass(loopNone).addClass(loopAll);
	 
	 //set the loop status 
	 thisClass.loopStatus = "all";
	}//end if loop none 
	
	//if current loop status is 
	else if(thisClass.loopStatus == "all"){
     
	 //remove the class and add the add loopAll 
	 loopButt.removeClass(loopAll).addClass(loopSingle);
	 
	  //set the loop status 
	 thisClass.loopStatus = "single";
    }//end if 
    
    //else set loop to off 
    else { 
	//remove the class and add the add loopAll 
	 loopButt.removeClass(loopAll).removeClass(loopSingle).addClass(loopNone);
	 
	 //set the loop status 
	 thisClass.loopStatus = "none";
    }//end set loop to off 	
    
    //show on debug	
	debugMsg("Loop Status: "+thisClass.loopStatus);
	});//end loop on click evt 

	},//end build loop 
	
	
	/*///////////////////Build TrackList /////////
	buildtracklist : function(){
	
    //the dom 
    var trackListDom = $("<div class='mejs-track-list'></div>");	
	
    },//end build Track List 	
	*/
////////////////////////////BUILD PLAYLIST //////// 	 
	 //build the playlist
	 buildplaylist : function(layer, controls, layers, media){
		
		var thisClass = this;
		
		//add the backward 
	    this.buildbackward();
		
		//add forward buttons
		this.buildforward();
		
		//lets build the loop
        this.buildloop();		
		
		//call the playlistItemsPanel for the 
		//this.buildtracklist();
		
		//call the refresh playlist Data to get all the playlist content into a global variable
		console.log(this.refreshPlaylistData());
		
		//lets now set the playlist current item 
		var playlistItems = this.getPlaylistItemsData();
		
		//lets get the first Index's data 
		firstItemData = this.getItemByIndex(0);
		
		if(firstItemData == false){
			return false;
		}//end false 
		
		
		//lets get the first Index
		this.setSrc(firstItemData.itemUrl);
		
		//set the currentItemIndex
		this.currentItemIndex = 0;
		
		
		//lets detect when an audio has finished, playing, we move to the next 
		media.addEventListener("ended",function(){
			//play the next Item 
			thisClass.playNextItem("auto");
		},false);
		
	 },//end build playlist 
	 /////////////////////////////////END Build Playlist ////////////
	 
	
	 //check if the playlist dom and its data exists 
	playListDataExists : function(player, controls, layers, media){
		
		//if the data was provided as an object, then lets use it 
		if(this.options.playlistItems != null){
		  return true;
		}//end if not null 
		
	//lets count the number of list we have	
	if($(playlistDataSelector).find("li").length==0){
      return false;
       }else{
       return true;
       }//end  if 
	   
     },//end func
		
		
		
	//lets refresh playlist data 
    refreshPlaylistData : function(){

	 //lets check if the data really exists 
	 if(this.playListDataExists() == false){
		debugMsg("No playlist data files found, please create one now");
		return false;
	 }//end if no play list data 
	 
		
	//if an array data  was provided as playlist item data , then lets use that 
    if(this.options.playlistItems != null){
    //lest insert the data into our global var 
	this.playlistItemsData = this.options.playlistItems;
	
	
	//return it 
	return this.options.playlistItems;
    }//end if \\
	
		 
	 //lets set a local var of playlist items 
	var playlistItemsDataArray = new Array();
	
	
	/////////////////If html data was provided rather, then lets scan that ///////
	
	//scan playList data 
	var scanPlayListData = $(playlistDataSelector).find("li");
			console.log(scanPlayListData);
	//lets now insert the new playlist data into the array 
	scanPlayListData.each(function(itemIndex){
				
     //lets get the url 
     var itemUrl = $(this).data("url");//end url 
   
      //if the url is empty, lets skip it 
      if(typeof itemUrl == 'undefined'){
	  debugMsg("Some Playlist items do not have source url, Player might fail to on those items");
      }//end skip empty urls 
   
   
	//item name 
    var itemName = $(this).text();
	
	//if the data-name is set ,lets use that 
	if($(this).data("name")){
	 itemName = $(this).data("name");
	}//end if 
	
	//lets set the items data index 
	$(this).attr("id",itemIndex);
	
	//lets push the data into our array 
	playlistItemsDataArray.push({itemName:itemName,itemUrl:itemUrl,itemIndex:itemIndex});
     
	});//end playlist data Item loop 		 
		
    //now lets attach our playlistItem to our Globals 
    this.playlistItemsData = playlistItemsDataArray;
	
	return playlistItemsDataArray;
	},//end refreshPlaylistData function 

	
	
	//theis method is responsible for getting the playlist Item Data 
	getPlaylistItemsData : function(){
		
		//if the playlist items data is empty, then lets scan the dom first
		if(this.playlistItemsData.length == 0){
        this.refreshPlaylistData();		
		}//end if the lenght is empty
		
		return this.playlistItemsData;
	},//end get playlistItemsData 
	
	
	
	///////////////GET ITEM BY ID ///////////
	getItemByIndex : function(itemIndex){
	
	 //lets get the playlistItemsData 
    playlistItems = this.getPlaylistItemsData();
	
	//discontinue if false
	if(playlistItems == false){
		return false;
	}//end discontinue if false
	
	//if debug is true ,lets check if the item exists 
	if(this.options.debug == true){
		if(!playlistItems[itemIndex]){
			consol.log("The Item does not exists, Invalid Index");
			return false;
		}
	}//end if debug is enabled 
	
	return playlistItems[itemIndex];
	},//end get Item By Id 
	
	
	
	
	///////PlayItemByUrl /////////
	playItemByUrl : function(url){
		
		player = this;
		
		//first lets puase player 
		player.pause();//pause Item
		player.setSrc(url);//setSrc
		
		//a hacky fix where the play() doesnt work in event Listenr "ended"
		setTimeout(function () {
		player.load();
		player.play();//play it 
	     },500);
		 
	},//end playItem By Url 
	
	
	
	////Play Item By Index 
	playItemByIndex : function(itemIndex){
	
    //lets get the playlistItemsData 
    playlistItems = this.getPlaylistItemsData();
	
	//discontinue if false
	if(playlistItems == false){
		return false;
	}//end discontinue if false
	
	//console.log(playlistItems);
	
	//lets get the item Index 
	var itemData = playlistItems[itemIndex];

	//now lets play the url an set the title 
	this.playItemByUrl(itemData.itemUrl);
	
	//lets set currentItemIndex to the current Index 
	this.currentItemIndex = itemIndex;
	
	//lets check if its really playing and set the item list in the dom data as active 
	
	},//end play Item By Index 
	
	
	//////////////////PlayNext Item 
	playNextItem : function(playNextTriggerType){
	
	//lets get the playlistItemsData 
    getPlaylistItems = this.getPlaylistItemsData();
     
	 //if the returned playlist items is false 
	if(getPlaylistItems == false){
		return false;
	}//if getPlaylistItems is false
	
	//next Item to play 
	var nextItemIndex = this.currentItemIndex+1;
	
	console.log(getPlaylistItems.length+"-"+nextItemIndex);
	
	//lets get the current Item Index 
	if(nextItemIndex > getPlaylistItems.length-1){//-1 since array starts from 0 thus our index starts from 0 
	 
	//if triggerType is manual we should just provide what the user want 
	if(playNextTriggerType == "manual"){
		nextItemIndex = 0;//restart
	}//end if auto 
	 
	 //if the playNextTriggerType is auto,this is when the loop comes in  
	 else if(playNextTriggerType == "auto"){
	  
	  //if the loop status is none
      if(this.loopStatus == "none"){
		  return false;
	  }
	  
	  //if the loop Status is all, then we should restart index 
	  else if(this.loopStatus == "all"){
		nextItemIndex = 0;//restart  
	  }
	  
	  //if loop status is single ,lets replay the file again
	  else if(this.loopStatus == "single"){
		nextItemIndex = this.currentItemIndex;
	  }//end if single 
	  
	  //if none,lets stop player 
	  else{ return false; }//end 
	  
	 }//end if auto triggerType
	 
	//if its click  
   }//if the current Item is grea
   
   
   //lets retest if the loop mode is single , then we will prevent from moving forward 
   //WE
   if(this.loopStatus == "single"){
		nextItemIndex = this.currentItemIndex;
	}//end if single 
	  
	  
	//lets playItemByIndex 
	this.playItemByIndex(nextItemIndex);
	},//end playNext Item 
	
	
	//////////PLAY PREVIOUS 
	playPrevItem : function(){

	//next Item to play 
	var prevItemIndex = this.currentItemIndex-1;
	
	//if previous Item is less than 1 , return false
	if(prevItemIndex < 0){
	
    //lets get the playlistItemsData 
    getPlaylistItems = this.getPlaylistItemsData();
     
	 //if the returned playlist items is false 
	if(getPlaylistItems == false){
		return false;
	}//if getPlaylistItems is false
	
	//set the prevItem to current Item cos Array ended
	prevItemIndex = getPlaylistItems.length - 1;//array Starts from 0 :P
	}//end if prev item Index is 0 
		
	//play Item By Index 
	this.playItemByIndex(prevItemIndex);	
	},//end play Previous 
	
	
    });//end plugin 
	
})(mejs.$);