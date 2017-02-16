import React, { Component } from 'react';
import './WeatherWidget.css';

export default class WeatherWidget extends Component {
  render() {
    return (
      <div className='WeatherWidget'>
        <br />
        <br />
        <img src='https://image.flaticon.com/icons/svg/17/17785.svg' role='presentation' style={{width: '90px', marginLeft: '80px'}} />
        <br />
        <br />
        <br />
        Här kommer väderinfo så småning om :)
        <br />
        <br />
        <br />
        Som placeholder art har vi ett svart åskmoln. Läskiga grejer! :O
        <br />
        <br />
        <br />
      </div>
    );
  }
}
