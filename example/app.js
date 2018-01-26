import React from 'react';
import ReactDOM from 'react-dom';
import BasicExample from './BasicExample';
import CustomExample from './CustomExample';
import CustomTypes from './CustomBlocksAndStyles';
import { Grid, Alert } from 'react-bootstrap';

class App extends React.Component {
  render() {
    return (
      <Grid>
        <h1 className="text-muted">DraftJS RichButtons Plugin</h1>
        <Alert bsStyle="info">
          A plugin for the
          <a href="https://github.com/draft-js-plugins/draft-js-plugins"> DraftJS Plugins Editor </a>
          that provides a simple way to add customizable rich-text controls to your draft-js instance.
        </Alert>
        <p> </p>
        <h2>Basic Example &nbsp;
          <a href="https://github.com/jasonphillips/draft-js-richbuttons-plugin/blob/master/example/BasicExample.js">
            &#123;code&#125;
          </a>
        </h2>
        <BasicExample/>
        <p> </p>
        <h2>Custom Buttons Example &nbsp;
          <a href="https://github.com/jasonphillips/draft-js-richbuttons-plugin/blob/master/example/CustomExample.js">
            &#123;code&#125;
          </a>
        </h2>
        <CustomExample/>
        <p> </p>
        <p> </p>
        <h2>Custom Block Types &amp; Styles &nbsp;
          <a href="https://github.com/jasonphillips/draft-js-richbuttons-plugin/blob/master/example/CustomBlocksAndStyles.js">
            &#123;code&#125;
          </a>
        </h2>
        <CustomTypes/>
      </Grid>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById( 'app' ));
