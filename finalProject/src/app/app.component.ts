import { Component,OnInit } from '@angular/core';
import populationDensity from './../assets/country-by-population-density.json';
import population from './../assets/country-by-population.json';
import { $ } from 'protractor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'finalProject';
  public populationDensity:{country:string, density:string}[] = populationDensity;
  public population:{country:string, population:string}[] = population;

  toggled = false;

  toggleView(args){ 
    if(!this.toggled){
      // $("#globe, #country_list, #graph").addClass("toggled");
      args.forEach((i) => {
        var elem = document.querySelector(`#${i}`); 
        elem.classList.add("toggled")});
      this.toggled = true;
    }
    else{ 
      args.forEach((i) => {
        var elem = document.querySelector(`#${i}`); 
        elem.classList.remove("toggled")});
      this.toggled = false;
  }
}

  ngOnInit(){

  }

}
