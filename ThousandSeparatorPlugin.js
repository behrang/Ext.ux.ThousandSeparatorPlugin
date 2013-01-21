// Generated by CoffeeScript 1.4.0
(function() {

  Ext.define('Ext.ux.ThousandSeparatorPlugin', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.thousandseparator',
    statics: {
      separatorImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAKklEQVQYV2NkIBIwEqmOgbYK/2NxBtxGdKuRFaPIYXMjSDGGOG09gzdIAUFjAwtbBzcSAAAAAElFTkSuQmCC'
    },
    constructor: function() {
      var img, _ref,
        _this = this;
      this.callParent(arguments);
      if ((_ref = this.separatorImage) == null) {
        this.separatorImage = this.statics().separatorImage;
      }
      img = document.createElement('img');
      img.onload = function() {
        return _this.separatorWidth = img.width;
      };
      return img.setAttribute('src', this.separatorImage);
    },
    init: function(textfield) {
      this.callParent(arguments);
      return textfield.on({
        render: function(field) {
          this.input = field.inputEl;
          this.input.setStyle('direction', 'ltr');
          this.textMetrics = Ext.create('Ext.util.TextMetrics');
          return this.textMetrics.bind(this.input);
        },
        change: function(field, newValue) {
          return this.separateThousands(newValue);
        },
        scope: this
      });
    },
    destroy: function() {
      return this.textMetrics.destroy();
    },
    isNumber: function(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    },
    pxToNumber: function(value) {
      return Number(value.replace('px', ''));
    },
    getPaddingLeft: function() {
      return this.pxToNumber(this.input.getStyle('padding-left'));
    },
    getPaddingRight: function() {
      return this.pxToNumber(this.input.getStyle('padding-right'));
    },
    getWidth: function() {
      return this.pxToNumber(this.input.getStyle('width'));
    },
    getTextAlign: function() {
      var textAlign;
      textAlign = this.input.getStyle('text-align');
      if (textAlign === 'start') {
        textAlign = 'left';
      }
      if (textAlign === 'end') {
        textAlign = 'right';
      }
      return textAlign;
    },
    getDefaultBg: function() {
      var bgImage, bgImages, bgPositions, bgRepeats, defaultBgIndices, i, index, styles;
      styles = this.input.getStyle(['background-image', 'background-repeat', 'background-position']);
      bgImages = styles['background-image'].split(', ');
      bgRepeats = styles['background-repeat'].split(', ');
      bgPositions = styles['background-position'].split(', ');
      defaultBgIndices = (function() {
        var _i, _len, _results;
        _results = [];
        for (i = _i = 0, _len = bgImages.length; _i < _len; i = ++_i) {
          bgImage = bgImages[i];
          if (bgImage.indexOf(this.separatorImage) < 0) {
            _results.push(i);
          }
        }
        return _results;
      }).call(this);
      bgImages = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = defaultBgIndices.length; _i < _len; _i++) {
          index = defaultBgIndices[_i];
          _results.push(bgImages[index]);
        }
        return _results;
      })();
      bgRepeats = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = defaultBgIndices.length; _i < _len; _i++) {
          index = defaultBgIndices[_i];
          _results.push(bgRepeats[index]);
        }
        return _results;
      })();
      bgPositions = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = defaultBgIndices.length; _i < _len; _i++) {
          index = defaultBgIndices[_i];
          _results.push(bgPositions[index]);
        }
        return _results;
      })();
      return {
        images: bgImages,
        repeats: bgRepeats,
        positions: bgPositions
      };
    },
    setBg: function(image, repeat, position) {
      return this.input.setStyle({
        'background-image': image,
        'background-repeat': repeat,
        'background-position': position
      });
    },
    separateThousands: function(value) {
      var bgImages, bgPositions, bgRepeats, defaultBg, groups, i, image, integerLength, paddingLeft, paddingRight, position, positions, repeat, textAlign, valueWidth, width, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      if (this.separatorWidth == null) {
        return;
      }
      paddingLeft = this.getPaddingLeft();
      paddingRight = this.getPaddingRight();
      width = this.getWidth();
      textAlign = this.getTextAlign();
      defaultBg = this.getDefaultBg();
      positions = [];
      if (this.isNumber(value)) {
        integerLength = value.indexOf('.');
        if (integerLength === -1) {
          integerLength = value.length;
        }
        groups = Math.floor(integerLength - 1) / 3;
        positions = (function() {
          var _i, _results;
          _results = [];
          for (i = _i = 1; _i <= groups; i = _i += 1) {
            _results.push(integerLength - (i * 3));
          }
          return _results;
        })();
      }
      valueWidth = this.textMetrics.getWidth(value);
      if (valueWidth > width - paddingLeft - paddingRight) {
        positions = [];
      }
      positions = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = positions.length; _i < _len; _i++) {
          position = positions[_i];
          _results.push(this.textMetrics.getWidth(value.substring(0, position)));
        }
        return _results;
      }).call(this);
      positions = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = positions.length; _i < _len; _i++) {
          position = positions[_i];
          _results.push(paddingLeft + position - Math.floor(this.separatorWidth / 2));
        }
        return _results;
      }).call(this);
      if (textAlign === 'right') {
        positions = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = positions.length; _i < _len; _i++) {
            position = positions[_i];
            _results.push(width - paddingLeft - paddingRight - valueWidth + position);
          }
          return _results;
        })();
      }
      bgPositions = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = positions.length; _i < _len; _i++) {
          position = positions[_i];
          _results.push("" + position + "px 0");
        }
        return _results;
      })();
      _ref = defaultBg.positions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        position = _ref[_i];
        bgPositions.push(position);
      }
      bgImages = (function() {
        var _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = positions.length; _j < _len1; _j++) {
          position = positions[_j];
          _results.push("url(" + this.separatorImage + ")");
        }
        return _results;
      }).call(this);
      _ref1 = defaultBg.images;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        image = _ref1[_j];
        bgImages.push(image);
      }
      bgRepeats = (function() {
        var _k, _len2, _results;
        _results = [];
        for (_k = 0, _len2 = positions.length; _k < _len2; _k++) {
          position = positions[_k];
          _results.push('no-repeat');
        }
        return _results;
      })();
      _ref2 = defaultBg.repeats;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        repeat = _ref2[_k];
        bgRepeats.push(repeat);
      }
      return this.setBg(bgImages.join(', '), bgRepeats.join(', '), bgPositions.join(', '));
    }
  });

}).call(this);
