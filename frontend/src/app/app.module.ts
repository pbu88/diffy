import {HttpClientModule} from '@angular/common/http';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DiffDetailContentComponent} from './components/diff-detail-content/diff-detail-content.component';
import {DiffDetailCountdownComponent} from './components/diff-detail-countdown/diff-detail-countdown.component';
import {DiffDetailNavComponent} from './components/diff-detail-nav/diff-detail-nav.component';
import {DiffDetailComponent} from './pages/diff-detail/diff-detail.component';
import {DiffFileTreeComponent} from './components/diff-file-tree/diff-file-tree.component';
import {HighlightComponent} from './components/highlight/highlight.component';
import {HomePageComponent} from './pages/home-page/home-page.component';
import {EscapeHtmlPipe} from './pipes/keep-html.pipe';


@NgModule({
  declarations: [
    AppComponent,
    DiffDetailComponent,
    HomePageComponent,
    EscapeHtmlPipe,
    DiffFileTreeComponent,
    DiffDetailContentComponent,
    DiffDetailNavComponent,
    DiffDetailCountdownComponent,
    HighlightComponent,
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
export class AppModule {
}
