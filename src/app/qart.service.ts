import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {QartForm, QartResponse} from './qart-form';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QartService {

  constructor(private http: HttpClient) { }

  buidQart(form: QartForm): Observable<QartResponse> {
    const formData = new FormData();
    formData.append('image', form.img);
    formData.append('content', form.content);
    formData.append('embed', form.embed.toString());
    formData.append('xpos', form.xpos.toString());
    formData.append('ypos', form.ypos.toString());
    formData.append('width', form.width.toString());
    return this.http.post<QartResponse>(environment.backendApi, formData);
  }
}
