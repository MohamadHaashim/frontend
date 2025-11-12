import { Injectable } from '@angular/core';
import { ServiceProvider } from '../service.provider';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private dataService: ServiceProvider) { }

  public addComments(bodyParams: any) {
    return this.dataService.post('addComments', bodyParams)
      .pipe(map(data => {
        return data;
      }
      ));
  }

  public getCommentList(bodyParams: any) {
    return this.dataService.post('getCommentList', bodyParams)
      .pipe(map(data => {
        return data;
      }
      ));
  }
}
