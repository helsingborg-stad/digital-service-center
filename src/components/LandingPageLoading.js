import React, { Component, PropTypes } from 'react';
import Lipping from './Lipping';
import { EventShowcase, Event } from './EventShowcase';
import AsideMenu from './AsideMenu';

export class LandingPageLoading extends Component {
  render() {
    return (
      <div className='LandingPage'>
        <Lipping />
      <div className='SiteHeader' style={{backgroundColor: this.props.bgColor}} />
        <main>
          <div className='GoogleMaps-wrapper' />
          <EventShowcase>
            {new Array(10).fill(null).map(() => (
            <Event
              key={Math.random()}
              id=''
              slug=''
              name=''
              onClick={() => {}} />
            ))}
          </EventShowcase>
        </main>
        <aside>
          <AsideMenu />
        </aside>
      </div>
    );
  }
}

LandingPageLoading.propTypes = {
  bgColor: PropTypes.string
};

export default LandingPageLoading;
