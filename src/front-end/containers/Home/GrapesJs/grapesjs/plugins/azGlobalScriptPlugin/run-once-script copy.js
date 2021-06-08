/* eslint-disable no-underscore-dangle */
if (!window.__azwc_export) {
  window.__azwc_export_resolve_func = null;
  window.__on_azwc_init = (exportData) => {
    if (window.__azwc_export_resolve_func) {
      window.__azwc_export_resolve_func(exportData);
    }
  };
  window.__azwc_export_promise = new Promise((resolve, reject) => {
    if (window.__azwc_export) {
      resolve(window.__azwc_export);
    } else {
      window.__azwc_export_resolve_func = resolve;
    }
  });
}

window.customRunOnceFuncs = [];
window.azgjsRunOnceDone = false;
const azgjsRunOnceFunc = (azwc_export) => {
  if (window.azgjsRunOnceDone) {
    return;
  }
  // console.log('azwc_export :', azwc_export);
  const { AzwcSwiper } = azwc_export;
  const { Swiper } = azwc_export.thirdParty;
  AzwcSwiper.componentDidLoad = (inst) => {
    // console.log('inst :', inst);
    // console.log('inst.host.id :', inst.host.id);
  };
  AzwcSwiper.createSwiper = inst => new Swiper(inst.container, Object.assign({}, AzwcSwiper.getDefaultOptions(inst), {
    // effect: 'fade',
    // direction: 'vertical',
    // mousewheel: true,
  }));
  window.customRunOnceFuncs.forEach(f => f({ azwc_export }));
  window.azgjsRunOnceDone = true;
};

window.waitAzwcLoaded = (cb) => {
  if (window.__azwc_export) {
    azgjsRunOnceFunc(window.__azwc_export);
    cb(window.__azwc_export);
  } else {
    window.__azwc_export_promise.then(() => {
      azgjsRunOnceFunc(window.__azwc_export);
      cb(window.__azwc_export);
    });
  }
};
