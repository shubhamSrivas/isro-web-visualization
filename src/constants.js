//Radius of Ascension i.e. Longitude data..
var grid_ra_x = [-180,-150,-120,-90,-60,-30,0,30,60,90,120,150];
var grid_ra_y = [0,0,0,0,0,0,0,0,0,0,0,0,0];
var grid_ra_hovtext = ['180°','150°','120°','90°','60°','30°','0°','330°','300°','270°','240°','210°'];
var grid_ra_textposition = ['middle center', 'middle center', 'middle center', 'middle center', 'middle center', 'middle center', 'middle center', 'middle center', 'middle center', 'middle center', 'middle center', 'middle center'];

//Declination i.e. latitude data
var grid_dec_x = [0,0,0,0,0,0,0];
var grid_dec_y = [-90,-60,-30,0,30,60,90];
var grid_dec_hovtext = ['-90°','-60°','-30°','0°','+30°','+60°','+90°'];
var grid_dec_textposition = ['top center', 'middle center', 'middle center', 'middle center', 'middle center', 'middle center', 'bottom center'];

// configuration for the plot
var mylayout={
    title:{
        text: '',
        font:{
            color: '#fff',
        }
    },
    dragmode: 'zoom',
    font:{
        size: 20,
    },
    autosize: true,
    paper_bgcolor: 'black',
    margin:{
        autoexpand: true,
    },
    geo: {
        projection:{
            type: 'aitoff',
        },
        center:{
            lon: 0,
            lat: 0,
        },
        bgcolor:'#000',
        lonaxis: {
            showgrid: true,
            tick0: 0,
            dtick: 15,
            gridcolor: "#aaa",
            gridwidth: 1
        },
        lataxis: {
            showgrid: true,
            tick0: 90,
            dtick: 30,
            gridcolor: "#aaa",
            gridwidth: 1
        },
        showcoastlines: false,
        showland: false,
        showrivers: false,
        showlakes: false,
        showocean: false,
        showcountries: false,
        showsubunits: false
    },
    showlegend: true,
    legend: {
        font:{
            color: '#fff',
        },
        x: 0.1,
        y: 1.12,
        orientation: 'h',
        bordercolor: "#fff",
    },
}
export {grid_ra_x,grid_ra_y,grid_dec_x,grid_dec_y,grid_ra_hovtext,grid_ra_textposition,grid_dec_hovtext,grid_dec_textposition,mylayout};