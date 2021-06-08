export const defaultCss = `
:root {
  --azg-theme-primary: #42a5f5;
}
`;

export const defaultHtml = `
<aside class="myCanvasNav canvi-navbar">
  <div class="canvi-user-info">
    <div class="canvi-user-info__image">
      <img src="logo.jpg" />
    </div>
    <div class="canvi-user-info__data">
      <span class="canvi-user-info__title">Title</span>
      <a href="#" class="canvi-user-info__meta">View site</a>
      <div class="canvi-user-info__close">
      </div>
    </div>
  </div>
  <div>
    <azwc-collapse-t1 active>
      <div slot="title">collapse-title-1</div>
      <p slot="contents">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam ducimus, illum vitae nam officia quidem iste maxime provident! Temporibus repellat nulla blanditiis at accusamus minima delectus aut doloribus officia deserunt.</p>
    </azwc-collapse-t1>
    <azwc-collapse-t1>
      <div slot="title">collapse-title-2</div>
      <p slot="contents">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam ducimus, illum vitae nam officia quidem iste maxime provident! Temporibus repellat nulla blanditiis at accusamus minima delectus aut doloribus officia deserunt.</p>
    </azwc-collapse-t1>
    <azwc-collapse-t1>
      <div slot="title">collapse-title-3</div>
      <p slot="contents">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam ducimus, illum vitae nam officia quidem iste maxime provident! Temporibus repellat nulla blanditiis at accusamus minima delectus aut doloribus officia deserunt.</p>
    </azwc-collapse-t1>
  </div>
  <ul class="canvi-navigation">
    <li>
      <a href="#" class="canvi-navigation__item"><span id="irdbf" class="canvi-navigation__icon-wrapper"><span
            class="canvi-navigation__icon icon-iconmonstr-code-2"></span></span><span
          class="canvi-navigation__text">Laravel</span></a>
    </li>
    <li>
      <a href="#" class="canvi-navigation__item"><span id="ink9n" class="canvi-navigation__icon-wrapper"><span
            class="canvi-navigation__icon icon-iconmonstr-code-5"></span></span><span
          class="canvi-navigation__text">CSS</span></a>
    </li>
    <li>
      <a href="#" class="canvi-navigation__item"><span id="if46h" class="canvi-navigation__icon-wrapper"><span
            class="canvi-navigation__icon icon-iconmonstr-code-9"></span></span><span
          class="canvi-navigation__text">HTML</span></a>
    </li>
    <li>
      <a href="#" class="canvi-navigation__item"><span id="i62as" class="canvi-navigation__icon-wrapper"><span
            class="canvi-navigation__icon icon-iconmonstr-code-11"></span></span><span
          class="canvi-navigation__text">JavaScript</span></a>
    </li>
    <li>
      <a href="#" class="canvi-navigation__item"><span id="ihx7s" class="canvi-navigation__icon-wrapper"><span
            class="canvi-navigation__icon icon-iconmonstr-code-13"></span></span><span
          class="canvi-navigation__text">Vue.js</span></a>
    </li>
  </ul>
</aside>
<section class="js-canvi-content">
  <button id="open-dialog-btn">Open Modal</button>
  <button class="js-canvi-open-button--left btn">Open Left Navbar</button>
  <azwc-dialog dialogid="d1">
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
    Content<br />
  </azwc-dialog>
</section>
<script data-global-script="">
  {
    var azwc_classes = window.__azwc_classes;
    console.log('azwc_classes :', azwc_classes);
    var AzwcSwiper = azwc_classes.AzwcSwiper;
    var Swiper = azwc_classes.thirdParty.Swiper;
    AzwcSwiper.componentDidLoad = (inst) => {
      console.log('inst :', inst);
      console.log('inst.host.id :', inst.host.id);
    }
    AzwcSwiper.createSwiper = (inst) => {
      return new Swiper(inst.container, Object.assign({}, AzwcSwiper.getDefaultOptions(inst), {
        // effect: 'fade',
        // direction: 'vertical',
        // mousewheel: true,
      })
      );
    }
    var AzwcDialog = azwc_classes.AzwcDialog;
    var btn = document.querySelector('#open-dialog-btn');
    btn.addEventListener("click", function () {
      console.log('AzwcDialog.open');
      console.log('AzwcDialog.allInstances :', AzwcDialog.allInstances);
      AzwcDialog.open('d1');
    }
    );
    var Canvi = azwc_classes.thirdParty.Canvi;
    var t = new Canvi({
      // content: ".js-canvi-content",
      content: "body",
      isDebug: !1,
      navbar: ".myCanvasNav",
      openButton: ".js-canvi-open-button--left",
      position: "left",
      pushContent: !1,
      speed: "0.2s",
      width: "100vw",
      responsiveWidths: [{
        breakpoint: "600px",
        width: "280px"
      }
        , {
        breakpoint: "1280px",
        width: "320px"
      }
        , {
        breakpoint: "1600px",
        width: "380px"
      }
      ]
    }
    );
    var canviCloseBtn = document.querySelector('.canvi-user-info__close');
    console.log('canviCloseBtn :', canviCloseBtn);
    canviCloseBtn.addEventListener("click", function () {
      t.close();
    }
    );
  }
</script>
`;
