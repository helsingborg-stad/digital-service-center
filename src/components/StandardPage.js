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

import './StandardPage.css';

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

export class StandardPage extends Component {
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
    const dataIsEmpty = !Object.keys(this.props.data).length;
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

    const dataIsEmpty = !Object.keys(this.props.data).length;
    if (this.props.isLoading || dataIsEmpty) {
      return <p>Loading!</p>;
    }
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
          <GoogleMaps
            {...eventsWithCoordinates(this.props.data)}
            visibleModals={this.state.visibleModals}
            handleToggleModalVisibility={this.toggleModalVisibility.bind(this)}
          />
          <EventShowcase>
            {this.props.data.map(event => (
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

StandardPage.propTypes = {
  fetchData: PropTypes.func.isRequired,
  data: PropTypes.any, // TODO
  hasErrored: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
  return {
    data: state.events,
    hasErrored: state.eventsHasErrored,
    isLoading: state.eventsAreLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (url) => dispatch(eventsFetchData(url))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StandardPage);
