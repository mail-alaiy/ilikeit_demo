/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

const SearchPopup = () => {
  return (
    <div class="search-popup">
    <div class="search-popup-container">

      <form role="search" method="get" class="form-group" action="">
        <input type="search" id="search-form" class="form-control border-0 border-bottom"
          placeholder="Type and press enter" value="" name="s" />
        <button type="submit" class="search-submit border-0 position-absolute bg-white"
          style={{top: "15px", right: "15px"}}><svg class="search" width="24" height="24">
            {/*search*/}
          </svg></button>
      </form>

      <h5 class="cat-list-title">Browse Categories</h5>

      <ul class="cat-list">
        <li class="cat-list-item">
          <a href="#" title="Jackets">Jackets</a>
        </li>
        <li class="cat-list-item">
          <a href="#" title="T-shirts">T-shirts</a>
        </li>
        <li class="cat-list-item">
          <a href="#" title="Handbags">Shirts</a>
        </li>
        <li class="cat-list-item">
          <a href="#" title="Accessories">Formal Wear</a>
        </li>
        <li class="cat-list-item">
          <a href="#" title="Cosmetics">Winter Wear</a>
        </li>
      </ul>

    </div>
  </div>
  )
}

export default SearchPopup