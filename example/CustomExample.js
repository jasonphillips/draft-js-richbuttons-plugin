import React from 'react';
import { Well, Panel, Button, ButtonToolbar, ButtonGroup, Glyphicon } from 'react-bootstrap';

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
  ItalicButton, BoldButton,
  // block buttons
  H2Button, ULButton, OLButton
} = richButtonsPlugin;

// custom inline button
const MyIconButton = ({glyph, toggleInlineStyle, isActive, label, inlineStyle }) =>
  <Button
    bsSize="small"
    onClick={toggleInlineStyle}
    bsStyle={isActive ? 'danger' : 'default'}
  > <Glyphicon glyph={glyph}/> </Button>;

// custom block button
const MyBlockButton = ({iconName, toggleBlockType, isActive, label, blockType }) =>
  <Button
    bsSize="small"
    onClick={toggleBlockType}
    bsStyle={isActive ? 'primary' : 'default'}
  >{label}</Button>;


class CustomExample extends React.Component {

  constructor(props) {
    super(props);
    const placeholder =
      '<p>You can customize your <i>own</i> buttons easily.</p>' +
      '<ul><li>See the buttons <b>below</b></li></ul>'
    ;
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
        <h2>Custom Buttons Example</h2>

        <Panel>
          <Editor
            editorState={content}
            onChange={this._onChange.bind(this)}
            spellCheck={false}
            plugins={[blockBreakoutPlugin, richButtonsPlugin]}
          />
        </Panel>

        <ButtonToolbar>
          <ButtonGroup>
            <BoldButton>
              <MyIconButton glyph="bold"/>
            </BoldButton>
            <ItalicButton>
              <MyIconButton glyph="italic"/>
            </ItalicButton>
          </ButtonGroup>

          <ButtonGroup>
            <H2Button>
              <MyBlockButton/>
            </H2Button>
            <ULButton>
              <MyBlockButton/>
            </ULButton>
            <OLButton>
              <MyBlockButton/>
            </OLButton>
          </ButtonGroup>
        </ButtonToolbar>
      </div>
    );
  }
}

export default CustomExample;
