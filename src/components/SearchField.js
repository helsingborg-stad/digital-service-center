import React from 'react';
import './SearchField.css';
import classnames from 'classnames';

const SearchField = ({ inline, onSearchChange, handleSearchInputPosition, autoFocus, value}) => {
  return (
    <div className={classnames('SearchField', inline && 'SearchField--inline')}>
      <input
        autoFocus={autoFocus}
        type='search'
        onChange={(ev) => onSearchChange(ev.target.value)}
        onFocus={(ev) => handleSearchInputPosition(ev.target.value)}
        className={classnames(
          'SearchField-input',
          inline && 'SearchField-input--inline'
          )
        }
        value={value}
        placeholder='Search'
      />
    </div>
  );
};

SearchField.propTypes = {
  inline: React.PropTypes.bool,
  onSearchChange: React.PropTypes.func,
  handleSearchInputPosition: React.PropTypes.func,
  autoFocus: React.PropTypes.bool,
  value: React.PropTypes.string
};

SearchField.defaultProps = {
  inline: false,
  onSearchChange: () => {},
  handleSearchInputPosition: () => {}
};

export default SearchField;
