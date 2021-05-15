import { ThrowStmt } from '@angular/compiler';
import { AfterViewInit, Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { BarcodeScanner } = Plugins;
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
  scanActive=false
  result
  constructor() {}

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
    }
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

}
