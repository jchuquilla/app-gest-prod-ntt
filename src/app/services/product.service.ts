import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Product} from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private url: string = `${environment.HOST}/products`;

  constructor(
    private http: HttpClient
  ) { }

  getAll(){
    return this.http.get<any>(this.url);
  }

  getOne(id: string){
    return this.http.get<any>(`${this.url}/${id}`);
  }

  createItem(item: Product){
    return this.http.post<any>(`${this.url}`, item);
  }

  updateItem(id: string, item: Product){
    return this.http.put<any>(`${this.url}/${id}`, item);
  }

  remove(id: string){
    return this.http.delete<any>(`${this.url}/${id}`);
  }

  verifyIdentifier(id: string){
    return this.http.get<any>(`${this.url}/verification/${id}`);
  }

}
