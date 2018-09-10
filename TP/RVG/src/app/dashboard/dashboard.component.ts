import { Component, OnInit } from '@angular/core';
import {VideoGame} from '../video-game';
import {GameService} from '../game.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  games: VideoGame[] = [];

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.getGames();
  }

  getGames(): void {
    this.gameService.getGames()
      .subscribe(games =>
        this.games = games.sort(this.gameService.sortBytitle).slice(1, 5));
  }
}

