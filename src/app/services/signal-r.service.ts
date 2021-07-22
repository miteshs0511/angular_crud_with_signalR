import { Injectable, EventEmitter } from "@angular/core";
// import * as signalR from "@aspnet/signalr";
import * as signalR from "@microsoft/signalr";

@Injectable({
  providedIn: "root"
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  signalReceived = new EventEmitter<any>();

  constructor() {
    this.buildConnection();
    this.startConnection();
  }

  private buildConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:56485/signalHub") //use your api address here and make sure you use right hub name.
      .build();
  };

  private startConnection = () => {
    this.hubConnection
      .start()
      .then(() => {
        console.log("Connection Started...");
        this.registerSignalEvents();
      })
      .catch(err => {
        console.log("Error while starting connection: " + err);

        //if you get error try to start connection again after 3 seconds.
        setTimeout(function() {
          this.startConnection();
        }, 3000);
      });
  };

  private registerSignalEvents() {
    this.hubConnection.on("SignalMessageReceived", (data: any) => {
      this.signalReceived.emit(data);
    });
    this.hubConnection.on("GetDetails", (data: any) => {
      this.signalReceived.emit(data);
    });

  }
}
