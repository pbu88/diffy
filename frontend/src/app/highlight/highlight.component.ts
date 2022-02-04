import {Component, Input, OnInit} from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import {Alert} from '../Alert';
import {AlertService} from '../alert.service';

@Component({
  selector: 'app-highlight',
  templateUrl: './highlight.component.html',
  styleUrls: ['./highlight.component.css']
})
export class HighlightComponent implements OnInit {
  alert$: Observable<Alert> = this.alertService.getMessage().pipe(shareReplay());

  constructor(private alertService: AlertService) {}

  ngOnInit() {}
}
