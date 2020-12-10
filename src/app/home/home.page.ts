import { Component, ViewChild } from '@angular/core';
import { CallNumber} from '@ionic-native/call-number/ngx';
import { Contacts } from '@ionic-native/contacts/ngx';
import { SMS, SmsOptions } from '@ionic-native/sms/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  image: string
  smsText: string
  latitude: any;
  longitude: any;
  map: any

  @ViewChild ('mapElement') mapElement;
  constructor(
    private callNumber: CallNumber,
    private contacts: Contacts,
    private sms: SMS,
    private camera: Camera,
    private geolocation: Geolocation,
    private facebook: Facebook
  ) {}
  
  loginWithFacebook(){
    this.facebook.login(['public_profile', 'user_friends', 'email']).then((response: FacebookLoginResponse) => {
      let userId = response.authResponse.userID;
      this.facebook.api("/me?fields=name,email", ['public_profile', 'user_friends', 'email']).then(userData =>{
        userData.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        this.image = userData.picture;
        alert(userData.name)
      })
    }, error=> {
      alert('error logging in' + error)
    })
  }
  loadMap(){
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: {lat: this.latitude, lng: this.longitude},
      zoom: 16
    })

    let position = new google.maps.LatLng(this.latitude,this.longitude);
    let mapMarker = new google.maps.Marker({
      position: position,
      latitude: this.latitude,
      longitude: this.longitude
    });

    mapMarker.setMap(this.map)
  }
  
  geolocationOptions: GeolocationOptions = {
    timeout: 10000,
    enableHighAccuracy: true,
    maximumAge: 3600
  }
  getCurrentLocation(){
    this.geolocation.getCurrentPosition(this.geolocationOptions).then(response => {
      this.latitude = response.coords.latitude;
      this.longitude = response.coords.longitude;

      alert(this.latitude)
      alert(this.longitude)
    }, error => {
      alert(error)
    })
  }
  
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
