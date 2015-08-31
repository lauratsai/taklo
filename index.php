<html>
<head>
	<title>Magic Mirror</title>
	<style type="text/css">
		<?php include('css/main.css') ?>
	</style>
	<link rel="stylesheet" type="text/css" href="css/weather-icons.css">
	<script type="text/javascript">
		var gitHash = '<?php echo trim(`git rev-parse HEAD`) ?>';
	</script>
	<meta name="google" value="notranslate" />
	<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
</head>
<body>
	
	<div class="top left"><div class="date small dimmed"></div><div class="time"></div><div class="calendar xxsmall"></div></div>
	<!--<div class="top center-hor"><div style = "font-size:10"><a id="play-video" href="#">Play Video</a></div><br /><iframe id="video" width="420" height="315" src="https://www.youtube.com/embed/mqmIMvWnIV8" frameborder="0" allowfullscreen></iframe></div>-->
	<div class="top left"><div class="date small dimmed"></div><div class="time"></div></div>
	<div class="top right"><div class="windsun small dimmed"></div><div class="temp"></div><div class="forecast small dimmed"></div></div>
	<div class="center-ver center-hor"><!-- <div class="dishwasher light">Vaatwasser is klaar!</div> --></div>
	<div class="lower-third center-hor"><div class="compliment light"></div></div>
	<div class="bottom center-hor"><div class="news medium"></div></div>
	<div class="bottom-date center-hor"><div class="newsDate small2"></div></div>
	<div class="bottom-date-wsj center-hor"><div class="newsDate5 small2"></div></div>	
	<div class="bottom-description-wsj center-hor"><div class="newsDescription mediumsmall"></div></div>
</div>

<script src="js/jquery.js"></script>
<script src="js/jquery.feedToJSON.js"></script>
<script src="js/ical_parser.js"></script>
<script src="js/moment-with-langs.min.js"></script>
<script src="js/config.js"></script>
<script src="js/rrule.js"></script>
<script src="js/main.js?nocache=<?php echo md5(microtime()) ?>"></script>
<!-- <script src="js/socket.io.min.js"></script> -->

</body>
</html>