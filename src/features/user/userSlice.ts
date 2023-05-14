import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Geocode from "../../models/Geocode";
import { AppDispatch, RootState } from "../../store";
import { Alert } from "../alerts/alertsSlice";
import * as storage from "./storage";
import { UserLocation } from "./storage";

export enum AltitudeType {
  AGL = "AGL",
  MSL = "MSL",
}

// CSS scroll-snap-stop
export enum OnOff {
  On = "On",
  Off = "Off",
}

export enum SpeedUnit {
  KPH = "km/h",
  MPH = "mph",
  Knots = "knots",
  mps = "m/s",
}

export enum HeightUnit {
  Feet = "ft",
  Meters = "m",
}

export enum TemperatureUnit {
  Celsius = "°C",
  Fahrenheit = "°F",
}

export function toggle(altitude: AltitudeType): AltitudeType {
  switch (altitude) {
    case AltitudeType.AGL:
      return AltitudeType.MSL;
    case AltitudeType.MSL:
      return AltitudeType.AGL;
  }
}

interface UserState {
  recentLocations: UserLocation[];
  altitude: AltitudeType;
  heightUnit: HeightUnit;
  speedUnit: SpeedUnit;
  temperatureUnit: TemperatureUnit;
  readAlerts: Record<string, string>;
  hiddenAlerts: Record<string, true>;
  swipeInertia: OnOff;
  gAirmetRead: OnOff;
}

// Define the initial state using that type
const initialState: UserState = {
  recentLocations: storage.getLocations(),
  altitude: storage.getAltitude(),
  heightUnit: storage.getHeightUnit(),
  speedUnit: storage.getSpeedUnit(),
  temperatureUnit: storage.getTemperatureUnit(),
  readAlerts: storage.getReadAlerts(),
  hiddenAlerts: storage.getHiddenAlerts(),
  swipeInertia: storage.getSwipeInertia(),
  gAirmetRead: storage.getGAirmetRead(),
};

/**
 * User preferences
 */
export const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateLocations(state, action: PayloadAction<UserLocation[]>) {
      state.recentLocations = action.payload;
    },
    toggleAltitude(state) {
      state.altitude = toggle(state.altitude);
    },
    updateAltitude(state, action: PayloadAction<AltitudeType>) {
      state.altitude = action.payload;
    },
    updateHeightUnit(state, action: PayloadAction<HeightUnit>) {
      state.heightUnit = action.payload;
    },
    updateSpeedUnit(state, action: PayloadAction<SpeedUnit>) {
      state.speedUnit = action.payload;
    },
    updateTemperatureUnit(state, action: PayloadAction<TemperatureUnit>) {
      state.temperatureUnit = action.payload;
    },
    readAlert(state, action: PayloadAction<Alert>) {
      state.readAlerts = storage.setReadAlert(action.payload);
    },
    hideAlert(state, action: PayloadAction<Alert>) {
      state.hiddenAlerts = storage.setHiddenAlert(action.payload);
    },
    resetHiddenAlerts(state) {
      storage.resetHiddenAlerts();
      state.hiddenAlerts = {};
    },
    setSwipeInertia(state, action: PayloadAction<OnOff>) {
      state.swipeInertia = storage.setSwipeInertia(action.payload);
    },
    setGAirmetRead(state, action: PayloadAction<OnOff>) {
      state.gAirmetRead = storage.setGAirmetRead(action.payload);
    },
  },
});

export const {
  updateLocations,
  readAlert,
  hideAlert,
  resetHiddenAlerts,
  setSwipeInertia,
  setGAirmetRead,
} = userReducer.actions;

export const toggleAltitude =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userReducer.actions.toggleAltitude());

    storage.setAltitude(getState().user.altitude);
  };

export const setAltitude =
  (altitude: AltitudeType) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userReducer.actions.updateAltitude(altitude));

    storage.setAltitude(getState().user.altitude);
  };

export const setHeightUnit =
  (altitude: HeightUnit) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userReducer.actions.updateHeightUnit(altitude));

    storage.setHeightUnit(getState().user.heightUnit);
  };

export const setSpeedUnit =
  (speedUnit: SpeedUnit) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userReducer.actions.updateSpeedUnit(speedUnit));

    storage.setSpeedUnit(getState().user.speedUnit);
  };

export const setTemperatureUnit =
  (temperatureUnit: TemperatureUnit) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userReducer.actions.updateTemperatureUnit(temperatureUnit));

    storage.setTemperatureUnit(getState().user.temperatureUnit);
  };

export const visitedLocation =
  (geocode: Geocode) => async (dispatch: AppDispatch) => {
    const updatedLocations = storage.visitedLocation({
      ...geocode,
      lastVisited: Date.now(),
    });

    dispatch(updateLocations(updatedLocations));
  };

export const removeLocation =
  (location: UserLocation) => async (dispatch: AppDispatch) => {
    const updatedLocations = storage.removeLocation(location);

    dispatch(updateLocations(updatedLocations));
  };

export default userReducer.reducer;
