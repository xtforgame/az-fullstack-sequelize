import {
  Drop,
  assert, evalQuotedToken, TypeGuards, Tokenizer, evalToken, Hash, Emitter, TagToken, Context, TagImplOptions,
} from 'liquidjs';
import { isString, isObject, isArray } from 'underscore';

export function toEnumerable(val: any) {
  if (isArray(val)) return val;
  if (isString(val) && val.length > 0) return [val];
  if (isObject(val)) return Object.keys(val).map(key => [key, val[key]]);
  return [];
}

export class ForloopDrop extends Drop {
  protected i = 0

  public length: number

  public constructor(length: number) {
    super();
    this.length = length;
  }

  public next() {
    this.i++;
  }

  public index0() {
    return this.i;
  }

  public index() {
    return this.i + 1;
  }

  public first() {
    return this.i === 0;
  }

  public last() {
    return this.i === this.length - 1;
  }

  public rindex() {
    return this.length - this.i;
  }

  public rindex0() {
    return this.length - this.i - 1;
  }

  public valueOf() {
    return JSON.stringify(this);
  }
}

export function toArray(val: any) {
  if (isArray(val)) return val;
  return [val];
}

export default {
  parse(token: TagToken) {
    const { args } = token;
    const tokenizer = new Tokenizer(args, this.liquid.options.operatorsTrie);
    this.file = this.liquid.options.dynamicPartials
      ? tokenizer.readValue()
      : tokenizer.readFileName();
    assert(this.file, () => `illegal argument "${token.args}"`);

    while (!tokenizer.end()) {
      tokenizer.skipBlank();
      const begin = tokenizer.p;
      const keyword = tokenizer.readIdentifier();
      if (keyword.content === 'with' || keyword.content === 'for') {
        tokenizer.skipBlank();
        if (tokenizer.peek() !== ':') {
          const value = tokenizer.readValue();
          if (value) {
            const beforeAs = tokenizer.p;
            const asStr = tokenizer.readIdentifier();
            let alias;
            if (asStr.content === 'as') alias = tokenizer.readIdentifier();
            else tokenizer.p = beforeAs;

            this[keyword.content] = { value, alias: alias && alias.content };
            tokenizer.skipBlank();
            if (tokenizer.peek() === ',') tokenizer.advance();
            continue;
          }
        }
      }
      tokenizer.p = begin;
      break;
    }
    this.hash = new Hash(tokenizer.remaining());
  },
  * render(ctx: Context, emitter: Emitter) {
    const { liquid, file, hash } = this;
    const { renderer } = liquid;
    const filepath = ctx.opts.dynamicPartials
      ? (TypeGuards.isQuotedToken(file)
        ? yield renderer.renderTemplates(liquid.parse(evalQuotedToken(file)), ctx)
        : evalToken(file, ctx))
      : file.getText();
    assert(filepath, () => `illegal filename "${file.getText()}":"${filepath}"`);

    const currentScope = ctx.getAll();

    const childCtx = new Context({ ...currentScope }, ctx.opts, ctx.sync);
    const scope = yield hash.render(ctx);
    if (this.with) {
      const { value, alias } = this.with;
      scope[alias || filepath] = evalToken(value, ctx);
    }
    childCtx.push(scope);

    if (this.for) {
      const { value, alias } = this.for;
      let collection = evalToken(value, ctx);
      collection = toEnumerable(collection);
      scope.forloop = new ForloopDrop(collection.length);
      for (const item of collection) {
        scope[alias] = item;
        const templates = yield liquid._parseFile(filepath, childCtx.opts, childCtx.sync);
        yield renderer.renderTemplates(templates, childCtx, emitter);
        scope.forloop.next();
      }
    } else {
      const templates = yield liquid._parseFile(filepath, childCtx.opts, childCtx.sync);
      yield renderer.renderTemplates(templates, childCtx, emitter);
    }
  },
} as TagImplOptions;
