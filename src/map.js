// imports
import React, { Component } from "react";
import { csv } from "d3";
import Plot from "react-plotly.js";
import "./map.css";
import StarDataTable from './StarDataTable';
import {
    grid_ra_x, grid_ra_y,
    grid_dec_x, grid_dec_y,
    grid_ra_hovtext,
    grid_ra_textposition,
    grid_dec_hovtext,
    grid_dec_textposition,
    mylayout
} from "./constants";

let details0 = [], details1 = [], details2 = [], details3 = [];
let urls0 = [], urls1 = [], urls2 = [], urls3 = [];

// Map
class Map extends Component {

    state = {
        // contains the star data
        data: [],
        // contains the coordinates that are to be plotted.
        mytrace: [],
        // used to toogle between data and plot
        showPlot: true,
        showData: false,
    }

    // fetching the data on 1st load
    componentDidMount() {
        /*recieves the data and pushes in the arrays given below 
          ras have radius of ascension
          decs have declinations
          mags have the info that if the star is lmxb or hmxb
          hovs have the hover text
        */
        csv("https://gist.githubusercontent.com/shubhamSrivas/4ad348e4ae6df449a6c1e957bfb246d9/raw/bf7e01430a0aa9e23d18161bb7da770182066344/totxbcatalogue.csv").then(data => {
            console.log(data);
            //for the high mass observed ones
            var ras0 = [], decs0 = [], mags0 = [], hovs0 = [];
            //for the high mass non observed ones
            var ras1 = [], decs1 = [], mags1 = [], hovs1 = [];
            //for the low mass observed ones
            var ras2 = [], decs2 = [], mags2 = [], hovs2 = [];
            //for the low mass non observed ones
            var ras3 = [], decs3 = [], mags3 = [], hovs3 = [];

            for (var i = 0; i < data.length; i++) {
                // Check if it is high mass aur low mass
                var magnitude = parseFloat(data[i].magnitude);

                // Check if it is observed by astrosat or not
                var str;
                var flag;
                if (parseFloat(data[i].isObserved) === 1) flag = 1;
                else flag = 0;
                if (flag === 1) str = "Yes";
                else str = "No";
                // Ra
                var ra_txt = parseFloat(data[i].ra * -1)
                var ra_tmp = ra_txt;
                if (ra_tmp <= -180) {
                    ra_tmp = ra_tmp + 360;
                }
                // Dec
                var dec_tmp = parseFloat(data[i].dec);

                // Publications
                var publications;
                try {
                    publications = JSON.parse(data[i].references);
                }
                catch (e) {
                    var cur = data[i].references, tmp = "";
                    publications = []
                    for (var j = 1; j < cur.length - 1; j++) {
                        if (cur[j] === '"') continue;
                        if (cur[j] === ',' && (cur[j - 1] === '[' || cur[j - 1] === '"' || cur[j + 1] === '"' || cur[j + 1] === ']')) {
                            publications.push(tmp); tmp = "";
                        }
                        else tmp = tmp + cur[j];
                    }
                }

                //related urls
                var url;
                try{
                    url=(JSON.parse(data[i].url));
                }
                catch(e){
                    url=[];
                }
                // sets the hover text
                var hovertext_tmp = "<b>" + data[i].name + "</b><br>(<b> Radius of Ascension: </b>" + ra_txt.toFixed(2) * -1 + "°,<b> Declination: </b>" + dec_tmp.toFixed(2) + "° )<br><b>Observed by Astrosat: </b>" + str;
                var detailtext_tmp = hovertext_tmp;
                if (flag === 1) {
                    detailtext_tmp += "<br><b>Observation Date: </b>" + data[i].Observation_Start_Date;
                    detailtext_tmp += "<br><b>Observation Time: </b>" + data[i].Observation_Start_Time;
                    detailtext_tmp += "<br><b>Observation ID: </b>" + data[i].Observation_ID;
                    detailtext_tmp += "<br><b>Proposal ID: </b>" + data[i].Proposal_ID;
                    detailtext_tmp += "<br><b>Target ID: </b>" + data[i].Target_ID;
                    detailtext_tmp += "<br><b>Source Name: </b>" + data[i].Source_Name;
                    detailtext_tmp += "<br><b>Prime Instrument: </b>" + data[i].Prime_Instrument;
                }
                detailtext_tmp += "<br><b>Publications:</b><br> ";
                for (let i = 0; i < publications.length; i++) {
                    detailtext_tmp += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                    detailtext_tmp += publications[i] + "<br>";
                }

                // pushing the data in respective arrays
                if (magnitude === 1) {
                    if (flag === 1) {
                        ras2.push(ra_tmp);
                        decs2.push(dec_tmp);
                        mags2.push(magnitude);
                        hovs2.push(hovertext_tmp);
                        details2.push(detailtext_tmp);
                        urls2.push(url);
                    }
                    else {
                        ras3.push(ra_tmp);
                        decs3.push(dec_tmp);
                        mags3.push(magnitude);
                        hovs3.push(hovertext_tmp);
                        details3.push(detailtext_tmp);
                        urls3.push(url);
                    }
                }
                else {
                    if (flag === 1) {
                        ras0.push(ra_tmp);
                        decs0.push(dec_tmp);
                        mags0.push(magnitude);
                        hovs0.push(hovertext_tmp);
                        details0.push(detailtext_tmp);
                        urls0.push(url);
                    }
                    else {
                        ras1.push(ra_tmp);
                        decs1.push(dec_tmp);
                        mags1.push(magnitude);
                        hovs1.push(hovertext_tmp);
                        details1.push(detailtext_tmp);
                        urls1.push(url);
                    }
                }
            }
            this.setState({
                data: data,
                mytrace: [
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
                    }, {//Non observed high mass xray binaries
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
                    }, {//observed low mass xray binaries
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
                    }, {//Non observed low mass xray binaries
                        type: 'scattergeo',
                        mode: 'markers',
                        name: 'LMXB Not Observed',
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
                    }, { // Grid RA
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
                    }, { // Grid Dec
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
                    }]
            });
            })
    }

/*Function to display the info of a clicked star so that info can be copied */
    handleClick = (e) => {
        console.log(e);
        var idx = e.points[0].pointIndex;
        var name = e.points[0].data.name;
        console.log(e.points[0].data)
        var detail;
        if (name === "HMXB Not Observed"){
             detail = details1[idx];
             if(urls1[idx].length>0){
                 detail+="<b>Suggested Readings:</b><br>";
             }
             for(let i=0;i<urls1[idx].length;i++){
                let j=i+1;
                detail+= "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style=\"color:white\" href=\""+urls1[idx][i]+"\">Publication"+j+"</a><br>";
             }
        }
        else if(name === "HMXB Observed"){ 
            detail = details0[idx];
            if(urls0[idx].length>0){
                detail+="<b>Suggested Readings:</b><br>";
            }
            for(let i=0;i<urls0[idx].length;i++){
                let j=i+1;
                detail+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style=\"color:white\" href=\""+urls0[idx][i]+"\">Publication"+j+"</a><br>";
            }
        }
        else if(name === "LMXB Not Observed"){ 
            detail = details3[idx];
            if(urls3[idx].length>0){
                detail+="<b>Suggested Readings:</b><br>";
            }
            for(let i=0;i<urls3[idx].length;i++){
                let j=i+1;
                detail+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style=\"color:white\" href=\""+urls3[idx][i]+"\">Publication"+j+"</a><br>";
            }
        }
        else {
            detail = details2[idx];
            if(urls2[idx].length>0){
                detail+="<b>Suggested Readings:</b><br>";
            }
            for(let i=0;i<urls2[idx].length;i++){
                let j=i+1;
                detail+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style=\"color:white\" href=\""+urls2[idx][i]+"\">Publication"+j+"</a><br>";
            }
        }
        document.getElementById('infoarea').innerHTML = `<div id="detail">${detail}</div>`;
        window.scrollBy(0, document.body.scrollHeight || document.documentElement.scrollHeight)
    }

    render() {
        if (this.state.mytrace.length === 0) {
            return (<div><h1>Loading....</h1></div>);
        }
        else {
            return (
                <div>
                    <h1 id="heading">High Mass And Low Mass Xray Binaries</h1>
                    <hr></hr>
                    <div className="section">
                        <div id="tools">
                            <h2>Tools</h2>
                            <button className="btn" onClick={() => { this.setState({ showPlot: true, showData: false }) }}>Show Plot</button>
                            <br></br>
                            <button className="btn" onClick={() => { this.setState({ showData: true, showPlot: false }) }}>Show Data</button>
                        </div>
                        <div id="plots">
                            {this.state.showPlot === false ? null :
                                <Plot
                                    style={{
                                        height: '100vh',
                                        width: '90vw',
                                        cursor: 'context-menu',
                                    }}
                                    data={this.state.mytrace}
                                    layout={mylayout}
                                    onClick={(data) => this.handleClick(data)}
                                />
                            }
                            {this.state.showData === false ? null : <StarDataTable tabledata={this.state.data} />}
                        </div>
                    </div>

 
                    {this.state.showData === true ? null : <div id="infoarea"></div>}
                </div>
            );
        }
    }
}
export default Map;