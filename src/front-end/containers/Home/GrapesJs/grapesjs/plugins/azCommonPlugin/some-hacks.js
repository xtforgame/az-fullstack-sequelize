export default (editor, options) => {
  const traverseComponent = (component, i, a) => {
    const cb = (component, i, a) => {
      if (component.type === 'textnode') {
        console.log('component.content :', component.content);
        return { tagName: 'azxxx', components: [] };
      }
      return traverseComponent(component, i, a);
    };
    const newComponent = { ...component };
    if (newComponent.components) {
      if (Array.isArray(newComponent.components)) {
        newComponent.components = newComponent.components.map(cb);
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
    // result.html = traverseComponent(result.html);
    return result;
  };
};
