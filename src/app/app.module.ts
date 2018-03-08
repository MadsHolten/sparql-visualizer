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
         MatCheckboxModule,
         MatChipsModule,
         MatPaginatorModule } from '@angular/material';

// Pipes
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';
import { PrefixPipe } from './pipes/prefix.pipe';
import { PrefixSimplePipe } from './pipes/prefix-simple.pipe'

// FxFlex
import { FlexLayoutModule } from '@angular/flex-layout';

// Codemirror
import { CodemirrorModule } from 'ng2-codemirror';

// App
import { AppComponent } from './app.component';
import { QueryFieldComponent } from './query-field/query-field.component';
import { SparqlForceComponent } from './sparql-force/sparql-force.component';
import { SparqlTableComponent } from './sparql-table/sparql-table.component';
import { SettingsComponent } from './settings/settings.component';

// Toolbar and menus
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SettingsDialog } from './toolbar/settings-dialog/settings-dialog.component';

// Dialogs
import { MessageDialog } from './dialogs/message-dialog.component';
import { VideoDialog } from './dialogs/video-dialog.component';
import { InputDialog } from './dialogs/input-dialog.component';
import { SelectDialog } from './dialogs/select-dialog.component';

// Services
import { ProjectSettingsService } from './services/project-settings.service';
import { DataService } from './services/data.service';


const appRoutes: Routes = [
  { path: '**', component: AppComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SparqlForceComponent,
    QueryFieldComponent,
    SparqlTableComponent,
    SettingsComponent,
    ToolbarComponent,
    VideoDialog,
    InputDialog,
    SelectDialog,
    SettingsDialog,
    MessageDialog,
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
    CodemirrorModule,
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
    MatCheckboxModule,
    MatPaginatorModule,
    FlexLayoutModule
  ],
  providers: [ ProjectSettingsService, Title, DataService ],
  bootstrap: [AppComponent],
  entryComponents: [
    MessageDialog,
    VideoDialog,
    InputDialog,
    SelectDialog,
    SettingsDialog 
  ]
})
export class AppModule { }
