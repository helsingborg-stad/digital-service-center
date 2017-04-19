import React, { Component, PropTypes } from 'react';
import Lipping from './Lipping';
import MultimediaBackground from './MultimediaBackground';
import BottomBar, { BottomBarLink } from './BottomBar';
import SectionCard from './SectionCard';
import SearchField from './SearchField';
import { connect } from 'react-redux';
import { startpageFetchData } from '../actions/startpage';
import StartpageLoading from './StartpageLoading.js';
import StartpageError from './StartpageError.js';

import './Startpage.css';

export class Startpage extends Component {
  static fetchData({ store }) {
    return store.dispatch(
      startpageFetchData('/api/startpage')
    );
  }

  componentDidMount() {
    const dataIsEmpty = !Object.keys(this.props.data).length;
    if (dataIsEmpty) {
      this.props.fetchData('/api/startpage');
    }
  }

  render() {
    if (this.props.hasErrored) {
      return (
       <StartpageError reloadPage={() => this.props.fetchData('/api/startpage')} />
      );
    }

    const dataIsEmpty = !Object.keys(this.props.data).length;
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
                  link={'/visitor'}
                  bgColor='#f4a428'
                  tags={this.props.data.visitorTags}
                  posts={this.props.data.visitorPosts} />
              </Column>
              <Column>
                <SectionCard
                  section={this.props.data.localHeading}
                  link={'/local'}
                  bgColor='#eb6421'
                  tags={this.props.data.localTags}
                  posts={this.props.data.localPosts} />
              </Column>
              <Column>
                <SectionCard
                  section={this.props.data.eventsHeading}
                  link={'/events'}
                  bgColor='#c90e52'
                  tags={this.props.data.eventsTags}
                  posts={this.props.data.eventsPosts} />
              </Column>
            </Row>
            <SearchField />
            <BottomBar>
              { this.props.data.topLinks.map(link => (
                <BottomBarLink key={link.href + link.name} link={link} />
              ))}
            </BottomBar>
          </MultimediaBackground>
        </div>
    );
  }
}

Startpage.propTypes = {
  fetchData: PropTypes.func.isRequired,
  data: PropTypes.shape({
    backgroundUrl: PropTypes.string,
    heading: PropTypes.string,
    topLinks: PropTypes.array,
    visitorHeading: PropTypes.string,
    visitorTags: PropTypes.array,
    visitorPosts: PropTypes.array,
    localHeading: PropTypes.string,
    localTags: PropTypes.array,
    localPosts: PropTypes.array,
    eventsHeading: PropTypes.string,
    eventsTags: PropTypes.array,
    eventsPosts: PropTypes.array
  }).isRequired,
  hasErrored: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
  return {
    data: state.startpage,
    hasErrored: state.startpageHasErrored,
    isLoading: state.startpageIsLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (url) => dispatch(startpageFetchData(url))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Startpage);
