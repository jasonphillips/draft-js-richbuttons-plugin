import React, { Component, PropTypes } from 'react';

class BlockButton extends Component {

  static propTypes = {
    store: PropTypes.object,
    label: PropTypes.string,
    blockType: PropTypes.string
  };

  render() {
    const { store, blockType, label, children } = this.props;
    const toggleBlockType = store.toggleBlockType.bind(store, blockType);

    const editorState = store.getEditorState();
    const selection = editorState.getSelection();
    const currentType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();
    const isActive = currentType == blockType;

    if (children && typeof children == 'object') {
      const ChildInput = React.cloneElement(children, {
        toggleBlockType,
        isActive,
        label,
        blockType
      });

      return ChildInput;
    }

    const spanStyle = {
      color: isActive ? '#900' : '#999',
      cursor: 'pointer',
      display: 'inline-block',
      marginRight: '1em'
    }

    return (
      <span onClick={ toggleBlockType } style={spanStyle}>
        { label }
      </span>
    );
  }
}

export default BlockButton;
