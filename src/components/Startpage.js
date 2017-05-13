import React, { Component, PropTypes } from 'react';
import Lipping from './Lipping';
import MultimediaBackground from './MultimediaBackground';
import BottomBar, { BottomBarLink } from './BottomBar';
import SectionCard from './SectionCard';
import Search from './Search';
import { connect } from 'react-redux';
import { startpageFetchData } from '../actions/startpage';
import { eventsFetchData } from '../actions/events';
import { searchFetchData } from '../actions/search';
import LanguageFlags from './LanguageFlags';
import StartpageLoading from './StartpageLoading.js';
import StartpageError from './StartpageError.js';
import VergicChatButton from './VergicChatButton';

import './Startpage.css';

export class Startpage extends Component {
  static fetchData({ store }) {
    return store.dispatch(
      startpageFetchData('/api/startpage', store.getState().activeLanguage)
    );
  }

  static fetchEventsData({ store }) {
    return store.dispatch(
      eventsFetchData('/api/events', store.getState().activeLanguage)
    );
  }

  static fetchSearchResults({ store }) {
    return store.dispatch(
      searchFetchData('/api/search')
    );
  }

  componentDidMount() {
    const dataIsEmpty = !this.props.data || !Object.keys(this.props.data).length;
    if (dataIsEmpty) {
      this.props.fetchData('/api/startpage', this.props.activeLanguage);
    }

    if (typeof window !== 'undefined') {
      if (this.props.shouldFetchEvents) {
        this.props.fetchEventsData('/api/events', this.props.activeLanguage);
      }
    }
  }

  render() {
    if (this.props.hasErrored) {
      return (
       <StartpageError reloadPage={() => this.props.fetchData('/api/startpage', this.props.activeLanguage)} />
      );
    }

    const dataIsEmpty = !this.props.data || !Object.keys(this.props.data).length;
    if (this.props.isLoading || dataIsEmpty) {
      return <StartpageLoading />;
    }

    const Row = ({children}) => (
      <div style={{display: 'flex', margin: '0 5%'}}>{children}</div>
    );
    const Column = ({children}) => (
      <div style={{flex: '1', margin: '0 1%', maxWidth: '33%', display: 'flex'}}>{children}</div>
    );

    return (
        <div className='Startpage'>
          {this.props.events && !!this.props.events.length &&
          <Search
            events={this.props.events}
            pageType='Startpage'
            inputWrapperStyle={{bottom: '6.5rem', transform: 'translateX(-50%)', left: '50%'}}
            activeLanguage={this.props.activeLanguage}
          />
          }
          <Lipping />
          <MultimediaBackground backgroundUrl={this.props.data.backgroundUrl}>
            <h1 className='Startpage-heading' onClick={() => location.reload()}>{this.props.data.heading}</h1>
            <Row>
              <Column>
                <SectionCard
                  type='visitor'
                  section={this.props.data.visitorHeading}
                  link={this.props.data.visitorHeadingLink}
                  bgColor='#c90e52'
                  tags={this.props.data.visitorTags}
                  posts={this.props.data.visitorPosts} />
              </Column>
              <Column>
                <SectionCard
                  type='local'
                  section={this.props.data.localHeading}
                  link={this.props.data.localHeadingLink}
                  bgColor='#eb6421'
                  tags={this.props.data.localTags}
                  posts={this.props.data.localPosts} />
              </Column>
              <Column>
                <SectionCard
                  type='events'
                  section={this.props.data.eventsHeading}
                  link={this.props.data.eventsHeadingLink}
                  bgColor='#f4a428'
                  tags={this.props.data.eventsTags}
                  showTimeSpanButtons={true}
                  posts={this.props.data.eventsPosts} />
              </Column>
            </Row>
            <BottomBar>
              { this.props.data.topLinks.map(link => (
                <BottomBarLink key={link.href + link.name} link={link} />
              ))}
              <VergicChatButton className='BottomBarLink' />
              <div className='Startpage-langWrapper'>
                <LanguageFlags activeLanguage={this.props.activeLanguage} />
              </div>
            </BottomBar>
          </MultimediaBackground>
        </div>
    );
  }
}

Startpage.propTypes = {
  fetchData: PropTypes.func.isRequired,
  fetchEventsData: PropTypes.func.isRequired,
  activeLanguage: PropTypes.string.isRequired,
  events: PropTypes.any, // TODO
  data: PropTypes.shape({
    backgroundUrl: PropTypes.string,
    heading: PropTypes.string,
    topLinks: PropTypes.array,
    visitorHeading: PropTypes.string,
    visitorHeadingLink: PropTypes.string,
    visitorTags: PropTypes.array,
    visitorPosts: PropTypes.array,
    localHeading: PropTypes.string,
    localHeadingLink: PropTypes.string,
    localTags: PropTypes.array,
    localPosts: PropTypes.array,
    eventsHeading: PropTypes.string,
    eventsHeadingLink: PropTypes.string,
    eventsTags: PropTypes.array,
    eventsPosts: PropTypes.array
  }),
  hasErrored: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
  return {
    events: state.events[state.activeLanguage],
    data: state.startpage[state.activeLanguage],
    activeLanguage: state.activeLanguage,
    hasErrored: (state.activeLanguage in state.startpageHasErrored)
      ? state.startpageHasErrored[state.activeLanguage] : false,
    isLoading: (state.activeLanguage in state.startpageIsLoading)
      ? state.startpageIsLoading[state.activeLanguage] : false,
    searchResults: state.searchResults,
    searchIsLoading: state.searchIsLoading,
    searchHasErrored: state.searchHasErrored,
    shouldFetchEvents: !(state.activeLanguage in state.events)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (url, lang) => dispatch(startpageFetchData(url, lang)),
    fetchEventsData: (url, lang) => dispatch(eventsFetchData(url, lang)),
    fetchSearchResults: (url) => dispatch(searchFetchData(url))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Startpage);
