import React, { Component, PropTypes } from 'react';
import './SectionCard.css';
import PaperRipple from 'react-paper-ripple';

export default class SectionCard extends Component {
  render() {
    return (
      <div className='SectionCard' style={{backgroundColor: this.props.bgColor}}>
        <h2 className='SectionCard-heading'>{this.props.section}</h2>
        <div className='SectionCard-tagWrapper'>
        {this.props.tags.map(tag => {
          return (<PaperRipple tag='a' className='SectionCard-tag' href={tag.href}>
            {tag.name}
          </PaperRipple>);
        })}
        </div>
        <div className='SectionCard-postWrapper'>
        {this.props.posts.map(post => {
          return (
            <PaperRipple tag='a' className='SectionCard-post' href={post.href}>
              <img className='SectionCard-postImage' src={post.imgUrl} />
              <h3 className='SectionCard-postHeading'>{post.heading}</h3>
              <p className='SectionCard-postPreamble'>{post.preamble}</p>
            </PaperRipple>
          );
        })}
        </div>
      </div>
    );
  }
}

SectionCard.propTypes = {
  section: PropTypes.string,
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
  }))
};

SectionCard.defaultProps = {
  posts: [],
  tags: [],
  bgColor: '#dedddd'
};
