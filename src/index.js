import StyleButton from './StyleButton';
import BlockButton from './BlockButton';
import { RichUtils } from 'draft-js';
import { MAX_LIST_DEPTH, INLINE_STYLES, BLOCK_TYPES } from './config/types';

import decorateComponentWithProps from 'decorate-component-with-props';

const richButtonsPlugin = () => {
  const store = {
    getEditorState: undefined,
    setEditorState: undefined,

    toggleInlineStyle: function toggleInlineStyle(inlineStyle) {
      const state = this.getEditorState();
      this.setEditorState(
        RichUtils.toggleInlineStyle(
          state,
          inlineStyle
        )
      );
    },

    toggleBlockType: function toggleBlockType(blockType) {
      const state = this.getEditorState();
      this.setEditorState(
        RichUtils.toggleBlockType(
          state,
          blockType
        )
      );
    }
  };

  const configured = {
    initialize: ({ getEditorState, setEditorState }) => {
      store.getEditorState = getEditorState;
      store.setEditorState = setEditorState;
    },

    handleKeyCommand: (command, { getEditorState, setEditorState }) => {
      const editorState = getEditorState();
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        setEditorState(newState);
        return true;
      }
      return false;
    },

    onTab: (event, { getEditorState, setEditorState }) => {
      const editorState = getEditorState();
      const newState = RichUtils.onTab(event, editorState, MAX_LIST_DEPTH);

      if (newState !== editorState) {
        setEditorState(newState);
      }
    }
  };

  INLINE_STYLES.forEach((inlineStyle) => {
    configured[`${inlineStyle.label}Button`] = decorateComponentWithProps(
      StyleButton, {
        store,
        label: inlineStyle.label,
        inlineStyle: inlineStyle.style
      }
    );
  });

  BLOCK_TYPES.forEach((blockType) => {
    configured[`${blockType.label}Button`] = decorateComponentWithProps(
      BlockButton, {
        store,
        label: blockType.label,
        blockType: blockType.style
      }
    );
  });

  return configured;
};

export default richButtonsPlugin;
