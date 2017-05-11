import React, { PropTypes, Component } from 'react';
import SearchField from './SearchField';
import SearchResultOverlay from './SearchResultOverlay';
import Sifter from 'sifter';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './Search.css';

export default class Search extends Component {
  constructor() {
    super();
    this.state = {
      searchResults: null
    }
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
  handleHideSearchResult() {
    this.setState({
      searchResults: null
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
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
        transitionEnter={true}
        transitionLeave={true}
      >
        { this.state.searchResults === null ?
        <div
          style={ this.props.inputWrapperStyle }
          className='Search-inputWrapper'>
            <SearchField
              inline
              onSearchChange={(val) => this.searchEvents(val, this.props.events)}
            />
        </div>
        :
          <div
            style={ this.props.inputWrapperStyle }
            className='Search-inputWrapper--top'>
              <SearchField
                inline
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
  activeLanguage: PropTypes.string
};
