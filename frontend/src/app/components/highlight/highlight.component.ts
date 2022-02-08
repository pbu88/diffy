import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { AlertService, Alert } from '../../services/alert.service';

@Component({
  selector: 'app-highlight',
  templateUrl: './highlight.component.html'
})
export class HighlightComponent implements OnInit {
  alert$: Observable<Alert> = this.alertService.getMessage().pipe(shareReplay());

  constructor(private alertService: AlertService) {}

  ngOnInit() {}

}
