var socket = io("http://"+window.location.hostname+":"+location.port);

socket.emit('getSettings');

socket.on('update', update);
socket.on('updateSettings', updateSettings);
socket.on('connectSettings', updateSettings);

function update(obj){
	// Teams
	// Away
	try{document.querySelector("div.teamName#away").innerHTML = obj.Teams.Away.Name;}catch(error){console.error(error)}
	document.documentElement.style.setProperty('--c-away', obj.Teams.Away.Color);
	// Home
	try{document.querySelector("div.teamName#home").innerHTML = obj.Teams.Home.Name;}catch(error){console.error(error)}
	document.documentElement.style.setProperty('--c-home', obj.Teams.Home.Color);
	
	// Score (for scoreboard, partials, and post-game)
	if(document.URL.includes("scoreboard.html")||document.URL.includes("partials.html")||document.URL.includes("postgame.html")){
		try{document.querySelector("div.teamScore#home").innerHTML = obj.Teams.Home.Score;}catch(error){console.error(error)}
		try{document.querySelector("div.teamScore#away").innerHTML = obj.Teams.Away.Score;}catch(error){console.error(error)}
	}
	// Only for scoreboard
	if (document.URL.includes("scoreboard.html")) {
		// Ball Strike
		try{document.querySelector("span#ball").innerHTML = obj.Ball;}catch(error){console.error(error)}
		try{document.querySelector("span#strike").innerHTML = obj.Strike;}catch(error){console.error(error)}
		// Outs
		try{document.querySelector("span#number").innerHTML = obj.Out;}catch(error){console.error(error)}
		// Inning and Top/Bottom
		try{document.querySelector(".inning > span#number").innerHTML = obj.Inning;}catch(error){console.error(error)}
		if(obj.Arrow == 1){
			try{document.querySelector(".inning > span#up").classList.remove("disabled");}catch(error){console.error(error)}
			try{document.querySelector(".inning > span#down").classList.add("disabled");}catch(error){console.error(error)}
		}else{
			try{document.querySelector(".inning > span#up").classList.add("disabled");}catch(error){console.error(error)}
			try{document.querySelector(".inning > span#down").classList.remove("disabled");}catch(error){console.error(error)}
		}
		if(obj.Bases[1]){
			try{document.querySelector("div#first").classList.remove("disabled");}catch(error){console.error(error)}
		}else{
			try{document.querySelector("div#first").classList.add("disabled");}catch(error){console.error(error)}
		}
		if(obj.Bases[2]){
			try{document.querySelector("div#second").classList.remove("disabled");}catch(error){console.error(error)}
		}else{
			try{document.querySelector("div#second").classList.add("disabled");}catch(error){console.error(error)}
		}
		if(obj.Bases[3]){
			try{document.querySelector("div#third").classList.remove("disabled");}catch(error){console.error(error)}
		}else{
			try{document.querySelector("div#third").classList.add("disabled");}catch(error){console.error(error)}
		}
	}
	// Only for partials
	// This code is now commented because it have to be tested after @TheTecnoKing will have finished to write the HTML page "inning.html"
	if (document.URL.includes("inning.html")) {
		let extraInningScoreAway = 0,extraInningScoreHome = 0;
		for (let i = 1; i <= localStorage.getItem("MaxInning"); i++) {
			try{
				document.querySelector("#i"+i+" > #away").classList.add("disabled");
				document.querySelector("#i"+i+" > #away").innerHTML = "";
			}catch(error){
				console.error(error);
			}
			try{
				document.querySelector("#i"+i+" > #home").classList.add("disabled");
				document.querySelector("#i"+i+" > #home").innerHTML = "";
			}catch(error){
				console.error(error);
			}			
		}
		for(let i = 1; i <= obj.Inning; i++){
			if(i>localStorage.getItem("MaxInning")){
				extraInningScoreAway += obj.Int[i].A;
				extraInningScoreHome += obj.Int[i].H;
			}else{
				if(i<obj.Inning){
					try{
						document.querySelector("#i"+i+" > #home").classList.remove("disabled");
						document.querySelector("#i"+i+" > #home").innerHTML = obj.Int[i].H;
					}catch(error){
						console.error(error);
					}
					try{
						document.querySelector("#i"+i+" > #away").classList.remove("disabled");
						document.querySelector("#i"+i+" > #away").innerHTML = obj.Int[i].A;
					}catch(error){
						console.error(error);
					}
				}else{
					if(obj.Arrow==2){
						try {
							document.querySelector("#i"+i+" > #away").classList.remove("disabled");
							document.querySelector("#i"+i+" > #away").innerHTML = obj.Int[i].A;
						} catch (error) {
							console.error(error);
						}
					}else if(obj.Int[i].H!=0){
						try {
							document.querySelector("#i"+i+" > #away").classList.remove("disabled");
							document.querySelector("#i"+i+" > #away").innerHTML = obj.Int[i].A;
						} catch (error) {
							console.error(error);
						}
						try {
							document.querySelector("#i"+i+" > #home").classList.remove("disabled");
							document.querySelector("#i"+i+" > #home").innerHTML = obj.Int[i].H;
						} catch (error) {
							console.error(error);
						}
					}else if(obj.Int[i].A!=0){
						try {
							document.querySelector("#i"+i+" > #away").classList.add("disabled");
							document.querySelector("#i"+i+" > #away").innerHTML = obj.Int[i].A;
						} catch (error) {
							console.error(error);
						}
					}
				}
			}
		}
		if(obj.Inning>localStorage.getItem("MaxInning")){
			//add the extra inning div to the scoreboard
			let extraInning=``; // waiting for @TheTecnoKing snippet
			try{document.querySelector("div.inningContainer").innerHTML += extraInning;}catch(error){console.error(error);}
		}
	}
}

function updateSettings(json){
	// Settings
	const obj = JSON.parse(json);
	const oldMaxInning = localStorage.getItem("MaxInning");
	localStorage.setItem("MaxInning",obj.MaxInning);
	localStorage.setItem("BlackenLastInning",obj.BlackenLastInning);
	// update the container of the innings
	if(obj.MaxInning>oldMaxInning){
		// TODO add remaining innings
		for(let i=oldMaxInning+1;i<=obj.MaxInning;i++){
			let inning = ``; //waiting for @TheTecnoKing snippet
			try{document.querySelector("div.inningContainer").innerHTML += inning;}catch(error){console.error(error);}
		}
	}else if(obj.MaxInning>oldMaxInning){
		// TODO remove excess innings
		for(let i=obj.MaxInning+1;i<=oldMaxInning;i++){
			try{document.querySelector("div.inningContainer").removeChild(document.querySelector("div.inningContainer").lastChild);}catch(error){console.error(error);}
		}
	}
}

function connectSettings(json) {
	// Settings
	const obj = JSON.parse(json);
	localStorage.setItem("MaxInning",obj.MaxInning);
	localStorage.setItem("BlackenLastInning",obj.BlackenLastInning);
	// Set the container with the innings 
	let container=``; //waiting for @TheTecnoKing snippet
	for(let i=0;i<obj.MaxInning;i++)
		container+=``; //waiting for @TheTecnoKing snippet
	document.querySelector("div.inningContainer").innerHTML = container;
}