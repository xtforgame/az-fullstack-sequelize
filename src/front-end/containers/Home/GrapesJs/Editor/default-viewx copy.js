export const defaultCss = `
:root {
  --azg-theme-primary: #42a5f5;
}
.clearfix{
  clear:both;
}
.header-banner{
  padding-top:35px;
  padding-bottom:100px;
  color:#ffffff;
  font-weight:100;
  background-image:url("https://grapesjs.com/img/bg-gr-v.png"), url("https://grapesjs.com/img/work-desk.jpg");
  background-attachment:scroll, scroll;
  background-position:left top, center center;
  background-repeat:repeat-y, no-repeat;
  background-size:contain, cover;
}
.container-width{
  width:90%;
  max-width:1150px;
  margin:0 auto;
}
.logo-container{
  float:left;
  width:50%;
}
.logo{
  background-color:#fff;
  border-radius:5px;
  width:130px;
  padding:10px;
  min-height:30px;
  text-align:center;
  line-height:30px;
  color:#4d114f;
  font-size:23px;
}
.menu{
  float:right;
  width:50%;
}
.menu-item{
  float:right;
  font-size:15px;
  color:#eee;
  width:130px;
  padding:10px;
  min-height:50px;
  text-align:center;
  line-height:30px;
  font-weight:400;
}
.lead-title{
  margin:150px 0 30px 0;
  font-size:40px;
}
.sub-lead-title{
  max-width:650px;
  line-height:30px;
  margin-bottom:30px;
  color:#c6c6c6;
}
.lead-btn{
  margin-top:15px;
  padding:10px;
  width:190px;
  min-height:30px;
  font-size:20px;
  text-align:center;
  letter-spacing:3px;
  line-height:30px;
  background-color:#d983a6;
  border-radius:5px;
  transition:all 0.5s ease;
  cursor:pointer;
}
.lead-btn:hover{
  background-color:#ffffff;
  color:#4c114e;
}
.lead-btn:active{
  background-color:#4d114f;
  color:#fff;
}
.flex-sect{
  background-color:#fafafa;
  padding:100px 0;
}
.flex-title{
  margin-bottom:15px;
  font-size:2em;
  text-align:center;
  font-weight:700;
  color:#555;
  padding:5px;
}
.flex-desc{
  margin-bottom:55px;
  font-size:1em;
  color:rgba(0, 0, 0, 0.5);
  text-align:center;
  padding:5px;
}
.cards{
  padding:20px 0;
  display:flex;
  justify-content:space-around;
  flex-flow:wrap;
}
.card{
  background-color:white;
  height:300px;
  width:300px;
  margin-bottom:30px;
  box-shadow:0 1px 2px 0 rgba(0, 0, 0, 0.2);
  border-radius:2px;
  transition:all 0.5s ease;
  font-weight:100;
  overflow:hidden;
}
.card:hover{
  margin-top:-5px;
  box-shadow:0 20px 30px 0 rgba(0, 0, 0, 0.2);
}
.card-header{
  height:155px;
  background-image:url("https://via.placeholder.com/350x250/78c5d6/fff/image1.jpg");
  background-size:cover;
  background-position:center center;
}
.card-header.ch2{
  background-image:url("https://via.placeholder.com/350x250/459ba8/fff/image2.jpg");
}
.card-header.ch3{
  background-image:url("https://via.placeholder.com/350x250/79c267/fff/image3.jpg");
}
.card-header.ch4{
  background-image:url("https://via.placeholder.com/350x250/c5d647/fff/image4.jpg");
}
.card-header.ch5{
  background-image:url("https://via.placeholder.com/350x250/f28c33/fff/image5.jpg");
}
.card-header.ch6{
  background-image:url("https://via.placeholder.com/350x250/e868a2/fff/image6.jpg");
}
.card-body{
  padding:15px 15px 5px 15px;
  color:#555;
}
.card-title{
  font-size:1.4em;
  margin-bottom:5px;
}
.card-sub-title{
  color:#b3b3b3;
  font-size:1em;
  margin-bottom:15px;
}
.card-desc{
  font-size:0.85rem;
  line-height:17px;
}
.am-sect{
  padding-top:100px;
  padding-bottom:100px;
}
.img-phone{
  float:left;
}
.am-container{
  display:flex;
  flex-wrap:wrap;
  align-items:center;
  justify-content:space-around;
}
.am-content{
  float:left;
  padding:7px;
  width:490px;
  color:#444;
  font-weight:100;
  margin-top:50px;
}
.am-pre{
  padding:7px;
  color:#b1b1b1;
  font-size:15px;
}
.am-title{
  padding:7px;
  font-size:25px;
  font-weight:400;
}
.am-desc{
  padding:7px;
  font-size:17px;
  line-height:25px;
}
.am-post{
  padding:7px;
  line-height:25px;
  font-size:13px;
}
.blk-sect{
  padding-top:100px;
  padding-bottom:100px;
  background-color:#222222;
}
.blk-title{
  color:#fff;
  font-size:25px;
  text-align:center;
  margin-bottom:15px;
}
.blk-desc{
  color:#b1b1b1;
  font-size:15px;
  text-align:center;
  max-width:700px;
  margin:0 auto;
  font-weight:100;
}
.price-cards{
  margin-top:70px;
  display:flex;
  flex-wrap:wrap;
  align-items:center;
  justify-content:space-around;
}
.price-card-cont{
  width:300px;
  padding:7px;
  float:left;
}
.price-card{
  margin:0 auto;
  min-height:350px;
  background-color:#d983a6;
  border-radius:5px;
  font-weight:100;
  color:#fff;
  width:90%;
}
.pc-title{
  font-weight:100;
  letter-spacing:3px;
  text-align:center;
  font-size:25px;
  background-color:rgba(0, 0, 0, 0.1);
  padding:20px;
}
.pc-desc{
  padding:75px 0;
  text-align:center;
}
.pc-feature{
  color:rgba(255,255,255,0.5);
  background-color:rgba(0, 0, 0, 0.1);
  letter-spacing:2px;
  font-size:15px;
  padding:10px 20px;
}
.pc-feature:nth-of-type(2n){
  background-color:transparent;
}
.pc-amount{
  background-color:rgba(0, 0, 0, 0.1);
  font-size:35px;
  text-align:center;
  padding:35px 0;
}
.pc-regular{
  background-color:#da78a0;
}
.pc-enterprise{
  background-color:#d66a96;
}
.footer-under{
  background-color:#312833;
  padding-bottom:100px;
  padding-top:100px;
  min-height:500px;
  color:#eee;
  position:relative;
  font-weight:100;
  font-family:Helvetica,serif;
}
.copyright{
  background-color:rgba(0, 0, 0, 0.15);
  color:rgba(238, 238, 238, 0.5);
  bottom:0;
  padding:1em 0;
  position:absolute;
  width:100%;
  font-size:0.75em;
}
.made-with{
  float:left;
  width:50%;
  padding:5px 0;
}
.foot-social-btns{
  display:none;
  float:right;
  width:50%;
  text-align:right;
  padding:5px 0;
}
.footer-container{
  display:flex;
  flex-wrap:wrap;
  align-items:stretch;
  justify-content:space-around;
}
.foot-list{
  float:left;
  width:200px;
}
.foot-list-title{
  font-weight:400;
  margin-bottom:10px;
  padding:0.5em 0;
}
.foot-list-item{
  color:rgba(238, 238, 238, 0.8);
  font-size:0.8em;
  padding:0.5em 0;
}
.foot-list-item:hover{
  color:rgba(238, 238, 238, 1);
}
.foot-form-cont{
  width:300px;
  float:right;
}
.foot-form-title{
  color:rgba(255,255,255,0.75);
  font-weight:400;
  margin-bottom:10px;
  padding:0.5em 0;
  text-align:right;
  font-size:2em;
}
.foot-form-desc{
  font-size:0.8em;
  color:rgba(255,255,255,0.55);
  line-height:20px;
  text-align:right;
  margin-bottom:15px;
}
.sub-input{
  width:100%;
  margin-bottom:15px;
  padding:7px 10px;
  border-radius:2px;
  color:#fff;
  background-color:#554c57;
  border:none;
}
.sub-btn{
  width:100%;
  margin:15px 0;
  background-color:#785580;
  border:none;
  color:#fff;
  border-radius:2px;
  padding:7px 10px;
  font-size:1em;
  cursor:pointer;
}
.sub-btn:hover{
  background-color:#91699a;
}
.sub-btn:active{
  background-color:#573f5c;
}
.bdg-sect{
  padding-top:100px;
  padding-bottom:100px;
  background-color:#fafafa;
}
.bdg-title{
  text-align:center;
  font-size:2em;
  margin-bottom:55px;
  color:#555555;
}
.badges{
  padding:20px;
  display:flex;
  justify-content:space-around;
  align-items:flex-start;
  flex-wrap:wrap;
}
.badge{
  width:290px;
  background-color:white;
  margin-bottom:30px;
  box-shadow:0 2px 2px 0 rgba(0, 0, 0, 0.2);
  border-radius:3px;
  font-weight:100;
  overflow:hidden;
  text-align:center;
}
.badge-header{
  height:115px;
  background-image:url("https://grapesjs.com/img/bg-gr-v.png"), url("https://grapesjs.com/img/work-desk.jpg");
  background-position:left top, center center;
  background-attachment:scroll, fixed;
  overflow:hidden;
}
.badge-name{
  font-size:1.4em;
  margin-bottom:5px;
}
.badge-role{
  color:#777;
  font-size:1em;
  margin-bottom:25px;
}
.badge-desc{
  font-size:0.85rem;
  line-height:20px;
}
.badge-avatar{
  width:100px;
  height:100px;
  border-radius:100%;
  border:5px solid #fff;
  box-shadow:0 1px 1px 0 rgba(0, 0, 0, 0.2);
  margin-top:-75px;
  position:relative;
}
.badge-body{
  margin:35px 10px;
}
.badge-foot{
  color:#fff;
  background-color:#a290a5;
  padding-top:13px;
  padding-bottom:13px;
  display:flex;
  justify-content:center;
}
.badge-link{
  height:35px;
  width:35px;
  line-height:35px;
  font-weight:700;
  background-color:#fff;
  color:#a290a5;
  display:block;
  border-radius:100%;
  margin:0 10px;
}
@media (max-width: 768px){
  .foot-form-cont{
    width:400px;
  }
  .foot-form-title{
    width:autopx;
  }
}
@media (max-width: 480px){
  .foot-lists{
    display:none;
  }
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
  <azwc-accordion>
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
  </azwc-accordion>
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
<script data-html-code="">
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
