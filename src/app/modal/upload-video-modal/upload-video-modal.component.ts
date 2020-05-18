import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-upload-video-modal',
  templateUrl: './upload-video-modal.component.html',
  styleUrls: ['./upload-video-modal.component.css']
})
export class UploadVideoModalComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<UploadVideoModalComponent>) { }

  ngOnInit() {
  }

  onNoClick(){
    this.dialogRef.close();
  }

}
