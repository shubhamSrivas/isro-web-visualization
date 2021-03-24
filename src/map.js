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
        // contains the coordinates that are to be plotted.
        mytrace : []
    }

    //used to fetch the data
    componentDidMount(){
        /*recieves the data and pushes in the arrays given below 
          ras have radius of ascension
          decs have declinations
          mags have the info that if the star is lmxb or hmxb
          hovs have the hover text
        */
        csv("https://gist.githubusercontent.com/shubhamSrivas/4ad348e4ae6df449a6c1e957bfb246d9/raw/ce2bcf5bb4e0558e29d0b166d11755fec1547e04/totxbcatalogue.csv").then(data=>{
           
        //for the high mass observed ones
        var ras0=[],decs0=[],mags0=[],hovs0=[];
        //for the high mass non observed ones
        var ras1=[],decs1=[],mags1=[],hovs1=[];
        //for the low mass observed ones
        var ras2=[],decs2=[],mags2=[],hovs2=[];
        //for the low mass non observed ones
        var ras3=[],decs3=[],mags3=[],hovs3=[];
        
        for( var i=0;i<data.length;i++){
            // Check if it is high mass aur low mass
            var magnitude=parseFloat(data[i].magnitude);

            // Check if it is observed by astrosat or not
            var str;
            var flag;
            if(parseFloat(data[i].isObserved)===1)flag=1;
            else flag=0;
            if(flag===1)str="Yes";
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
            // sets the hover text
            var hovertext_tmp = "<b>"+data[i].name+"</b><br>(<b> Radius of Ascension: </b>"+ra_txt.toFixed(2)*-1+"°,<b> Declination: </b>"+dec_tmp.toFixed(2)+"° )<br><b>Observed by Astrosat: </b>"+str;

            if(flag===1){
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

            // pushing the data in respective arrays
            if (magnitude === 1){
                if(flag===1){
                    ras2.push(ra_tmp);
                    decs2.push(dec_tmp);         
                    mags2.push(magnitude);
                    hovs2.push(hovertext_tmp);
                }
                else{
                    ras3.push(ra_tmp);
                    decs3.push(dec_tmp);         
                    mags3.push(magnitude);
                    hovs3.push(hovertext_tmp);
                }
            }
            else{
                if(flag===1){
                    ras0.push(ra_tmp);
                    decs0.push(dec_tmp);         
                    mags0.push(magnitude);
                    hovs0.push(hovertext_tmp);
                }
                else{
                    ras1.push(ra_tmp);
                    decs1.push(dec_tmp);         
                    mags1.push(magnitude);
                    hovs1.push(hovertext_tmp);
                }
            }
        } 
        this.setState({mytrace : [
            {//observed high mass xray binaries
                type: 'scattergeo',
                mode: 'markers',
                name: 'HMXB Observed',
                lon: ras0, 
                lat: decs0,
                text: hovs0,
                hoverinfo: 'text',
                arrangement: 'fixed',
                marker: {
                color: '#0519f7',
                symbol: 'circle',
                size: 6,
                }
            },{//Non observed high mass xray binaries
                type: 'scattergeo',
                mode: 'markers',
                name: 'HMXB Not Observed',
                lon: ras1, 
                lat: decs1,
                text: hovs1,
                hoverinfo: 'text',
                arrangement: 'fixed',
                marker: {
                color: '#4e74f5',
                symbol: 'circle',
                size: 6,
                }
            },{//observed low mass xray binaries
                type: 'scattergeo',
                mode: 'markers',
                name: 'LMXB Observed',
                lon: ras2, 
                lat: decs2,
                text: hovs2,
                hoverinfo: 'text',
                arrangement: 'fixed',
                marker: {
                color: '#f57f0a',
                symbol: 'circle',
                size: 4,
                }
            },{//Non observed low mass xray binaries
                type: 'scattergeo',
                mode: 'markers',
                name: 'LMXB Non Observed',
                lon: ras3, 
                lat: decs3,
                text: hovs3,
                hoverinfo: 'text',
                arrangement: 'fixed',
                marker: {
                color: '#faa652',
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

    /*Function to display the info of a clicked star so that info can be copied */
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
                            width: '98vw',
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