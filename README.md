# ISRO Web-App For Xray Binary Visualization

This project was made to visualize the data of high mass xray binaries and low mass xray binaries. It uses plotly.js.

## Starting the app

### npm start
Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The page will reload if you make edits.

## Description of files

### index.js, index.css, App.js , App.css
Contains basic javascript and css code which enable us to render the map component in the html.

### constants.js
Contains the info for making the galactic grid and configuration for the plot.

### map.js
Contains the definition of map component and has three functions

    1. componentDidMount() : React lifecycle method which fetches the data of xray binaries stored at gist.github and after fetching the data the corresponding hover text and other info are pushed in an array for further use by plotly to plot and display the relevant data.

    2. handleClick() : This is a click event handler on each data point (xray binaries) when you click any star it gives the info in text form so that it could be copied and used as required.

    3. render() : react method which employs plotly.js to plot the xray binaries on the galactic spherical grid.

 
## Features of the plot:

    => We can zoom in and rotate the plot to get different views of the plot...
    => If we want to segregate any data then we can click on the legend(on the right) to toggle the plot of that data
    => If the data of a particular xray binary is required in text format then we can click on that xray binary and we will get the data in text format.

    On the top right there are 6 buttons:
    1. Download the plot as png: On clicking it user can download the plot..

    2. Box Select: You can make a box shape on the plot to highlight the stars in a specific region and then if you want you can download it using the 1st button.

    3. Zoom In: As the name suggests you can zoom in the plot.

    4. Zoom Out: As the name suggests you can zoom out of the plot.

    5. Reset: This readjusts the plot to its origin position..
