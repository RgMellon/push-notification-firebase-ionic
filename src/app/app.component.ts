import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
//firebase
import  firebaseConfig from './firebase-config';
import *as firebase from 'firebase';
import {FCM} from '@ionic-native/fcm';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar,
    public splashScreen: SplashScreen, private fcm: FCM) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.notificaMobile();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    this.notificationWEB()
  }

  // somente para web e pwa
  notificationWEB() {
    if(document.URL.startsWith('http')){
      const firebaseApp = firebase.initializeApp(firebaseConfig);
      const messaging = firebaseApp.messaging();
      navigator.serviceWorker.register('service-worker.js')
      .then(registration => {{
        messaging.useServiceWorker(registration)
        messaging.requestPermission()
              // pergunta da permissao
              .then(permision => {
                  messaging.getToken()
                      .then(token => {
                          console.log(token)
                          // pega token do divice
                      })
              })
          messaging.onMessage(payload => {
              console.log(payload)
          })
      }})
    }
  }

  notificaMobile() {
    if(this.platform.is('android')){
      this.fcm.getToken()
      .then(token => {
        console.log(token)
      })

      this.fcm.onNotification()
        .subscribe(data => console.log(data))
    }
  }


  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
