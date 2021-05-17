import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.page.html',
  styleUrls: ['./upload-csv.page.scss'],
})
export class UploadCsvPage implements OnInit {

  constructor(public router:Router,public toastController: ToastController) { }

  ngOnInit() {
  }

  onFileSelected(event){
    let files = event.srcElement.files;  
    if (!this.isValidCSVFile(files[0])){
      this.presentToast("Invalid File , Please Upload CSV")
    }else{
      console.log(event)
      let input = event.target;  
      let reader = new FileReader();  
      reader.readAsText(input.files[0]);  
      reader.onload = () => {  
        let csvData = reader.result;  
        localStorage.setItem("csvData",csvData.toString())
        this.router.navigateByUrl("/home")
        this.presentToast("CSV Updated Successfully, Start Scanning")
        
      };  
  
      reader.onerror = function () {  
        console.log('error is occured while reading file!');  
      };
    }
    
  }

  isValidCSVFile(file: any) {  
    return file.name.endsWith(".csv");  
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}
