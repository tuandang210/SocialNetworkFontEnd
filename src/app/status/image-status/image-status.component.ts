import {Component, OnInit} from '@angular/core';
import {ImageStatusService} from '../../service/image-status/image-status.service';
import {FormControl, FormGroup} from '@angular/forms';
import {AngularFireStorage} from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import {StatusService} from '../../service/status/status.service';

@Component({
  selector: 'app-image-status',
  templateUrl: './image-status.component.html',
  styleUrls: ['./image-status.component.css']
})
export class ImageStatusComponent implements OnInit {
  imageForm: FormGroup = new FormGroup({
    url: new FormControl()
  });

  selectedImg: any = null;
  imgSrc1 = '';

  constructor(private imageStatusService: ImageStatusService,
              private angularFireStorage: AngularFireStorage) {
  }

  ngOnInit() {
  }

  submit() {
    if (this.selectedImg != null) {
      const filePath = `${this.selectedImg.name.split('.').splice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.angularFireStorage.ref(filePath);
      this.angularFireStorage.upload(filePath, this.selectedImg).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.imgSrc1 = url;
            const image = this.imageForm.value;
            image.url = url;
            this.imageStatusService.createImage(image).subscribe(() => {
              this.imgSrc1 = '';
            });
          });
        })).subscribe();
    }
  }

  showImagePreview(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc1 = event.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImg = event.target.files[0];

      if (this.selectedImg != null) {
        const filePath = `${this.selectedImg.name.split('.').splice(0, -1).join('.')}_${new Date().getTime()}`;
        const fileRef = this.angularFireStorage.ref(filePath);
        this.angularFireStorage.upload(filePath, this.selectedImg).snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(url => {
              this.imgSrc1 = url;
            });
          })).subscribe();
      }

    } else {
      this.selectedImg = null;
    }
  }
}
