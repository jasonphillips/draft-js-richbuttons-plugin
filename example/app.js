import React from 'react';
import ReactDOM from 'react-dom';
import BasicExample from './BasicExample';
import CustomExample from './CustomExample';
import { Grid } from 'react-bootstrap';

class App extends React.Component {
  render() {
    return (
      <Grid>
        <BasicExample/>
        <CustomExample/>
      </Grid>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById( 'app' ));
