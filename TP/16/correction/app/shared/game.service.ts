import { Injectable } from '@angular/core';
import {VIDEOGAMES} from './mock-video-games';
import {VideoGame, Cart} from './video-game';
import {Observable, of, from, Subject} from 'rxjs';
import {MessageService} from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private _cart: Cart = new Cart();
  emitChangeSource = new Subject<Cart>();
  changeEmitted$ = this.emitChangeSource.asObservable();

  constructor(private messageService: MessageService,
              private http: HttpClient,
    ) { }

  get cart$(): Observable<Cart> {
    return of(this._cart);
  }

  getGames(): Observable<VideoGame[]> {
    this.messageService.add('GameService: fetched games');
    return of(VIDEOGAMES.sort((x, y) => x.id - y.id));
  }

  getGame(id: number): Observable<VideoGame> {
      this.messageService.add(`GameService: fetched hero id=${id}`);
      return of(VIDEOGAMES.find(game => game.id === id));
  }

  getTop4(): Observable<VideoGame[]> {
    this.messageService.add('GameService: fetched TOP4 games');
    return of(VIDEOGAMES.sort((x, y) => y.nbView - x.nbView).slice(0, 4));
  }

  incrementNbView(game: VideoGame): void {
    game.nbView++;
    console.log(`Game.nbView++ ${game.id}`);
    console.log(VIDEOGAMES);
  }

  addToCart(game: VideoGame): void {
    this.messageService.add('GameService: add ' + game.title + ' to cart');
    this._cart.add(game);
    this.emitChangeSource.next(this._cart);
  }

  updateGame(game: VideoGame): Observable<any> {
    console.log(`update game ${game.title} ${game.nbView}`);
    return this.http.put(environment.gamesUrl, game, httpOptions);
  }

  addGame(game: VideoGame): Observable<VideoGame> {
    console.log(`add game id=${game.id} ${game.title}`);
    return this.http.post<VideoGame>(environment.gamesUrl, game, httpOptions);
  }

  deleteGame(id: number): Observable<VideoGame> {
    console.log(`delete game id=${id}`);
    return this.http.delete<VideoGame>(`${environment.gamesUrl}/${id}`, httpOptions);
  }

  searchGames(term: string): Observable<VideoGame[]> {
    if (!term.trim()) {
      return of([]);
    }
    if (environment.production) {
      return this.http.get<VideoGame[]>(`${environment.gamesUrl}/search?q=${term}`);
    } else {
      return this.http.get<VideoGame[]>(`${environment.gamesUrl}/?title=${term}`);
    }
  }
}