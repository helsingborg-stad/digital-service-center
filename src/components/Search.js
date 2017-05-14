import React, { PropTypes, Component } from 'react';
import SearchField from './SearchField';
import { searchFetchData } from '../actions/search';
import SearchResultOverlay from './SearchResultOverlay';
import Sifter from 'sifter';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import './Search.css';

export class Search extends Component {
  constructor() {
    super();
    this.state = {
      searchResults: null,
      searchInputOnTop: false
    };
  }

  static fetchData({ store, term }) {
    return store.dispatch(
      searchFetchData('/api/hbg-se-search', term)
    );
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
      searchResults: searchTerm ? resultEvents : null
    });

    // TODO: debounce
    this.props.fetchData('/api/hbg-se-search', searchTerm);
  }

  handleSearchInputPosition(searchTerm, events) {
    if (searchTerm) {
      this.searchEvents(searchTerm, events);
    }

    this.setState({
      searchInputOnTop: true
    });
  }

  handleHideSearchResult() {
    this.setState({
      searchResults: null,
      searchInputOnTop: false
    });
  }
  changeOverlay(event) {
    this.props.changeOverlayEvent(event);
    this.handleHideSearchResult();
  }
  render() {
    return (
    <div className='Search-wrapper'>
      <ReactCSSTransitionGroup
        transitionName="Search-wrapper-transitionGroup"
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={1000}
        transitionEnter={true}
        transitionLeave={true}
      >
        { !this.state.searchInputOnTop ?
        <div
          key='searchInputOnTop'
          style={ this.props.inputWrapperStyle }
          className='Search-inputWrapper'>
            <SearchField
              inline
              autoFocus={false}
              onSearchChange={(val) => this.searchEvents(val, this.props.events)}
              handleSearchInputPosition={(val) => this.handleSearchInputPosition(val, this.props.events)}
            />
        </div>
        :
          <div
            style={ this.props.inputWrapperStyle }
            className='Search-inputWrapper--top'>
              <SearchField
                inline
                autoFocus={true}
                onSearchChange={(val) => this.searchEvents(val, this.props.events)}
              />
          </div>
        }
      </ReactCSSTransitionGroup>
      <SearchResultOverlay
        searchResults={this.state.searchResults}
        changeOverlayEvent={this.changeOverlay.bind(this)}
        pageType={this.props.pageType}
        handleHideSearchResult={this.handleHideSearchResult.bind(this)}
        activeLanguage={this.props.activeLanguage}
        searchInputOnTop={this.state.searchInputOnTop}
      />
      { JSON.stringify(this.props.hgbSearch, null, 2)}
  </div>
    );
  }
}

Search.propTypes = {
  pageType: PropTypes.string,
  changeOverlayEvent: PropTypes.func,
  events: PropTypes.array,
  inputWrapperStyle: PropTypes.object,
  activeLanguage: PropTypes.string,
  fetchData: PropTypes.func.isRequired,
  hgbSearch: PropTypes.any
};


const mapStateToProps = (state) => {
  return {
    searchResults: state.searchResults,
    searchInputOnTop: state.searchInputOnTop,
    hgbSearch: state.search
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (url, term) => dispatch(searchFetchData(url, term))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);