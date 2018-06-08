import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';

import languages from '../../../util/languages';
import * as Flags from '../../icons-flags/index';

import './EventSelectLanguage.css';

const promotedLanguages = ['en', 'sv', 'da', 'no', 'de', 'fr', 'nl', 'es', 'it'];

class EventSelectLanguage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: props.activeLanguage
    };
  }

  languageClickHandler = (event) => {
    this.setState({
      selectedId: event.target.id
    });

    if (event.target.id === 'en' || event.target.id === 'sv') {
      this.props.onToggle(event.target.id);
    } else {
      const { content, eventId, activeLanguage } = this.props;
      this.props.onTranslate(content, eventId, activeLanguage, event.target.id);
      this.props.onToggle(event.target.id);
    }
  }

  render() {
    return (
      <section className='EventDropUp'>
        <div className={cn('EventDropUp__box',
          {'is-active': this.props.isActive && !this.props.translationLoading})}>
          <ul>
            {promotedLanguages.map(l =>
              <li
                id={l}
                key={l}
                onClick={this.languageClickHandler}
                className={
                  cn('EventLang--select',
                    {'is-active checkMark': this.state.selectedId === l && !this.props.translationLoading},
                    {'is-active spinner': this.state.selectedId === l && this.props.translationLoading}
                  )}
                disabled={this.props.translationLoading}>
                <div style={{pointerEvents: 'none'}}>
                  <div className="EventLang--select__box">
                    {Flags[`${l.toUpperCase()}Flag`]({className: 'EventSelectLanguage__flag'})}
                  </div>
                  <h3>{languages[l].nativeName}</h3>
                </div>
              </li>
            )}
          </ul>
        </div>
      </section>
    );
  }
}

EventSelectLanguage.propTypes = {
  content: PropTypes.string.isRequired,
  eventId: PropTypes.number.isRequired,
  activeLanguage: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
  onTranslate: PropTypes.func,
  isActive: PropTypes.boolean,
  translationLoading: PropTypes.boolean
};

const mapStateToProps = (state) => {
  return {
    activeLanguage: state.activeLanguage,
    translations: state.translation,
    translationLoading: state.translation.loading
  };
};

export default connect(mapStateToProps)(EventSelectLanguage);
