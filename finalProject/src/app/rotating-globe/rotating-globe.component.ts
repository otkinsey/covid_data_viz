import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as versor from 'versor';

@Component({
  selector: 'app-rotating-globe',
  templateUrl: './rotating-globe.component.html',
  styleUrls: ['./rotating-globe.component.css']
})
export class RotatingGlobeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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
    var width = window.innerWidth, height = globe_container.clientHeight;

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

    d3.json("/assets/countries.json").then((countries)=>{ 
      svg.selectAll(".subunit")
      .data(topojson.feature(countries, countries.objects.polygons).features)
    .enter().append("path")
      .attr("d", path)
      .style("stroke", "#fff")
      .style("stroke-width", "1px")
    })

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
