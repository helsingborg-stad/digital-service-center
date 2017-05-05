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
    let foundCategory = eventCategories.find(c => c.id === firstActiveCat);

    //
    // Category not found, search in subcategories
    //
    if (!foundCategory) {
      const foundSubCategories = eventCategories.filter(cat => {
        return cat.subCategories && cat.subCategories.length;
      }).map(cat => cat.subCategories)
      .reduce((acc, cat) => acc.concat(cat), []);

      foundSubCategories.forEach(item => {
        if (item.id === firstActiveCat) {
          foundCategory = item;
          return;
        }
      });
    }

    return foundCategory ? foundCategory.activeColor : null;
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

  handleSideNavClick({id, subCategories, parentId}) {

    const { activeCategories } = this.state;
    let categoryIds = !parentId && subCategories && subCategories.length
      ? subCategories.map(sub => (sub.id)) : [];

    categoryIds = categoryIds.concat([id]);
    if (parentId && activeCategories
      .filter(x => x !== id)
      .every(activeId => {
        return subCategories.map(sub => (sub.id)).indexOf(activeId) === -1;
      })) {
      categoryIds = categoryIds.concat([parentId]);
    }

    this.setState(activeCategories.includes(id)
      ? {activeCategories: activeCategories.filter(x => !categoryIds.includes(x))}
      : {activeCategories: activeCategories.concat(categoryIds)});
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
        />
        <div className='LandingPage-searchWrapper'>
          <SearchField inline />
        </div>
        {!this.state.directions &&
        <SideNavigation>
          {pageData.categories && !!pageData.categories.length && pageData.categories.map(cat =>

            <SideNavigationLink
              id={cat.id}
              key={cat.id}
              name={cat.name}
              activeCategories={this.state.activeCategories}
              activeColor={cat.activeColor}
              handleClick={this.handleSideNavClick.bind(this)}
              icon='Bed'
              subCategories={cat.subCategories}
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
    events: state.events,
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
