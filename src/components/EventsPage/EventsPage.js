import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Lipping from '../Lipping';
import SiteHeader from '../SiteHeader';
import Moment from 'moment';
import { SiteFooter, SiteFooterLink } from '../SiteFooter';
import VergicChatButton from '../VergicChatButton';
import { Event } from '../EventShowcase';
import Scrollbars from 'react-custom-scrollbars';
import LandingPageLoading from '../LandingPage/LandingPageLoading';
import LandingPageError from '../LandingPage/LandingPageError';
import EventOverlay from '../EventOverlay/EventOverlay';
import { OverlayTransitionWrapper } from '../OverlayBackdrop';
import AsideMenu from '../AsideMenu';
import Calendar from '../Calendar';
import { connect } from 'react-redux';
import { eventsFetchData } from '../../actions/events';
import EventsDateList from '../EventsDateList.js';
import './EventsPage.css';
import LanguageFlags from '../LanguageFlags';
import Search from '../Search/Search.js';
import { getEventIdsGroupedByWeekNumber } from './eventsPageHelpers.js';


export class EventsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleOverlayEvent: props.activeEvent || null,
      selectedDates: null
    };
  }

  static fetchData({ store }) {
    return store.dispatch(
      eventsFetchData('/api/events', store.getState().activeLanguage)
    );
  }

  changeOverlayEvent(event) {
    const eventSlug = event ? event.slug : null;
    const eventToShow = this.props.events.find(e => e.slug === eventSlug);

    this.changeUrl(event ? event.slug : this.state.visibleOverlayEvent, event !== null);

    this.setState({
      visibleOverlayEvent: eventToShow ? eventToShow.slug : null
    });
  }

  changeUrl(param, addParam) {
    const newUrl = addParam
      ? `${window.location.pathname}/${param}`
      : window.location.pathname.replace(`/${param}`, '');
    window.history.pushState({ path: window.location.pathname }, '', newUrl);
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

    const params = new window.URL(window.location.href).searchParams;
    const categoryIds = params && params.get('category');
    if (categoryIds) {
      categoryIds.split(',').forEach(id => {
        this.setState({
          activeCategories: this.state.activeCategories.concat(parseInt(id, 10))
        });
      });
    }
  }

  render() {
    if (this.props.hasErrored) {
      return (
        <LandingPageError
          reloadPage={() => this.props.fetchData('/api/events', this.props.activeLanguage)}
        />
      );
    }

    const formatDate = (date) => {
      return Moment(date).format('YY/MM/DD');
    };

    const dataIsEmpty = !this.props.events || !Object.keys(this.props.events).length;
    if (this.props.isLoading || dataIsEmpty) {
      return <LandingPageLoading bgColor='#f4a428' />;
    }
    const pageData = this.props.landingPages.events;
    const eventsByWeekNumber = getEventIdsGroupedByWeekNumber(this.props.events);

    return (
      <div className='EventsPage'>
        <Lipping />
        <SiteHeader
          heading={pageData.heading}
          bgColor='#f4a428'
          freeWifiLink={this.props.landingPages.shared.freeWifi}
        />
        <Search
          events={this.props.events}
          changeOverlayEvent={this.changeOverlayEvent.bind(this)}
          pageType='Eventspage'
          activeLanguage={this.props.activeLanguage}
        />
        <main>
          <div className='EventsPage-eventsWrapper'>
            <Scrollbars style={{ width: 'calc(100% - 1.5rem)', marginRight: '-1.5rem' }}>
              <div className='EventsPage-innerScrollWrapper'>
                { Object.keys(eventsByWeekNumber)
                  .map(week => (
                    <div key={week}>
                      <h2 className='EventsPage-eventsHeading'>
                        {
                          this.props.activeLanguage === 'sv' ? 'Vecka ' + week :
                            formatDate(eventsByWeekNumber[week][0].date)
                            + ' - ' +
                            formatDate(eventsByWeekNumber[week].slice(-1)[0].date)
                        }
                      </h2>
                      <div className='EventsPage-eventWrapper'>
                        { eventsByWeekNumber[week].map(eventId => (
                          <Event
                            key={eventId.id}
                            {...this.props.events.find(e => e.id === eventId.id)}
                            onClick={this.changeOverlayEvent.bind(this)} />
                        ))
                        }
                      </div>
                    </div>
                  ))
                }
              </div>
            </Scrollbars>
          </div>
          <SiteFooter color='#f4a428' backToStartPath={`/${this.props.activeLanguage}/`}>
            { pageData.bottomLinks.map((link) => (
              <SiteFooterLink key={link.href + link.name} link={link} />))
            }
            <VergicChatButton
              className='SiteFooterLink'
              pageName={pageData.heading} color='#f4a428'
            />
            <div className='Startpage-langWrapper'>
              <LanguageFlags activeLanguage={this.props.activeLanguage} />
            </div>
          </SiteFooter>
          <OverlayTransitionWrapper>
            { this.state.visibleOverlayEvent &&
              <EventOverlay
                key='event-overlay'
                event={this.props.events.find(e => e.slug === this.state.visibleOverlayEvent)}
                handleClose={() => this.changeOverlayEvent(null)}
                changeOverlayEvent={this.changeOverlayEvent.bind(this)}
              />
            }
          </OverlayTransitionWrapper>
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
              autoHeightMax={`100vh - ${this.props.isInPortraitMode ?
                '6.5rem' :
                '3.25rem'} - 4.6875rem - 400px - 2rem`}
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
  events: PropTypes.any,
  landingPages: PropTypes.any,
  hasErrored: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  activeEvent: PropTypes.string,
  selectedTimeSpan: PropTypes.string,
  isInPortraitMode: PropTypes.bool
};

const mapStateToProps = (state) => {
  return {
    events: state.events[state.activeLanguage],
    activeLanguage: state.activeLanguage,
    landingPages: state.landingPages[state.activeLanguage],
    hasErrored: (state.activeLanguage in state.eventsHasErrored)
      ? state.eventsHasErrored[state.activeLanguage] : false,
    isLoading: (state.activeLanguage in state.eventsAreLoading)
      ? state.eventsAreLoading[state.activeLanguage] : false,
    isInPortraitMode: state.isInPortraitMode
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (url, lang) => dispatch(eventsFetchData(url, lang))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsPage);
