import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FootballDataService } from '../../services/football-data.service';
import { League, Fixture } from '../../models/team.model';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.css'],
})
export class TeamDetailsComponent implements OnInit, OnDestroy {
  league: League | null;
  tableHeader = ['', 'Home', 'Goals', '-', 'Goals', 'Away', ''];
  fixturesList: Fixture[] = [];
  private subscription: Subscription;

  constructor(private footballservice: FootballDataService) {
    this.league = null;
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.getTeamsData();
  }

  getTeamsData() {
    this.subscription.add(
      this.footballservice.data.subscribe((data) => {
        if (data) {
          this.league = data;
          this.getFixtures(data.leagueId, data.teamId);
        }
      })
    );
  }

  getFixtures(leagueId: number, teamId: number) {
    this.footballservice.getFixtures(leagueId, teamId).subscribe((res) => {
      if (res.response.length) {
        this.fixturesList = res.response.slice(0, 10);
      } else alert(res.errors.requests);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
