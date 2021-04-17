import React from 'react';
import ReactToPrint from 'react-to-print';
import {
  FontAwesomeIcon
} from '@fortawesome/react-fontawesome';
import ComponentToPrint from './toPrint';

import {
  InvisibleIconButton,
} from '../../design/styledComponents';

class Example extends React.PureComponent {
  constructor( props ) {
    super( props );
    this.state = {};
  }

  render() {
    return (
      <div>
        <ReactToPrint
          trigger={() => {
            // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
            // to the root node of the returned component as it will be overwritten.
            return <InvisibleIconButton type="button">
                <FontAwesomeIcon icon={['fa', 'print']} /></InvisibleIconButton>;
          }}
          content={() => this.componentRef}
        />
        <div style={{display: "none"}}>
          <ComponentToPrint ref={el => (this.componentRef = el)} {...this.props}/> { /* eslint-disable-line no-return-assign */ } { /* eslint-disable-line react/jsx-props-no-spreading */ }
        </div>
      </div>
    );
  }
}

export default Example;