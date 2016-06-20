# DraftJS RichButtons Plugin

[![npm version](https://badge.fury.io/js/draft-js-richbuttons-plugin.svg)](http://badge.fury.io/js/draft-js-richbuttons-plugin)

*This is a plugin for the `draft-js-plugins-editor`.*

This plugin allows you to add essential rich formatting buttons (inline and block styles) to your plugins-enabled editor.

## Usage

First instantiate the plugin:

```js
import createRichButtonsPlugin from 'draft-js-richbuttons-plugin';

const richButtonsPlugin = createRichButtonsPlugin();
```

Now get any desired components for inline or block formatting buttons from the instance:

```js
/* import only the ones you need; all available shown */
const {   
  // inline buttons
  ItalicButton, BoldButton, MonospaceButton, UnderlineButton,
  // block buttons
  ParagraphButton, BlockquoteButton, CodeButton, OLButton, ULButton, H1Button, H2Button, H3Button, H4Button, H5Button, H6Button
} = richButtonsPlugin;
```

Render these where desired in your component:

```HTML
<div className="myToolbar">
  <BoldButton/>
  <ItalicButton/>

  <H2Button/>
  <ULButton/>
  <OLButton/>
</div>
```

## Rendering Your Own Buttons

The default buttons are intentionally plain, but will pass the needed props down to their child, allowing you to customize rendering to your needs.

Props passed to both inline and block buttons:

  - **isActive** (_bool_) - true if style / blocktype active in selection
  - **label** (_string_) -  default label

Props unique to inline buttons:

  - **toggleInlineStyle** (_func_) - to be attached to your click event
  - **inlineStyle** (_string_) - the draft code for the style
  - **onMouseDown** (_func_) - attach this to the onMouseDown event of your custom controls; important for preventing focus from leaving the editor when toggling an inline style with a click

Props unique to block buttons:

  - **toggleBlockType** (_func_) - to be attached to your click event
  - **blockType** (_string_) - the draft code for the block type

Example:

```js
/*
  Stateless component for inline style buttons, using the passed props as well as a custom prop "iconName"
*/
const MyIconButton = ({iconName, toggleInlineStyle, isActive, label, inlineStyle, onMouseDown }) =>
  <a onClick={toggleInlineStyle} onMouseDown={onMouseDown}>
    <span
      className={`fa fa-${iconName}`}
      toolTip={label}
      style={{ color: isActive ? '#000' : '#777' }}
    />
  </a>;
```

The above presentational component could then be used this way:

```html
<BoldButton>
  <MyIconButton iconName="bold"/>
</BoldButton>
<ItalicButton>
  <MyIconButton iconName="italic"/>
</ItalicButton>
```

## Key Bindings

The plugin automatically applies default key bindings from draft's `RichUtils`, including Tab / Shift-Tab behavior for nested lists.

## License

MIT
