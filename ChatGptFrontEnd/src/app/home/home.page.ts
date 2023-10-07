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
  history: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<string[]>('http://localhost:5500/keys').subscribe((keys) => {
      this.keys = keys;
      this.selectedKey = keys[0];
    });

    // Fetch history from the server
    this.http.get<any[]>('http://localhost:5500/history')
      .subscribe(data => {
        this.history = data;
    });
  }

  submitText() {
    this.http.post('http://localhost:5500/endpoint', { text: this.text, key: this.selectedKey })
      .subscribe((response: any) => {
        //const result = `Key: ${response.key}, Value: ${response.value}, Text: ${response.text}`;
        this.responseText = `${response.value}`;

        // Add the transaction to history
        this.history.push({
          text: this.text,
          key: this.selectedKey,
          value: response.value
        });
      });
  }
}
