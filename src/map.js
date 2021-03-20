import React, { Component } from "react";
import {csv, map} from "d3";
import Plot from "react-plotly.js";
import "./map.css";

var ras0=[],decs0=[],mags0=[],hovs0=[];
var ras1=[],decs1=[],mags1=[],hovs1=[];
var grid_ra_x = [-180,-150,-120,-90,-60,-30,0,30,60,90,120,150];
var grid_ra_y = [0,0,0,0,0,0,0,0,0,0,0,0,0];
var grid_ra_hovtext = ['180°','150°','120°','90°','60°','30°','0°','330°','300°','270°','240°','210°'];
var grid_ra_textposition = ['middle center', 'middle center', 'middle center', 'middle center', 'middle center', 'middle center', 'middle center', 'middle center', 'middle center', 'middle center', 'middle center', 'middle center'];

// dec
var grid_dec_x = [0,0,0,0,0,0,0];
var grid_dec_y = [-90,-60,-30,0,30,60,90];
var grid_dec_hovtext = ['-90°','-60°','-30°','0°','+30°','+60°','+90°'];
var grid_dec_textposition = ['top center', 'middle center', 'middle center', 'middle center', 'middle center', 'middle center', 'bottom center'];

class Map extends Component { 
    state={
        mytrace : [],
        mylayout : {
            title: 'High Mass and Low Mass Xray Binaries',
            font:{
                size: 20,
            },
            // autosize: true,
            plot_bgcolor:"#000",
            geo: {
                projection:{
                    type: 'aitoff'
                },
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
            showlegend: true
        }
    }
    componentDidMount(){
        csv("https://gist.githubusercontent.com/shubhamSrivas/4ad348e4ae6df449a6c1e957bfb246d9/raw/5ada0c3bd922e4269baa109aa43db529248240db/totxbcatalogue.csv").then(data=>{
        for( var i=0;i<data.length;i++){
            // Check if it is high mass aur low mass
            var magnitude=parseFloat(data[i].magnitude);

            // Check if it is observed by astrosat or not
            var str;
            if(parseFloat(data[i].isObserved)===1)str="Yes";
            else str="No";
            // Ra
            var ra_txt=parseFloat(data[i].ra * -1)
            var ra_tmp=ra_txt;
            if (ra_tmp <= -180){
                ra_tmp=ra_tmp+360;
            }
            // Dec
            var dec_tmp=parseFloat(data[i].dec);
            
            //Publications
            var publications;
            try{
                publications=JSON.parse(data[i].references);
            }
            catch(e){
                var cur=data[i].references,tmp="";
                publications=[]
                for(var j=1;j<cur.length-1;j++){
                    if(cur[j]==='"')continue;
                    if(cur[j]===',' && (cur[j-1]==='['||cur[j-1]==='"'||cur[j+1]==='"'||cur[j+1]===']')){
                        publications.push(tmp);tmp="";
                    }
                    else tmp=tmp+cur[j];
                }
                console.log(data[i].name)
                console.log(publications);
            }
            //
            var hovertext_tmp = "<b>"+data[i].name+"</b><br>(<b> RA: </b>"+ra_txt.toFixed(2)*-1+"°,<b> Dec: </b>"+dec_tmp.toFixed(2)+"° )<br><b>Observed by Astrosat: </b>"+str+"<br><b>Publications:</b> ";

            for( let i=0;i<publications.length;i++){
                if(i>0)hovertext_tmp+="";
                hovertext_tmp+=publications[i]+"<br>";
            }
            if (magnitude === 1){
                ras1.push(ra_tmp);
                decs1.push(dec_tmp);         
                mags1.push(magnitude);
                hovs1.push(hovertext_tmp);
            }
            else{
                ras0.push(ra_tmp);
                decs0.push(dec_tmp);         
                mags0.push(magnitude);
                hovs0.push(hovertext_tmp);
            }
        }  
        });
        this.setState({mytrace : [
            {
                    type: 'scattergeo',
                    mode: 'markers',
                    name: 'High Mass Xray Binaries',
                    lon: ras0, 
                    lat: decs0,
                    text: hovs0,
                    hoverinfo: 'text',
                    marker: {
                    symbol: 'star',
                    size: 6
                    }
            },{
                    type: 'scattergeo',
                    mode: 'markers',
                    name: 'Low Mass Xray binaries',
                    lon: ras1, 
                    lat: decs1,
                    text: hovs1,
                    hoverinfo: 'text',
                    marker: {
                    symbol: 'star',
                    size: 6
                    }
            },
            { // Grid RA
                type: 'scattergeo',
                mode: 'text',
                lon: grid_ra_x, 
                lat: grid_ra_y,
                text: grid_ra_hovtext,
                hoverinfo: 'none',
                textfont: {
                    size: 8,
                    color: '#696969'
                },
                textposition: grid_ra_textposition,
                showlegend: false
            },
            { // Grid Dec
                type: 'scattergeo',
                mode: 'text',
                lon: grid_dec_x, 
                lat: grid_dec_y,
                text: grid_dec_hovtext,
                hoverinfo: 'none',
                textfont: {
                    size: 8,
                    color: '#696969'
                },
                textposition: grid_dec_textposition,
                showlegend: false
            }]})
    }
render() {
return (
<div>
    <Plot
        style={{
            height: '100vh',
            width: '100vw'
        }}
        data={this.state.mytrace}
        layout={this.state.mylayout}
    />
    {/* {console.log(this.state.mytrace)} */}
</div>
);
}
}
export default Map;