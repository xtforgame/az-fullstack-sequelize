/* eslint-disable no-underscore-dangle */
window.waitAzwcLoaded((azwc_export) => {
  const { AzwcDialog } = azwc_export;
  const btn = document.querySelector('#open-dialog-btn');
  btn.addEventListener('click', () => {
    console.log('AzwcDialog.open');
    console.log('AzwcDialog.allInstances :', AzwcDialog.allInstances);
    AzwcDialog.open('d1');
  });
  const { Canvi } = azwc_export.thirdParty;
  const t = new Canvi({
    // content: ".js-canvi-content",
    content: 'body',
    isDebug: !1,
    navbar: '.myCanvasNav',
    openButton: '.js-canvi-open-button--left',
    position: 'left',
    pushContent: !1,
    speed: '0.2s',
    width: '100vw',
    responsiveWidths: [{
      breakpoint: '600px',
      width: '280px',
    },
    {
      breakpoint: '1280px',
      width: '320px',
    },
    {
      breakpoint: '1600px',
      width: '380px',
    },
    ],
  });
  const canviCloseBtn = document.querySelector('.canvi-user-info__close');
  canviCloseBtn.addEventListener('click', () => {
    t.close();
  });
});
