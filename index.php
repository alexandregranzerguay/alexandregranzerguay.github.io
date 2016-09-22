
<?php
/*if(!isset($_POST['submit'])){
	$name = $email = $message = "";
	$nameErr = $emailErr = $messageErr = "";

	//validation

	  if (empty($_POST["name"])) {
		$nameErr = "Name is required";
	  } else {
		$name = $_POST["name"]);
	  }

	  if (empty($_POST["email"])) {
		$emailErr = "Email is required";
	  } else {
		$email = $_POST["email"];
	  }
	  
	  if (empty($_POST["message"])) {
		$messageErr = "Message is required";
	  } else {
		$message = $_POST["message"];
	  }
	  
	$my_email= 'alegra@claudel.org';
	$email_subject = "New Form Submission";
	$email_body: "You have received a new message from $name. \n".
				"email address: $email\n".
				"Message: \n $message".

	$to = "alegra@claudel.org";
	$headers = 'From: '.$email."\r\n";
	$time = date("h:ia")
	$date = date("d/m/Y");
	//Sending email
	mail($to,$email_subject,$email_body,$headers);
*/
}
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Alexandre Granzer-Guay</title>
	<link href="css/bootstrap.min.css" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css?family=Open+Sans|Trocchi" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="main.css">
	<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body>
	<div class="menu clsd">
		<!--Menu-->
		<ul>
			<li class="item1">About me</li>
			<li class="item2">Exerience</li>
			<li class="item3">Skills</li>
			<li class="item4">Contact</li>
		</ul>
	</div>
	<div class="jumbotron">
		<div class="icon-menu">	
			<p><span class="glyphicon glyphicon-menu-hamburger"></span></p>
		</div>
			<div class="intro-info">
				<span class="border">
					ALEXANDRE GRANZER-GUAY
				</span>
			</div>
	</div>
	<div class="about-me row">
				<h2>About Me</h2>
				<p>I am currently a third-year Electrical Engineering student. I have a strong interest in new design ideas and realizing projects.  I hope to specilize in the field of bio-electrical engineering. I consider myself a creative person who is quick to pick up new skills and able to work efficiently and independently. I also consider myself as someone who values attention to detail, has a sense for aesthetics and has strong analytical skills.</p>
	</div>
	<div class="timeline-jumbotron">
		<div class="container">
			<section id="experience" class="section section-experience">
					<h2 class="section-title text-center">EXPERIENCE</h2>
							<div class="fullwidth">
  
							  <div class="timeline group">
								
								<div class="item">
								  <h2 class="title">APP DEVELOPMENT</h2>
								  <p class="description">my team and i were tasked with the development of an app to help the social intergration of people with visual impairements. we were limited to the use of appinventor for this project. we created an application that helps people with visual impairements to vocally store, categorize and search contacts through the use of tags.</p>
								</div>
								
								<div class="item">
								  <h2 class="title">URBAN FARM PLANNING</h2>
								  <p class="description">this project was focused around the development of a farm in an urban area. through the use of online and field research we created a complete project plan to develop an efficient and eco-friendly farm in downtown montreal.</p>
								</div>							
							  </div>
							</div>
			</section>
		</div>
	</div>
	<div class="skills container">
				<h2>SKILLS</h2>
					<div class="col-xs-2"> 	<p>HTML</p> </div>
					<div class="col-xs-3 skill">
						<div class="progress html">
						</div>
					</div>
					<div class="col-xs-2"> 	<p>CSS</p> </div>
					<div class="col-xs-3 skill">
						<div class="progress css">
						</div>
					</div>
					<div class="col-xs-2"> &nbsp </div>
					<div class="col-xs-2 seperator"> &nbsp </div>
					<div class="col-xs-2"> <p>JavaScript</p> </div>
					<div class="col-xs-3 skill">
						<div class="progress javascript">
						</div>
					</div>
					<div class="col-xs-2"> <p>Ruby</p> </div>
					<div class="col-xs-3 skill">
						<div class="progress ruby">
						</div>
					</div>
					<div class="col-xs-2"> &nbsp </div>
	</div>
	<div class="row contact" id="grad">
		<div class="container">
				<section id="hire">
					<h1>Contact Me</h1>
					<form method="POST" action="index.php" enctype="multipart/form-data" name="emailform" class="hidden">
						  <div class="field name-box">
								<input type="text" id="name" placeholder="Who Are You?" name="name"/>
								<label for="name">Name</label>
								<span class="error"><?php echo $nameErr;?></span>
						  </div>

						  <div class="field email-box">
								<input type="text" id="email" placeholder="name@email.com" name="email"/>
								<label for="email">Email</label>
								<span class="error"><?php echo $emailErr;?></span>
						  </div>

						  <div class="field msg-box">
								<textarea id="msg" rows="4" placeholder="Your message goes here..." name="message"/></textarea>
								<label for="msg">Msg</label>
								<span class="error"><?php echo $messageErr;?></span>
						  </div>

						  <input class="button" type="submit" value="Send" />
					</form>
					<div class="resume box">
						<div><a class="email">13agg1@queensu.ca</a></div>
						<span class="bracket">{</span><a href="content/AGG_Resume.pdf" download="AlexandreGranzerGuay-Resume.pdf" id="resume-link" class="fade" >Resume/CV</a><span class="bracket">}</span>
					</div>
				</section>
		</div>
	</div>
	
	<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="jquery-1.11.3.js"></script>
	<!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="js/bootstrap.min.js"></script>
	<!--jQuery file for all animations-->
	<script src="app.js"></script>
</body>
</html>