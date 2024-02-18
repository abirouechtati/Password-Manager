import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PasswordManagerService } from 'src/services/password-manager.service';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.css']
})
export class SiteListComponent {

  allSites!:Observable<Array<any>>;

  siteName!:string;
  siteUrl!:string;
  siteImgUrl!:string;
  siteId!:string;
  formState:string='Add New ';

  isSuccess:Boolean=false;
  successMessage!:string;

  constructor(private passwordManager:PasswordManagerService ){
    this.loadSites();
  }
  showAlert(message:string){
    this.isSuccess=true;
    this.successMessage=message;
  }
  onSubmit(values:object){
    if(this.formState=='Add New '){
      this.passwordManager.addSite(values)
      .then(()=>{
        this.showAlert("Data Saved Successfully");
      })
      .catch(err=>{
        console.log(err);
      })
    }
    else if (this.formState=="Edit"){
      this.passwordManager.updateSite(this.siteId,values)
      .then(()=>{
        this.showAlert("Data Updated Successfully");
      })
      .catch(err=>{
        console.log(err);
      })
    }
  
   
  }
  loadSites(){
    this.allSites=this.passwordManager.loadSites();
  }
  editSite(siteName:string,siteUrl:string,siteImgUrl:string,id:string) {
    this.siteName=siteName;
    this.siteUrl=siteUrl;
    this.siteImgUrl=siteImgUrl;
    this.siteId=id;

    this.formState="Edit"
  }
  deleteSite(id:string){
    this.passwordManager.deleteSite(id)
    .then(()=>{
      this.showAlert("Data deleted successfully");
   
    })
    .catch(err=>{
      console.log(err);
    })
  }
 
}
