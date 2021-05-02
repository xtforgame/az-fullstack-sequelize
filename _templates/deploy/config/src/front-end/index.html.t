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

    <!-- grapesjs -->
    <!-- <link rel="stylesheet" href="https://unpkg.com/grapesjs/dist/css/grapes.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/grapesjs-preset-webpage@0.1.11/dist/grapesjs-preset-webpage.min.css"> -->
    <!-- <script src="https://static.filestackapi.com/v3/filestack-0.1.10.js"></script>
    <script src="https://unpkg.com/grapesjs"></script>
    <script src='https://unpkg.com/grapesjs-blocks-basic'></script>
    <script src='https://cdn.jsdelivr.net/npm/grapesjs-preset-webpage@0.1.11/dist/grapesjs-preset-webpage.min.js'></script> -->



    <!-- <link rel="stylesheet" href="tp/grapesjs@0.16.44/grapes.min.css">
    <link rel="stylesheet" href="tp/grapesjs-preset-webpage@0.1.11/grapesjs-preset-webpage.min.css">
    <script src="tp/filestackapi-v3/filestack-0.1.10.js"></script>
    <script src="tp/grapesjs@0.16.44/grapes.min.js"></script>
    <script src='tp/grapesjs-blocks-basic@0.1.8/grapesjs-blocks-basic.min.js'></script>
    <script src='tp/grapesjs-preset-webpage@0.1.11/grapesjs-preset-webpage.min.js'></script> -->
    <style>
      body,
      html {
        height: 100%;
        margin: 0;
      }
      .gjs-mdl-dialog {
        font-weight: normal !important;
      }
      .gjs-sm-sector, .gjs-clm-tags {
        font-weight: normal !important;
      }

      .gjs-category-title, .gjs-layer-title, .gjs-block-category .gjs-title, .gjs-sm-sector .gjs-sm-title, .gjs-clm-tags .gjs-sm-title {
        font-weight: normal !important;
      }

      .azgjs-view .gjs-cv-canvas {
        top: 0 !important;
        width: 100% !important;
        height: 100% !important;
      }
      .gjs-mdl-container {
        z-index: 10000 !important;
      }
    </style>
    <!-- grapesjs -->

    <style id="insertion-point-jss"></style>
  </head>
  <body>
    <div id="page_main" class="wrapper" />
    <!-- The following scripts will be generared by webpack -->
  </body>
</html>
