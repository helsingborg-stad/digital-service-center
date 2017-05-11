import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import './SectionCard.css';
import Link from './Link';
import { Scrollbars } from 'react-custom-scrollbars';
import { iframeUrl } from '../actions/iframeUrl';
import formatRelativeUrl from '../util/formatRelativeUrl';

export class SectionCard extends Component {
  render() {
    return (
      <div className='SectionCard' style={{backgroundColor: this.props.bgColor}}>
        <Link to={this.props.link}>
          <h2 className='SectionCard-heading'>{this.props.section}</h2>
        </Link>
        <div className='SectionCard-tagWrapper'>
        {!this.props.showTimeSpanButtons && this.props.tags.map(tag => {
          return (<Link key={Math.random()} className='SectionCard-tag' to={tag.href}>
            {tag.name}
          </Link>);
        })}
        {this.props.showTimeSpanButtons &&
          <span>
            <Link className='SectionCard-tag' to='/sv/events?selectedTimeSpan=today'>
            {this.props.translatables.today}
            </Link>
            <Link className='SectionCard-tag' to='/sv/events?selectedTimeSpan=tomorrow'>
            {this.props.translatables.tomorrow}
            </Link>
            <Link className='SectionCard-tag' to='/sv/events?selectedTimeSpan=weekend'>
            {this.props.translatables.weekend}
            </Link>
            <Link className='SectionCard-tag' to='/sv/events?selectedTimeSpan=all'>
            {this.props.translatables.all}
            </Link>
          </span>
        }
        </div>
        <div className='SectionCard-scrollWrapper'>
          <Scrollbars style={{ width: '100%', height: '40vh' }}>
            <div className='SectionCard-postWrapper'>
            {this.props.posts.map(post => {
              switch (post.type) {
              case 'iframe':
                return (
                  <Link to={`/${this.props.activeLanguage}/${this.props.section}/`} onClick={() => this.props.setIframeUrl(post)} key={Math.random()}>
                    { post.imgUrl &&
                      <img className='SectionCard-postImage' src={post.imgUrl} role='presentation' />
                    }
                    <h3 className='SectionCard-postHeading'>{post.heading}</h3>
                    <p className='SectionCard-postPreamble'>{post.preamble}</p>
                  </Link>
                );
              case 'page':
                return (
                  <Link to={`/${this.props.activeLanguage}/${this.props.section}/`} onClick={(url) => this.props.setIframeUrl({url: formatRelativeUrl(url)})} key={Math.random()}>
                    { post.imgUrl &&
                      <img className='SectionCard-postImage' src={post.imgUrl} role='presentation' />
                    }
                    <h3 className='SectionCard-postHeading'>{post.heading}</h3>
                    <p className='SectionCard-postPreamble'>{post.preamble}</p>
                  </Link>
                );
              case 'event':
                return (
                  <Link key={Math.random()} className='SectionCard-post' to={post.href}>
                  { post.imgUrl &&
                    <img className='SectionCard-postImage' src={post.imgUrl} role='presentation' />
                  }
                  <h3 className='SectionCard-postHeading'>{post.heading}</h3>
                  <p className='SectionCard-postPreamble'>{post.preamble}</p>
                </Link>);
              default:
                return null;
              }})}
            </div>
          </Scrollbars>
        </div>
      </div>
    );
  }
}

SectionCard.propTypes = {
  section: PropTypes.string,
  link: PropTypes.string,
  bgColor: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.shape({
    href: PropTypes.string,
    name: PropTypes.string
  })),
  posts: PropTypes.arrayOf(PropTypes.shape({
    href: PropTypes.string,
    imgUrl: PropTypes.string,
    heading: PropTypes.string,
    preamble: PropTypes.string
  })),
  showTimeSpanButtons: PropTypes.bool,
  translatables: PropTypes.shape({
    today: PropTypes.string.isRequired,
    tomorrow: PropTypes.string.isRequired,
    weekend: PropTypes.string.isRequired,
    all: PropTypes.string.isRequired
  }).isRequired,
  activeLanguage: PropTypes.string,
  setIframeUrl: PropTypes.func
};

SectionCard.defaultProps = {
  posts: [],
  tags: [],
  bgColor: '#dedddd'
};

const mapStateToProps = (state) => {
  return {
    translatables: state.siteSettings.translatables,
    activeLanguage: state.activeLanguage
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setIframeUrl: (url) => dispatch(iframeUrl(url))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionCard);
