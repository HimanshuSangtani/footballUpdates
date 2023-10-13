import { Component, OnInit } from '@angular/core';
import { FootballDataService } from '../../services/football-data.service';
import { Standing, LeagueData } from '../../models/league.model';

@Component({
  selector: 'app-league-selection',
  templateUrl: './league-selection.component.html',
  styleUrls: ['./league-selection.component.css'],
})
export class LeagueSelectionComponent implements OnInit {
  selectedCountry!: string;
  selectedLeagueId!: number;
  standingList: Standing[] = [];
  countries: string[] = ['England', 'Spain', 'Germany', 'France', 'Italy'];
  tableHeader: string[] = [
    '',
    '',
    'Name',
    'Games',
    'W',
    'L',
    'D',
    'Goal Difference',
    'Points',
  ];
  leagueIds: { [key: string]: number } = {
    England: 39,
    Spain: 140,
    Germany: 78,
    France: 61,
    Italy: 135,
  };

  constructor(private footballservice: FootballDataService) {}

  ngOnInit(): void {
    this.getLeaguesData();
  }

  private getLeaguesData() {
    this.footballservice.data.subscribe((data: LeagueData | null) => {
      let country: string = 'England';
      if (data !== null) {
        country =
          Object.keys(this.leagueIds).find(
            (key) => this.leagueIds[key] === data.leagueId
          ) || 'England';
      }
      this.selectedCountry = country;
      this.getStandings(country);
    });
  }

  selectCountry(country: string) {
    this.selectedCountry = country;
    this.getStandings(country);
  }

  getStandings(league: string) {
    this.selectedLeagueId = this.leagueIds[league];

    this.footballservice
      .getStandings(this.selectedLeagueId)
      .subscribe((res) => {
        if (res.response.length) {
          this.standingList = res.response[0].league['standings'][0];
        } else alert(res.errors.requests);
      });
  }

  sendFixturesData(standing: Standing) {
    let fixturesData = {
      leagueId: this.selectedLeagueId,
      teamId: standing.team.id,
    };
    this.footballservice.dataShare(fixturesData);
  }
}
