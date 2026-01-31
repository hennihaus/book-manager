import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePage } from './home-page';
import { provideRouter } from '@angular/router';
import { routes } from '../app.routes';
import { RouterTestingHarness } from '@angular/router/testing';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideRouter(routes)]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the HomePage component for /home', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/home', HomePage);

    expect(component).toBeTruthy();
    expect(document.title).toBe('BookManager');
  })
});
