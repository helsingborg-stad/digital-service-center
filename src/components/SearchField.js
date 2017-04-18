import React, { Component } from 'react';
import './SearchField.css';
import searchIcon from '../media/search.svg';
import classnames from 'classnames';
import SearchResultOverlay from './SearchResultOverlay';

export default class SearchField extends Component {
  render() {
    return (
      <div className={classnames('SearchField', this.props.inline && 'SearchField--inline')}>
      <form method='get' id='search' action='#' onSubmit={this.handleSearchSubmit}>
      <input
        type='search'
        onFocus={()=>console.log('test')}
        className={classnames(
          'SearchField-input',
          this.props.inline && 'SearchField-input--inline'
          )
        }
        placeholder='Search'
      />
      <input
        className={classnames(
          'SearchField-button',
          this.props.inline && 'SearchField-button--inline'
          )
        }
        name="searchsubmit" type="image" src={searchIcon} value="Sök" />
      </form>
      </div>
    );
  }
  handleSearchSubmit() {
    return false;
  }
}

SearchField.propTypes = {
  inline: React.PropTypes.bool
};

SearchField.defaultProps = {
  inline: false
};
