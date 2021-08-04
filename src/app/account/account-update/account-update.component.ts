import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AccountService} from '../../service/account/account.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {AngularFireStorage} from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import {AuthenticationService} from '../../service/authentication/authentication.service';

@Component({
  selector: 'app-account-update',
  templateUrl: './account-update.component.html',
  styleUrls: ['./account-update.component.css']
})
export class AccountUpdateComponent implements OnInit {
  accountForm: FormGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
    phone: new FormControl(),
    fullName: new FormControl(),
    address: new FormControl(),
    favorite: new FormControl(),
    active: new FormControl()
  });
  id: number;
  selectedImg = null;
  imgSrc = '';
  oldAvatar = '';

  constructor(private accountService: AccountService,
              private activatedRoute: ActivatedRoute,
              private angularFireStorage: AngularFireStorage,
              private authenticationService: AuthenticationService) {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = +paramMap.get('id');
      this.getAccount(this.id);
    });
  }

  ngOnInit() {
  }

  public getAccount(id: number) {
    return this.accountService.findById(id).subscribe(account => {
      this.accountForm = new FormGroup({
          id: new FormControl(account.id),
          username: new FormControl(account.username),
          fullName: new FormControl(account.fullName),
          address: new FormControl(account.address),
          phone: new FormControl(account.phone),
          favorite: new FormControl(account.favorite)
        }
      );
      this.imgSrc = account.avatar;
    });
  }

  updateAccount(id: number) {
    if (this.selectedImg != null) {
      const filePath = `${this.selectedImg.name.split('.').splice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.angularFireStorage.ref(filePath);
      this.angularFireStorage.upload(filePath, this.selectedImg).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {

            this.imgSrc = url;
            const account = this.accountForm.value;
            account.avatar = url;
            this.accountForm = new FormGroup({
              id: new FormControl(account.id),
              username: new FormControl(account.username),
              fullName: new FormControl(account.fullName),
              address: new FormControl(account.address),
              phone: new FormControl(account.phone),
              favorite: new FormControl(account.favorite)
            });
            this.authenticationService.currentUserValue.avatar = url;
            this.authenticationService.currentUserValue.fullName = account.fullName;
            this.accountService.updateAccount(id, account).subscribe();
            alert('Cập nhật thành công');
          });
        })).subscribe();
    } else {
      const account = this.accountForm.value;
      account.avatar = this.authenticationService.currentUserValue.avatar;
      this.authenticationService.currentUserValue.fullName = account.fullName;
      this.accountService.updateAccount(id, account).subscribe();
      alert('Cập nhật thành công');
    }
  }

  showPreview(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = event.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImg = event.target.files[0];
      if (this.selectedImg != null) {
        const filePath = `${this.selectedImg.name.split('.').splice(0, -1).join('.')}_${new Date().getTime()}`;
        const fileRef = this.angularFireStorage.ref(filePath);
        this.angularFireStorage.upload(filePath, this.selectedImg).snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(url => {
              this.imgSrc = url;
            });
          })).subscribe();
      }

    } else {
      this.selectedImg = null;
    }
  }
}
