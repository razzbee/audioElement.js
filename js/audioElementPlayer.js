(function($) {
	
	$.extend(mejs.MepDefaults, {
    nextText: 'Next Track',
    previousText: 'Previous Track',
	playlistItems : [],
	enableLoop : true,
	loopText : "Toggle Loop",
	toggleTracklistText : "Toggle Track List",
	noTracksText : "No tracks ",
	tracklistPosition : "top"
  });

   
   //we implemented our own loop,so lets disable mejs loop feature
   mejs.MepDefaults.loop = false;
  
   //player Parent Dom
    var playerParentSelector = ".mejs-audio-player-parent";
  
   //define the button classes 
   var forwardClass = "mejs-forward-button";
		
   var backwardClass = "mejs-backward-button";
   
   playlistDataSelector = ".mejs-playlist-data";
   
   //track list domSelector 
   var tracklistDomSelector = "mejs-track-list-panel";
   
   //show debug msg 
   function debugMsg(msg){
	   if(mejs.MepDefaults.debug == true){
		   console.log(msg);
	   }//end if
   }//end dhow debug mesg 
           
    $.extend(MediaElementPlayer.prototype, {
	
	//set the playlist Items url 
    playlistItemsData : new Array(),
	
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
    
	var forwardButton = $("<span class='mejs-button'><button title='"+this.options.nextText+"' type='button' class='"+forwardClass+"'>"+mejs.MepDefaults.nextText+"</button></span>");
     
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
	
	//default Loop Info
	if(this.options.enableLoop == true){
		defaultLoopIcon = loopAll;
		thisClass.loopStatus = "all";
	}//end if loop 	
	else{
	defaultLoopIcon = loopNone;	
	}
	
   //the loop dom 
   var loopDom = "<span  class='mejs-button mejs-loop'><button type='submit' class='"+defaultLoopIcon+" mejs-loop-button' title='"+loopText+"'>"+loopText+"</button></span>";	

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
	
	
	
    ////////////////BUILD TRACK LIST /////////
	buildtracklist : function(layer, controls, layers, media){
		
	thisClass = this;
	
	toggleTracklistText = this.options.toggleTracklistText;
	
    //toggleTracklist Button 
	var toggleTracklistButton = "<span class='mejs-button'><button type='button' class='mejs-toggle-tracklist mejs-toggle-tracklist-off' title='"+toggleTracklistText+"'>"+toggleTracklistText+"</button></span>";
	
	//lets append to the controls 
	$(toggleTracklistButton).appendTo(this.controls);
	
	//mejs-track-list-panel 
	var tracklistPanelSelector = ".mejs-track-list-panel";
	
	//if clicked 
	$(".mejs-toggle-tracklist").on("click",function(evt){
		evt.preventDefault();

		//lets toggle class 
		//$(tracklistPanelSelector).toggleClass("mejs-track-list-panel-visible mejs-track-list-panel-hidden");
		
		//slideToggle ,Show or hide the track list 
		$("."+tracklistDomSelector).slideToggle();
		
		//lets change the button 
		$(this).toggleClass("mejs-toggle-tracklist-on","mejs-toggle-tracklist-off");
	});
	
	
	   //lets create the tracklist panel 
		this.createTrackListPanel();
		
		//if any of the track item is clicked 
		$(document).on("click",".mejs-track-item",function(evt){
			
			evt.preventDefault();
	
			//the item id 
			var itemIndex = $(this).attr("id");
			
			//play Item By Id 
			thisClass.playItemByIndex(itemIndex);	
		});
	  
	},//end build track list 
	
	
	
	////////////////////////////////CREATE TRACK LIST PANEL /////
	createTrackListPanel : function(){
	
	//player Parent Dom 
	var playerParent = this.layers.parents(playerParentSelector);
	
	//if there is an existing tracklist dom ,lets remove it 
	playerParent.find("."+tracklistDomSelector).remove();
	
    //the track list panel 
	var trackListPanelDom = $("<div class='"+tracklistDomSelector+"'></div>");
	
     //get the track list 
	var playlistItems = this.getPlaylistItemsData();
	
	//if no data or false 
	if(playlistItems == false){
		//show empty text 
		trackListPanelDom.html(this.options.noTracksText);
		
		//show debug message 
		debugMsg("The track list is empty");
		
		return false;
	}//end if false 
	
	
	//lets loop the data and add it to it 
	playlistItemsLen = playlistItems.length;
	
	//lets loop the array and get the contents 
	for(i =0; i < playlistItemsLen;i++){
		
		var itemObj = playlistItems[i];
		
		//console.log(i);
		
		var itemUrl = itemObj.itemUrl;
		
		var itemName = itemObj.itemName;
		
		//if index exists, lets set t to the index , else lets give it indexing 
		if(itemObj.itemIndex){
			itemId = itemObj.itemIndex;
		}else{
		    itemId = i;
		}
		
		//lets append it to the tracklist dom 
		var trackItemDom = $("<a href='javascript:void();' class='mejs-track-item' id='"+itemId+"'>"+itemName+"</a>");
		
		//appendTo the panel dom 
		trackItemDom.appendTo(trackListPanelDom);

    }//end foreach loop 
	
     
	 //if the tracklist position is top 
	 
	if(this.options.tracklistPosition == "top"){
	//lets now append the trackListPanelDom to the layers 
	trackListPanelDom.prependTo(playerParent);
	}else{
	//if bottom then append 
	trackListPanelDom.appendTo(playerParent);
	}//end if the track list is to be shown at the bottom 
	
	//hide the panelDom 
	trackListPanelDom.hide();
			
	},//end create tracklist panel 
	
	
	
////////////////////////////BUILD PLAYLIST //////// 	 
	 //build the playlist
	 buildplaylist : function(layer, controls, layers, media){
		
		var thisClass = this;
		
		
		//Call refreshPlaylistData(); and this.getPlaylistItemsData() b4 calling any other method 
		
		//call the refresh playlist Data to get all the playlist content into a global variable
		this.refreshPlaylistData();
		
		//lets now set the playlist current item 
		var playlistItems = this.getPlaylistItemsData();
		
		//call buildtracklist to show and hide tracklist 
		this.buildtracklist();
		
		//add the backward 
	    this.buildbackward();
		
		//add forward buttons
		this.buildforward();
		
		//lets build the loop
        this.buildloop();		
			
		//lets get the first Index's data 
		firstItemData = this.getItemByIndex(0);
		
		//if the first item is provided 
		if(typeof firstItemData == 'object'){
			
		//lets get the first Index
		this.playItemByUrl(firstItemData.itemUrl,true);
		
		//set the currentItemIndex
		this.currentItemIndex = 0;
		
		//set Title 
		this.setItemTitle(firstItemData.itemName);
		
		}//end if not false 
		
		media.addEventListener("error",function(){
		//if there are more playlist data 
		if(thisClass.playlistItemsData.length > 1){
			//play the next Item 
			thisClass.playNextItem("auto");
		}//end if 
		});
	
		//lets detect when an audio has finished, playing, we move to the next 
		media.addEventListener("ended",function(){
			//play the next Item 
			thisClass.playNextItem("auto");
		});
		
	 },//end build playlist 
	 /////////////////////////////////END Build Playlist ////////////
	 
	
	 //check if the playlist dom and its data exists 
	playListDataExists : function(player, controls, layers, media){
		
		//if the data was provided as an object, then lets use it 
		if(this.options.playlistItems.length > 0){
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
    if(this.options.playlistItems.length > 0){
    //lest insert the data into our global var 
	this.playlistItemsData = this.options.playlistItems;
	
	
	//return it 
	return this.options.playlistItems;
    }//end if \\
	
	
	/////////////////If html data was provided rather, then lets scan that ///////
	
	//scan playList data 
	var scanPlayListData = $(playlistDataSelector).find("li");
			//console.log(scanPlayListData);
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
	this.playlistItemsData.push({itemName:itemName,itemUrl:itemUrl,itemIndex:itemIndex});
     
	});//end playlist data Item loop 

  //lets set this.options.playlistItems to the scanned results,so that in our next scan,we will not do dom scan 
  this.options.playlistItems = this.playlistItemsData;  
		
    //lets create the tracklist panel 
	this.createTrackListPanel();
	
	return this.playlistItemsData;
	},//end refreshPlaylistData function 

	
	
	//theis method is responsible for getting the playlist Item Data 
	getPlaylistItemsData : function(){
		
		//if the playlist items data is empty, then lets scan the dom first
		if(this.playlistItemsData.length==0){
        this.refreshPlaylistData();		
		
		if(this.playlistItemsData.length ==0){
			return false;
		}//end if 
		
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
	
	
	///////////////SET Track Title //////////
	setItemTitle : function(title){
	
	//lets get the player title 
	titleDom = this.layers.parents(playerParentSelector).find(".mejs-item-title");
	
	//set Title 
	titleDom.text(title);
	
	},///////////end set track title 
	
	///////PlayItemByUrl /////////
	playItemByUrl : function(url,doNotPlay){
		
		thisClass = this;
		
		//first lets puase player 
		thisClass.pause();//pause Item
		thisClass.setSrc(url);//setSrc
		
		//a hacky fix where the play() doesnt work in event Listenr "ended"
		setTimeout(function () {
		thisClass.load();
		
		if(doNotPlay != true){
		thisClass.play();//play it
		}
		
	     },500);
		 
	},//end playItem By Url 
	
	
	
	////Play Item By Index 
	playItemByIndex : function(itemIndex){
	
    //lets get the playlistItemsData 
    playlistItems = this.getPlaylistItemsData();
	
		
		//console.log(this.playlistItemsData);
		
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
	
	//lets set the Item title 
	this.setItemTitle(itemData.itemName);
	
	//tracklistDomSelector
	tracklistSelector = "."+tracklistDomSelector;
	
	//lets check if its really playing and set the item list in the dom data as active 
	$(tracklistSelector).find("a").removeClass("mejs-current-item");
	
	//lets now add the current 
	$(tracklistSelector).find("#"+itemIndex).addClass("mejs-current-item");
	
	tracklistSelector = null;
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



	
	////////Append Item To the end of playlist Items 
	appendItem : function(trackDataObj,playAfterAppend){
		
	//trackDataObj 
	trackDataObj = trackDataObj || null;
	
	//play After Append 
	var playAfterAppend = playAfterAppend || false;
	
	//if not obj or empty 
	if(typeof trackDataObj != "object" && trackDataObj.length < 1){
		debugMsg("Please Provide a valid trackItems to the method");
		return false;
	}//end if 
	
	//lets scan the data first, then we will add the new object to it 
	getPlaylistItems = this.getPlaylistItemsData();
	
	//lets now create the item Index 
	ItemIndex = (this.playlistItemsData.length-1)+1;
	
	//if false 
	if(getPlaylistItems == false){
		ItemIndex = 0;
	}//end if false 
	
	//lets append to the options 
	this.options.playlistItems.push(trackDataObj);

	
	//lets refresh 
	//refresh the playListdata 
	this.refreshPlaylistData(); 
	
	this.buildtracklist();
	

	//if playAfter Append is true 
	if(playAfterAppend == true ){
	
    //play Item 	
	this.playItemByIndex(ItemIndex);
	}//end if play After Append is true 
    
	//return the item Index 
	return ItemIndex;
	},///////////////////////END APPEND 
	
	
	////////Append Item To the end of playlist Items 
	 prependItem : function(trackDataObj,playAfterPrepend){
		
	//trackDataObj 
	trackDataObj = trackDataObj || null;
	
	//play After Append 
	var playAfterPrepend = playAfterPrepend || false;
	
	//if not obj or empty 
	if(typeof trackDataObj != "object" && trackDataObj.length < 1){
		debugMsg("Please Provide a valid trackItems to the method");
		return false;
	}//end if 
	
	
	 //track Index will always be 0 for prepend 
	 ItemIndex = 0;
	 
	 //lets set the item Index 
	 trackDataObj.itemIndex = ItemIndex;
	
	//lets now prepend it to the data Obj 
	this.options.playlistItems.unshift(trackDataObj);
	
     //lets refresh 
	//refresh the playListdata 
	this.refreshPlaylistData(); 
	
	this.buildtracklist();
	
	//if play after prepend 
     if(playAfterPrepend == true){
	//play Item 	
	this.playItemByIndex(ItemIndex); 
	 }//end if play after prepend is true 
	 
	//return the item Index 
	return ItemIndex;
	},
	
    });//end plugin 
	
})(mejs.$);



///////////Audio Elemeent Js 
function audioElementPlayer(selector,paramObj){
	
//for the features lets force a custom feature 
paramObj.features = ['playpause','progress','volume','playlist','duration','current'];
  
  //force strict options 
paramObj.iPadUseNativeControls = false;
 
paramObj.iPhoneUseNativeControls = false;
 
paramObj.AndroidUseNativeControls = false;
	
paramObj.alwaysShowControls = true;

//lets modify user dom 
var audioJsDom = "<div class='mejs-audio-player-parent'><div class='mejs-audio-player'></div></div>";

//wrap the selector 
$(selector).wrap(audioJsDom);

//lets add the title 
$("<h2 class='mejs-item-title'></h2>").prependTo(".mejs-audio-player");

//lets call mediaElementJs 
var mediaElement = new MediaElementPlayer(selector,paramObj);

return mediaElement;

}//end function 
