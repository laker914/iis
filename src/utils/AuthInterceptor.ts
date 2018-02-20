import {Injectable } from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { CommonService } from '../services/common';
import { Observable } from "rxjs/Observable";

@Injectable()

export class AuthInterceptor implements HttpInterceptor {

  constructor(private commonService: CommonService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const tokenId = this.commonService.getToken();
    // console.log(tokenId);
    // const authReq = req.clone({
    //   headers: req.headers
    //               .set('Authorization',tokenId)
    //               .set('Content-Type', 'application/x-www-form-urlencoded,charset=utf-8')
    // });
    return next.handle(req);
  }
}
