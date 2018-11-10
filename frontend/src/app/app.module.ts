import { BrowserModule }           from '@angular/platform-browser';
import { NgModule }                from '@angular/core';
import { HttpClientModule }        from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { FormsModule }             from '@angular/forms';
import { AppComponent }            from './app.component';
import { AppRoutingModule }        from './app-routing.module';
import { DiffDetailComponent }     from './diff-detail/diff-detail.component';
import { HomePageComponent }       from './home-page/home-page.component';
import { EscapeHtmlPipe }          from './pipes/keep-html.pipe';
import { DiffFileTreeComponent } from './diff-file-tree/diff-file-tree.component';
import { DiffDetailContentComponent } from './diff-detail-content/diff-detail-content.component';


@NgModule({
  declarations: [
    AppComponent,
    DiffDetailComponent,
    HomePageComponent,
    EscapeHtmlPipe,
    DiffFileTreeComponent,
    DiffDetailContentComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
