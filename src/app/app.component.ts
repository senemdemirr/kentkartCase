import { Component, OnInit } from '@angular/core';
import { IndexedDbService } from './services/indexeddb.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'kentkartCase';
  constructor(
    private indexedDbService: IndexedDbService,
    private authService: AuthService) {}

  async ngOnInit() {
    const companies = await this.indexedDbService.getAllFromTable('companies');
    console.log('Companies:', companies);

    const employees = await this.indexedDbService.getAllFromTable('employees');
    console.log('Employees:', employees);
  }
}
