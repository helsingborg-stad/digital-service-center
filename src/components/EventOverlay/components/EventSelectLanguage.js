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
      selectedId: props.activeLanguage,
      loading: false
    };
  }

  languageClickHandler = (event) => {
    if (event.target.id === 'en' || event.target.id === 'sv') {
      this.props.onToggle(event.target.id);
    } else {
      this.props.onToggle(event.target.id);
      this.props.onTranslate(this.props.content, this.props.eventId, this.props.activeLanguage, event.target.id);
    }

    this.setState({
      selectedId: event.target.id
    });
  }

  translationLoading = () => {
    this.setState({
      loading: true
    });
  }

  render() {
    const activeClasses = cn('EventDropUp__box',
      {'is-active': this.props.isActive});
    return (
      <section className="EventDropUp">
        <div className={activeClasses}>
          <ul>
            { promotedLanguages.map(l =>
              <li
                id={l}
                key={l}
                onClick={this.languageClickHandler.bind(this)}
                className={
                  cn('EventLang--select',
                    {'is-active': this.state.selectedId === l}
                  )}>
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

const mapStateToProps = (state) => {
  return {
    activeLanguage: state.activeLanguage,
    translations: state.translation
  };
};

export default connect(mapStateToProps)(EventSelectLanguage);
