import {Component, Input, OnInit, SimpleChange} from '@angular/core';

@Component({
  selector: 'app-diff-detail-countdown',
  templateUrl: './diff-detail-countdown.component.html',
  styleUrls: ['./diff-detail-countdown.component.css']
})
export class DiffDetailCountdownComponent implements OnInit {
  @Input() expiresAt: string;
  @Input() displayMakePermanent: boolean;
  @Input() _extendLifetime: () => void;
  @Input() _makePermanent: () => void;
  @Input() diffEmail: string;
  hours: number;
  minutes: number;
  seconds: number;
  extendLifetimeLoading: boolean;

  constructor() {}

  ngOnInit() {
    console.log("init")
    setInterval(() => {
      this.updateTtl();
    }, 1000);
  }

  ngOnChanges(changes: SimpleChange) {
    if(changes["expiresAt"] != undefined) {
      this.extendLifetimeLoading = false;
    }
  }

  updateTtl() {
    // not much scientific stuff here, just get the job done for now
    let now = new Date();
    let dateDiffInSecs = (new Date(this.expiresAt).getTime() - now.getTime()) / 1000;
    if (dateDiffInSecs < 0) {
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
      return;
    }
    this.hours = Math.floor(dateDiffInSecs / 60 / 60);
    this.minutes = Math.floor((dateDiffInSecs / 60) - (this.hours * 60));
    this.seconds = Math.floor((dateDiffInSecs) - (this.hours * 60 * 60) - (this.minutes * 60));
  }

  extendLifetime() {
    this._extendLifetime();
    this.extendLifetimeLoading = true;
  }

  makePermanent() {
    this._makePermanent();
  }
}
