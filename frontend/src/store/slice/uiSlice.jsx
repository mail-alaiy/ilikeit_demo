// store/slice/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  images: [],
  drawer: {
    isOpen: false,
    step: 1
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setInitialImages: (state, action) => {
      console.log("Setting initial images");
      state.images = action.payload;
    },
    updateImagesFromAPI: (state, action) => {
      console.log("image update from API");
        state.images = [...state.images, ...action.payload];
    },
    openDrawer: (state) => {
      state.drawer.isOpen = true;
      state.drawer.step = 1;
    },
    closeDrawer: (state) => {
      state.drawer.isOpen = false;
      state.drawer.step = 1;
    },
    nextStep: (state) => {
      if (state.drawer.step < 5) state.drawer.step += 1;
    },
    prevStep: (state) => {
      if (state.drawer.step > 1) state.drawer.step -= 1;
    }
  }
});

export const {
  setInitialImages,
  updateImagesFromAPI,
  openDrawer,
  closeDrawer,
  nextStep,
  prevStep,
  goToStep
} = uiSlice.actions;

export default uiSlice.reducer;
