export default (editor, config) => {
  const sm = editor.StyleManager;
  // const csm = config.customStyleManager;

  // sm.getSectors().reset(csm && csm.length ? csm : [{
  //   name: config.textGeneral,
  //   open: false,
  //   buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'],
  // },{
  //   name: config.textLayout,
  //   open: false,
  //   buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
  // },{
  //   name: config.textTypography,
  //   open: false,
  //   buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-shadow'],
  //   properties: [{
  //     property: 'text-align',
  //     list: [
  //         { value: 'left', className: 'fa fa-align-left' },
  //         { value: 'center', className: 'fa fa-align-center'  },
  //         { value: 'right', className: 'fa fa-align-right' },
  //         { value: 'justify', className: 'fa fa-align-justify' },
  //     ],
  //   }]
  // },{
  //   name: config.textDecorations,
  //   open: false,
  //   buildProps: ['border-radius-c', 'background-color', 'border-radius', 'border', 'box-shadow', 'background'],
  // },{
  //   name: config.textExtra,
  //   open: false,
  //   buildProps: ['transition', 'perspective', 'transform'],
  // }]);
  sm.getSectors().reset([
    {
      name: 'General',
      open: false,
      buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'],
    },
    {
      name: 'Flex',
      open: false,
      buildProps: [
        'flex-direction',
        'flex-wrap',
        'justify-content',
        'align-items',
        'align-content',
        'order',
        'flex-basis',
        'flex-grow',
        'flex-shrink',
        'align-self',
      ],
    }, {
      name: 'Dimension',
      open: false,
      buildProps: ['width', 'height', 'min-width', 'max-width', 'min-height', 'max-height', 'margin', 'padding'],
    }, {
      name: 'Typography',
      open: false,
      buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-shadow'],
    }, {
      name: 'Decorations',
      open: false,
      buildProps: ['border-radius-c', 'background-color', 'border-radius', 'border', 'box-shadow', 'background'],
    }, {
      name: 'Extra',
      open: false,
      buildProps: ['opacity', 'transition', 'perspective', 'transform'],
      properties: [
        {
          type: 'slider',
          property: 'opacity',
          defaults: 1,
          step: 0.01,
          max: 1,
          min: 0,
        },
        {
          name: 'Transition',
          property: 'transition',
          type: 'stack',
          preview: false,
          properties: [{
            name: 'Property',
            property: 'transition-property',
            type: 'select',
            defaults: 'width',
            list: [
              { value: 'width', name: 'Width' },
              { value: 'height', name: 'Height' },
              { value: 'color', name: 'Color' },
              { value: 'background-color', name: 'Background Color' },
              { value: 'transform', name: 'Transform' },
              { value: 'box-shadow', name: 'Box shadow' },
              { value: 'opacity', name: 'Opacity' }],
          }, {
            name: 'Duration',
            property: 'transition-duration',
            type: 'integer',
            units: ['s', 'ms'],
            defaults: '2',
            min: 0,
          }, {
            name: 'Easing',
            property: 'transition-timing-function',
            type: 'select',
            defaults: 'ease',
            list: [{ value: 'linear', name: 'Linear' },
              { value: 'ease', name: 'Ease' },
              { value: 'ease-in', name: 'Ease-in' },
              { value: 'ease-out', name: 'Ease-out' },
              { value: 'ease-in-out', name: 'Ease-in-out' }],
          }],
        },
      ],
    }]);
};
