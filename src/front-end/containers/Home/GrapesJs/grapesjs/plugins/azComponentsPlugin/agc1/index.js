/*
:root{
  --azg-theme-primary: rgb(100, 160, 180);
  --azg-theme-on-primary: rgb(255, 255, 255);
  --azg-section-padding-top: 50px;
  --azg-section-padding-bottom: 50px;
}
*/

export default [
  {
    name: 'agc1/button',
    version: '1.0.0',
    grapesjsData: {
      category: 'Agc1',
      attributes: {
        class: 'fa fa-link',
      },
      label: 'Button',
      content: `<div data-agc-name="agc1/button" class="agc1-btn">Button</div><style>.agc1-btn{
          padding-top:10px;
          padding-right:10px;
          padding-bottom:10px;
          padding-left:10px;
          width:200px;
          min-height:30px;
          font-size:20px;
          text-align:center;
          letter-spacing:3px;
          line-height:30px;
          background-color:var(--agc1-theme-primary, var(--azg-theme-primary, #42a5f5));
          color:var(--agc1-theme-on-primary, var(--azg-theme-on-primary, #42a5f5));

          transition-duration:0.5s;
          transition-timing-function:ease;
          transition-delay:0s;
          transition-property:all;
          cursor:pointer;
      }
      .agc1-btn:hover{
          background-color:rgb(255, 255, 255);
          color:rgb(0, 0, 0);
      }
      .agc1-btn:active{
          background-color:#0077c2;
          color:rgb(255, 255, 255);
      }
      </style>`,
    },
    data: {
      componentName: 'agc1/button',
      html: '<div data-agc-name="agc1/button" class="agc1-btn">Button</div>',
      css: `.agc1-btn{
          padding-top:10px;
          padding-right:10px;
          padding-bottom:10px;
          padding-left:10px;
          width:200px;
          min-height:30px;
          font-size:20px;
          text-align:center;
          letter-spacing:3px;
          line-height:30px;
          background-color:var(--agc1-theme-on-primary, var(--azg-theme-on-primary, #42a5f5));
          color:var(--agc1-theme-on-primary, var(--azg-theme-on-primary, #42a5f5));

          transition-duration:0.5s;
          transition-timing-function:ease;
          transition-delay:0s;
          transition-property:all;
          cursor:pointer;
      }
      .agc1-btn:hover{
          background-color:rgb(255, 255, 255);
          color:rgb(0, 0, 0);
      }
      .agc1-btn:active{
          background-color:#0077c2;
          color:rgb(255, 255, 255);
      }
      `,
      exCfg: {
        category: 'Agc1',
        attributes: {
          class: 'fa fa-link',
        },
      },
    },
  },
  {
    name: 'agc1/section',
    version: '1.0.0',
    grapesjsData: {
      category: 'Agc1',
      attributes: {
        class: 'gjs-fonts gjs-f-b1',
      },
      label: 'Section',
      content: `<section data-agc-name="agc1/section" class="agc1-sect">
        <div data-azbox class="agc1-sect-container">
          <agjc-placeholder></agjc-placeholder>
        </div>
      </section>
      <style>.agc1-sect{
        padding-top: var(--agc1-section-padding-top, var(--azg-section-padding-top, 100px));
        padding-bottom: var(--agc1-section-padding-bottom, var(--azg-section-padding-bottom, 100px));
      }
      .agc1-sect-container{
        width:90%;
        max-width:1150px;
        margin-top:0px;
        margin-right:auto;
        margin-bottom:0px;
        margin-left:auto;
      }
      </style>`,
    },
    data: {
      componentName: 'agc1/section',
      html: `<section data-agc-name="agc1/section" class="agc1-sect">
        <div data-azbox class="agc1-sect-container">
          <agjc-placeholder></agjc-placeholder>
        </div>
      </section>`,
      css: `.agc1-sect{
        padding-top: var(--agc1-section-padding-top, var(--azg-section-padding-top, 100px));
        padding-bottom: var(--agc1-section-padding-bottom, var(--azg-section-padding-bottom, 100px));
      }
      .agc1-sect-container{
        width:90%;
        max-width:1150px;
        margin-top:0px;
        margin-right:auto;
        margin-bottom:0px;
        margin-left:auto;
      }
      `,
      exCfg: {
        category: 'Agc1',
        attributes: {
          class: 'gjs-fonts gjs-f-b1',
        },
      },
    },
  },
  {
    name: 'agc1/header',
    version: '1.0.0',
    grapesjsData: {
      category: 'Agc1',
      attributes: {
        class: 'fa fa-link',
      },
      label: 'Header',
      content: `<header data-agc-name="agc1/header" id="ibynh" class="agc-header">
        <div>
        </div>
      </header>
      <style>.agc-header{
          padding-top:8px;
          padding-right:8px;
          padding-bottom:8px;
          padding-left:8px;
          display:flex;
          justify-content:space-between;
      }
      </style>`,
    },
    data: {
      componentName: 'Header',
      html: `<header data-agc-name="agc1/header" class="agc-header">
        <div>
        </div>
      </header>`,
      css: `.agc-header{
          padding-top:8px;
          padding-right:8px;
          padding-bottom:8px;
          padding-left:8px;
          display:flex;
          justify-content:space-between;
      }
      `,
      exCfg: {
        category: 'Agc1',
        attributes: {
          class: 'fa fa-link',
        },
      },
    },
  },
  {
    name: 'agc1/fab-menu',
    version: '1.0.0',
    grapesjsData: {
      category: 'Agc1',
      attributes: {
        class: 'fa fa-link',
      },
      label: 'Fab Menu',
      content: `<div data-agc-name="agc1/fab-menu" data-azbox="" class="fab-bg js-canvi-open-button--left">
        <div class="container">
        <div class="bar1">
        </div>
        <div class="bar2">
        </div>
        <div class="bar3">
        </div>
        </div>
        <agjc-placeholder>
        </agjc-placeholder>
      </div>
      <style>.fab-bg{
        width:60px;
        height:60px;
        display:flex;
        justify-content:center;
        align-items:center;
        background-color:rgb(177, 77, 112);
        border-top-left-radius:30px;
        border-top-right-radius:30px;
        border-bottom-right-radius:30px;
        border-bottom-left-radius:30px;
      }
      .container{
        display:inline-block;
        cursor:pointer;
      }
      .bar1{
        width:35px;
        height:5px;
        background-color: white;
        margin-top:6px;
        margin-right:0px;
        margin-bottom:6px;
        margin-left:0px;
      }
      .bar2{
        width:35px;
        height:5px;
        background-color:white;
        margin-top:6px;
        margin-right:0px;
        margin-bottom:6px;
        margin-left:0px;
      }
      .bar3{
        width:35px;
        height:5px;
        background-color: white;
        margin-top:6px;
        margin-right:0px;
        margin-bottom:6px;
        margin-left:0px;
      }
      </style>`,
    },
    data: {
      componentName: 'agc1/fab-menu',
      html: `<div data-agc-name="agc1/fab-menu" data-azbox="" class="fab-bg js-canvi-open-button--left">
        <div class="container">
        <div class="bar1">
        </div>
        <div class="bar2">
        </div>
        <div class="bar3">
        </div>
        </div>
        <agjc-placeholder>
        </agjc-placeholder>
      </div>`,
      css: `.fab-bg{
        width:60px;
        height:60px;
        display:flex;
        justify-content:center;
        align-items:center;
        background-color:rgb(177, 77, 112);
        border-top-left-radius:30px;
        border-top-right-radius:30px;
        border-bottom-right-radius:30px;
        border-bottom-left-radius:30px;
      }
      .container{
        display:inline-block;
        cursor:pointer;
      }
      .bar1{
        width:35px;
        height:5px;
        background-color: white;
        margin-top:6px;
        margin-right:0px;
        margin-bottom:6px;
        margin-left:0px;
      }
      .bar2{
        width:35px;
        height:5px;
        background-color:white;
        margin-top:6px;
        margin-right:0px;
        margin-bottom:6px;
        margin-left:0px;
      }
      .bar3{
        width:35px;
        height:5px;
        background-color: white;
        margin-top:6px;
        margin-right:0px;
        margin-bottom:6px;
        margin-left:0px;
      }
      `,
      exCfg: {
        category: 'Agc1',
        attributes: {
          class: 'fa fa-link',
        },
      },
    },
  },
  {
    name: 'agc1/img-cnt-ctner',
    version: '1.0.0',
    grapesjsData: {
      category: 'Agc1',
      attributes: {
        class: 'gjs-fonts gjs-f-b1',
      },
      label: 'Img Cnt Ctner',
      content: `<div data-agc-name="agc1/img-cnt-ctner" data-azbox="" class="img-cnt-ctner">
        <agjc-placeholder>
        </agjc-placeholder>
      </div>
      <style>.img-cnt-ctner {
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          width:600px;
          height:480px;
          padding:20px 20px 20px 20px;
      }
      </style>`,
    },
    data: {
      componentName: 'agc1/img-cnt-ctner',
      html: `<div data-agc-name="agc1/img-cnt-ctner" data-azbox="" class="img-cnt-ctner">
        <agjc-placeholder>
        </agjc-placeholder>
      </div>`,
      css: `.img-cnt-ctner {
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          width:600px;
          height:480px;
          padding:20px 20px 20px 20px;
      }
      `,
      exCfg: {
        category: 'Agc1',
        attributes: {
          class: 'gjs-fonts gjs-f-b1',
        },
      },
    },
  },
  {
    name: '大標',
    version: '1.0.0',
    grapesjsData: {
      category: 'Custom',
      attributes: {
        class: 'fa fa-link',
      },
      label: '大標',
      content: '<div class="lead-title">Build your templates without coding\n</div><style>.lead-title{\n  margin-top:30px;\n  margin-right:0px;\n  margin-bottom:30px;\n  margin-left:0px;\n  font-size:40px;\n  text-align:center;\n}\n</style>',
    },
    data: {
      componentName: '大標',
      html: '<div class="lead-title">Build your templates without coding\n</div>',
      css: '.lead-title{\n  margin-top:30px;\n  margin-right:0px;\n  margin-bottom:30px;\n  margin-left:0px;\n  font-size:40px;\n  text-align:center;\n}\n',
      exCfg: {
        category: 'Custom',
        attributes: {
          class: 'fa fa-link',
        },
      },
    },
  },
  {
    name: '副標',
    version: '1.0.0',
    grapesjsData: {
      category: 'Custom',
      attributes: {
        class: 'fa fa-link',
      },
      label: '副標',
      content: '<div class="flex-title">Flex is the new black\n</div><style>.flex-title{\n  margin-bottom:15px;\n  font-size:2em;\n  text-align:center;\n  font-weight:700;\n  color:rgb(85, 85, 85);\n  padding-top:5px;\n  padding-right:5px;\n  padding-bottom:5px;\n  padding-left:5px;\n}\n</style>',
    },
    data: {
      componentName: '副標',
      html: '<div class="flex-title">Flex is the new black\n</div>',
      css: '.flex-title{\n  margin-bottom:15px;\n  font-size:2em;\n  text-align:center;\n  font-weight:700;\n  color:rgb(85, 85, 85);\n  padding-top:5px;\n  padding-right:5px;\n  padding-bottom:5px;\n  padding-left:5px;\n}\n',
      exCfg: {
        category: 'Custom',
        attributes: {
          class: 'fa fa-link',
        },
      },
    },
  },
];
