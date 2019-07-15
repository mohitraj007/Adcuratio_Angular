import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
    providedIn: 'root',
})
export class CurrencyService {
    constructor(private http: HttpClient) { }


    getData(url): Observable<string> {
        return this.http.get<string>(url);
    }
}