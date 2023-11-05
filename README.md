## ImageJ.JS

This repo demonstrate the use of [CheerpJ3](https://labs.leaningtech.com/cheerpj3) to run imagej in the web browser.

![ImageJ.JS Screenshot](static/imagej.js-screenshot.png)

Read the [blog post](https://aicell.io/post/improving-imagej.js/) for more details.

## Difference compared to Cheerpj2
 * No need to compile the java code to javascript
 * Any java function can be overwriten by javascript

![Running MorphoLibJ in the browser](static/morpholibj-filters.gif)

## Development

Download and prepare imagej:
```
sh prepare.sh
```

Run the following command to start a web server:
```
python3 -m http.server 8000
```

Then open the following url in your browser:
```
http://localhost:8000
```
