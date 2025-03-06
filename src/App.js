/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Billboard from './components/Billboard'
import Compliments from './components/Compliments'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import NewArrivals from './components/NewArrivals'
import Newsletter from './components/Newsletter'
import Shirts from './components/Shirts'
import Tshirts from './components/Tshirts'
import WinterComfort from './components/WinterComfort'
import "bootstrap/dist/css/bootstrap.min.css";
import Login from './components/Login'
import AddNameScreen from './components/AddName'
import "./App.css";
import UploadPicturesScreen from './components/UploadPictures'

const App = () => {
  return (
   <>
   <Navbar/>
   <Billboard/>
   <NewArrivals/>
   <WinterComfort/>
   <Compliments/>
   <Shirts/>
   <Tshirts/>
   <Newsletter/>
   <Footer/>
   </>
  )
}

export default App