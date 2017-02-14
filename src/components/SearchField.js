import React, { Component } from 'react';
import './SearchField.css';
import searchIcon from '../media/search.svg';

export default class SearchField extends Component {
  render() {
    return (
      <div className='SearchField'>
      <form method='get' id='search' action='#' onSubmit={this.handleSearchSubmit}>
      <input type='search' className='SearchField-input' placeholder='Search' />
      <input className='SearchField-button' name="searchsubmit" type="image" src={searchIcon} value="Sök" />
      </form>
      </div>
    );
  }
  handleSearchSubmit() {
    return false;
  }
}
