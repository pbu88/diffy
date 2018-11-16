import { Component, OnInit, Input } from '@angular/core';
import { AlertService }             from '../alert.service';
import { Alert }                    from '../Alert';

@Component({
    selector: 'app-highlight',
    templateUrl: './highlight.component.html',
    styleUrls: ['./highlight.component.css']
})
export class HighlightComponent implements OnInit {
    alert: Alert;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
      this.alertService.getMessage()
          .subscribe(alert => { this.alert = alert; });
    }
}
