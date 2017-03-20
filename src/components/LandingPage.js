import React, { Component, PropTypes } from 'react';
import Lipping from './Lipping';
import { SiteHeader, SiteHeaderLink } from './SiteHeader';
import { SiteSubHeader, SiteSubHeaderLink } from './SiteSubHeader';
import { SideNavigation, SideNavigationLink } from './SideNavigation';
import GoogleMaps from './GoogleMaps';
import { EventShowcase, Event } from './EventShowcase';
import AsideMenu from './AsideMenu';
import Calendar from './Calendar';
import WeatherWidget from './WeatherWidget';
import { connect } from 'react-redux';
import { eventsFetchData } from '../actions/events';

import './LandingPage.css';

const eventsWithCoordinates = (events) => {
  return events.filter(e => e.location && e.location.latitude && e.location.longitude)
    .reduce((acc, e) => {
      acc.markers.push({
        id: e.id,
        lat: e.location.latitude,
        lng: e.location.longitude,
        eventData: e
      });
      return acc;
    }, {markers: []});
};

export class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleModals: []
    };
  }

  static fetchData({ store }) {
    return store.dispatch(
      eventsFetchData('/api/events')
    );
  }

  toggleModalVisibility(modalId) {
    const visibleModals = this.state.visibleModals;
    this.setState(visibleModals.includes(modalId)
      ? {visibleModals: visibleModals.filter(x => x !== modalId)}
      : {visibleModals: visibleModals.concat([modalId])});
  }

  componentDidMount() {
    const dataIsEmpty = !Object.keys(this.props.events).length;
    if (dataIsEmpty) {
      this.props.fetchData('/api/events');
    }
  }

  render() {
    if (this.props.hasErrored) {
      return (
       <p>Error!</p>
      );
    }

    const dataIsEmpty = !Object.keys(this.props.events).length;
    if (this.props.isLoading || dataIsEmpty) {
      return <p>Loading!</p>;
    }
    const pageData = this.props.landingPages[this.props.type];
    return (
      <div className='LandingPage'>
        <Lipping />
        <SiteHeader heading={pageData.heading} bgColor={this.props.bgColor}>
          { pageData.topLinks.map(({name, href}) => (
            <SiteHeaderLink name={name} href={href} key={href} />))
          }
        </SiteHeader>
        <SiteSubHeader logoColor={this.props.bgColor}>
          { pageData.subTopLinks.map(({name, href}) => (
            <SiteSubHeaderLink name={name} href={href} key={href} />))
          }
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
          <GoogleMaps
            {...eventsWithCoordinates(this.props.events)}
            visibleModals={this.state.visibleModals}
            handleToggleModalVisibility={this.toggleModalVisibility.bind(this)}
          />
          <EventShowcase>
            {this.props.events.map(event => (
            <Event
              key={event.id}
              id={event.id}
              name={event.name}
              imgSrc={event.imgUrl}
              onClick={this.toggleModalVisibility.bind(this)} />
            ))}
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

LandingPage.propTypes = {
  type: PropTypes.oneOf(['visitor', 'local']),
  bgColor: PropTypes.string,
  fetchData: PropTypes.func.isRequired,
  events: PropTypes.any, // TODO
  landingPages: PropTypes.any, // TODO
  hasErrored: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
  return {
    events: state.events,
    landingPages: state.landingPages,
    hasErrored: state.eventsHasErrored,
    isLoading: state.eventsAreLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (url) => dispatch(eventsFetchData(url))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
