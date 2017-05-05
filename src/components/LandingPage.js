import React, { Component, PropTypes } from 'react';
import Lipping from './Lipping';
import SiteHeader from './SiteHeader';
import { SiteFooter, SiteFooterLink } from './SiteFooter';
import { SideNavigation, SideNavigationLink } from './SideNavigation';
import SearchField from './SearchField';
import GoogleMaps from './GoogleMaps';
import GoogleMapsDirections from './GoogleMapsDirections';
import { EventShowcase, Event } from './EventShowcase';
import EventOverlay from './EventOverlay';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import AsideMenu from './AsideMenu';
import Calendar from './Calendar';
import LandingPageLoading from './LandingPageLoading';
import LandingPageError from './LandingPageError';
import Scrollbars from 'react-custom-scrollbars';
import EventsDateList from './EventsDateList.js';
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
      activeCategories: [],
      directions: null,
      selectedDates: null
    };
  }

  static fetchData({ store }) {
    return store.dispatch(
      eventsFetchData('/api/events', store.getState().activeLanguage)
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
    const dataIsEmpty = !this.props.events || !Object.keys(this.props.events).length;
    if (dataIsEmpty) {
      this.props.fetchData('/api/events', this.props.activeLanguage);
    }
  }

  showDirections(directions) {
    this.setState({
      directions: directions
    });
  }

  handleSelectedDates(selectedDates) {
    this.setState({
      selectedDates: selectedDates
    });
  }

  handleSideNavClick(id) {
    const { activeCategories } = this.state;
    this.setState(activeCategories.includes(id)
      ? {activeCategories: activeCategories.filter(x => x !== id)}
      : {activeCategories: activeCategories.concat([id])});
  }

  render() {
    if (this.props.hasErrored) {
      return <LandingPageError reloadPage={() => this.props.fetchData('/api/events', this.props.activeLanguage)} />;
    }

    const dataIsEmpty = !this.props.events || !Object.keys(this.props.events).length;
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
        />
        <div className='LandingPage-searchWrapper'>
          <SearchField inline />
        </div>
        {!this.state.directions &&
        <SideNavigation>
          {pageData.categories && !!pageData.categories.length && pageData.categories.map(cat =>
            <SideNavigationLink
              key={cat.id}
              name={cat.name}
              selected={this.state.activeCategories.includes(cat.id)}
              activeColor={cat.activeColor}
              handleClick={() => this.handleSideNavClick(cat.id)}
              icon={cat.iconName}
            />)
          }
        </SideNavigation>
        }
        <main>
          <div className='LandingPage-mapWrapper'>
            {!this.state.directions
            ? <GoogleMaps
              {...selectedEventsWithCoordinates(
                this.props.events,
                this.state.activeCategories,
                pageData.categories
              )}
              visibleModals={this.state.visibleModals}
              handleToggleModalVisibility={this.toggleModalVisibility.bind(this)}
              handleShowMoreInfo={this.changeOverlayEvent.bind(this)}
              apiKey={this.props.googleMapsApiKey}
              handleShowDirections={this.showDirections.bind(this)}
            />
            : <GoogleMapsDirections
              origin={this.state.directions.origin}
              destination={this.state.directions.destination}
              handleClose={this.showDirections.bind(this, null)}
            />
            }
          </div>
          <EventShowcase>
            {this.props.events.map(event => (
            <Event
              key={event.id}
              {...event}
              onClick={this.changeOverlayEvent.bind(this)} />
            ))}
          </EventShowcase>
          <SiteFooter color={this.props.bgColor}>
            { pageData.bottomLinks.map(({name, url}) => (
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
            { this.state.visibleOverlayEvent && !this.state.directions &&
              <EventOverlay
                key='event-overlay'
                event={this.props.events.find(e => e.slug === this.state.visibleOverlayEvent)}
                handleClose={() => this.changeOverlayEvent(null)}
                handleShowDirections={this.showDirections.bind(this)}
              />
            }
          </ReactCSSTransitionGroup>
        </main>
        <aside>
          <AsideMenu>
            <Calendar
              themeCssClass={this.props.type}
              handleSelectedDates={this.handleSelectedDates.bind(this)}
            />
            <Scrollbars autoHeight autoHeightMax='80vh - 3.25rem - 4.6875rem - 400px - 2rem'>
              <EventsDateList
                events={this.props.events}
                selectedDates={this.state.selectedDates}
                handleOverlayEvent={this.changeOverlayEvent.bind(this)}
              />
            </Scrollbars>
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
  activeLanguage: PropTypes.string.isRequired,
  events: PropTypes.any, // TODO
  categories: PropTypes.array,
  landingPages: PropTypes.any, // TODO
  hasErrored: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  activeEvent: PropTypes.string,
  googleMapsApiKey: PropTypes.string,
  directions: PropTypes.shape({
    origin: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired
    }).isRequired,
    destination: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired
    }).isRequired
  })
};

const mapStateToProps = (state) => {
  return {
    events: state.events[state.activeLanguage],
    activeLanguage: state.activeLanguage,
    landingPages: state.landingPages,
    hasErrored: (state.activeLanguage in state.eventsHasErrored)
      ? state.eventsHasErrored[state.activeLanguage] : false,
    isLoading: (state.activeLanguage in state.eventsAreLoading)
      ? state.eventsAreLoading[state.activeLanguage] : false,
    googleMapsApiKey: state.siteSettings.googleMapsApiKey
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (url, lang) => dispatch(eventsFetchData(url, lang))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
