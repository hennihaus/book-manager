import { inject, Injectable } from '@angular/core';
import { Book } from './book';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookStore {
  #http = inject(HttpClient);
  #apiUrl = 'https://api1.angular-buch.com';

  getAll(): HttpResourceRef<Book[]> {
    return httpResource<Book[]>(
      () => `${this.#apiUrl}/books`,
      { defaultValue: [] }
    );
  }

  getSingle(isbn: () => string): HttpResourceRef<Book | undefined> {
    return httpResource<Book>(
      () => `${this.#apiUrl}/books/${isbn()}`
    )
  }

  remove(isbn: string): Observable<void> {
    return this.#http.delete<void>(`${this.#apiUrl}/books/${isbn}`);
  }
}
