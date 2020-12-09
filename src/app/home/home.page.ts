import { Component } from '@angular/core';
import { CallNumber} from '@ionic-native/call-number/ngx';
import { Contacts } from '@ionic-native/contacts/ngx';
import { SMS, SmsOptions } from '@ionic-native/sms/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  image: string
  smsText: string

  constructor(
    private callNumber: CallNumber,
    private contacts: Contacts,
    private sms: SMS,
    private camera: Camera
  ) {}
  
  takePicture(){
    var cameraOption: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(cameraOption).then((imageData) => {
      let base = 'data:image/jpeg;base64,' + imageData;
      this.image = base;
    }, (err) => {
      alert(err);
    })
  }

  browsePicture(){
    var cameraOption: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
    }

    this.camera.getPicture(cameraOption).then((imageData) => {
      let base = 'data:image/jpeg;base64,' + imageData;
      this.image = base;
    }, (err) => {
      alert(err);
    })
  }
  
  sendSms(){
    this.contacts.pickContact().then((contact) => {
      var contactNumber = contact.phoneNumbers[0].value;
      var smsOptions: SmsOptions = {
        replaceLineBreaks: false,
        android: {
          intent: 'INTENT'
        }        
      }
      this.sms.send(contactNumber,this.smsText, smsOptions).then((data) => {
        alert(data);
      }, (err) => {
        alert(err);
      })
    }, (err) => {
      alert(err);
    })
  }
  call(){
    this.contacts.pickContact().then((contact) => {
      var contactNumber = contact.phoneNumbers[0].value;
      this.callNumber.callNumber(contactNumber, true).then((data) => {
        alert(data);
      }, err => {
        alert(err);
      })
    })
  }

}
