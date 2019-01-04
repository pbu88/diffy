import {Metrics} from "../Metrics";
import * as http from "http";

export class GAMetrics implements Metrics {
    key: string;
    options: any;
    clientId: string;
    constructor(key: string, clientId: string) {
        this.key = key;
        this.clientId = clientId;

        this.options = {
          hostname: 'www.google-analytics.com',
          path: '/collect',
          method: 'POST',
        };

    }
    private logStr(level: string, str: string) {
        if (level === "info") {
            console.info("LogBasedMetrics: " + str);
        }
        else if(level === "error") {
            console.error("LogBasedMetrics: " + str);
        }
    }
    private sendRequest(data: string) {
        const req = http.request(this.options, (res) => {});
        req.on('error', (e) => {
            this.logStr("error", `problem with GA request: ${e.message}`);
        });
        // write data to request body
        req.write(data);
        req.end();
    }
    diffStoredSuccessfully() {
        const data = "v=1&cid="+this.clientId+"&t=event&ec=diff&ea=created&tid=" + this.key;
        this.sendRequest(data);
    }
    diffFailedToStore() {
        const data = "v=1&cid="+this.clientId+"&t=event&ec=diff&ea=created_failed&tid=" + this.key;
        this.sendRequest(data);
    }
    diffStoredSuccessfullyFromAPI() {
        const data = "v=1&cid="+this.clientId+"&t=event&ec=diff&ea=created_api&tid=" + this.key;
        this.sendRequest(data);
    }
    diffFailedToStoreFromAPI() {
        const data = "v=1&cid="+this.clientId+"&t=event&ec=diff&ea=created_failed_api&tid=" + this.key;
        this.sendRequest(data);
    }
    diffDeletedSuccessfully() {
        const data = "v=1&cid="+this.clientId+"&t=event&ec=diff&ea=deleted&tid=" + this.key;
        this.sendRequest(data);
    }
    diffFailedToDelete() {
        const data = "v=1&cid="+this.clientId+"&t=event&ec=diff&ea=deleted_failed&tid=" + this.key;
        this.sendRequest(data);
    }
    diffRetrievedSuccessfully() {
        const data = "v=1&cid="+this.clientId+"&t=event&ec=diff&ea=diff_retrieved&tid=" + this.key;
        this.sendRequest(data);
    }
}

