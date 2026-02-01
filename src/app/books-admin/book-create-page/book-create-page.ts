import { Component, inject, signal } from '@angular/core';
import { form, FormField, submit } from '@angular/forms/signals';
import { BookStore } from '../../shared/book-store';
import { Router } from '@angular/router';
import { Book } from '../../shared/book';

@Component({
  selector: 'app-book-create-page',
  imports: [FormField],
  templateUrl: './book-create-page.html',
  styleUrl: './book-create-page.css',
})
export class BookCreatePage {
  #bookStore = inject(BookStore);
  #router = inject(Router);

  readonly #bookFormData = signal({
    isbn: '',
    title: '',
    subtitle: '',
    authors: [''],
    description: '',
    imageUrl: '',
  });
  protected readonly bookForm = form(this.#bookFormData);

  addAuthorField() {
    this.bookForm.authors().value.update((authors) => [...authors, '']);
  }

  submitForm() {
    submit(this.bookForm, async (bookForm) => {
      const formValue = bookForm().value();
      const authors = formValue.authors.filter((author) => !!author.trim());

      const newBook: Book = {
        ...formValue,
          authors,
          createdAt: new Date().toISOString(),
      };

      const createdBook = await this.#bookStore.create(newBook);
      await this.#router.navigate(['/books', 'details', createdBook.isbn]);
    });

    return false;
  }
}
