import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoAnalisisComponent } from './video-analisis.component';

describe('VideoAnalisisComponent', () => {
  let component: VideoAnalisisComponent;
  let fixture: ComponentFixture<VideoAnalisisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoAnalisisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoAnalisisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
