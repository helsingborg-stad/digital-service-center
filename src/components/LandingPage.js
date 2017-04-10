import React, { Component, PropTypes } from 'react';
import Lipping from './Lipping';
import { SiteHeader, SiteHeaderLink } from './SiteHeader';
import { SiteSubHeader, SiteSubHeaderLink } from './SiteSubHeader';
import { SiteFooter, SiteFooterLink } from './SiteFooter';
import { SideNavigation, SideNavigationLink } from './SideNavigation';
import GoogleMaps from './GoogleMaps';
import { EventShowcase, Event } from './EventShowcase';
import EventOverlay from './EventOverlay';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import AsideMenu from './AsideMenu';
import Calendar from './Calendar';
import WeatherWidget from './WeatherWidget';
import LandingPageLoading from './LandingPageLoading';
import LandingPageError from './LandingPageError';
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
      visibleModals: [],
      visibleOverlayEvent: props.activeEvent || null,
      categories: [
        { name: 'Stay', id: 0, children: [
          {name: 'Hotel', id: 1, children: [], selected: false },
          {name: 'Motel', id: 2, children: [], selected: false },
          {name: 'Bed & Breakfast', id: 3, children: [], selected: false }
        ], selected: false},
        { name: 'Eat', id: 4, children: [], selected: false},
        { name: 'See & Do', id: 5, children: [], selected: false},
        { name: 'Events', id: 6, children: [], selected: false},
        { name: 'Today', id: 7, children: [], selected: false},
        { name: 'Nightlife', id: 8, children: [], selected: false},
        { name: 'Infopoints', id: 9, children: [], selected: false}
      ]
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

  changeOverlayEvent(eventSlug) {
    const event = this.props.events.find(e => e.slug === eventSlug);
    this.setState({
      visibleOverlayEvent: event ? event.slug : null
    });
  }

  componentDidMount() {
    const dataIsEmpty = !Object.keys(this.props.events).length;
    if (dataIsEmpty) {
      this.props.fetchData('/api/events');
    }
  }

  handleSideNavClick(id) {
    const categories = this.state.categories.map(cat =>
      cat.id === id ? Object.assign({}, cat, {id: id, selected: !cat.selected}) : cat
    );
    this.setState({
      categories: categories
    });
  }

  render() {
    if (this.props.hasErrored) {
      return <LandingPageError reloadPage={() => this.props.fetchData('/api/events')} />;
    }

    const dataIsEmpty = !Object.keys(this.props.events).length;
    if (this.props.isLoading || dataIsEmpty) {
      return <LandingPageLoading bgColor={this.props.bgColor} />;
    }
    const pageData = this.props.landingPages[this.props.type];
    return (
      <div className='LandingPage'>
        <Lipping />
        <SiteHeader heading={pageData.heading} bgColor={this.props.bgColor} freeWifiLink={this.props.landingPages.shared.freeWifi}>
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
          {this.state.categories.map(cat =>
            <SideNavigationLink
              key={cat.id}
              name={cat.name}
              selected={cat.selected}
              handleClick={() => this.handleSideNavClick(cat.id)}
            >
              { cat.children && cat.children.map(innerCat =>
              <SideNavigationLink name={innerCat.name} key={innerCat.key} />)
              }
            </SideNavigationLink>)
          }
        </SideNavigation>
        <main>
          <GoogleMaps
            {...eventsWithCoordinates(this.props.events)}
            visibleModals={this.state.visibleModals}
            handleToggleModalVisibility={this.toggleModalVisibility.bind(this)}
            handleShowMoreInfo={this.changeOverlayEvent.bind(this)}
          />
          <EventShowcase>
            {this.props.events.map(event => (
            <Event
              key={event.id}
              id={event.id}
              slug={event.slug}
              name={event.name}
              imgSrc={event.imgUrl}
              onClick={this.changeOverlayEvent.bind(this)} />
            ))}
          </EventShowcase>
          <SiteFooter>
            { [...pageData.topLinks, ...pageData.subTopLinks].map(({name, href}) => (
              <SiteFooterLink name={name} href={href} key={href} />))
            }
          </SiteFooter>
         <ReactCSSTransitionGroup
            transitionName="EventOverlay-transitionGroup"
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}
            transitionEnter={true}
            transitionLeave={true}
          >
            { this.state.visibleOverlayEvent &&
              <EventOverlay
                key='event-overlay'
                event={this.props.events.find(e => e.slug === this.state.visibleOverlayEvent)}
                handleClose={() => this.changeOverlayEvent(null)}
              />
            }
          </ReactCSSTransitionGroup>
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
  isLoading: PropTypes.bool.isRequired,
  activeEvent: PropTypes.string
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
