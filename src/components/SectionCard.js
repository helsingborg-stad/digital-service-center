import React, { Component, PropTypes } from 'react';
import './SectionCard.css';
import Link from './Link';
import { Scrollbars } from 'react-custom-scrollbars';

export default class SectionCard extends Component {
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
            Idag
            </Link>
            <Link className='SectionCard-tag' to='/sv/events?selectedTimeSpan=tomorrow'>
              Imorgon
            </Link>
            <Link className='SectionCard-tag' to='/sv/events?selectedTimeSpan=weekend'>
              Helg
            </Link>
            <Link className='SectionCard-tag' to='/sv/events?selectedTimeSpan=all'>
              Alla
            </Link>
          </span>
        }
        </div>
        <div className='SectionCard-scrollWrapper'>
          <Scrollbars style={{ width: '100%', height: '40vh' }}>
            <div className='SectionCard-postWrapper'>
            {this.props.posts.map(post => {
              return (
                <Link key={Math.random()} className='SectionCard-post' to={post.href}>
                  { post.imgUrl &&
                    <img className='SectionCard-postImage' src={post.imgUrl} role='presentation' />
                  }
                  <h3 className='SectionCard-postHeading'>{post.heading}</h3>
                  <p className='SectionCard-postPreamble'>{post.preamble}</p>
                </Link>
              );
            })}
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
  showTimeSpanButtons: PropTypes.bool
};

SectionCard.defaultProps = {
  posts: [],
  tags: [],
  bgColor: '#dedddd'
};
