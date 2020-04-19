import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RotatingGlobeComponent } from './rotating-globe/rotating-globe.component';
import { PopulationGraphComponent } from './population-graph/population-graph.component';
import { InfectionGraphComponent } from './infection-graph/infection-graph.component';


@NgModule({
  declarations: [
    AppComponent,
    RotatingGlobeComponent,
    PopulationGraphComponent,
    InfectionGraphComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
