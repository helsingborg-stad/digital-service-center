import React, { Component, PropTypes } from 'react';
import Lipping from './Lipping';
import { SiteHeader, SiteHeaderLink } from './SiteHeader';
import { SiteSubHeader, SiteSubHeaderLink } from './SiteSubHeader';
import { SiteFooter, SiteFooterLink } from './SiteFooter';
import { SideNavigation, SideNavigationLink } from './SideNavigation';
import SearchField from './SearchField';
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

const selectedEventsWithCoordinates = (events, activeCategories, eventCategories) => {
  const getActiveColorForEvent = (event) => {
    const firstActiveCat = event.categories.map(c => c.id).find(c => activeCategories.includes(c));
    return eventCategories.find(c => c.id === firstActiveCat).activeColor;
  };

  const selectedEvents = !activeCategories.length
    ? []
    : events.filter(e => {
      return e.categories.map(c => c.id).some(c => activeCategories.includes(c));
    }).map(e => {
      return Object.assign({}, e, { activeColor: getActiveColorForEvent(e) });
    });

  return selectedEvents.filter(e => e.location && e.location.latitude && e.location.longitude)
    .reduce((acc, e) => {
      acc.markers.push({
        id: e.id,
        lat: e.location.latitude,
        lng: e.location.longitude,
        eventData: e,
        activeColor: e.activeColor
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
      activeCategories: []
    };
  }

  static fetchData({ store }) {
    return store.dispatch(
      eventsFetchData('/api/events')
    );
  }

  toggleModalVisibility(modalId) {
    const { visibleModals } = this.state;
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
    const { activeCategories } = this.state;
    this.setState(activeCategories.includes(id)
      ? {activeCategories: activeCategories.filter(x => x !== id)}
      : {activeCategories: activeCategories.concat([id])});
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
        <SiteHeader
          heading={pageData.heading}
          bgColor={this.props.bgColor}
          freeWifiLink={this.props.landingPages.shared.freeWifi}
        >
          { pageData.topLinks.map(({name, url}) => (
            <SiteHeaderLink name={name} href={url} key={url} />))
          }
        </SiteHeader>
        <SiteSubHeader logoColor={this.props.bgColor}>
          { pageData.subTopLinks.map(({name, url}) => (
            <SiteSubHeaderLink name={name} href={url} key={url} />))
          }
        </SiteSubHeader>
        <div className='LandingPage-searchWrapper'>
          <SearchField inline />
        </div>
        <SideNavigation>
          {this.props.categories && this.props.categories.map(cat =>
            <SideNavigationLink
              key={cat.id}
              name={cat.name}
              selected={this.state.activeCategories.includes(cat.id)}
              activeColor={cat.activeColor}
              handleClick={() => this.handleSideNavClick(cat.id)}
              icon='Bed'
            />)
          }
        </SideNavigation>
        <main>
          <GoogleMaps
            {...selectedEventsWithCoordinates(this.props.events, this.state.activeCategories, this.props.categories)}
            visibleModals={this.state.visibleModals}
            handleToggleModalVisibility={this.toggleModalVisibility.bind(this)}
            handleShowMoreInfo={this.changeOverlayEvent.bind(this)}
            apiKey={this.props.googleMapsApiKey}
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
          <SiteFooter color={this.props.bgColor}>
            { [...pageData.topLinks, ...pageData.subTopLinks].map(({name, url}) => (
              <SiteFooterLink name={name} href={url} key={url} />))
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
            <Calendar themeCssClass={this.props.type} />
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
  categories: PropTypes.array,
  landingPages: PropTypes.any, // TODO
  hasErrored: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  activeEvent: PropTypes.string,
  googleMapsApiKey: PropTypes.string
};

const mapStateToProps = (state) => {
  return {
    events: state.events,
    categories: state.eventsCategories,
    landingPages: state.landingPages,
    hasErrored: state.eventsHasErrored,
    isLoading: state.eventsAreLoading,
    googleMapsApiKey: state.siteSettings.googleMapsApiKey
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (url) => dispatch(eventsFetchData(url))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
