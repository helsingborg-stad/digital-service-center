import React, { Component, PropTypes } from 'react';
import Lipping from './Lipping';
import MultimediaBackground from './MultimediaBackground';
import BottomBar, { BottomBarLink } from './BottomBar';
import SectionCard from './SectionCard';
import SearchField from './SearchField';
import { connect } from 'react-redux';
import { startpageFetchData } from '../actions/startpage';
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
          <Lipping />
          <MultimediaBackground backgroundUrl={this.props.data.backgroundUrl}>
            <h1 className='Startpage-heading'>{this.props.data.heading}</h1>
            <Row>
              <Column>
                <SectionCard
                  section={this.props.data.visitorHeading}
                  link={this.props.data.visitorHeadingLink}
                  bgColor='#c90e52'
                  tags={this.props.data.visitorTags}
                  posts={this.props.data.visitorPosts} />
              </Column>
              <Column>
                <SectionCard
                  section={this.props.data.localHeading}
                  link={this.props.data.localHeadingLink}
                  bgColor='#eb6421'
                  tags={this.props.data.localTags}
                  posts={this.props.data.localPosts} />
              </Column>
              <Column>
                <SectionCard
                  section={this.props.data.eventsHeading}
                  link={this.props.data.eventsHeadingLink}
                  bgColor='#f4a428'
                  tags={this.props.data.eventsTags}
                  showTimeSpanButtons={true}
                  posts={this.props.data.eventsPosts} />
              </Column>
            </Row>
            <SearchField onSearchChange={(val) => console.log('search', val)} />
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
  activeLanguage: PropTypes.string.isRequired,
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
    data: state.startpage[state.activeLanguage],
    activeLanguage: state.activeLanguage,
    hasErrored: (state.activeLanguage in state.startpageHasErrored)
      ? state.startpageHasErrored[state.activeLanguage] : false,
    isLoading: (state.activeLanguage in state.startpageIsLoading)
      ? state.startpageIsLoading[state.activeLanguage] : false,
    searchResults: state.searchResults,
    searchIsLoading: state.searchIsLoading,
    searchHasErrored: state.searchHasErrored
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (url, lang) => dispatch(startpageFetchData(url, lang)),
    fetchSearchResults: (url) => dispatch(searchFetchData(url))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Startpage);
