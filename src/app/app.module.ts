import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

// Local storage
import { WebStorageModule } from 'ngx-store';

// Directives
import { ScrollDirective } from './directives/scroll.directive';

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
import { PrefixSimplePipe } from './pipes/prefix-simple.pipe';
import { CountryTooltipPipe } from './pipes/country-tooltip.pipe';

// FxFlex
import { FlexLayoutModule } from '@angular/flex-layout';

// Codemirror
import { CodemirrorModule } from 'ng2-codemirror';

// Clipboard
import { ClipboardModule } from 'ngx-clipboard';

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
import { MessageDialogComponent } from './dialogs/message-dialog.component';
import { VideoDialogComponent } from './dialogs/video-dialog.component';
import { InputDialogComponent } from './dialogs/input-dialog.component';
import { SelectDialogComponent } from './dialogs/select-dialog.component';

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
    VideoDialogComponent,
    InputDialogComponent,
    SelectDialogComponent,
    SettingsDialog,
    MessageDialogComponent,
    PrefixPipe,
    PrefixSimplePipe,
    CountryTooltipPipe,
    ScrollDirective
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
    ClipboardModule,
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
  providers: [ ProjectSettingsService, Title, DataService, PrefixSimplePipe ],
  bootstrap: [AppComponent],
  entryComponents: [
    MessageDialogComponent,
    VideoDialogComponent,
    InputDialogComponent,
    SelectDialogComponent,
    SettingsDialog 
  ]
})
export class AppModule { }
