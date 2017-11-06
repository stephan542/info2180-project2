/*Extra Feature
	Multiple background
	End game notification
	Animation and Transition
	
*/
"use strict";
$(function(){
	//gwt all the puzzle pieces
	var puzzlepieces = $("#puzzlearea").children();
	//add puzzle piece class to puzzle piece
	puzzlepieces.addClass("puzzlepiece");
	//Change the cursor from a click to a pointer
	puzzlepieces.css({cursor:"pointer"});
	//get each different brower offset values to get correct cordinates
	var browseroffset=[puzzlepieces.eq(0).offset().left,puzzlepieces.eq(0).offset().top];
	//set current background
	var images =["background.jpg","https://pbs.twimg.com/profile_images/615933280085479424/cXz0u5wG_400x400.jpg","https://pbs.twimg.com/profile_images/2060304342/Post-Timeskip-Luffy1-339x600_400x400.png","https://s-media-cache-ak0.pinimg.com/736x/87/7c/42/877c4280902ca16ca278bbf63cf9ee29--flash-tv-the-flash.jpg","https://pbs.twimg.com/profile_images/692069067792846848/nQOj8_2P.png"];
	var background = "url("+images[Math.floor(Math.random()*images.length)]+")";
	puzzlepieces.css({backgroundImage:background});
	//set the puzzle size
	var puzzlesize = 4;
	//create the block structure depending on the size
	initpieces(puzzlesize);
	//gets the start cordinates 
	var initset = getblockpositions();
	//test if at least one object is moved.
	var moved = false;
	//builds control panel
	image_chooser();
	//shuffles puzzle
	shuffle();
	
	
	puzzlepieces.on('mouseover',function(){
		if(abletomove($(this))){   //test if the piece hovered over is moveable
			$(this).addClass("movablepiece");  //set the piece to the movalbe class
		}
		
	});
	
	puzzlepieces.on('click',function(){
		if($(this).hasClass("movablepiece")){   //check if the price is movable
			move($(this));  // moves the pieces
			moved=true;  //show at least one piece is moved
			puzzlepieces.removeClass("movablepiece");   //removes te movable class from all piece before reslecting it
			
		}
	});
	
	$('#overall').on('mouseover',function(){
		//test if the puzzle it set back to the inital state
		if(initset.toString() === getblockpositions().toString() && moved){  
				puzzlepieces.css({backgroundImage:"url(http://cashmereclutch.com/wp-content/uploads/2010/10/winner-win.jpg)"}); // display winner image
		}
	});
					
	$('#shufflebutton').on('click',function(){
		shuffle();  
		moved=false; //reset moved
		
	});
	
	
	
	//FUNCTIONS
	function shuffle(){
			initpieces(puzzlesize);
			puzzlepieces.css({backgroundImage:background});
			var r,piece;
		
	        //moves around random the puzzle around 500 shuffling it around
			for(var count = 0;count<500;count++){
				r = Math.floor(Math.random()*15);	
				piece = puzzlepieces.eq(r);
				if(abletomove(piece)){
					
					//moves to an avaiable spot
					piece.css({left:Math.floor((getpuzzledata(piece)[0])/100)*100});
					piece.css({top:Math.floor((getpuzzledata(piece)[1])/100)*100});
				}
				 
		    }	
	}
	
	function initpieces(size){
		var pieceCount = 0;   //count each pieces
		//set out the piece of the grid defined in size
		for(var y=0;y<size;y++){
			for(var x=0;x<size;x++){
				//set  a section of the background image to each piece
				puzzlepieces.eq(pieceCount).css({backgroundPositionX:x*-100});
				puzzlepieces.eq(pieceCount).css({backgroundPositionY:y*-100});
				//set the top cord for each piece
				puzzlepieces.eq(pieceCount).css({top:y*100});
				//set the bottom cord for each piece
				puzzlepieces.eq(pieceCount).css({left:x*100});
				pieceCount++;
			}
		}
	}
	
	function getblockpositions(){
		var positions = [];  //array to be add piece current cordinate on the puzzl area
		for(var p=0;p<puzzlepieces.length;p++){
			//add the cord of each to position array
			positions.push([(puzzlepieces.eq(p).offset().left)-browseroffset[0],
						    Math.floor((puzzlepieces.eq(p).offset().top)-browseroffset[1])
						   ]); 
		}
		return positions;
	}
	
	function abletomove(piece){
		return getpuzzledata(piece).length > 0?true:false;  //test if there are space for the piece to move
	}
	
	function move(piece){
		//move and nimate the piece to a position specficed from getpuzzledata
		piece.animate({left:Math.floor((getpuzzledata(piece)[0])/100)*100}, 100);
		piece.animate({top:Math.floor((getpuzzledata(piece)[1])/100)*100}, 100);
	}
	
	function getpuzzledata(piece){
		
		var piecepos = piece.offset();  //egets the piece cordinates
	
		//get all place the piece should move
		var movpos = [[(piecepos.left)-browseroffset[0]-100,Math.floor((piecepos.top)-browseroffset[1])],
					  [(piecepos.left)-browseroffset[0]+100,Math.floor((piecepos.top)-browseroffset[1])],
					  [(piecepos.left)-browseroffset[0],Math.floor((piecepos.top)-browseroffset[1]-100)],
					  [(piecepos.left)-browseroffset[0],Math.floor((piecepos.top)-browseroffset[1]+100)]
					 ];
		
		
		//filter out the valid moves that can be made
		var posible_movpos = movpos.filter(function(counter){
			if(counter[0]<400 && counter[1]<400 && counter[0]>=0 && counter[1]>=0){
				return counter;
			}
		});
		
		//store the cord of the pieces on the board so we can sse where the piece cannot move to
		var unmovpos = getblockpositions();
		//to keep track if there is a piece in the position
		var flag = true;
		
		//loop through the posible moves vs position taken and returns the position if the space is free or a empty
		//array if it is false;
		for(var check =0;check<posible_movpos.length;check++){
			flag=true;  
			for(var checked =0;checked<unmovpos.length;checked++){
				if(posible_movpos[check][0] === unmovpos[checked][0] &&
				   posible_movpos[check][1] === unmovpos[checked][1]){
					flag = false;
				} 
			}
			if(flag === true){
				return posible_movpos[check]; //return the positions that are free
			  }
		}
		if(flag === false){
			return [];  //returns the empty array to signify that it cannot move anywhere
		}	
	}
	
	function image_chooser(resetit){
		var controls = document.querySelector("#controls");
		var heading = document.createElement("h5");
		heading.appendChild(document.createTextNode("Choose an image for the puzzle"));
		controls.appendChild(heading);
		images.forEach(function(image){
			var pick_image = document.createElement("img");
			pick_image.src = image;
			pick_image.height = 64;
			pick_image.width = 64;
			pick_image.border = 1;
			pick_image.onclick = function(){
				change_image(image);
			};
			controls.appendChild(pick_image);
			controls.appendChild(document.createTextNode(" "));
		});
		
		browseroffset=[puzzlepieces.eq(0).offset().left,puzzlepieces.eq(0).offset().top];
	}
	
	//extra function
	function change_image(image){
		background = "url("+image+")";
		puzzlepieces.css({backgroundImage:background});
	}
	
	//reset due to window change
	$(window).resize(function(){
		initpieces(puzzlesize);
		browseroffset=[puzzlepieces.eq(0).offset().left,puzzlepieces.eq(0).offset().top];
		shuffle();
	});
	
});

