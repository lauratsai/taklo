jQuery.fn.updateWithText = function(text, speed)
{
	var dummy = $('<div/>').html(text);

	if ($(this).html() != dummy.html())
	{
		$(this).fadeOut(speed/2, function() {
			$(this).html(text);
			$(this).fadeIn(speed/2, function() {
				//done
			});
		});
	}
}


jQuery.fn.outerHTML = function(s) {
    return s
        ? this.before(s).remove()
        : jQuery("<p>").append(this.eq(0).clone()).html();
};

function roundVal(temp)
{
	return Math.round(temp * 10) / 10;
}

function kmh2beaufort(kmh)
{
	var speeds = [1, 5, 11, 19, 28, 38, 49, 61, 74, 88, 102, 117, 1000];
	for (var beaufort in speeds) {
		var speed = speeds[beaufort];
		if (speed > kmh) {
			return beaufort;
		}
	}
	return 12;
}

jQuery(document).ready(function($) {

	var news = [];
	var newsIndex = 0;
	var newsDescription = [];
	var newsDate = [];
	var newsLink = [];

	var eventList = [];

	var lastCompliment;
	var compliment;
	
	var newsDelay = 2000;

    moment.lang(lang);

	//connect do Xbee monitor
	// var socket = io.connect('http://rpi-alarm.local:8082');
	// socket.on('dishwasher', function (dishwasherReady) {
	// 	if (dishwasherReady) {
	// 		$('.dishwasher').fadeIn(2000);
	// 		$('.lower-third').fadeOut(2000);
	// 	} else {
	// 		$('.dishwasher').fadeOut(2000);
	// 		$('.lower-third').fadeIn(2000);
	// 	}
	// });


	(function checkVersion()
	{
		$.getJSON('githash.php', {}, function(json, textStatus) {
			if (json) {
				if (json.gitHash != gitHash) {
					window.location.reload();
					window.location.href=window.location.href;
				}
			}
		});
		setTimeout(function() {
			checkVersion();
		}, 3000);
	})();

	//play "Mirror Mirror on the Wall" from Snow White
	/*(function playVideo()
	{
		$('.video').hide();
	
		$('.play-video').on('click', function(ev) {
			$("#video")[0].src += "&autoplay=1";
			ev.preventDefault();
	 });
	})();*/
	
	(function updateTime()
	{
        var now = moment();
        var date = now.format('LLLL').split(' ',4);
        date = date[0] + ' ' + date[1] + ' ' + date[2] + ', ' + date[3];

		$('.date').html(date);
		date2 = now.format('LLLL').substring(date.length, now.format('LLLL').length - 3);
		date3 = now.format('LLLL').substring(now.format('LLLL').length - 3).toLowerCase();
		$('.time').html(date2 +  '<span class="sec">'+now.format('ss')+'</span>' + date3, 2000);
		
		setTimeout(function() {
			updateTime();
		}, 1000);
	})();
	
	(function updateCalendarData()
	{
		new ical_parser("calendar.php", function(cal){
        	events = cal.getEvents();
        	eventList = [];

			for (var i in events) {
        		var e = events[i];
        		for (var key in e) {
        			var value = e[key];
					var separator = key.search(';');
					if (separator >= 0) {
						var mainKey = key.substring(0,separator);
						var subKey = key.substring(separator+1);

						var dt;
						if (subKey == 'VALUE=DATE') {
							//date
							dt = new Date(value.substring(0,4), value.substring(4,6) - 1, value.substring(6,8));
						} else {
							//time
							dt = new Date(value.substring(0,4), value.substring(4,6) - 1, value.substring(6,8), value.substring(9,11), value.substring(11,13), value.substring(13,15));
						}

						if (mainKey == 'DTSTART') e.startDate = dt;
						if (mainKey == 'DTEND') e.endDate = dt;
					}
        		}

                if (e.startDate == undefined){
                    //some old events in Gmail Calendar is "start_date"
                    //FIXME: problems with Gmail's TimeZone
            		var days = moment(e.DTSTART).diff(moment(), 'days');
            		var seconds = moment(e.DTSTART).diff(moment(), 'seconds');
                    var startDate = moment(e.DTSTART);
                } else {
            		var days = moment(e.startDate).diff(moment(), 'days');
            		var seconds = moment(e.startDate).diff(moment(), 'seconds');
                    var startDate = moment(e.startDate);
                }

        		//only add future events, days doesn't work, we need to check seconds
        		if (seconds >= 0) {
                    if (seconds <= 60*60*5 || seconds >= 60*60*24*2) {
                        var time_string = moment(startDate).fromNow();
                    }else {
                        var time_string = moment(startDate).calendar()
                    }
                    if (!e.RRULE) {
    	        		eventList.push({'description':e.SUMMARY,'seconds':seconds,'days':time_string});
                    }
                    e.seconds = seconds;
        		}
                
                // Special handling for rrule events
                if (e.RRULE) {
                    var options = new RRule.parseString(e.RRULE);
                    options.dtstart = e.startDate;
                    var rule = new RRule(options);
                    
                    // TODO: don't use fixed end date here, use something like now() + 1 year
                    var dates = rule.between(new Date(), new Date(2016,11,31), true, function (date, i){return i < 10});
                    for (date in dates) {
                        var dt = new Date(dates[date]);
                        var days = moment(dt).diff(moment(), 'days');
                        var seconds = moment(dt).diff(moment(), 'seconds');
                        var startDate = moment(dt);
                     	if (seconds >= 0) {
                            if (seconds <= 60*60*5 || seconds >= 60*60*24*2) {
                                var time_string = moment(dt).fromNow();
                            } else {
                                var time_string = moment(dt).calendar()
                            }
                            eventList.push({'description':e.SUMMARY,'seconds':seconds,'days':time_string});
                        }           
                    }
                }
            };
        	eventList.sort(function(a,b){return a.seconds-b.seconds});

        	setTimeout(function() {
        		updateCalendarData();
        	}, 60000);
    	});
	})();

	(function updateCalendar()
	{
		table = $('<table/>').addClass('xsmall').addClass('calendar-table');
		opacity = 1;

		for (var i in eventList) {
			var e = eventList[i];		
			
			if (i < NUM_EVENTS){
				var row = $('<tr/>').css('opacity',opacity);
				row.append($('<td/>').html(e.description).addClass('description'));
				row.append($('<td/>').html(e.days).addClass('days dimmed'));
				table.append(row);
			}
		
			opacity -= 1 / eventList.length;
		}

		$('.calendar').updateWithText(table,1000);

		setTimeout(function() {
        	updateCalendar();
        }, 1000);
	})();

	(function updateCompliment()
	{
        //see compliments.js
		while (compliment == lastCompliment) {
     
      //Check for current time  
      var compliments;
      var date = new Date();
      var hour = date.getHours();
      //set compliments to use
      if (hour >= 3 && hour < 9) compliments = morning;
      if (hour >= 9 && hour < 12) compliments = midmorning;
      if (hour >= 12 && hour < 17) compliments = afternoon;
      if (hour >= 17 && hour < 22) compliments = evening;
      if (hour >= 22 || hour < 3) compliments = night;

		compliment = Math.floor(Math.random()*compliments.length);
		}

		$('.compliment').updateWithText(compliments[compliment], 4000);

		lastCompliment = compliment;

		setTimeout(function() {
			updateCompliment(true);
		}, 30000);

	})();

	(function updateRandomText()
	{
		var TOTAL_EVENTS = 10;

		random_table = $('<table/>').addClass('xsmall').addClass('calendar-table');
		opacity = 1;

		for (var i = 0; i < TOTAL_EVENTS; i++) {
			//var e = eventList[i];		
			
			if (i < NUM_EVENTS){
				var row = $('<tr/>').css('opacity',opacity);
				row.append($('<td/>').html("transaction").addClass('description'));
				row.append($('<td/>').html("date").addClass('days dimmed'));
				row.append($('<td/>').html("category").addClass('category xxsmall'));
				random_table.append(row);
			}
		
			opacity -= 1 / NUM_EVENTS;
		}

		$(".financial_table").updateWithText(random_table, 4000);

		setTimeout(function() {
			updateRandomText(true);
		}, 30000);

	})();

	(function updateCurrentWeather()
	{
		var iconTable = {
			'01d':'wi-day-sunny',
			'02d':'wi-day-cloudy',
			'03d':'wi-cloudy',
			'04d':'wi-cloudy-windy',
			'09d':'wi-showers',
			'10d':'wi-rain',
			'11d':'wi-thunderstorm',
			'13d':'wi-snow',
			'50d':'wi-fog',
			'01n':'wi-night-clear',
			'02n':'wi-night-cloudy',
			'03n':'wi-night-cloudy',
			'04n':'wi-night-cloudy',
			'09n':'wi-night-showers',
			'10n':'wi-night-rain',
			'11n':'wi-night-thunderstorm',
			'13n':'wi-night-snow',
			'50n':'wi-night-alt-cloudy-windy'
		}


		$.getJSON('http://api.openweathermap.org/data/2.5/weather?q=Cambridge,us&mode=json', weatherParams, function(json, textStatus) {

			var temp = roundVal(json.main.temp);
			// var temp_min = roundVal(json.main.temp_min);
			// var temp_max = roundVal(json.main.temp_max);

			var wind = roundVal(json.wind.speed);

			var iconClass = iconTable[json.weather[0].icon];
			var icon = $('<span/>').addClass('icon').addClass('dimmed').addClass('wi').addClass(iconClass);
			$('.temp').updateWithText(icon.outerHTML()+temp+'&deg;', 1000);

			// var forecast = 'Min: '+temp_min+'&deg;, Max: '+temp_max+'&deg;';
			// $('.forecast').updateWithText(forecast, 1000);

			var now = new Date();
			//var sunrise = new Date(json.sys.sunrise*1000).toTimeString().substring(0,5);
			//var sunset = new Date(json.sys.sunset*1000).toTimeString().substring(0,5);
			var sunrise = new Date(json.sys.sunrise*1000).toTimeString().substring(0,2) + new Date(json.sys.sunrise*1000).toTimeString().substring(3,5);
			var hours24 = parseInt(sunrise.substring(0, 2), 10);
			var hours = ((hours24 + 11) % 12) + 1;
			var amPm = hours24 > 11 ? 'pm' : 'am';
			var minutes = sunrise.substring(2);
			sunrise = hours + ":" + minutes + amPm;
			
			var sunset = new Date(json.sys.sunset*1000).toTimeString().substring(0,2) + new Date(json.sys.sunrise*1000).toTimeString().substring(3,5);
			var hours24 = parseInt(sunset.substring(0, 2), 10);
			var hours = ((hours24 + 11) % 12) + 1;
			var amPm = hours24 > 11 ? 'pm' : 'am';
			var minutes = sunset.substring(2);
			sunset = hours + ":" + minutes + amPm;
			
			var windString = '<span class="wi wi-strong-wind xdimmed"></span> ' + kmh2beaufort(wind) ;
			var sunString = '<span class="wi wi-sunrise xdimmed"></span> ' + sunrise;
			if (json.sys.sunrise*1000 < now && json.sys.sunset*1000 > now) {
				sunString = '<span class="wi wi-sunset xdimmed"></span> ' + sunset;
			}

			$('.windsun').updateWithText(windString+' '+sunString, 1000);
		});

		setTimeout(function() {
			updateCurrentWeather();
		}, 60000);
	})();

	(function updateWeatherForecast()
	{
		var iconTable = {
			'01d':'wi-day-sunny',
			'02d':'wi-day-cloudy',
			'03d':'wi-cloudy',
			'04d':'wi-cloudy-windy',
			'09d':'wi-showers',
			'10d':'wi-rain',
			'11d':'wi-thunderstorm',
			'13d':'wi-snow',
			'50d':'wi-fog',
			'01n':'wi-night-clear',
			'02n':'wi-night-cloudy',
			'03n':'wi-night-cloudy',
			'04n':'wi-night-cloudy',
			'09n':'wi-night-showers',
			'10n':'wi-night-rain',
			'11n':'wi-night-thunderstorm',
			'13n':'wi-night-snow',
			'50n':'wi-night-alt-cloudy-windy'
		}
			$.getJSON('http://api.openweathermap.org/data/2.5/forecast/', weatherParams, function(json, textStatus) {
			var forecastData = {};

			for (var i in json.list) {
				var forecast = json.list[i];
				var dateKey  = forecast.dt_txt.substring(0, 10);

				if (forecastData[dateKey] == undefined) {
					forecastData[dateKey] = {
						'timestamp':forecast.dt * 1000,
						'icon':forecast.weather[0].icon,
						'temp_min':forecast.main.temp,
						'temp_max':forecast.main.temp
					};
				} else {
					forecastData[dateKey]['icon'] = forecast.weather[0].icon;
					forecastData[dateKey]['temp_min'] = (forecast.main.temp < forecastData[dateKey]['temp_min']) ? forecast.main.temp: forecastData[dateKey]['temp_min']
					forecastData[dateKey]['temp_max'] = (forecast.main.temp > forecastData[dateKey]['temp_max']) ? forecast.main.temp: forecastData[dateKey]['temp_max'];
				}

			}


			var forecastTable = $('<table />').addClass('forecast-table');
			var opacity = 1;
			for (var i in forecastData) {
				var forecast = forecastData[i];
			    var iconClass = iconTable[forecast.icon];
				var dt = new Date(forecast.timestamp);
				var row = $('<tr />').css('opacity', opacity);

				row.append($('<td/>').addClass('day').html(moment.weekdaysShort(dt.getDay())));
				row.append($('<td/>').addClass('icon-small').addClass(iconClass));
				row.append($('<td/>').addClass('temp-max').html(roundVal(forecast.temp_max)));
				row.append($('<td/>').addClass('temp-min').html(roundVal(forecast.temp_min)));

				forecastTable.append(row);
				opacity -= 0.155;
			}


			$('.forecast').updateWithText(forecastTable, 1000);
		});

		setTimeout(function() {
			updateWeatherForecast();
		}, 60000);
	})();

	(function fetchNews() {
		$.feedToJson({
			feed: feed,
			success: function(data){
				news = [];
				newsDescription = [];
				newsDate = [];
				newsLink = [];
				for (var i in data.item) {
					var item = data.item[i];
					if (feedSource == TWITTER){
						news.push(item.description);
						d1 = new Date(item.pubDate);
						newsDate.push(d1);
						//2015-08-17T01:22:01+0000
					}
					else if (feedSource == WSJ){
						news.push(item.title);
						newsDescription.push(item.description);
						newsDate.push(item.pubDate.substring(5, 16));
						newsLink.push(item.link);
					}
					else if (feedSource == INSTAGRAM){
						news.push(item.description);
					}
					else{
						news.push(item.title);
					}
				}
			}
		});
		setTimeout(function() {
			fetchNews();
		}, 6000);
	})();

	(function showNews() {
		if (feedSource == TWITTER){
			var newsItem = news[newsIndex];
			if (newsDate[newsIndex] != undefined){
				var newsItem2 = newsDate[newsIndex].toString().substring(0, 25);
				var newsItem21 = moment(moment(newsDate[newsIndex].toString(), moment.ISO_8601)).fromNow(); 
				var newsItem2 = newsItem2 + " -- " + newsItem21;
				//moment("2010-01-01T05:06:07", )
				//2015-08-17T01:22:01+0000
			}
			$('.news').updateWithText(newsItem, newsDelay);
			$('.newsDate').updateWithText(newsItem2, newsDelay);
			$('.newsDescription').updateWithText("", newsDelay);
			}
		else if (feedSource == WSJ){
			if (newsDate[newsIndex] != undefined){
				var newsItem = news[newsIndex];
				var newsItem2 = newsDate[newsIndex].toString().substring(0, 25);
				var newsItem3 = newsDescription[newsIndex];
			}
			$('.news').updateWithText(newsItem, newsDelay);
			$('.newsDate5').updateWithText(newsItem2, newsDelay);
			$('.newsDescription').updateWithText(newsItem3, newsDelay);
		}
		else if(feedSource == INSTAGRAM){
			var newsItem2 = news[newsDescription];
			$('.newsDate5').updateWithText(newsItem2, newsDelay);
		}
		else{
			if (news[newsIndex] != undefined){
				var newsItem = news[newsIndex];
			}
			$('.news').updateWithText(newsItem,newsDelay);

		}
		
		newsIndex--;
		if (newsIndex < 0) newsIndex = news.length - 1;
		setTimeout(function() {
			showNews();
		}, 5500);
	})();

});
