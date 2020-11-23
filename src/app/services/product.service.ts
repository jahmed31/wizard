import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { catchError, mapTo, tap, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  products(query?) {
    let url = `${environment.apiUrl}/products/`;
    if (query) {
      url = `${url}?${query}`;
    }
    return this.http
      .get<any>(url);
  }

  createProduct(data) {
    return this.http
      .post<any>(`${environment.apiUrl}/products/create/`, data);
  }

}
