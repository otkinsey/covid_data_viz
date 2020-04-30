import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-infection-graph',
  templateUrl: './infection-graph.component.html',
  styleUrls: ['./infection-graph.component.css']
})
export class InfectionGraphComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
        // Feel free to change or delete any of the code you see in this editor!
        var svg = d3.select("app-infection-graph").append("svg")
        .attr("width", 960)
        .attr("height", 600);
      
      
      
      var tickDuration = 500;
      
      var top_n = 12;
      var height = 600;
      var width = 960;
      
      const margin = {
        top: 80,
        right: 0,
        bottom: 5,
        left: 0
      };
    
      let barPadding = (height-(margin.bottom+margin.top))/(top_n*5);
        
      let title = svg.append('text')
       .attr('class', 'title')
       .attr('y', 24)
       .html('World Health Organizaton Covid 19 Infection Stats');
    
      // let subTitle = svg.append("text")
      //  .attr("class", "subTitle")
      //  .attr("y", 55)
      //  .html("Brand value, $m");
     
      let caption = svg.append('text')
       .attr('class', 'caption')
       .attr('x', width)
       .attr('y', height-5)
       .style('text-anchor', 'end')
       .html('Source: Interbrand');
  
      //  let date = 2000;
      var date = new Date("2020-02-25");
      
    d3.csv('assets/who_covid19_full_data.csv').then(function(data) {
      //if (error) throw error;
        
        console.log(data);
        
         data.forEach(d => {
          d.total_case = +d.total_cases,
          d.total_deaths = +d.total_deaths,
          d.total_cases = isNaN(d.total_cases) ? 0 : d.total_cases,
          d.date = new Date(d.date),
          d.colour = d3.hsl(Math.random()*360,0.75,0.75)
        });
  
       console.log("data: ", data);
      
       /* maybe filter maybe not */
       let dateSlice = data.filter(d => d.date.getDate() == date.getDate() && !isNaN(d.total_cases) && d.location !== "World")
        .sort((a,b) => b.total_cases - a.total_cases)
        .slice(0, top_n);
    
        dateSlice.forEach((d,i) => d.rank = i);
      
       console.log('dateSlice: ', dateSlice)
    
       let x = d3.scaleLinear()
          .domain([0, d3.max(dateSlice, d => d.total_cases)])
          .range([margin.left, width-margin.right-65]);
    
       let y = d3.scaleLinear()
          .domain([top_n, 0])
          .range([height-margin.bottom, margin.top]);
    
       let xAxis = d3.axisTop()
          .scale(x)
          .ticks(width > 500 ? 5:2)
          .tickSize(-(height-margin.top-margin.bottom))
          .tickFormat(d => d3.format(',')(d));
    
       svg.append('g')
         .attr('class', 'axis xAxis')
         .attr('transform', `translate(0, ${margin.top})`)
         .call(xAxis)
         .selectAll('.tick line')
         .classed('origin', d => d == 0);
    
       svg.selectAll('rect.bar')
          .data(dateSlice, d => d.total_cases)
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('x', x(0)+1)
          .attr('width', d => {
            console.log(x(d.total_cases)-x(0)-1); 
            return x(d.total_cases)-x(0)-1;
          })
          .attr('y', d => y(d.rank)+5)
          .attr('height', y(1)-y(0)-barPadding)
          .style('fill', d => d.colour);
        
       svg.selectAll('text.label')
          .data(dateSlice, d => d.total_cases)
          .enter()
          .append('text')
          .attr('class', 'label')
          .attr('x', d => { console.log(x(d.total_cases)-8); return x(d.total_cases)-8 })
          .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
          .style('text-anchor', 'end')
          .html(d => d.location);
        
      svg.selectAll('text.total_casesLabel')
        .data(dateSlice, d => d.total_cases)
        .enter()
        .append('text')
        .attr('class', 'valueLabel')
        .attr('x', d => { console.log(x(d.total_cases)+5); return x(d.total_cases)+5 })
        .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
        .text(d => d3.format(',.0f')(d.total_cases));
  
      let yearText = svg.append('text')
        .attr('class', 'yearText')
        .attr('x', width-margin.right)
        .attr('y', height-25)
        .style('text-anchor', 'end')
        .html(~~date)
        .call(halo, 10);
       
     let ticker = d3.interval(e => {
        dateSlice = data.filter(d => d.date == date && !isNaN(d.total_cases))
          .sort((a,b) => b.total_cases - a.total_cases)
          .slice(0,top_n);
  
        dateSlice.forEach((d,i) => d.rank = i);
       
        //console.log('IntervalYear: ', dateSlice);
  
        x.domain([0, d3.max(dateSlice, d => d.total_cases)]); 
       
      //   svg.select('.xAxis')
      //     .transition()
      //     .duration(tickDuration)
      //     .ease(d3.easeLinear)
      //     .call(xAxis);
      
      //    let bars = svg.selectAll('.bar').data(dateSlice, d => d.total_cases);
      
      //    bars
      //     .enter()
      //     .append('rect')
      //     .attr('class', d => `bar ${d.location.replace(/\s/g,'_')}`)
      //     .attr('x', x(0)+1)
      //     .attr( 'width', d => { console.log(x(d.total_cases)-x(0)-1); return x(d.total_cases)-x(0)-1})
      //     .attr('y', d => y(top_n+1)+5)
      //     .attr('height', y(1)-y(0)-barPadding)
      //     .style('fill', d => d.colour)
      //     .transition()
      //       .duration(tickDuration)
      //       .ease(d3.easeLinear)
      //       .attr('y', d => y(d.rank)+5);
            
      //    bars
      //     .transition()
      //       .duration(tickDuration)
      //       .ease(d3.easeLinear)
      //       .attr('width', d => { console.log("line 179: ",x(d.total_cases)-x(0)-1); return x(d.total_cases)-x(0)-1})
      //       .attr('y', d => y(d.rank)+5);
              
      //    bars
      //     .exit()
      //     .transition()
      //       .duration(tickDuration)
      //       .ease(d3.easeLinear)
      //       .attr('width', d => { console.log("line 187: ",x(d.total_cases)); return d.total_cases})
      //       .attr('y', d => y(top_n+1)+5)
      //       .remove();
  
      //    let labels = svg.selectAll('.label')
      //       .data(dateSlice, d => d.total_cases);
       
      // //    labels
      // //     .enter()
      // //     .append('text')
      // //     .attr('class', 'label')
      // //     .attr('x', d => x(d.total_cases)-8)
      // //     .attr('y', d => y(top_n+1)+5+((y(1)-y(0))/2))
      // //     .style('text-anchor', 'end')
      // //     .html(d => d.location)    
      // //     .transition()
      // //       .duration(tickDuration)
      // //       .ease(d3.easeLinear)
      // //       .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);
               
      
      // //     labels
      // //       .transition()
      // //       .duration(tickDuration)
      // //         .ease(d3.easeLinear)
      // //         .attr('x', d => x(d.total_cases)-8)
      // //         .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);
       
      // //    labels
      // //       .exit()
      // //       .transition()
      // //         .duration(tickDuration)
      // //         .ease(d3.easeLinear)
      // //         .attr('x', d => x(d.total_cases)-8)
      // //         .attr('y', d => y(top_n+1)+5)
      // //         .remove();
           
  
       
      // //    let valueLabels = svg.selectAll('.total_casesLabel').data(dateSlice, d => d.total_cases);
      
      // //    valueLabels
      // //       .enter()
      // //       .append('text')
      // //       .attr('class', 'valueLabel')
      // //       .attr('x', d => x(d.total_cases)+5)
      // //       .attr('y', d => y(top_n+1)+5)
      // //       .text(d => d3.format(',.0f')(d.total_cases))
      // //       .transition()
      // //         .duration(tickDuration)
      // //         .ease(d3.easeLinear)
      // //         .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);
              
      // //    valueLabels
      // //       .transition()
      // //         .duration(tickDuration)
      // //         .ease(d3.easeLinear)
      // //         .attr('x', d => x(d.total_cases)+5)
      // //         .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
      // //         .tween("text", function(d) {
      // //            let i = d3.interpolateRound(d.total_cases, d.total_cases);
      // //            return function(t) {
      // //              this.textContent = d3.format(',')(i(t));
      // //           };
      // //         });
        
       
      // //   valueLabels
      // //     .exit()
      // //     .transition()
      // //       .duration(tickDuration)
      // //       .ease(d3.easeLinear)
      // //       .attr('x', d => x(d.total_cases)+5)
      // //       .attr('y', d => y(top_n+1)+5)
      // //       .remove();
      
      // //   yearText.html(~~date);
      // // //  console.log("date: ",date);
      // //  if((new Date(date).getMonth() == new Date().getMonth()) && (new Date(date).getDate() == new Date().getDate())) ticker.stop();
      // //  date = d3.format('.1f')((+date) + 0.1);
     },tickDuration);
  
   });
      
   const halo = function(text, strokeWidth) {
    text.select(function() { return this.parentNode.insertBefore(this.cloneNode(true), this); })
      .style('fill', '#ffffff')
       .style( 'stroke','#ffffff')
       .style('stroke-width', strokeWidth)
       .style('stroke-linejoin', 'round')
       .style('opacity', 1);
     
  }
  }

}
