import React, { Component } from "react";
import {csv} from "d3";
import Plot from "react-plotly.js";
import "./map.css";
import {grid_ra_x,grid_ra_y,
    grid_dec_x,grid_dec_y,
    grid_ra_hovtext,grid_ra_textposition,
    grid_dec_hovtext,grid_dec_textposition,
    mylayout} from "./constants";
class Map extends Component { 
    state={
        mytrace : []
    }
    componentDidMount(){
        
        csv("https://gist.githubusercontent.com/shubhamSrivas/4ad348e4ae6df449a6c1e957bfb246d9/raw/ce2bcf5bb4e0558e29d0b166d11755fec1547e04/totxbcatalogue.csv").then(data=>{
                
        var ras0=[],decs0=[],mags0=[],hovs0=[];
        var ras1=[],decs1=[],mags1=[],hovs1=[];
        
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
            }
            //
            var hovertext_tmp = "<b>"+data[i].name+"</b><br>(<b> RA: </b>"+ra_txt.toFixed(2)*-1+"°,<b> Dec: </b>"+dec_tmp.toFixed(2)+"° )<br><b>Observed by Astrosat: </b>"+str;

            if(parseFloat(data[i].isObserved)===1){
                hovertext_tmp+="<br><b>Observation Date: </b>"+data[i].Observation_Start_Date;
                hovertext_tmp+="<br><b>Observation Time: </b>"+data[i].Observation_Start_Time;
                hovertext_tmp+="<br><b>Observation ID: </b>"+data[i].Observation_ID;
                hovertext_tmp+="<br><b>Proposal ID: </b>"+ data[i].Proposal_ID;
                hovertext_tmp+="<br><b>Target ID: </b>"+ data[i].Target_ID;
                hovertext_tmp+="<br><b>Source Name: </b>"+ data[i].Source_Name;
                hovertext_tmp+="<br><b>Prime Instrument: </b>"+ data[i].Prime_Instrument;
            }
            hovertext_tmp+="<br><b>Publications:</b><br> ";
            for( let i=0;i<publications.length;i++){
                hovertext_tmp+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
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
        this.setState({mytrace : [
            {
                    type: 'scattergeo',
                    mode: 'markers',
                    name: 'High Mass Xray Binaries',
                    lon: ras0, 
                    lat: decs0,
                    text: hovs0,
                    hoverinfo: 'text',
                    arrangement: 'fixed',
                    marker: {
                    symbol: 'circle',
                    size: 6,
                    }
            },{
                    type: 'scattergeo',
                    mode: 'markers',
                    name: 'Low Mass Xray Binaries',
                    lon: ras1, 
                    lat: decs1,
                    text: hovs1,
                    hoverinfo: 'text',
                    arrangement: 'fixed',
                    marker: {
                    symbol: 'circle',
                    size: 4
                    }
            },{ // Grid RA
                type: 'scattergeo',
                mode: 'text',
                lon: grid_ra_x, 
                lat: grid_ra_y,
                text: grid_ra_hovtext,
                hoverinfo: 'none',
                textfont: {
                    size: 8,
                    color: '#fff'
                },
                textposition: grid_ra_textposition,
                arrangement: 'perpendicular',
                showlegend: false
            },{ // Grid Dec
                type: 'scattergeo',
                mode: 'text',
                lon: grid_dec_x, 
                lat: grid_dec_y,
                text: grid_dec_hovtext,
                hoverinfo: 'none',
                textfont: {
                    size: 8,
                    color: '#fff'
                },
                textposition: grid_dec_textposition,
                arrangement: 'perpendicular',
                showlegend: false
            }]}) 
        });
    }
    handleClick = (e) => {
        var idx=e.points[0].pointIndex;
        console.log(e.points[0].data.text[idx])
        document.getElementById('clickinfo').innerHTML=e.points[0].data.text[idx];
        window.scrollBy(0,document.body.scrollHeight || document.documentElement.scrollHeight)
    }
    render() {
        if(this.state.mytrace.length===0){
            return (<div><h1>Loading....</h1></div>);
        }
        else{
            return (
                <div>
                    <Plot
                        style={{
                            height: '100vh',
                            width: '100vw',
                            cursor: 'context-menu',
                        }}
                        data={this.state.mytrace}
                        layout={mylayout}
                        onClick={(data)=> this.handleClick(data)}
                    />
                    <div id="clickinfo"></div>
                </div>
            );
        }
    }
}
export default Map;