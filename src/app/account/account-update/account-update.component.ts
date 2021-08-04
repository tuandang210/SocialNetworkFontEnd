import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
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
    phone: new FormControl('', [Validators.pattern('^0+[0-9]{9}$'), Validators.required]),
    fullName: new FormControl('', [Validators.pattern('^[a-zA-Z]{1,}(?: [a-zA-Z]+){0,2}$'), Validators.required]),
    address: new FormControl('', [Validators.required]),
    favorite: new FormControl(),
    active: new FormControl()
  });
  id: number;
  selectedImg = null;
  imgSrc = '';
  isDone = false;
  isError = false;

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
          password: new FormControl(account.password, [Validators.required, Validators.minLength(6), Validators.maxLength(32)]),
          fullName: new FormControl(account.fullName, [Validators.pattern('^[a-zA-Z]{1,}(?: [a-zA-Z]+){0,2}$'), Validators.required]),
          address: new FormControl(account.address, [Validators.required]),
          phone: new FormControl(account.phone, [Validators.pattern('^0+[0-9]{9}$'), Validators.required]),
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
              password: new FormControl(account.password, [Validators.required, Validators.minLength(6), Validators.maxLength(32)]),
              fullName: new FormControl(account.fullName, [Validators.pattern('^[a-zA-Z]{1,}(?: [a-zA-Z]+){0,2}$'), Validators.required]),
              phone: new FormControl(account.phone, [Validators.pattern('^0+[0-9]{9}$'), Validators.required]),
              address: new FormControl(account.address, [Validators.required]),
              favorite: new FormControl(account.favorite)
            });
            this.authenticationService.currentUserValue.avatar = url;
            this.authenticationService.currentUserValue.fullName = account.fullName;
            this.accountService.updateAccount(id, account).subscribe();
            this.isDone = true;
            setTimeout(() => {
              this.isDone = false;
            }, 2000);
          });
        })).subscribe();
    } else {
      const account = this.accountForm.value;
      account.avatar = this.authenticationService.currentUserValue.avatar;
      this.authenticationService.currentUserValue.fullName = account.fullName;
      this.accountService.updateAccount(id, account).subscribe(() => {
        this.isDone = true;
        setTimeout(() => {
          this.isDone = false;
        }, 2000);
      }, error => {
        this.isError = true;
      });
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

  get email() {
    return this.accountForm.get('email');
  }

  get address() {
    return this.accountForm.get('address');
  }

  get phone() {
    return this.accountForm.get('phone');
  }

  get fullName() {
    return this.accountForm.get('fullName');
  }
}
