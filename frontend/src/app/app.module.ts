import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DiffDetailContentComponent } from "./components/diff-detail-content/diff-detail-content.component";
import { DiffDetailCountdownComponent } from "./components/diff-detail-countdown/diff-detail-countdown.component";
import { DiffDetailNavComponent } from "./components/diff-detail-nav/diff-detail-nav.component";
import { DiffDetailComponent } from "./pages/diff-detail/diff-detail.component";
import { DiffFileTreeComponent } from "./components/diff-file-tree/diff-file-tree.component";
import { HighlightComponent } from "./components/highlight/highlight.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { EscapeHtmlPipe } from "./pipes/keep-html.pipe";
import { FooterComponent } from "./components/layout/footer/footer.component";
import { HeaderComponent } from "./components/layout/header/header.component";
import { DiffyLayoutComponent } from './components/layout/diffy-layout/diffy-layout.component';
import { SiteLayoutComponent } from './components/layout/site-layout/site-layout.component';
import { ToggleDarkModeComponent } from './components/toggle-dark-mode/toggle-dark-mode.component';

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
    FooterComponent,
    HeaderComponent,
    DiffyLayoutComponent,
    SiteLayoutComponent,
    ToggleDarkModeComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
