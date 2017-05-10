import React, { Component, PropTypes } from 'react';
import Lipping from './Lipping';
import SiteHeader from './SiteHeader';
import { SiteFooter, SiteFooterLink } from './SiteFooter';
import VergicChatButton from './VergicChatButton';
import { SideNavigation, SideNavigationLink } from './SideNavigation';
import SearchField from './SearchField';
import SearchResultOverlay from './SearchResultOverlay';
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
import LanguageFlags from './LanguageFlags';
import Sifter from 'sifter';

import './LandingPage.css';

const getRelatedEvents = (events, mainEvent) => {
  return events.filter(event => {
    return mainEvent.id !== event.id && event.categories.reduce((catArray, cat) => {
      if (mainEvent.categories.find(c => c.id === cat.id)) {
        catArray.push(cat);
      }
      return catArray;
    }, []).length;
  });
};

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
    const relatedEvents = event ? getRelatedEvents(
      this.props.events,
      event
    ) : null;
    this.setState({
      visibleOverlayEvent: event ? event.slug : null,
      relatedEvents: relatedEvents
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
    if (this.refs.eventsDateListScroll) {
      this.refs.eventsDateListScroll.scrollToTop();
    }
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

  searchEvents(searchTerm, events) {
    const sifter = new Sifter(events);
    const result = sifter.search(searchTerm, {
      fields: ['name', 'content'],
      sort: [{field: 'name', direction: 'asc'}],
      limit: 10
    });

    const resultEvents = events.filter((event, index) => {
      return result.items.some(item => item.id === index);
    });

    this.setState({
      searchResults: resultEvents.map(e => e.name + '')
    });
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
            <SearchField inline onSearchChange={(val) => this.searchEvents(val, this.props.events).bind(this)} />
            <SearchResultOverlay searchResults={this.state.searchResults} />
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
              icon={cat.iconName}
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
            {this.props.events.slice(0, 10).map(event => (
            <Event
              key={event.id}
              {...event}
              onClick={this.changeOverlayEvent.bind(this)} />
            ))}
          </EventShowcase>
          <SiteFooter color={this.props.bgColor} backToStartPath={`/${this.props.activeLanguage}/`}>
            { pageData.bottomLinks.map((link) => (
              <SiteFooterLink key={link.href + link.name} link={link} />))
            }
            <VergicChatButton className='SiteFooterLink' pageName={pageData.heading} />
              <div className='Startpage-langWrapper'>
                <LanguageFlags activeLanguage={this.props.activeLanguage}/>
              </div>
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
                relatedEvents={this.state.relatedEvents}
                changeOverlayEvent={this.changeOverlayEvent.bind(this)}
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
            <Scrollbars
              ref='eventsDateListScroll'
              autoHeight
              autoHeightMax='80vh - 3.25rem - 4.6875rem - 400px - 2rem'
            >
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
