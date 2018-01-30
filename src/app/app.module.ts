import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

// Local storage
import { WebStorageModule } from 'ngx-store';

// Material design
import 'hammerjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule,
         MatInputModule,
         MatSelectModule,
         MatTabsModule,
         MatCardModule,
         MatExpansionModule,
         MatIconModule,
         MatTooltipModule,
         MatSnackBarModule,
         MatTableModule,
         MatSlideToggleModule } from '@angular/material';

// Pipes
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';

// FxFlex
import { FlexLayoutModule } from '@angular/flex-layout';

// App
import { AppComponent } from './app.component';
import { SparqlForceComponent } from './sparql-force/sparql-force.component';
import { SparqlTableComponent } from './sparql-table/sparql-table.component';
import { SettingsComponent } from './settings/settings.component';

const appRoutes: Routes = [
  { path: '**', component: AppComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SparqlForceComponent,
    SparqlTableComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    WebStorageModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSlideToggleModule,
    MarkdownToHtmlModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
