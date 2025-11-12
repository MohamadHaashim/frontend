import { HttpClient } from "@angular/common/http";
import { ServiceProvider } from "../service.provider";
import { ServiceConfig } from "../service.url.config";
import { Injectable } from "@angular/core";
import { map } from "rxjs";


@Injectable({
    providedIn: 'root',
  })

export class SetupService {

    constructor(
        private setupSevice: ServiceProvider,
        private http: HttpClient,
        public service:ServiceConfig
      ) {}

    //   Fees List

    public feesList(data: any) {
        return this.setupSevice.post('feesList', data).pipe(
          map((data) => {
            return data;
          })
        );
      }

}