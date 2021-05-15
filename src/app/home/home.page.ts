import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { AfterViewInit, Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { BarcodeScanner } = Plugins;
import { map } from 'rxjs/operators';
const startScan = async () => {
  
};

const stopScan = () => {
  const { BarcodeScanner } = Plugins;
  BarcodeScanner.showBackground();
  BarcodeScanner.stopScan();
};

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  idKey
  scanActive=false
  result
  data=[]
  displayData=null
  constructor(public http:HttpClient) {}

  async startScan(){
    this.scanActive=true
    await this.checkPermission()
    BarcodeScanner.hideBackground(); // make background of WebView transparent
  
    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
    
    // if the result has content
    if (result.hasContent) {
      this.scanActive=false
      console.log(result.content); // log the raw scanned content
      this.result=result.content
      this.showData(result)
    }
  }

  ionViewDidEnter(){
    this.http.get("assets/data.csv",{responseType: 'text'}).pipe(
      map((res: any) => {
        let rowStrings=res.split("\r\n")
        let objectArr=[]
        let keys = rowStrings[0].split(',')
        this.idKey=keys[0]
        rowStrings.splice(0,1)
        rowStrings.forEach(rowString => {
          if(rowString){
            let values=rowString.split(',')
            let obj={}
            keys.forEach((key,index) => {
              
              obj[key]=values[index]
            });
            objectArr.push(obj)
          }
        });
        return objectArr
      })
   ).subscribe(res=>{
      console.log(res)
      this.data=res
    },err=>{
      console.log(err)
    })
  }

  ngAfterViewInit(){
    BarcodeScanner.prepare()
  }

  async stopScan(){
    this.scanActive=false
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  }

  async checkPermission(){

  // check or request permission
  const status = await BarcodeScanner.checkPermission({ force: true });

  if (status.granted) {
    // the user granted permission
    return true;
  }

  return false;
  }

  showData(result:string){
    console.log(result) // string scanned for qr
    let temp = {}
    temp['ID']=result.substr(0,4)
    temp['herkunft1']=result.substr(4,3)
    temp['herkunft2']=result.substr(7,8)
    temp['puffer']=result.substr(15,2)
    temp['nm']=result.substr(17,2)
    temp['codiertes']=result.substr(19,5)
    console.log(temp)
    let found=this.data.find(element=>{
      return element[this.idKey]=temp['ID']
    })
    if(!found){
      found={}
    }
    
    this.displayData={...found,...temp}
    console.log(this.displayData)

    
  }

}
