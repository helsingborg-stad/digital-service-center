import React, { Component, PropTypes } from 'react';
import Lipping from './Lipping';
import SiteHeader from './SiteHeader';
import { SiteFooter, SiteFooterLink } from './SiteFooter';
import VergicChatButton from './VergicChatButton';
import { Event } from './EventShowcase';
import Scrollbars from 'react-custom-scrollbars';
import LandingPageLoading from './LandingPageLoading';
import LandingPageError from './LandingPageError';
import EventOverlay from './EventOverlay';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import AsideMenu from './AsideMenu';
import Calendar from './Calendar';
import { connect } from 'react-redux';
import { eventsFetchData } from '../actions/events';
import EventsDateList from './EventsDateList.js';
import './EventsPage.css';
import GoogleMapsDirections from './GoogleMapsDirections';
import LanguageFlags from './LanguageFlags';
import SearchField from './SearchField';
import SearchResultOverlay from './SearchResultOverlay';
import Sifter from 'sifter';
import cn from 'classnames';

const getDistinctEventCategories = (events, excludedCategories) => {
  const distinctCategories = events.reduce((acc, event) => {
    if (event.type !== 'event') {
      return acc;
    }
    event.categories.forEach(cat => {
      if (!acc.some(c => c.id === cat.id) && !excludedCategories.includes(cat.id)) {
        acc.push(cat);
      }
    });
    return acc;
  }, []);
  return distinctCategories.sort((a, b) => a.name.localeCompare(b.name));
};

const getEventsForCategory = (events, categoryId) => {
  return events.filter(event => (
    event.categories.some(c => c.id === categoryId) && event.type === 'event'
  ));
};

const getRelatedEvents = (events, mainEvent) => {
  const relatedEvents = events.filter(event => {
    return mainEvent.id !== event.id && event.categories.reduce((catArray, cat) => {
      if (mainEvent.categories.find(c => c.id === cat.id)) {
        catArray.push(cat);
      }
      return catArray;
    }, []).length;
  });
  return relatedEvents;
};

export class EventsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleOverlayEvent: props.activeEvent || null,
      selectedDates: null,
      directions: null
    };
  }

  static fetchData({ store }) {
    return store.dispatch(
      eventsFetchData('/api/events', store.getState().activeLanguage)
    );
  }

  handleHideSearchResult() {
    this.setState({
      searchResults: null
    });
  }

  showDirections(directions) {
    this.setState({
      directions: directions
    });
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
      searchResults: resultEvents
    });
  }

  changeOverlayEvent(eventSlug) {
    const event = this.props.events.find(e => e.slug === eventSlug);
    const relatedEvents = event ? getRelatedEvents(
      this.props.events,
      event
    ) : null;
    this.setState({
      visibleOverlayEvent: event ? event.slug : null,
      relatedEvents: relatedEvents,
      searchResults: null
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

  componentDidMount() {
    const dataIsEmpty = !this.props.events || !Object.keys(this.props.events).length;
    if (dataIsEmpty) {
      this.props.fetchData('/api/events', this.props.activeLanguage);
    }
  }

  render() {
    if (this.props.hasErrored) {
      return <LandingPageError reloadPage={() => this.props.fetchData('/api/events', this.props.activeLanguage)} />;
    }

    const dataIsEmpty = !this.props.events || !Object.keys(this.props.events).length;
    if (this.props.isLoading || dataIsEmpty) {
      return <LandingPageLoading bgColor='#f4a428' />;
    }
    const pageData = this.props.landingPages.events;

    return (
      <div className='EventsPage'>
        <Lipping />
        <SiteHeader
          heading={pageData.heading}
          bgColor='#f4a428'
          freeWifiLink={this.props.landingPages.shared.freeWifi}
        />
        <div className={cn('EventsPage-searchWrapper',
          {'EventsPage-searchWrapper--top':
          this.state.searchResults && this.state.searchResults.length})}>
            <SearchField
              inline
              onSearchChange={(val) => this.searchEvents(val, this.props.events)}
            />
        </div>
        <SearchResultOverlay
          searchResults={this.state.searchResults}
          changeOverlayEvent={this.changeOverlayEvent.bind(this)}
          pageType={pageData.heading}
          handleHideSearchResult={this.handleHideSearchResult.bind(this)}
        />
        <main>
          {!this.state.directions
            ? <div className='EventsPage-eventsWrapper'>
              <Scrollbars style={{ width: 'calc(100% - 1.5rem)', marginRight: '-1.5rem' }}>
                <div className='EventsPage-innerScrollWrapper'>
                { getDistinctEventCategories(this.props.events, pageData.excludedCategoryIds)
                  .map(c => (
                    <div key={c.id}>
                      <h2
                        className='EventsPage-eventsHeading'
                        dangerouslySetInnerHTML={{__html: c.name}}
                      />
                      <div className='EventsPage-eventWrapper'>
                        <Scrollbars style={{ width: 'calc(100% - 0.5rem)', height: 'calc(100% - 0.7rem)' }}>
                        { getEventsForCategory(this.props.events, c.id).map(event => (
                          <Event
                            key={event.id}
                            {...event}
                            onClick={this.changeOverlayEvent.bind(this)} />
                          ))
                        }
                        </Scrollbars>
                      </div>
                    </div>
                  ))
                }
                </div>
              </Scrollbars>
            </div>
            : <div className='EventsPage-mapWrapper'>
              <GoogleMapsDirections
                origin={this.state.directions.origin}
                destination={this.state.directions.destination}
                handleClose={this.showDirections.bind(this, null)}
                />
              </div>
          }
          <SiteFooter color='#f4a428' backToStartPath={`/${this.props.activeLanguage}/`}>
            { pageData.bottomLinks.map((link) => (
              <SiteFooterLink key={link.href + link.name} link={link} />))
            }
            <VergicChatButton className='SiteFooterLink' pageName={pageData.heading} />
            <div className='Startpage-langWrapper'>
              <LanguageFlags activeLanguage={this.props.activeLanguage} />
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
                handleShowDirections={this.showDirections.bind(this)}
                handleClose={() => this.changeOverlayEvent(null)}
                relatedEvents={this.state.relatedEvents}
                changeOverlayEvent={this.changeOverlayEvent.bind(this)}
              />
            }
          </ReactCSSTransitionGroup>
        </main>
        <aside>
          <AsideMenu fullHeight>
            <Calendar
              themeCssClass='#f4a428'
              handleSelectedDates={this.handleSelectedDates.bind(this)}
              selectedTimeSpan={this.props.selectedTimeSpan}
            />
            <Scrollbars
              ref='eventsDateListScroll'
              autoHeight
              autoHeightMax='100vh - 3.25rem - 4.6875rem - 400px - 2rem'
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

EventsPage.propTypes = {
  bgColor: PropTypes.string,
  fetchData: PropTypes.func.isRequired,
  activeLanguage: PropTypes.string.isRequired,
  events: PropTypes.any, // TODO
  landingPages: PropTypes.any, // TODO
  hasErrored: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  activeEvent: PropTypes.string,
  selectedTimeSpan: PropTypes.string
};

const mapStateToProps = (state) => {
  return {
    events: state.events[state.activeLanguage],
    activeLanguage: state.activeLanguage,
    landingPages: state.landingPages,
    hasErrored: (state.activeLanguage in state.eventsHasErrored)
      ? state.eventsHasErrored[state.activeLanguage] : false,
    isLoading: (state.activeLanguage in state.eventsAreLoading)
      ? state.eventsAreLoading[state.activeLanguage] : false
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (url, lang) => dispatch(eventsFetchData(url, lang))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsPage);
