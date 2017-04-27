import React from 'react';
import './SearchField.css';
import classnames from 'classnames';

const SearchField = ({ inline, onSearchChange }) => {
  return (
    <div className={classnames('SearchField', inline && 'SearchField--inline')}>
      <input
        type='search'
        onChange={(ev) => onSearchChange(ev.target.value)}
        className={classnames(
          'SearchField-input',
          inline && 'SearchField-input--inline'
          )
        }
        placeholder='Search'
      />
    </div>
  );
};

SearchField.propTypes = {
  inline: React.PropTypes.bool,
  onSearchChange: React.PropTypes.func
};

SearchField.defaultProps = {
  inline: false,
  onSearchChange: () => {}
};

export default SearchField;
