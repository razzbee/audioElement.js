# audioElement.js
A Full Width Responsive Audio Player with advanced features created on top of mediaElement.js

DOC 
====
To use Audio Element  Js include the following in your <head></head> Tag


<link rel="stylesheet" type="text/css" media="all" href="css/audioElementPlayer.css" />

<script src='js/mediaelement-and-player.min.js'></script>
<script src='js/audioElementPlayer.js'></script>


then initialise audioElement js with 

audioElementJs = new audioElementPlayer(selector,parameters);


The Parameter must be in an object so ,below is the default parameters :

audioElementJs = new audioElementPlayer(selector,{
nextText: 'Next Track',
    previousText: 'Previous Track',
	playlistItems : [],
	loopText : "Toggle Loop",
	toggleTracklistText : "Toggle Track List",
	noTracksText : "No tracks ",
	tracklistPosition : "top"
}

You can Feed the playlist data in playlistItems array , a sample of the playlistItems can be found below :

playlistItems : [{itemName:"God Is Good",itemUrl:"GodisGood.mp3"}];

These forms the playlist data , look into the index.html for demo


Another Working Demo : http://upafarma.com
