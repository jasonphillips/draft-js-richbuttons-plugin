import React from 'react';
import { Well, Panel } from 'react-bootstrap';
import Immutable from 'immutable';

import Draft from 'draft-js';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
const { EditorState, ContentState } = Draft;
import Editor from 'draft-js-plugins-editor';

import createBlockBreakoutPlugin from 'draft-js-block-breakout-plugin';
const blockBreakoutPlugin = createBlockBreakoutPlugin();

import createRichButtonsPlugin from '../' //  from 'draft-js-richbuttons-plugin';
const richButtonsPlugin = createRichButtonsPlugin();

const {
  // inline buttons
  ItalicButton, BoldButton, createStyleButton,
  // block buttons
  ParagraphButton, H2Button, createBlockButton,
} = richButtonsPlugin;

// create your custom inlinestyle button
const RedStyleButton = createStyleButton({style: 'RED', label: 'Red'});

// create your custom block-type button
const BorderedBlockButton = createBlockButton({type: 'BorderedBox', label: 'LittleBox'}); 

// draft style map to apply that custom RED style
const styleMap = {
  'RED': {
    color: '#900',
  },
};

// now the draft configuration for the custom block
const blockStyleFn = (contentBlock) => {
  const type = contentBlock.getType();
  if (type==='BorderedBox') {
    return 'bordered_style'; 
  }
}

const blockRenderMap = Draft.DefaultDraftBlockRenderMap.merge(
  Immutable.Map({
    'BorderedBox': {
      element: 'summary',
    }
  })
);


class BasicExample extends React.Component {

  state = {
    editorState: this._getPlaceholder()
  }

  _getPlaceholder() {
    const placeholder = `
      <p>You can also create custom styles or block types.</p>
      <summary>Press the <b>LittleBox</b> button above to toggle a custom block like this one; and try the <b>Red</b> button to highlight text in red.</summary>
      <p>See the example code for usage.</p>
    `;
    const blocksFromHTML = Draft.convertFromHTML(
      placeholder, 
      Draft.getSafeBodyFromHTML,
      blockRenderMap
    );
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    return Draft.EditorState.createWithContent(state);
  }

  _onChange(editorState) {
    this.setState({editorState});
  }

  render() {
    let { editorState } = this.state;

    return (
      <div>
        <Well style={{ marginBottom:0 }}>
          <BoldButton/>
          <ItalicButton/>
          <RedStyleButton/>
          <b> | &nbsp; </b>
          <H2Button/>
          <ParagraphButton/>
          <BorderedBlockButton/>
        </Well>
        <Panel>
          <Panel.Body>
            <Editor
              customStyleMap={styleMap}
              blockRenderMap={blockRenderMap}
              blockStyleFn={blockStyleFn}
              editorState={editorState}
              onChange={this._onChange.bind(this)}
              spellCheck={false}
              plugins={[blockBreakoutPlugin, richButtonsPlugin]}
            />
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}

export default BasicExample;
