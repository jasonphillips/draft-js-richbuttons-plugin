import React from 'react';
import { Well, Panel, Button, ButtonToolbar, ButtonGroup, Glyphicon, DropdownButton, MenuItem } from 'react-bootstrap';

import Draft from 'draft-js';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
const { EditorState, ContentState } = Draft;
import Editor from 'draft-js-plugins-editor';

import createBlockBreakoutPlugin from 'draft-js-block-breakout-plugin';
const blockBreakoutPlugin = createBlockBreakoutPlugin();

import createRichButtonsPlugin from '../';
const richButtonsPlugin = createRichButtonsPlugin();

const {
  // inline buttons
  ItalicButton, BoldButton, UnderlineButton,
  // single component for block controls
  BlockControls
} = richButtonsPlugin;

// custom inline button
const CustomButton = ({children, toggleInlineStyle, isActive, label, inlineStyle, onMouseDown }) =>
  <Button
    bsSize="small"
    onClick={toggleInlineStyle}
    onMouseDown={onMouseDown}
    bsStyle={isActive ? 'info' : 'default'}
  > {children} </Button>;

// custom dropdown for block types
const MySelect = ({blockTypes, activeType, activeLabel, selectBlockType}) =>
  <DropdownButton onSelect={selectBlockType} title={activeLabel} bsSize="small">
    {blockTypes.map(({style, label}) =>
      <MenuItem eventKey={style} key={style}>{ label }</MenuItem>
    )}
  </DropdownButton>


class DropdownExample extends React.Component {

  state = {
    editorState: this._getPlaceholder()
  }

  _getPlaceholder() {
    const placeholder =
      '<p>Another option provided for block controls is a <b>dropdown</b> menu.</p>'
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
          <Editor
            editorState={editorState}
            onChange={this._onChange.bind(this)}
            spellCheck={false}
            ref="editor"
            plugins={[blockBreakoutPlugin, richButtonsPlugin]}
          />
        </Panel>
        <ButtonToolbar>
          <ButtonGroup>

            <BoldButton>
              <CustomButton><Glyphicon glyph="bold"/></CustomButton>
            </BoldButton>
            <ItalicButton>
              <CustomButton><Glyphicon glyph="italic"/></CustomButton>
            </ItalicButton>
            <UnderlineButton>
              <CustomButton><u><b>Abc</b></u></CustomButton>
            </UnderlineButton>

            <BlockControls>
              <MySelect/>
            </BlockControls>

          </ButtonGroup>
        </ButtonToolbar>
      </div>
    );
  }
}

export default DropdownExample;
