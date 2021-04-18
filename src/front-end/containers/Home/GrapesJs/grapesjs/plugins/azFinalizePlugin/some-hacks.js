export default (editor, options) => {
  const traverseComponent = (component, i, a) => {
    const cb = (component, i, a) => {
      if (component.tagName === 'script' && component.type !== 'custom-script') {
        // console.log('component :', component);
        // console.log('component.components :', component.components);
        return undefined;
      }
      // if (component.type === 'textnode') {
      //   // console.log('component.content :', component.content);
      //   return { tagName: 'azxxx', components: [] };
      // }
      return traverseComponent(component, i, a);
    };
    if (Array.isArray(component)) {
      return component.map(cb).filter(c => c);
    }
    const newComponent = { ...component };
    if (newComponent.components) {
      if (Array.isArray(newComponent.components)) {
        newComponent.components = newComponent.components.map(cb).filter(c => c);
      } else {
        newComponent.components = cb(newComponent.components);
      }
    }
    return newComponent;
  };

  // https://github.com/artf/grapesjs/blob/master/src/parser/index.js
  // https://github.com/artf/grapesjs/blob/master/src/parser/model/ParserHtml.js
  editor.Parser.parseHtml = (str) => {
    const {
      em, compTypes, parserHtml, parserCss,
    } = editor.Parser;
    // console.log('parserHtml');
    // console.log('str :', str);
    parserHtml.compTypes = em ? em.get('DomComponents').getTypes() : compTypes;
    const result = parserHtml.parse(str, parserCss);
    result.html = traverseComponent(result.html);
    return result;
  };

  // =========================================
  // do not select any class by default

  const sm = editor.SelectorManager;
  // console.log('sm :', sm.selectorTags);

  sm.prevCids = [];

  // https://github.com/artf/grapesjs/blob/d2ded38edcb2400e8fd4a11c28f84de12a6d540e/src/selector_manager/view/ClassTagsView.js
  const { updateSelection } = sm.selectorTags;
  sm.selectorTags.updateSelection = function (targets) {
    let trgs = targets || this.getTargets();
    trgs = Array.isArray(trgs) ? trgs : [trgs];
    let selectors = [];
    if (trgs.length !== sm.prevCids.length || trgs.find((t, i) => t.cid !== sm.prevCids[i])) {
      if (trgs && trgs.length) {
        selectors = this.getCommonSelectors({ targets: trgs });
        this.checkSync({ validSelectors: selectors });
      }
      selectors.forEach(model => model.set('active', false));
      sm.prevCids = trgs.map(t => t.cid);
    }
    return updateSelection.call(this, targets);
  };
};
