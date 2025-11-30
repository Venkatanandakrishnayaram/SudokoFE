import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  apiEndpoint:string="https://refused-view-com-map.trycloudflare.com/";
  // apiEndpoint:string="http://127.0.0.1:8000/";


  constructor(private http: HttpClient) { }

  Login(loginModel:any):Observable<any>
  {
    return this.http.post(this.apiEndpoint+"login/",loginModel)
  }

  saveGame(gameData:any)
  {
    return this.http.post(this.apiEndpoint+"store_game/",gameData)
  }

  winPercentage(userid:number)
  {
    return this.http.get(this.apiEndpoint+"win-percentage/"+userid)
  }

  mostPlayedLevel(userid:number)
  {
    return this.http.get(this.apiEndpoint+"most-played-level/"+userid)
  }

  getAllGames(userid:number)
  {
    return this.http.get(this.apiEndpoint+"getGames/"+userid);
  }

  register(registerModel:any)
  {
    return this.http.post(this.apiEndpoint+"register",registerModel);
  }
}
