import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Lipping from '../Lipping';
import SiteHeader from '../SiteHeader';
import Moment from 'moment';
import 'moment/locale/en-gb';
import 'moment/locale/sv';
import { SiteFooter, SiteFooterLink } from '../SiteFooter';
import VergicChatButton from '../VergicChatButton';
import { Event } from '../EventShowcase';
import Scrollbars from 'react-custom-scrollbars';
import LandingPageLoading from '../LandingPage/LandingPageLoading';
import LandingPageError from '../LandingPage/LandingPageError';
import EventOverlay from '../EventOverlay/EventOverlay';
import { OverlayTransitionWrapper } from '../OverlayBackdrop';
import AsideMenu from '../AsideMenu';
import EventCategoryList from './components/EventCategoryList';
import Calendar from '../Calendar';
import { connect } from 'react-redux';
import { eventsFetchData } from '../../actions/events';
import './EventsPage.css';
import LanguageFlags from '../LanguageFlags';
import SearchField from '../Search/SearchField.js';
import { filterEventsForEventsPage } from './eventsPageHelpers.js';
import FlipMove from 'react-flip-move';
import cn from 'classnames';

export class EventsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleOverlayEvent: props.activeEvent || null,
      selectedDates: null,
      menuCategories: null,
      activeCategories: []
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
    this.setState({selectedDates});
  }

  // eslint-disable-next-line no-shadow
  handleSideNavClick(id) {
    const { activeCategories } = this.state;

    this.setState(activeCategories.includes(id)
      ? { activeCategories: activeCategories.filter(x => x !== id) }
      : { activeCategories: activeCategories.concat(id) });
  }

  handleSearchChange(searchTerm) {
    this.setState({searchTerm});
  }

  handleClearFilters() {
    this.setState({
      selectedDates: null,
      activeCategories: [],
      searchTerm: null
    });
  }

  componentDidMount() {
    const dataIsEmpty = !this.props.events || !Object.keys(this.props.events).length;
    if (dataIsEmpty) {
      this.props.fetchData('/api/events', this.props.activeLanguage);
    }
  }

  formatWeek = (week, thisWeek, date) => {
    const nextWeek = thisWeek + 1;
    if (week === thisWeek) {
      return this.props.activeLanguage === 'sv'
        ? 'Denna vecka'
        : 'This week';
    } else if (week === nextWeek) {
      return this.props.activeLanguage === 'sv'
        ? 'Nästa vecka'
        : 'Next week';
    }
    return this.props.activeLanguage === 'sv'
      ? 'Vecka ' + week
      : Moment(date[0].date).startOf('isoWeek').format('MMM DD -')
      + Moment(date.slice(-1)[0].date).endOf('isoWeek').format(' MMM DD');
  };

  render() {
    Moment.locale(this.props.activeLanguage);
    if (this.props.hasErrored) {
      return (
        <LandingPageError
          reloadPage={() => this.props.fetchData('/api/events', this.props.activeLanguage)}
        />
      );
    }

    const dataIsEmpty = !this.props.events || !Object.keys(this.props.events).length;
    if (this.props.isLoading || dataIsEmpty) {
      return <LandingPageLoading bgColor='#f4a428' />;
    }
    const pageData = this.props.landingPages.events;
    const { eventsByWeekNumber, numEvents, numActiveEvents, categories, categoryIcons } =
      filterEventsForEventsPage(
        this.props.events,
        this.state.activeCategories,
        this.state.selectedDates,
        this.state.searchTerm
      );
    const eventCounterText = this.props.translatables.numberOfEventsShowing
      .replace('numActiveEvents', numActiveEvents)
      .replace('numEvents', numEvents);

    return (
      <div className='EventsPage'>
        <Lipping />
        <SiteHeader
          heading={pageData.heading}
          bgColor='#f4a428'
          freeWifiLink={this.props.landingPages.shared.freeWifi}
        />
        <main>
          <div className='EventsPage-eventsWrapper'>
            <Scrollbars style={{ width: 'calc(100% - 1.5rem)', marginRight: '-1.5rem' }}>
              <div className='EventsPage-innerScrollWrapper'>
                { Object.keys(eventsByWeekNumber)
                  .filter(week => week >= Moment().week())
                  .map(week => (
                    <div key={week}>
                      <h2 className='EventsPage-eventsHeading'>
                        { this.formatWeek(parseInt(week, 10), Moment().week(), eventsByWeekNumber[week]) }
                      </h2>
                      <div className='EventsPage-eventWrapper'>
                        <FlipMove typeName={null} staggerDurationBy={4} staggerDelayBy={2} >
                          { eventsByWeekNumber[week].map(eventId => (
                            <Event
                              key={eventId.id}
                              {...this.props.events.find(e => e.id === eventId.id)}
                              onClick={this.changeOverlayEvent.bind(this)} />
                          ))
                          }
                        </FlipMove>
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
                pageType='Eventspage'
                event={this.props.events.find(e => e.slug === this.state.visibleOverlayEvent)}
                handleClose={() => this.changeOverlayEvent(null)}
                changeOverlayEvent={this.changeOverlayEvent.bind(this)}
              />
            }
          </OverlayTransitionWrapper>
        </main>
        <aside>
          <AsideMenu page='Eventspage' fullHeight>
            <EventCategoryList
              title={this.props.translatables.chooseCategories}
              categories={categories}
              categoryIcons={categoryIcons}
              activeCategories={this.state.activeCategories}
              onClick={this.handleSideNavClick.bind(this)}
            />
            <Calendar
              themeCssClass='#f4a428'
              handleSelectedDates={this.handleSelectedDates.bind(this)}
              selectedTimeSpan={this.props.selectedTimeSpan}
              resetDates={this.state.selectedDates === null}
            />
            <SearchField
              inline
              pageType='Eventspage'
              value={this.state.searchTerm || ''}
              onSearchChange={this.handleSearchChange.bind(this)}
            />
            <div className={cn('EventsPage-eventCounter',
              numEvents > numActiveEvents && 'EventsPage-eventCounter--visible')}>
              {eventCounterText}
              <button
                className='EventsPage-eventCounter__button'
                onClick={this.handleClearFilters.bind(this)}>
                {this.props.translatables.clearFilter}
              </button>
            </div>
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
  translatables: PropTypes.shape({
    numberOfEventsShowing: PropTypes.string,
    clearFilter: PropTypes.string
  })
};

const mapStateToProps = (state) => {
  return {
    events: state.events[state.activeLanguage],
    activeLanguage: state.activeLanguage,
    translatables: state.siteSettings.translatables[state.activeLanguage],
    landingPages: state.landingPages[state.activeLanguage],
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
