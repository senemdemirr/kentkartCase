import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { IndexedDbService } from '../../services/indexeddb.service';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user: any = null; // Aktif kullanıcı bilgisi
  allUsers: any[] = []; // Tüm kullanıcılar listesi
  public isLoggedIn: Observable<boolean>;
  isHomePage: boolean = false;


  constructor(
    private authService: AuthService,
    private indexedDbService: IndexedDbService,
    private location: Location,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn$;
    this.router.events.subscribe(() => {
      this.isHomePage = (this.router.url === '/home') || (this.router.url === '/');
    });
  }

  async signIn(): Promise<void> {
    try {
      await this.authService.signIn();
      console.log('User successfully signed in');
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  }

  logout(): void {
    this.user = null;
    this.authService.logout();
    console.log('User logged out');
  }

  goBack(): void {
    this.location.back();
  }
}
