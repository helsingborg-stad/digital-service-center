import PropTypes from 'prop-types';
import React from 'react';
import './SearchField.css';
import classnames from 'classnames';
import ReactDebounceInput from 'react-debounce-input';

const SearchField = ({inline, onSearchChange, handleSearchInputPosition,
  autoFocus, value, pageType}) => {
  return (
    <div className={classnames('SearchField', inline && 'SearchField--inline')}>
      <ReactDebounceInput
        debounceTimeout={300}
        autoFocus={autoFocus}
        type='search'
        onChange={(ev) => onSearchChange(ev.target.value)}
        onFocus={(ev) => handleSearchInputPosition(ev.target.value)}
        className={classnames(
          'SearchField-input',
          inline && 'SearchField-input--inline',
          {'SearchField-input--inline--eventpage': pageType === 'Eventspage'}
        )
        }
        value={value}
        placeholder='Search'
      />
    </div>
  );
};

SearchField.propTypes = {
  inline: PropTypes.bool,
  onSearchChange: PropTypes.func,
  handleSearchInputPosition: PropTypes.func,
  autoFocus: PropTypes.bool,
  value: PropTypes.string
};

SearchField.defaultProps = {
  inline: false,
  onSearchChange: () => {},
  handleSearchInputPosition: () => {}
};

export default SearchField;
