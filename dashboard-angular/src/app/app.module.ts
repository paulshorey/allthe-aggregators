import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HAMMER_GESTURE_CONFIG } from "@angular/platform-browser";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';


import { AppComponent } from "./app.component";
import DashboardModule from "./routes/dashboard/dashboard.module";
import DemoModule from "./routes/demo/demo.module";


@NgModule({
  declarations: [AppComponent],
  imports: [
    RouterModule.forRoot([
      {
        path: "dashboard",
        loadChildren: () => DashboardModule
      },
      {
        path: "",
        loadChildren: () => DemoModule
      }
    ]),
    HttpClientModule, BrowserModule, FormsModule, HttpClientModule, ReactiveFormsModule, BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
