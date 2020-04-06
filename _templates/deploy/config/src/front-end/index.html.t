---
to: src/front-end/index.html
---
<!DOCTYPE html>
<html>
  <head>
    <!-- The first thing in any HTML file should be the charset -->
    <meta charset="utf-8">
    <!-- Make the page mobile compatible -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="mobile-web-app-capable" content="yes">
    <title><%= h.capitalize(project.name) %></title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <style id="insertion-point-jss"></style>
  </head>
  <body>
    <script src="testlibs/mocha.js"></script>
    <script src="testlibs/chai.js"></script>
    <script src="testlibs/sinon.js"></script>
    <div id="page_main" class="wrapper" />
    <!-- The following scripts will be generared by webpack -->
  </body>
</html>
