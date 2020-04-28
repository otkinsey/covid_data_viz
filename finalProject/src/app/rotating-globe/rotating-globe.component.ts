import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as versor from 'versor';
import { HttpClient } from '@angular/common/http';
import populationDensity from './../../../node_modules/country-json/src/country-by-population-density.json';
import population from './../../../node_modules/country-json/src/country-by-population.json';
import { ActivationEnd } from '@angular/router';
// import { appendFile } from 'fs';

@Component({
  selector: 'app-rotating-globe',
  templateUrl: './rotating-globe.component.html',
  styleUrls: ['./rotating-globe.component.css'],
})
export class RotatingGlobeComponent implements OnInit {
  public populationDensity:{country:string, density:string}[] = populationDensity;
  public population:{county:string, population:string}[] = population;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // console.log("[rotating-globe.components] populationDensity: ",populationDensity);
    // console.log("[rotating-globe.components] population: ",population);

    var population;
    var population_density;
    var countries;
    var country_names;
    
    this.http
        .get('assets/country-by-population.json', {responseType:'json'})
        .subscribe((result: string) => { population = result; console.log("population: ", population) })

    this.http
        .get('assets/country-by-population-density.json', {responseType:'json'})
        .subscribe((result: string) => { population_density = result; console.log("population_density: ", population_density) })

    // loadData();
    var angles = ["λ", "φ", "γ"];
    angles.forEach(function(angle, index){
      d3.select("#rotation").append("div")
        .attr("class", "angle-label angle-label-" + index)
        .html(angle + ": <span>0</span>")

      d3.select("#rotation").append("input")
        .attr("type", "range")
        .attr("class", "angle angle-" + index)
        .attr("min", "-180")
        .attr("max", "180")
        .attr("step", "1")
        .attr("value", "0");
    });
    var globe_container = document.getElementById("globe");
    var width = .5*window.innerWidth, height = globe_container.clientHeight;

    var svg = d3.select("#globe").append("svg")
        .attr("width", width)
        .attr("height", height);

    var projection = d3.geoOrthographic()
        .scale(d3.min([width / 2, height / 2]))
        .translate([width / 2, height / 2])
        .precision(1);

    var path = d3.geoPath()
        .projection(projection);

    var graticule = d3.geoGraticule()
        .step([10, 10]);

    var v0, // Mouse position in Cartesian coordinates at start of drag gesture.
        r0, // Projection rotation as Euler angles at start.
        q0; // Projection rotation as versor at start.

    svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", "#ccc");

    var drag = d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);

    svg.call(drag);

    function dragstarted(){
      var mouse_pos = d3.mouse(this);
      v0 = versor.cartesian(projection.invert(mouse_pos));
      r0 = projection.rotate();
      q0 = versor(r0);
      svg.insert("path")
        .datum({type: "Point", coordinates: projection.invert(mouse_pos)})
        .attr("class", "point point-mouse")
        .attr("d", path); 
    }

    var focused;
    d3.selectAll(".country")
    .on("click", () => rotateMe(event))

    var rotateMe =  function(event) {
      let name = event.target.innerHTML;
      d3.selectAll(`.country_path`).attr("fill", (d) => {
        // var country = getCountryData(d.name);
        var country = getCountryData(d.properties.name);
        var gradient_val = createGradient(country.population_density)
        return gradient_val;
      })
      // let id = country_names.find((c) => c.name = name).id;
      var rotate = projection.rotate();
      var focusedCountry = getCountryGeoJSON(countries, name),//get the clicked country's details
      p = d3.geoCentroid(focusedCountry);
      d3.select(`[name = "${name}"]`).attr("fill", "orange")
      console.log("focused country: ", focusedCountry);
      svg.selectAll(".focused").classed("focused", focused = false);
    
    //Globe rotating
    (function transition() {
      d3.transition()
      .duration(2500)
      .tween("rotate", function() {
        var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
        return function(t) {
          projection.rotate(r(t));
          svg.selectAll("path").attr("d", path)
          .classed("focused", function(d, i) { return name == focusedCountry.name  ? focused = d : false; });
        };
      })
      })();
    };

    function dragged(){
      var mouse_pos = d3.mouse(this);
      var v1 = versor.cartesian(projection.rotate(r0).invert(mouse_pos)),
      q1 = versor.multiply(q0, versor.delta(v0, v1)),
      r1 = versor.rotation(q1);
      if (r1){
        update(r1);
        svg.selectAll("path").attr("d", path);
        svg.selectAll(".point-mouse")
            .datum({type: "Point", coordinates: projection.invert(mouse_pos)});
      }
    }

    function dragended(){
      svg.selectAll(".point").remove();
    }

    function update(eulerAngles){
      angles.forEach(function(angle, index){
        d3.select(".angle-label-" + index + " span").html(Math.round(eulerAngles[index]))
        d3.select(".angle-" + index).property("value", eulerAngles[index])
      });
      
      projection.rotate(eulerAngles);
    }

    // function loadData(){
    //   console.log("loadData: ",population, populationDensity);
    //   let pd = populationDensity;
    //   let density_and_population = population.map((o,i) => {return { country : o.country, 
    //                                                       population: o.population,
    //                                                       population_density: o.country === pd[i].country ? pd[i].density : 
    //                                                       `error: ${pd[i].country} not included in population array` };
    //     })
    //   }

    function getCountryData(name){
      /* todo: add population density and total population to countries properties */
      
      console.log("[getCountryData] name: ", name);
      var pop = population.find((i) => i.country === name );
      
      var pd = population_density.find((i) => i.country === name );
      
      return   {  name: name,
                  total_population: pop.population,
                  population_density: pd.density
                }
    }

    function getCountryGeoJSON(cnt, sel) { 
      for(var i = 0, l = cnt.length; i < l; i++) {
        if(cnt[i].properties.name == sel) {return cnt[i];}
      }
    };
    
    // d3.json("assets/world.json").then((data)=>{ 
    d3.json("assets/countries.json").then((data)=>{ 
      console.log("countries: ",data);
      // countries = topojson.feature(data, data.objects.countries).features;
      countries = topojson.feature(data, data.objects.polygons).features;
      svg.selectAll(".subunit")
      .data(countries)
      .enter().append("path")
      .attr("class", "country_path")
      .attr("d", path)
      .attr("fill", (d) => {
        // var country = getCountryData(d.name);
        var country = getCountryData(d.properties.name);
        var gradient_val = createGradient(country.population_density)
        return gradient_val;
      })
      .attr("name", function(d){ return d.properties.name; })
      .on('mouseover', (d) => { 
        let current_country = document.querySelector(`[name = "${d.properties.name}"]`)
        let data = getCountryData(d.properties.name);
        // let mouse_x = d3.event.pageX - current_country.getBoundingClientRect().x;
        // let mouse_y = d3.event.pageY - current_country.getBoundingClientRect().y;
        let mouse_x = d3.event.pageX+10;
        let mouse_y = d3.event.pageY-20;

        console.log("x: ",mouse_x," y: ", mouse_y);
        var tooltip = document.getElementById("tooltip");
        tooltip.className = "active";
        tooltip.setAttribute("style",`position:absolute;top: ${mouse_y}px;left: ${mouse_x}px`)
        tooltip.innerHTML = `<div> 
                      country: ${data.name}<br>
                      population: ${data.total_population}<br>
                      density: ${data.population_density}
                  </div>`
                  // document.body.append(tooltip);
        return tooltip;
      })// temporary implementation add stylized hover effect
      .on("mouseout",() => { 
        console.log("mouseout");
        let tooltip = document.getElementById("tooltip"); 
        tooltip.className = "";
        // document.body.removeChild(tooltip); 
      })
      .style("stroke", "#fff")
      .style("stroke-width", "1px")
    })
    // .then(()=>{
    //   d3.tsv('assets/country_names.tsv').then((data) =>{
    //     country_names = data;
    //     svg.selectAll(".country_path")
    //     .data(data)
    //     .attr("id", (d)=> d.id)
    //     // .attr("name", (d)=> d.name)
    //     .attr("name", (d)=> d.properties.name)
        // .attr("fill", (d) => {
        //   // var country = getCountryData(d.name);
        //   var country = getCountryData(d.properties.name);
        //   var gradient_val = createGradient(country.population_density)
        //   return gradient_val;
        // })
        // .on('mouseover', (d) => { 
        //   let current_country = document.querySelector(`[name = "${d.name}"]`)
        //   let data = getCountryData(d.name);
        //   // let mouse_x = d3.event.pageX - current_country.getBoundingClientRect().x;
        //   // let mouse_y = d3.event.pageY - current_country.getBoundingClientRect().y;
        //   let mouse_x = d3.event.pageX+10;
        //   let mouse_y = d3.event.pageY-20;
  
        //   console.log("x: ",mouse_x," y: ", mouse_y);
        //   var tooltip = document.getElementById("tooltip");
        //   tooltip.className = "active";
        //   tooltip.setAttribute("style",`position:absolute;top: ${mouse_y}px;left: ${mouse_x}px`)
        //   tooltip.innerHTML = `<div> 
        //                 country: ${data.name}<br>
        //                 population: ${data.total_population}<br>
        //                 density: ${data.population_density}
        //             </div>`
        //             // document.body.append(tooltip);
        //   return tooltip;
        // })// temporary implementation add stylized hover effect
        // .on("mouseout",() => { 
        //   console.log("mouseout");
        //   let tooltip = document.getElementById("tooltip"); 
        //   tooltip.className = "";
        //   // document.body.removeChild(tooltip); 
        // })
      // })
    // })

  
    

    var createGradient =  d3.scaleOrdinal(d3.schemeBlues[9]);

      

    d3.selectAll("input").on("input", function(){
      // get all values
      var nums = [];
      d3.selectAll("input").each(function(d, i){
        nums.push(+d3.select(this).property("value"));
      });
      update(nums);
      svg.selectAll("path").attr("d", path);  
      
    });
  }
}
