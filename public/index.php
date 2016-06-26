<?php

$baseURL = dirname($_SERVER['SCRIPT_NAME']) . '/';

?>

<!DOCTYPE html>
<html>
  <head>
    <base href="<?php echo $baseURL; ?>">
    <link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.6/css/materialize.min.css" media="screen,projection">
    <link type="text/css" rel="stylesheet" href="css/app.css">
    <link rel="icon" href="img/favicon.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta charset="utf-8">
    <title>Tentan.se - Tentamensresultat på Linköpings Universitet</title>
    <meta name="description" content="Webbtjänst för att visualisera statistik från kurser på Linköpings universitet." />
    <meta property="og:title" content="Tentamensresultat på Linköpings Universitet" />
    <meta property="og:description" content="Webbtjänst för att visualisera statistik från kurser på Linköpings universitet." />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="img/ogimage.png" />
    <meta property="og:locale" content="sv_SE" />
    <meta property="og:site_name" content="Tentan.se" />
    <meta name="theme-color" content="#388e3c" />
  </head>
  <body>

    <div id="blurcontainer">
      <div id="container" class="container"></div>
    </div>

    <script src="https://code.jquery.com/jquery-3.0.0.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.6/js/materialize.min.js"></script>
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
