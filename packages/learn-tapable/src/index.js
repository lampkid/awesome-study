import { SyncHook, SyncBailHook, SyncWaterfallHook, SyncLoopHook, AsyncSeriesHook } from "tapable";

class Car {
  constructor() {
    this.hooks = {
      carStarted: new AsyncSeriesHook(["arg0"]),
      radioChanged: new SyncHook(["radioStation"])
    };
  }

  turnOn() {
    this.hooks.carStarted.callAsync( () => {
        console.log('async called')
    });
  }

  setRadioStation(radioStation) {
    this.hooks.radioChanged.call(radioStation);
  }
}
 
const myCar = new Car();

myCar.hooks.carStarted.tap("EngineLampPlugin", () => {
    console.log("Car started!");
    //return 'car started'
  });
  myCar.hooks.carStarted.tap("EngineLamp2Plugin", (prevRetVal) => {
    console.log(prevRetVal, "Car Engine2 started!");
   return 'car engine2 started'
  });
  
  myCar.hooks.radioChanged.tap("RadioPlugin", (radioStation) => {
    console.log(`Radio changed to ${radioStation}`);
  });
  
  myCar.setRadioStation("100.10");
  // "Radio changed to 100.10"
  myCar.turnOn();
  // "Car started!"
  
 