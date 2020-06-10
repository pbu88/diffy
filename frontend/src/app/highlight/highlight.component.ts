import {Component, Input, OnInit} from '@angular/core';

import {Alert} from '../Alert';
import {AlertService} from '../alert.service';

@Component({
  selector: 'app-highlight',
  templateUrl: './highlight.component.html',
  styleUrls: ['./highlight.component.css']
})
export class HighlightComponent implements OnInit {
  alert: Alert;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService.getMessage().subscribe(alert => {
      this.alert = alert;
    });
  }
}
