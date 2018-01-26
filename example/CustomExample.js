import React from 'react';
import { Well, Panel, Button, ButtonToolbar, ButtonGroup, Glyphicon } from 'react-bootstrap';

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
  ItalicButton, BoldButton,
  // block buttons
  H2Button, H3Button, ULButton, OLButton
} = richButtonsPlugin;

// custom inline button
const MyIconButton = ({glyph, toggleInlineStyle, isActive, label, inlineStyle, onMouseDown }) =>
  <Button
    bsSize="small"
    onClick={toggleInlineStyle}
    onMouseDown={onMouseDown}
    bsStyle={isActive ? 'info' : 'default'}
  > <Glyphicon glyph={glyph}/> </Button>;

// custom block button
const MyBlockButton = ({ toggleBlockType, isActive, label, blockType }) =>
  <Button
    bsSize="small"
    onClick={toggleBlockType}
    bsStyle={isActive ? 'primary' : 'default'}
  > {label} </Button>;


class CustomExample extends React.Component {

  state = {
    editorState: this._getPlaceholder()
  }

  _getPlaceholder() {
    const placeholder =
      '<p>You can customize your <i>own</i> buttons easily.</p>' +
      '<ul><li>See the buttons <b>below</b></li></ul>'
    ;
    const contentHTML = DraftPasteProcessor.processHTML(placeholder);
    const state = ContentState.createFromBlockArray(contentHTML);
    return Draft.EditorState.createWithContent(state);
  }

  _onChange(editorState) {
    this.setState({editorState});
  }

  render() {
    let { editorState } = this.state;

    return (
      <div>
        <Panel>
          <Panel.Body>
            <Editor
              editorState={editorState}
              onChange={this._onChange.bind(this)}
              spellCheck={false}
              plugins={[blockBreakoutPlugin, richButtonsPlugin]}
            />
          </Panel.Body>
        </Panel>
        <ButtonToolbar>
          <ButtonGroup>
            <BoldButton><MyIconButton glyph="bold"/></BoldButton>
            <ItalicButton><MyIconButton glyph="italic"/></ItalicButton>
          </ButtonGroup>

          <ButtonGroup>
            <H2Button><MyBlockButton/></H2Button>
            <H3Button><MyBlockButton/></H3Button>
            <ULButton><MyBlockButton/></ULButton>
            <OLButton><MyBlockButton/></OLButton>
          </ButtonGroup>
        </ButtonToolbar>
      </div>
    );
  }
}

export default CustomExample;
