<?php

$baseURL = dirname($_SERVER['SCRIPT_NAME']);
$course = strtoupper(substr($_SERVER['REQUEST_URI'], 1));

if (strlen($course) > 0) {
  $title = 'Kursstatistik för ' . $course . ' på Linköpings Universitet';
} else {
  $title = 'Tentan.se - Tentamensresultat på Linköpings Universitet';
}

?>
<!DOCTYPE html>
<html>
  <head>
    <base href="<?php echo $baseURL; ?>/">
    <link href="//fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link type="text/css" rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/materialize/0.97.6/css/materialize.min.css" media="screen,projection">
    <link type="text/css" rel="stylesheet" href="css/app.css">
    <link rel="icon" href="img/favicon.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta charset="utf-8">
    <title><?php echo $title; ?></title>
    <meta name="description" content="Tentan.se är en webbtjänst för att visualisera statistik från kurser på Linköpings universitet." />
    <meta property="og:title" content="<?php echo $title; ?>" />
    <meta property="og:description" content="Tentan.se är en webbtjänst för att visualisera statistik från kurser på Linköpings universitet." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://tentan.se<?php echo $_SERVER['REQUEST_URI']; ?>" />
    <meta property="og:image" content="https://tentan.se/img/ogimage.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="sv_SE" />
    <meta property="og:site_name" content="Tentan.se" />
    <meta name="theme-color" content="#388e3c" />
  </head>
  <body>

    <div id="blurcontainer">
      <div id="container" class="container"></div>
    </div>

    <script src="//code.jquery.com/jquery-3.0.0.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/materialize/0.97.6/js/materialize.min.js"></script>
    <script>
      window.courseCode = '<?php echo @$_GET['course']; ?>';
      window.baseUrl = '<?php echo $baseURL; ?>';
    </script>
    <script src="js/app.js"></script>
    <script>

      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
      ga('create', 'UA-76033203-1', 'auto');
      ga('send', 'pageview');

    </script>

  </body>
</html>
