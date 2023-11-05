## ImageJ.JS Demo

This repo demonstrate the use of [CheerpJ3](https://labs.leaningtech.com/cheerpj3) to run imagej in the web browser.


## Difference compared to Cheerpj2
 * No need to compile the java code to javascript
 * Any java function can be overwriten by javascript

## How to run

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
