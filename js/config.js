//customizable
var name = "Alice";
var alarmHour = 6;
var alarmMinute = 30; //Do not set past 59
var alarmMeridian = "A"; //A or P
var printAlarm = "6:30AM";
var feedSource = 3;
//1 - Twitter
//2 - Instagram
//3 - WSJ
//4 - CNN
//5 - NYTimes

//how many events displayed on Calendar?
var NUM_EVENTS = 10;

//change weather params here:
//units: metric or imperial
var weatherParams = {
    'q':'Philadelphia,PA',
    'units':'imperial',
    'lang':lang
};

// for navigator language
var lang = window.navigator.language;
// you can change the language
// var lang = 'en';

//sets moment.js lang
moment.lang(lang);

//Spectra's playlist
var songArray = [
	{
		name: "Man in the Mirror",
		artist: "Michael Jackson",
		year: "1988"
	},
	{
		name: "My Mirror Speaks",
		artist: "Death Cab for Cutie",
		year: "2009"
	},
	{
		name: "My Mirror Speaks",
		artist: "Death Cab for Cutie",
		year: "2009"
	},
	{
		name: "Smoke + Mirrors",
		artist: "Imagine Dragons",
		year: "2009"
	},
	{
		name: "Mirror, Mirror",
		artist: "Def Leppard",
		year: "1981"
	},
	{
		name: "Mirrors",
		artist: "Justin Timberlake",
		year: "2013"
	},
	{
		name: "Mirror, Mirror",
		artist: "Def Leppard",
		year: "1981"
	},
	{
		name: "I'll Be Your Mirror",
		artist: "The Velvet Underground",
		year: "1966"
	},
	{
		name: "Smash the Mirror",
		artist: "The Who",
		year: "1969",
		note: "This song promotes mirror abuse."
	},
	{
		name: "Rearview Mirror",
		artist: "Pearl Jam",
		year: "1993"
	},
	{
		name: "Objects in the Rearview Mirror May Appear Closer Than They Are",
		artist: "Meat Loaf",
		year: "1993"
	},
	{
		name: "Mirror Man",
		artist: "Human League",
		year: "1994"
	},
	{
		name: "Go to the Mirror!",
		artist: "The Who",
		year: "1969"
	},
	{
		name: "Mirror Mirror",
		artist: "Blind Guardian",
		year: "1998"
	},
	{
		name: "I Never Go Around Mirrors!",
		artist: "Lefty Frizzell",
		year: "1983"
	},
	{
		name: "The Screen Behind the Mirror",
		artist: "Enigma",
		year: "2000"
	},
	{
		name: "The Mirror",
		artist: "Dream Theater",
		year: "1994"
	},
	{
		name: "Dream of Mirrors",
		artist: "Iron Maiden",
		year: "1994"
	},
	{
		name: "Ghost in the Mirror",
		artist: "Motionless in White",
		year: "2009"
	},
	{
		name: "Mirror in the Bathroom",
		artist: "The English Beat",
		year: "1980"
	},
	{
		name: "Mirror Man",
		artist: "Captain Beefheart and His Magic Band",
		year: "1979"
	},
	{
		name: "Son of Mirror Man (Mere Man)",
		artist: "Captain Beefheart and His Magic Band",
		year: "1968"
	},
	
];

//feed source constants
var TWITTER = 1;
var INSTAGRAM = 2;
var WSJ = 3;
var CNN = 4;
var NYTIMES = 5;

//set alarmBoole
if (printAlarm.indexOf("P") > -1){
	var alarmBoole = alarmHour + 12;
}
else {
	var alarmBoole = alarmHour;
}

//set RSS feed
if (feedSource == TWITTER){
	var feed = 'https://script.googleusercontent.com/macros/echo?user_content_key=pAtTLF6_Wx1VsrgaPst5OqOBcXaA7sgj5L6T1d_-vFcnnwLEAi0s7B13j-7WYHMpq4Y708mFJ-b4mAJ71h8YKOXvV2lkqYcvm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnGWPa3klBRhrFvS2X-s_RsFnMhcQrQeSEdOFKSz4xLz0zM1t57f7dIMg_FNa1L0jfi5ma1nUJcHuAz_02T9Z4aw10kcuhaTZndAMOY8IX9PP&lib=M_tLyEO7ilhYy2ZHCPI2thkoU2qvfDcTZ'
}
else if (feedSource == INSTAGRAM){
	var feed = 'http://widget.stagram.com/rss/n/akamaitechnologies';
}
else if (feedSource == WSJ){
	var feed = 'http://www.wsj.com/xml/rss/3_7014.xml';
}
else if (feedSource == CNN){
	var feed = 'http://rss.cnn.com/rss/edition.rss';
}
else if (feedSource == NYTIMES){
	var feed = 'http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml';
}
else{
	
}

//for "Happy ____!"
var day = moment().format('dddd');

//for alarm
var currentDate = new Date();
var currentMom = moment();
if (currentDate.getHours() > alarmBoole){	
	var wakeHour = (23 - currentDate.getHours() + alarmHour);
	if (wakeHour >= 24){
		wakeHour = wakeHour % 12;
	}
	var wakeMinute = (60 - currentDate.getMinutes() + alarmMinute) % 60;
	
	if (wakeHour == 0){
		var printTime = "in " + wakeMinute + " minutes";
	}
	else{
		var printTime = "in " + wakeHour + " hours, " + wakeMinute + " minutes";
	}
}
else if (currentDate.getHours() <= alarmBoole){
	var wakeHour = (alarmHour - currentDate.getHours());
	if (wakeHour >= 24){
		wakeHour = wakeHour % 12;
	}
	wakeHour = wakeHour - 1;
	var wakeMinute = (60 - currentDate.getMinutes() + alarmMinute) % 60;
	
	if (wakeHour == 0){
		var printTime = "in " + wakeMinute + " minutes";
	}
	else{
		var printTime = "in " + wakeHour + " hours, " + wakeMinute + " minutes";
	}
}
else{
	
}

// compliments:

var randSong = Math.floor(Math.random() * songArray.length);
var morning = [
			'Good morning, sunshine!', //use for example
			"Don't forget to brush your teeth!",
            'Enjoy your day!',
            'How did you sleep?',
			"Strike a pose!",
			//"Faster forward, the future is now!",
			"I like waking up to the song '" + songArray[randSong].name + "' by " + songArray[randSong].artist + " (" + songArray[randSong].year + ")."
        ];
var midmorning = [
			'Greetings, ' + name + '!', //use for example
			'How was breakfast?',
			"It's almost time for lunch!",
			"Time to get to work!  Or just hang out.",
			"Make a silly face!", 
			//"Faster forward, the future is now!", //use for example
			"Mid-morning tune: '" + songArray[randSong].name + "' by " + songArray[randSong].artist + " (" + songArray[randSong].year + ")."
		];
        
var afternoon = [
            'Hello, beautiful!',
            'You look sexy!',
            "Good afternoon, " + name + "!",
            'Looking good today!',
			"Happy " + day + "!",
			"Make a scary face!",
			"Is heaven missing an angel?  If so, I'm sure you could find it.", 
			//"Faster forward, the future is now!",
			"My afternoon jam: '" + songArray[randSong].name + "' by " + songArray[randSong].artist + " (" + songArray[randSong].year + ")."
        ];

var evening = [
            'Hi, sexy!', //use for example
            'Wow, you look hot!',
            'You look nice!',
			'Are you going out tonight?',
			'How was dinner?',
            "Good evening, " + name + "!",
			"Don't forget to brush your teeth!",
			"Want to watch a movie?", 
			//"Faster forward, the future is now!",
			"Your alarm is set for " + printAlarm + ". If you sleep now, you must wake up " + printTime + ".",
			"For this evening, may I recommend '" + songArray[randSong].name + "' by " + songArray[randSong].artist + " (" + songArray[randSong].year + ")?"
        ];
var night = [
            "Good night, " + name + "!",
			"It's almost time to sleep!",
			"Are you packed for the morning?",
			"Your alarm is set for " + printAlarm + ". If you sleep now, you must wake up " + printTime + ".", //use for example
			"At night, I listen to '" + songArray[randSong].name + "' by " + songArray[randSong].artist + " (" + songArray[randSong].year + ")."//use for example
        ];