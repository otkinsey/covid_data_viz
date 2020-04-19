import { Component } from '@angular/core';
import populationDensity from './../../node_modules/country-json/src/country-by-population-density.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'finalProject';
  public populationDensity:{country:string, density:string}[] = populationDensity;
}
