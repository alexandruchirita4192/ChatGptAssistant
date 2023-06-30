import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  text: string = '';
  responseText: string = '';
  keys: string[] = [];
  selectedKey: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<string[]>('http://localhost:5500/keys').subscribe((keys) => {
      this.keys = keys;
      this.selectedKey = keys[0];
    });
  }

  submitText() {
    this.http.post('http://localhost:5500/endpoint', { text: this.text, key: this.selectedKey })
      .subscribe((response: any) => {
        this.responseText = `${response.text}`;
      });
  }
}
