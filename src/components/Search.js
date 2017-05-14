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
      searchInputOnTop: false,
      searchTerm: null
    };
  }

  static fetchData({ store, term }) {
    return store.dispatch(
      searchFetchData('/api/hbg-se-search', term)
    );
  }

  handleSearchChange(searchTerm) {
    const sifter = new Sifter(this.props.events);
    const result = sifter.search(searchTerm, {
      fields: ['name', 'content'],
      sort: [{field: 'name', direction: 'asc'}],
      limit: 10
    });

    const resultEvents = this.props.events.filter((event, index) => {
      return result.items.some(item => item.id === index);
    });

    this.setState({
      searchTerm,
      searchResults: searchTerm ? resultEvents : null
    });

    // TODO: debounce
    this.props.fetchData('/api/hbg-se-search', searchTerm);
  }

  handleSearchInputPosition(searchTerm) {
    if (searchTerm) {
      this.handleSearchChange(searchTerm);
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
          key='searchInputOnBottom'
          style={ this.props.inputWrapperStyle }
          className='Search-inputWrapper'>
            <SearchField
              inline
              autoFocus={false}
              value={this.state.searchTerm || ''}
              onSearchChange={(val) => this.handleSearchChange(val)}
              handleSearchInputPosition={(val) => this.handleSearchInputPosition(val, this.props.events)}
            />
        </div>
        :
          <div
            key='searchInputOnTop'
            style={ this.props.inputWrapperStyle }
            className='Search-inputWrapper--top'>
              <SearchField
                inline
                autoFocus={true}
                value={this.state.searchTerm || ''}
                onSearchChange={(val) => this.handleSearchChange(val)}
              />
          </div>
        }
      </ReactCSSTransitionGroup>
      <SearchResultOverlay
        eventsSearchResults={this.state.searchResults}
        hbgSeSearchResults={(this.state.searchTerm && (this.state.searchTerm in this.props.hbgSearch)) ? this.props.hbgSearch[this.state.searchTerm] : []}
        changeOverlayEvent={this.changeOverlay.bind(this)}
        pageType={this.props.pageType}
        handleHideSearchResult={this.handleHideSearchResult.bind(this)}
        activeLanguage={this.props.activeLanguage}
        searchInputOnTop={this.state.searchInputOnTop}
      />
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
  hbgSearch: PropTypes.any
};


const mapStateToProps = (state) => {
  return {
    searchResults: state.searchResults,
    searchInputOnTop: state.searchInputOnTop,
    hbgSearch: state.search
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (url, term) => dispatch(searchFetchData(url, term))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
