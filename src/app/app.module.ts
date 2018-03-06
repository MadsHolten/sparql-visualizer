import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

// Local storage
import { WebStorageModule } from 'ngx-store';

// Material design
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
         MatSlideToggleModule,
         MatMenuModule,
         MatToolbarModule,
         MatDialogModule,
         MatProgressSpinnerModule,
         MatChipsModule } from '@angular/material';

// Pipes
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';
import { PrefixPipe } from './pipes/prefix.pipe';
import { PrefixSimplePipe } from './pipes/prefix-simple.pipe'

// FxFlex
import { FlexLayoutModule } from '@angular/flex-layout';

// App
import { AppComponent } from './app.component';
import { SparqlForceComponent } from './sparql-force/sparql-force.component';
import { SparqlTableComponent } from './sparql-table/sparql-table.component';
import { SettingsComponent } from './settings/settings.component';

// Toolbar and menus
import { ToolbarComponent, AboutDialog, VideoDialog } from './toolbar/toolbar.component';
import { SettingsDialog } from './toolbar/settings-dialog/settings-dialog.component';

// Services
import { ProjectSettingsService } from './services/project-settings.service';


const appRoutes: Routes = [
  { path: '**', component: AppComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SparqlForceComponent,
    SparqlTableComponent,
    SettingsComponent,
    ToolbarComponent,
    AboutDialog,
    VideoDialog,
    SettingsDialog,
    PrefixPipe,
    PrefixSimplePipe
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
    MatMenuModule,
    MatToolbarModule,
    MatDialogModule,
    MarkdownToHtmlModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    FlexLayoutModule
  ],
  providers: [ ProjectSettingsService, Title ],
  bootstrap: [AppComponent],
  entryComponents: [ 
    AboutDialog,
    VideoDialog,
    SettingsDialog 
  ]
})
export class AppModule { }
