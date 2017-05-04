import React, { Component, PropTypes } from 'react';
import Lipping from './Lipping';
import SiteHeader from './SiteHeader';
import { SiteFooter, SiteFooterLink } from './SiteFooter';
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
      eventsFetchData('/api/events')
    );
  }

  showDirections(directions) {
    this.setState({
      directions: directions
    });
  }

  changeOverlayEvent(eventSlug) {
    const event = this.props.events.find(e => e.slug === eventSlug);
    this.setState({
      visibleOverlayEvent: event ? event.slug : null
    });
  }

  handleSelectedDates(selectedDates) {
    this.setState({
      selectedDates: selectedDates
    });
  }

  componentDidMount() {
    const dataIsEmpty = !Object.keys(this.props.events).length;
    if (dataIsEmpty) {
      this.props.fetchData('/api/events');
    }
  }

  render() {
    if (this.props.hasErrored) {
      return <LandingPageError reloadPage={() => this.props.fetchData('/api/events')} />;
    }

    const dataIsEmpty = !Object.keys(this.props.events).length;
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
        <main>
          {!this.state.directions
            ? <div className='EventsPage-eventsWrapper'>
              <Scrollbars style={{ width: 'calc(100% - 0.5rem)', margin: '0.5rem 0' }}>
              { getDistinctEventCategories(this.props.events, pageData.excludedCategoryIds)
                .map(c => (
                  <div key={c.id}>
                    <h2 dangerouslySetInnerHTML={{ __html: c.name}} />
                    <div className='EventsPage-eventWrapper'>
                      { getEventsForCategory(this.props.events, c.id).map(event => (
                      <Event
                        key={event.id}
                        id={event.id}
                        slug={event.slug}
                        name={event.name}
                        imgSrc={event.imgUrl}
                        onClick={this.changeOverlayEvent.bind(this)} />
                      ))}
                    </div>
                  </div>
                ))
              }
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
          <SiteFooter color='#f4a428'>
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
                handleShowDirections={this.showDirections.bind(this)}
                handleClose={() => this.changeOverlayEvent(null)}
              />
            }
          </ReactCSSTransitionGroup>
        </main>
        <aside>
          <AsideMenu fullHeight>
            <Calendar
              themeCssClass='#f4a428'
              handleSelectedDates={this.handleSelectedDates.bind(this)}
            />
            <Scrollbars autoHeight autoHeightMax='100vh - 3.25rem - 4.6875rem - 400px - 2rem'>
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
  events: PropTypes.any, // TODO
  landingPages: PropTypes.any, // TODO
  hasErrored: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  activeEvent: PropTypes.string,
  selectedDates: PropTypes.shape({
    startDate: PropTypes.object,
    endDate: PropTypes.object
  })
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

export default connect(mapStateToProps, mapDispatchToProps)(EventsPage);
