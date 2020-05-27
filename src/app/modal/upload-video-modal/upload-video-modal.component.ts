import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload-video-modal',
  templateUrl: './upload-video-modal.component.html',
  styleUrls: ['./upload-video-modal.component.css']
})
export class UploadVideoModalComponent implements OnInit {

  uploadForm:FormGroup=this.fb.group({
    video:[undefined,Validators.required],
    annotations:[undefined,Validators.required],
    title:['',Validators.required],
    city:[''],
    description:[''],
    recorded_date:[undefined]
  })

  maxDate=new Date();

  constructor(private dialogRef: MatDialogRef<UploadVideoModalComponent>,
              private fb:FormBuilder) { }

  ngOnInit() {

  }

  okClick(){
    this.dialogRef.close(this.uploadForm.value)
  }

  onNoClick(){
    this.dialogRef.close();
  }

}
