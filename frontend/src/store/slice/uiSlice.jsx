// store/slice/uiSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  images: [],
  drawer: {
    isOpen: false,
    step: 1,
  },
  notification: {
    // New state for notifications
    message: null,
    type: null,
    show: false,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setInitialImages: (state, action) => {
      console.log("Setting initial images");
      state.images = action.payload;
    },
    updateImagesFromAPI: (state, action) => {
      console.log("image update from API");
      state.images = [...state.images, ...action.payload];
      state.notification.message = "New Look Generated!";
      state.notification.type = "success";
      state.notification.show = true;
    },
    openDrawer: (state) => {
      state.drawer.isOpen = true;
      state.drawer.step = 1;
    },
    closeDrawer: (state) => {
      state.drawer.isOpen = false;
      state.drawer.step = 1;
    },
    showNotification: (state, action) => {
      state.notification.message = action.payload.message;
      state.notification.type = action.payload.type || 'info';
      state.notification.show = true;
    },
    hideNotification: (state) => {
      state.notification.message = null;
      state.notification.type = null;
      state.notification.show = false;
    },
    nextStep: (state) => {
      if (state.drawer.step < 5) state.drawer.step += 1;
    },
    prevStep: (state) => {
      if (state.drawer.step > 1) state.drawer.step -= 1;
    },
  },
});

export const {
  setInitialImages,
  updateImagesFromAPI,
  openDrawer,
  closeDrawer,
  nextStep,
  prevStep,
  goToStep,
  showNotification,
  hideNotification
} = uiSlice.actions;

export default uiSlice.reducer;
