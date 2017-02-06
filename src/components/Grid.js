import React, { Component } from 'react';
import classnames from 'classnames';
import '../lib/flexboxgrid.css';

export class Container extends Component {
  render() {
    return (
      <div className={classnames('Container', 'container', this.props.fluid && 'container-fluid')}>
        { this.props.children }
      </div>
    );
  }
}

Container.propTypes = {
  fluid: React.PropTypes.bool,
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
};

export class Row extends Component {
  render() {
    return (
      <div className={classnames('Row', 'row', this.props.reverse && 'reverse')}>
        { this.props.children }
      </div>
    );
  }
}

Row.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ]),
  reverse: React.PropTypes.bool
};

export class Column extends Component {
  render() {
    return (
      <div className={classnames(
        'Column',
        this.props.cols && `col-md-${this.props.cols}`,
        this.props.colsWide && `col-lg-${this.props.colsWide}`,
        this.props.colsNarrow && `col-sm-${this.props.colsNarrow}`,
        this.props.offset && `col-md-offset-${this.props.offset}`,
        this.props.offsetWide && `col-lg-offset-${this.props.offsetWide}`,
        this.props.offsetNarrow && `col-sm-offset-${this.props.offsetNarrow}`,
        this.props.reverse && 'reverse'
      )}>
        { this.props.children }
      </div>
    );
  }
}

const validColumnWidths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

Column.propTypes = {
  cols: React.PropTypes.oneOf(validColumnWidths),
  colsWide: React.PropTypes.oneOf(validColumnWidths),
  colsNarrow: React.PropTypes.oneOf(validColumnWidths),
  offset: React.PropTypes.oneOf(validColumnWidths),
  offsetWide: React.PropTypes.oneOf(validColumnWidths),
  offsetNarrow: React.PropTypes.oneOf(validColumnWidths),
  reverse: React.PropTypes.bool,
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
};
