import { Component } from '@angular/core';
import { user } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PasswordManagerService } from 'src/services/password-manager.service';
import { AES,enc } from 'crypto-js';

@Component({
  selector: 'app-password-list',
  templateUrl: './password-list.component.html',
  styleUrls: ['./password-list.component.css']
})
export class PasswordListComponent {
  siteId!:string;
  siteName!:string;
  siteUrl!:string;
  siteImgUrl!:string;

  passwordList!:Array<any>

  email!:string;
  username!:string;
  password!:string;
  passwordId!:string;

  formState:string='Add New'

  isSuccess:Boolean=false;
  successMessage!:string;

  constructor(private route:ActivatedRoute,private passwordmanager:PasswordManagerService){
    this.route.queryParams.subscribe((val:any)=>{
      this.siteId=val.id;
      this.siteName=val.siteName;
      this.siteUrl=val.siteUrl;
      this.siteImgUrl=val.siteImgUrl;
    })
    this.loadPasswords();
  }
 showAlert(message:string){
    this.isSuccess=true;
    this.successMessage=message;
  }

resetForm(){
  this.email='';
  this.username='';
  this.password='';
  this.formState='Add New';
}

  onSubmit(values:any){
    const encryptedPassword = this.encryptPassword(values.password);
    values.password =encryptedPassword;
    console.log(values);
    if(this.formState=='Add New'){
      this.passwordmanager.addPassword(values,this.siteId).then(()=>{
        this.showAlert('Password Saved Successfully')
        console.log('Password Saved Successfully');
        this.resetForm();
      })
      .catch(err=>{
        console.log(err)
      })
    }
    else if(this.formState=='Edit'){
      this.passwordmanager.updatePassword(this.siteId,this.passwordId,values)
      .then(()=>{
        this.showAlert('Data Updated');
        console.log('Data Updated')
        this.resetForm();
      }) .catch(err=>{
        console.log(err)
      })
    }
    
    
  }
  loadPasswords(){
    this.passwordmanager.loadPasswords(this.siteId).subscribe(val=>{
    this.passwordList=val;
   });
  }
  editPassword(email:string,username:string,password:string,passwordId:string){
    this.email=email;
    this.username=username;
    this.password=password;
    this.passwordId=passwordId;
    this.formState="Edit"
  }
  deletePassword(passwordId:string){
    this.passwordmanager.deletePassword(this.siteId,passwordId)
    .then(()=>{
      this.showAlert('Deleted Successfully')
      console.log('Deleted Successfully');
    }).catch(err=>{
      console.log(err)
    })
  }

encryptPassword(password:string){
  /*random 256 bytes key generated from 
  url="https://generate-random.org/encryption-key-generator?count=1&bytes=256&cipher=aes-256-cbc&string=&password=" */
  const secretKey='K1015h83tdmpabNlmSOd4TeYpZPR7f6UHugEJyO3LgEYB7Ubis+LhC3c9kCNPiXNaZqNEOb6zJi8lr582k4czVCXvaRFFYHLanDusEemKOBZgA2E8W/9MNlI1z7ZZtQz/O5av779kL2ZIZ0309FBOqNfw/TtOAqpQpcMog3V21rudpmBphNh8DqTs+saLz+lDQMOs+YJtkGh96Z0OM3VqV84suVOUbOlC8u7awcJlfcUbcTzvtIfXNhsZ+m7LTBaYztER945aiKKOeLAGPHCv9CbicovlZZ3FfRNcBj4zGx2cPnXqTvx0xha9lAaZoOwFDu/LTL284j7WQJW4vDiDfSUs/inmlfJhDU7yz+VA00=';
  const encrypredPassword = AES.encrypt(password,secretKey).toString();
  console.log( encrypredPassword);
  return encrypredPassword;
}
decryptPassword(password:string){
  const secretKey='K1015h83tdmpabNlmSOd4TeYpZPR7f6UHugEJyO3LgEYB7Ubis+LhC3c9kCNPiXNaZqNEOb6zJi8lr582k4czVCXvaRFFYHLanDusEemKOBZgA2E8W/9MNlI1z7ZZtQz/O5av779kL2ZIZ0309FBOqNfw/TtOAqpQpcMog3V21rudpmBphNh8DqTs+saLz+lDQMOs+YJtkGh96Z0OM3VqV84suVOUbOlC8u7awcJlfcUbcTzvtIfXNhsZ+m7LTBaYztER945aiKKOeLAGPHCv9CbicovlZZ3FfRNcBj4zGx2cPnXqTvx0xha9lAaZoOwFDu/LTL284j7WQJW4vDiDfSUs/inmlfJhDU7yz+VA00=';
  const decryptedPassword= AES.decrypt(password,secretKey).toString(enc.Utf8);
  return decryptedPassword;
}
onDecrypt(password:string, index:number){
  const decryptedPassword=this.decryptPassword(password);
  this.passwordList[index].password=decryptedPassword;
  console.log(decryptedPassword)
}
}
