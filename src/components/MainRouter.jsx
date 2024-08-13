import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Categories from './Admin/Categories'
import Dishes from './Admin/Dishes'
import Home from './Admin/Home'
import Login from './Admin/Login';
import Maincategories from './Admin/Maincategories';
import Stocks from './Admin/Stocks'
import Metalprice from './Admin/Metalprice'
import Demo from './Admin/Demo'
import Components from './Admin/Components';
import Settings from './Admin/Settings';
import Subcategory from './Admin/Subcategory';
import Banner from './Admin/Banner';
import Coupon from './Admin/Coupon';





// import Products from './Client/Products'
// import Aboutus from './Client/Aboutus'
// import Viewdetails from './Client/Viewdetails'
// import Scheme from './Client/Scheme'
function MainRouter() {
  return (
    <div>
      <Routes>
            <Route>
              {/* <Route path="/" element={<Home />} /> */}
              <Route path="/" element={<Login />}  />
              <Route path="/home" element={<Home />} />
              {/* <Route path="products" element={<Products />} />
              <Route path="aboutus" element={<Aboutus />} />
              <Route path="scheme" element={< Scheme/>} /> */}
              <Route path="/dishes" element={<Dishes/>} />
              {/* <Route path="/view-details" element={<Viewdetails />} />            */}
              <Route path="categories" element={<Categories />} />
              <Route path="maincategories" element={<Maincategories />} />
              <Route path="/subcategories" element={<Subcategory />} />
              <Route path="stocks" element={<Stocks />} />
              <Route path="metalprice" element={<Metalprice />} />
              <Route path="demo" element={<Demo />} />
              <Route path="asd" element={<Components/>} />
              <Route path="/settings" element={<Settings/>} />
              <Route path="/banners" element={< Banner/>} />
              <Route path="/coupon" element={< Coupon/>} />





              </Route>
      </Routes>
    </div>
  )
}

export default MainRouter