import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDetailsPage } from './book-details-page';
import { provideRouter, Router } from '@angular/router';
import { booksPortalRoutes } from '../books-portal.routes';
import { BookStore } from '../../shared/book-store';
import { provideLocationMocks } from '@angular/common/testing';
import { Location } from '@angular/common';
import { inputBinding, resource, signal, WritableSignal } from '@angular/core';
import { Mock } from 'vitest';
import { Book } from '../../shared/book';

describe('BookDetailsPage', () => {
  let component: BookDetailsPage;
  let fixture: ComponentFixture<BookDetailsPage>;
  let isbn: WritableSignal<string>;
  let getSingleFn: Mock;

  const testBook: Partial<Book> = {
    isbn: '12345',
    title: 'Test Book 1',
  }

  beforeEach(async () => {
    isbn = signal('12345');
    getSingleFn = vi.fn().mockResolvedValue(testBook);

    await TestBed.configureTestingModule({
      imports: [BookDetailsPage],
      providers: [
        provideRouter(booksPortalRoutes),
        provideLocationMocks(),
        {
          provide: BookStore,
          useFactory: () => ({
            getSingle: (isbn: () => string) => resource({
              params: isbn,
              loader: getSingleFn,
            })
          })
        }
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookDetailsPage, {
      bindings: [inputBinding('isbn', isbn)]
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the correct book by ISBN', async () => {
    expect(getSingleFn).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ params: '12345' })
    );
    expect(component['book'].value()).toEqual(testBook);
  });

  it('should navigate to the details page', async () => {
    const location = TestBed.inject(Location);
    const router = TestBed.inject(Router);

    await router.navigate(['/details/12345']);

    expect(location.path()).toBe('/details/12345');
  });

  it('should update book details when ISBN changes', async () => {
    const anotherBook = { isbn: '67890', title: 'Test Book 2', authors: [] };
    getSingleFn.mockResolvedValue(anotherBook);

    isbn.set('67890');
    await fixture.whenStable();

    expect(getSingleFn).toHaveBeenLastCalledWith(
      expect.objectContaining({ params: '67890' })
    );
    expect(component['book'].value()).toEqual(anotherBook);
  });
});
