(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global['emmet-monaco'] = global['emmet-monaco'] || {})));
}(this, (function (exports) {
  'use strict';

  var expandAbbreviation = function expandAbbreviation(emmet, source, language) {
    var target = emmet.expandAbbreviation(source, language, language);
    var result = emmet.tabStops.extract(target, {
      escape: function escape(ch) {
        return ch;
      }
    });

    return result;
  };

  var enableEmmet = function enableEmmet(editor, emmet, options) {
    if (!emmet) {
      throw new Error('Must include emmet.');
    }
    if (!editor) {
      throw new Error('Must provide monaco-editor instance.');
    }
    editor.addCommand(monaco.KeyCode.Tab, function () {
      var word = editor.model.getValueInRange(editor.getSelection());
      var pos = editor.getPosition();
      if (!word) {
        var lineContent = editor.model.getLineContent(pos.lineNumber);
        word = emmet.utils.action.extractAbbreviation(lineContent.substring(0, pos.column));
      }
      // Get expand text
      // var expandAbbreviationResult = expandAbbreviation(emmet, word, 'html');
      var cursorPos = editor.getModel().getOffsetAt(editor.getPosition());
      var stylePos = {
        prestart: editor.getValue().lastIndexOf('<style>', cursorPos),
        preend: editor.getValue().lastIndexOf('</style>', cursorPos),
        nextstart: editor.getValue().indexOf('<style>', cursorPos),
        nextend: editor.getValue().indexOf('</style>', cursorPos),
      };


      if (
        stylePos.prestart > stylePos.preend &&
        cursorPos > stylePos.prestart &&
        cursorPos < stylePos.nextend
      ) {
        var expandAbbreviationResult = expandAbbreviation(emmet, word, 'css');
      } else {
        var expandAbbreviationResult = expandAbbreviation(emmet, word, 'html');
      }

      var expandText = expandAbbreviationResult.text || '\t';

      if (expandText) {
        // replace range content: pos.column , pos.column -word.length;
        var range = new monaco.Range(pos.lineNumber, pos.column - word.length, pos.lineNumber, pos.column);
        var id = {
          major: 1,
          minor: 1
        };
        var op = {
          identifier: id,
          range: range,
          text: expandText,
          forceMoveMarkers: true,
        };

        editor.executeEdits('', [op]);
        if (expandAbbreviationResult.tabstops.length) {
          var tabstop = expandAbbreviationResult.tabstops[0];
          var selection = new monaco.Selection(pos.lineNumber, tabstop.start + range.startColumn, pos.lineNumber, tabstop.end + range.startColumn);
          editor.setSelection(selection)
        }
      }
    });
  };

  exports.enableEmmet = enableEmmet;

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

})));
//# sourceMappingURL=emmet-monaco.js.map