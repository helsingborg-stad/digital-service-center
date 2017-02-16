import React, { Component } from 'react';
import Lipping from './Lipping';
import { SiteHeader, SiteHeaderLink } from './SiteHeader';
import { SiteSubHeader, SiteSubHeaderLink } from './SiteSubHeader';
import { SideNavigation, SideNavigationLink } from './SideNavigation';
import GoogleMaps from './GoogleMaps';
import { EventShowcase, Event } from './EventShowcase';
import AsideMenu from './AsideMenu';
import Calendar from './Calendar';
import WeatherWidget from './WeatherWidget';

import './StandardPage.css';

export default class StandardPage extends Component {
  render() {
    const mapProps = {
      markers: [{
        id: 'mitt id',
        lat: 56.0456282,
        lng: 12.7045333
      }, {
        id: 'mitt id2',
        lat: 56.0451487,
        lng: 12.6956927
      }, {
        id: 'mitt id3',
        lat: 56.0478332,
        lng: 12.6940619
      }
      ]
    };
    return (
      <div className='StandardPage'>
        <Lipping />
        <SiteHeader heading='Explore Helsingborg' bgColor='#c70d53'>
          <SiteHeaderLink name='Guided Tours' href='#asdf' />
          <SiteHeaderLink name='Mobile infopoint' href='#asdf' />
          <SiteHeaderLink name='Something else' href='#asdf' />
        </SiteHeader>
        <SiteSubHeader>
          <SiteSubHeaderLink name='Local' href='#asdf' />
          <SiteSubHeaderLink name='Vägbeskrivning på Knutpunkten' href='#asdf' />
          <SiteSubHeaderLink name='Ett bättre Helsingborg' href='#asdf' />
        </SiteSubHeader>
        <SideNavigation>
          <SideNavigationLink name='Stay' href='#asdf'>
            <SideNavigationLink name='Hotel' href='#asdf' />
            <SideNavigationLink name='Motel' href='#asdf' />
            <SideNavigationLink name='Bed &amp; Breakfast' href='#asdf' selected />
          </SideNavigationLink>
          <SideNavigationLink name='Eat' href='#asdf' />
          <SideNavigationLink name='See &amp; Do' href='#asdf' />
          <SideNavigationLink name='Events' href='#asdf' />
          <SideNavigationLink name='Today' href='#asdf' />
          <SideNavigationLink name='Nightlife' href='#asdf' />
          <SideNavigationLink name='Infopoints' href='#asdf' />
        </SideNavigation>
        <main>
          <GoogleMaps {...mapProps} />
          <EventShowcase>
            <Event
              name='Brooklyn i Helsingborg'
              href='#asdf'
              imgSrc='http://lorempixel.com/240/175?random=1' />
            <Event
              name='Alla går till Ebbas fik'
              href='#asdf'
              imgSrc='http://lorempixel.com/240/175?random=2' />
            <Event
              name='Se alla matcher på Pitchers'
              href='#asdf'
              imgSrc='http://lorempixel.com/240/175?random=3' />
            <Event
              name='Världens första apprestaurang'
              href='#asdf'
              imgSrc='http://lorempixel.com/240/175?random=4' />
            <Event
              name='Viskan för vinkännaren'
              href='#asdf'
              imgSrc='http://lorempixel.com/240/175?random=5' />
            <Event
              name='Avslappnad miljö hos Frida'
              href='#asdf'
              imgSrc='http://lorempixel.com/240/175?random=6' />
            <Event
              name='Avslappnad miljö hos Bengt'
              href='#asdf'
              imgSrc='http://lorempixel.com/240/175?random=7' />
            <Event
              name='Avslappnad miljö hos Lotta'
              href='#asdf'
              imgSrc='http://lorempixel.com/240/175?random=8' />
          </EventShowcase>
        </main>
        <aside>
          <AsideMenu>
            <Calendar />
            <WeatherWidget />
          </AsideMenu>
        </aside>
      </div>
    );
  }
}
