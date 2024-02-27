import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'IVORY Presentable Demo';

  constructor(
    private http: HttpClient
  ) {}

  public tableHeight = 600;
  public tableColumns = [
    { 
      'field': 'athlete',
      'displayText': 'Athlete',
      'hasFilter': true,
      'width': '140'
    },
    { 
      'field': 'age',
      'displayText': 'Age'
    },
    { 
      'field': 'country',
      'displayText': 'Country',
      'hasFilter': true,
      'filterOptions': [
        'Armenia',
        'Austria',
        'Australia',
        'Azerbaijan',
        'Bahamas',
        'Belarus',
        'Bulgaria',
        'Brazil',
        'Canada',
        'China',
        'Chile',
        'Colombia',
        'Costa Rica',
        'Croatia',
        'Cuba',
        'Czech Republic',
        'Egypt',
        'Ethiopia',
        'Estonia',
        'France',
        'Finland',
        'Germany',
        'Georgia',
        'Great Britain',
        'Hungary',
        'Italy',
        'India',
        'Iran',
        'Jamaica',
        'Japan',
        'Kazahkstan',
        'Kenya',
        'Kyrgyzstan',
        'Latvia',
        'Lithuania',
        'Mongolia',
        'Morocco',
        'Netherlands',
        'New Zealand',
        'Norway',
        'Poland',
        'Puerto Rico',
        'Romania',
        'Russia',
        'Singapore',
        'Slovakia',
        'Slovenia',
        'South Africa',
        'South Korea',
        'Spain',
        'Sweden',
        'Switzerland',
        'Tajikistan',
        'Trinidad and Tobago',
        'Tunisia',
        'Turkey',
        'United States',
        'Ukraine',
        'Uzbekistan',
        'Zimbabwe'
      ]
    },
    { 
      'field': 'year', 
      'displayText': 'Year'
    },
    { 
      'field': 'date',
      'displayText': 'Date'
    },
    { 
      'field': 'sport',
      'displayText': 'Sport',
      'hasFilter': true,
      'filterOptions': [
        'Alpine Skiing',
        'Archery',
        'Badminton',
        'Baseball',
        'Basketball',
        'Beach Volleyball',
        'Biathlon',
        'Bobsleigh',
        'Boxing',
        'Canoeing',
        'Cross Country Skiing',
        'Cycling',
        'Diving',
        'Equestrian',
        'Fencing',
        'Football',
        'Freestyle Skiing',
        'Gymnastics',
        'Handball',
        'Hockey',
        'Ice Hockey',
        'Judo',
        'Luge',
        'Nordic Combined',
        'Rowing',
        'Shooting',
        'Short-Track Speed Skating',
        'Ski Jumping',
        'Speed Skating',
        'Synchronized Swimming',
        'Table Tennis',
        'Taekwondo',
        'Tennis',
        'Trampoline',
        'Triathlon',
        'Volleyball',
        'Waterpolo',
        'Weightlifting',
        'Wrestling'
      ]
    },
    { 
      'field': 'gold',
      'displayText': 'Gold'
    },
    { 
      'field': 'silver',
      'displayText': 'Silver'
    },
    { 
      'field': 'bronze',
      'displayText': 'Bronze'
    },
    { 
      'field': 'total',
      'displayText': 'Total'
    },
  ];
  public tableControls = true;
  public tableData = [];
  public tablePagination = true;
  public tablePageSize = 100;
  public tablePageSizeOptions = [25, 50, 100, 200];
  public tableSelection = true;

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.http
      .get('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .subscribe((data: any) => (this.tableData = data));
  }

  onRecordsSelected(event: any) {
    console.log(event);
  }

  ngOnDestroy(): void {
    
  }

}
