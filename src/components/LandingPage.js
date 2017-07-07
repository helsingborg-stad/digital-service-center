import React, { Component, PropTypes } from 'react';
import Lipping from './Lipping';
import SiteHeader from './SiteHeader';
import { SiteFooter, SiteFooterLink } from './SiteFooter';
import VergicChatButton from './VergicChatButton';
import { SideNavigation, SideNavigationLink } from './SideNavigation';
import Search from './Search';
import GoogleMaps from './GoogleMaps';
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
import { iframeUrl } from '../actions/iframeUrl';
import LanguageFlags from './LanguageFlags';
import formatRelativeUrl from '../util/formatRelativeUrl';


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

    // Category not found, search in subcategories
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
    }, { markers: [] });
};

export class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleModals: [],
      visibleOverlayEvent: props.activeEvent || null,
      activeCategories: [],
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
      ? { visibleModals: visibleModals.filter(x => x !== modalId) }
      : { visibleModals: visibleModals.concat([modalId]) });
  }

  changeOverlayEvent(event, showDirections = false) {
    const eventSlug = event ? event.slug : null;
    const eventToShow = this.props.events.find(e => e.slug === eventSlug);
    const relatedEvents = eventToShow ? getRelatedEvents(
      this.props.events,
      eventToShow
    ) : null;

    this.changeUrl(event ? event.slug : this.state.visibleOverlayEvent, event !== null);
    this.setState({
      visibleOverlayEvent: eventToShow ? eventToShow.slug : null,
      relatedEvents: relatedEvents,
      showDirections: showDirections
    });
  }

  changeUrl(param, addParam) {
    const newUrl = addParam
      ? `${window.location.pathname}/${param}`
      : window.location.pathname.replace(`/${param}`, '');
    window.history.pushState({ path: window.location.pathname }, '', newUrl);
  }

  componentDidMount() {
    const dataIsEmpty = !this.props.events || !Object.keys(this.props.events).length;
    if (dataIsEmpty) {
      this.props.fetchData('/api/events', this.props.activeLanguage);
    }

    const params = new window.URL(location.href).searchParams;
    const categoryIds = params.get('category');
    if (categoryIds) {
      categoryIds.split(',').forEach(id => {
        this.setState({
          activeCategories: this.state.activeCategories.concat(parseInt(id, 10))
        });
      });
    }
  }

  handleSelectedDates(selectedDates) {
    this.setState({
      selectedDates: selectedDates
    });
    if (this.refs.eventsDateListScroll) {
      this.refs.eventsDateListScroll.scrollToTop();
    }
  }

  // eslint-disable-next-line no-shadow
  handleSideNavClick({id, type, menuItem, iframeUrl}) {
    if (type === 'googleQueryPlace') {
      this.props.setIframeUrl({url: iframeUrl});
    } else if (type === 'iframe') {
      this.props.setIframeUrl(menuItem);
    } else if (type && type === 'event') {
      this.changeOverlayEvent(menuItem);
    } else {
      const { activeCategories } = this.state;

      this.setState(activeCategories.includes(id)
        ? { activeCategories: activeCategories.filter(x => x !== id) }
        : { activeCategories: activeCategories.concat(id) });
    }
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

        <Search
          events={this.props.events}
          changeOverlayEvent={this.changeOverlayEvent.bind(this)}
          pageType={this.props.type}
          activeLanguage={this.props.activeLanguage}
        />

        <SideNavigation>
          {pageData.menu !== null && pageData.menu.map(menu =>
            <SideNavigationLink
              id={menu.id || menu.menuId}
              key={menu.id || menu.menuId}
              name={menu.name}
              activeCategories={this.state.activeCategories}
              activeColor={menu.activeColor}
              handleClick={this.handleSideNavClick.bind(this)}
              type={menu.type}
              iframeUrl={menu.iframeUrl}
              icon={menu.iconName}
              subCategories={menu.subItems}
              menuItem={menu}
            />)

          }
          {pageData.menu === null && pageData.categories && !!pageData.categories.length && pageData.categories.map(cat =>
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

        <main>
          <div className='LandingPage-mapWrapper'>
            <GoogleMaps
              {...selectedEventsWithCoordinates(
                this.props.events,
                this.state.activeCategories,
                pageData.categories
              ) }
              visibleModals={this.state.visibleModals}
              handleToggleModalVisibility={this.toggleModalVisibility.bind(this)}
              handleShowMoreInfo={this.changeOverlayEvent.bind(this)}
              apiKey={this.props.googleMapsApiKey}
            />
          </div>
          <EventShowcase>
            {pageData.pages.map((event, index) => {
              switch (event.type) {
              case 'iframe':
                return (
                  <Event
                    key={index}
                    {...event}
                    onClick={(url) => this.props.setIframeUrl(url)} />
                );
              case 'page':
                return (
                  <Event
                    key={index}
                    {...event}
                    onClick={() => this.props.setIframeUrl({ url: formatRelativeUrl(event.url) })} />
                );
              case 'event':
                return (
                  <Event
                    key={index}
                    {...event}
                    onClick={this.changeOverlayEvent.bind(this)} />
                );
              default:
                return null;
              }
            })
            }
          </EventShowcase>
          <SiteFooter color={this.props.bgColor} backToStartPath={`/${this.props.activeLanguage}/`}>
            {pageData.bottomLinks.map((link) => (
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
            {this.state.visibleOverlayEvent &&
              <EventOverlay
                key='event-overlay'
                event={this.props.events.find(e => e.slug === this.state.visibleOverlayEvent)}
                handleClose={() => this.changeOverlayEvent(null)}
                relatedEvents={this.state.relatedEvents}
                changeOverlayEvent={this.changeOverlayEvent.bind(this)}
                showDirections={this.state.showDirections}
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
  }),
  setIframeUrl: PropTypes.func
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
    googleMapsApiKey: state.siteSettings.googleMapsApiKey
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (url, lang) => dispatch(eventsFetchData(url, lang)),
    setIframeUrl: (url) => dispatch(iframeUrl(url))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
