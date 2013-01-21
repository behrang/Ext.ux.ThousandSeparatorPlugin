Ext.define 'Ext.ux.ThousandSeparatorPlugin'
  extend: 'Ext.AbstractPlugin'

  alias: 'plugin.thousandseparator'

  statics:
    separatorImage: 'data:image/gif;base64,R0lGODlhAQAFAIAAADMzM///zCH5BAAHAP8ALAAAAAABAAUAAAIChF0AOw=='
    topPosition: 3

  constructor: ->
    @callParent arguments

    statics = @statics()
    @separatorImage ?= statics.separatorImage
    @topPosition ?= statics.topPosition

    img = document.createElement 'img'
    img.onload = =>
      @separatorWidth = img.width
    img.setAttribute 'src', @separatorImage

  init: (textfield) ->
    @callParent arguments
    textfield.on
      render: (field) ->
        @input = field.inputEl
        @input.setStyle 'direction', 'ltr'
        @textMetrics = Ext.create 'Ext.util.TextMetrics'
        @textMetrics.bind @input
      change: (field, newValue) ->
        @separateThousands newValue
      scope: this

  destroy: ->
    @textMetrics.destroy()

  isNumber: (n) -> !isNaN(parseFloat n) and isFinite(n)

  pxToNumber: (value) -> Number value.replace 'px', ''

  getPaddingLeft: -> @pxToNumber @input.getStyle 'padding-left'

  getPaddingRight: -> @pxToNumber @input.getStyle 'padding-right'

  getWidth: -> @pxToNumber @input.getStyle 'width'

  getTextAlign: ->
    textAlign = @input.getStyle 'text-align'
    textAlign = 'left' if textAlign is 'start'
    textAlign = 'right' if textAlign is 'end'
    textAlign

  getDefaultBg: ->
    styles = @input.getStyle ['background-image', 'background-repeat', 'background-position']
    bgImages = styles['background-image'].split ', '
    bgRepeats = styles['background-repeat'].split ', '
    bgPositions = styles['background-position'].split ', '
    defaultBgIndices = (i for bgImage, i in bgImages when bgImage.indexOf(@separatorImage) < 0)
    bgImages = (bgImages[index] for index in defaultBgIndices)
    bgRepeats = (bgRepeats[index] for index in defaultBgIndices)
    bgPositions = (bgPositions[index] for index in defaultBgIndices)
    {
      images: bgImages
      repeats: bgRepeats
      positions: bgPositions
    }

  setBg: (image, repeat, position) ->
    @input.setStyle
      'background-image': image
      'background-repeat': repeat
      'background-position': position

  separateThousands: (value) ->
    return unless @separatorWidth?
    paddingLeft = @getPaddingLeft()
    paddingRight = @getPaddingRight()
    width = @getWidth()
    textAlign = @getTextAlign()
    defaultBg = @getDefaultBg()
    positions = []

    if @isNumber value
      integerLength = value.indexOf '.'
      integerLength = value.length if integerLength is -1
      groups = Math.floor(integerLength - 1) / 3

      positions = (integerLength - (i * 3) for i in [1..groups] by 1)

    valueWidth = @textMetrics.getWidth value
    positions = [] if valueWidth > width - paddingLeft - paddingRight

    positions = (@textMetrics.getWidth value.substring 0, position for position in positions)
    positions = (paddingLeft + position - 1 for position in positions)
    if textAlign is 'right'
      positions = (width - paddingLeft - paddingRight - valueWidth - 3 + position for position in positions)

    bgPositions = ("#{position}px #{@topPosition}px" for position in positions)
    bgPositions.push position for position in defaultBg.positions

    bgImages = ("url(#{@separatorImage})" for position in positions)
    bgImages.push image for image in defaultBg.images

    bgRepeats = ('no-repeat' for position in positions)
    bgRepeats.push repeat for repeat in defaultBg.repeats

    @setBg bgImages.join(', '), bgRepeats.join(', '), bgPositions.join(', ')
