import { Injectable } from '@angular/core';
import { IndexedDbService } from './indexeddb.service';
import { gapi } from 'gapi-script';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authInitialized = false;
  private loggedIn = false;
  private clientId = '1096356951172-uvj4uf2k3g35ssqn6nt3g5nud6h8r7gj.apps.googleusercontent.com';
  
  // Login durumu için BehaviorSubject
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private dbService: IndexedDbService) {
    this.initializeGoogleAuth();
    this.loadUserFromSession();
  }

  private initializeGoogleAuth(): void {
    gapi.load('client:auth2', async () => {
      try {
        await gapi.auth2.init({
          client_id: this.clientId,
          scope: 'profile email',
          ux_mode: 'popup',
          fetch_basic_profile: true,
        });

        this.authInitialized = true;
        console.log('Google Auth initialized');

        const GoogleAuth = gapi.auth2.getAuthInstance();
        const user = GoogleAuth.currentUser.get();

        if (user.isSignedIn()) {
          const profile = user.getBasicProfile();
          console.log('Kullanıcı oturumu aktif:', profile.getEmail());
          this.saveUserToSession(profile);
          this.isLoggedInSubject.next(true);
        } else {
          console.log('Kullanıcı oturumu yok.');
          this.isLoggedInSubject.next(false);
        }
      } catch (error) {
        console.error('Error initializing Google Auth:', error);
        this.isLoggedInSubject.next(false);
      }
    });
  }

  async signIn(): Promise<void> {
    try {
      const GoogleAuth = gapi.auth2.getAuthInstance();
      const user = await GoogleAuth.signIn();
      const profile = user.getBasicProfile();
      const token = user.getAuthResponse().id_token;

      const email = profile.getEmail();
      const userInfo = {
        email,
        name: profile.getName(),
        imageUrl: profile.getImageUrl(),
        token,
      };

      await this.dbService.addUser(email, token);
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
      console.log(`User signed in: ${email}`);
      this.login();
      this.isLoggedInSubject.next(true);
    } catch (error) {
      console.error('Error during sign-in:', error);
      this.isLoggedInSubject.next(false);
    }
  }

  private saveUserToSession(profile: any): void {
    const userInfo = {
      email: profile.getEmail(),
      name: profile.getName(),
      imageUrl: profile.getImageUrl(),
    };

    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    this.loggedIn = true;
    this.isLoggedInSubject.next(true);
    console.log('Kullanıcı bilgisi sessionStorage\'a kaydedildi:', userInfo);
  }

  private loadUserFromSession(): void {
    const storedUserInfo = sessionStorage.getItem('userInfo');
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      console.log('Kayıtlı kullanıcı bilgisi yüklendi:', userInfo);
      this.loggedIn = true;
      this.isLoggedInSubject.next(true);
    } else {
      console.log('Kayıtlı kullanıcı bilgisi bulunamadı.');
      this.loggedIn = false;
      this.isLoggedInSubject.next(false);
    }
  }

  login(): void {
    this.loggedIn = true;
    this.isLoggedInSubject.next(true);
  }

  async logout(): Promise<void> {
    try {
      const GoogleAuth = gapi.auth2.getAuthInstance();
      const user = GoogleAuth.currentUser.get();
      const profile = user?.getBasicProfile();

      if (profile) {
        const email = profile.getEmail();
        await this.dbService.updateUserStatus(email, false);
      }

      await GoogleAuth.signOut();

      sessionStorage.removeItem('userInfo');
      this.loggedIn = false;
      this.isLoggedInSubject.next(false);
      console.log('User logged out and session cleared.');
    } catch (error) {
      console.error('Error during logout:', error);
      this.isLoggedInSubject.next(false);
    }
  }
}