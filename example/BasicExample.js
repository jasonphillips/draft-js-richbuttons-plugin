import React from 'react';
import { Well, Panel } from 'react-bootstrap';

import Draft from 'draft-js';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
const { EditorState, ContentState } = Draft;
import Editor from 'draft-js-plugins-editor';

import createRichButtonsPlugin from '../';
import createBlockBreakoutPlugin from 'draft-js-block-breakout-plugin';
const richButtonsPlugin = createRichButtonsPlugin();
const blockBreakoutPlugin = createBlockBreakoutPlugin();

const {
  // inline buttons
  ItalicButton, BoldButton, MonospaceButton, UnderlineButton,
  // block buttons
  ParagraphButton, H1Button, H2Button, ULButton, OLButton
} = richButtonsPlugin;


class BasicExample extends React.Component {

  constructor(props) {
    super(props);
    const placeholder = '<p>Add <b>rich</b> controls to your editor with minimal hassle.</p>';
    this.state = {
      content: this._getPlaceholder(placeholder)
    }
  }

  _onChange(editorState) {
    this.setState({content: editorState}, () => {
      richButtonsPlugin.onEditorChange(editorState);
    });
  }

  _getPlaceholder(placeholder) {
    const contentHTML = DraftPasteProcessor.processHTML(placeholder);
    const state = ContentState.createFromBlockArray(contentHTML);
    return Draft.EditorState.createWithContent(state)
  }

  render() {
    let { content } = this.state;

    return (
      <div>
        <h2>Basic Example</h2>
        <Well style={{ marginBottom:0 }}>
          <BoldButton/>
          <ItalicButton/>
          <UnderlineButton/>
          <MonospaceButton/>
          <b> | &nbsp; </b>
          <ParagraphButton/>
          <H2Button/>
          <ULButton/>
          <OLButton/>
        </Well>
        <Panel>
          <Editor
            editorState={content}
            onChange={this._onChange.bind(this)}
            spellCheck={false}
            plugins={[blockBreakoutPlugin, richButtonsPlugin]}
          />
        </Panel>
      </div>
    );
  }
}

export default BasicExample;
