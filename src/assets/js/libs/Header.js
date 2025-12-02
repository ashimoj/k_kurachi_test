import MicroModal from 'micromodal';
import { lenis } from './Scroll';

// ============================================
// ヘッダー追従
// ============================================

function fixedHeader() {
  const header = document.querySelector('.js-header');
  const hero = document.querySelector('.js-hero');
  if (hero) {
    let headerH = header.clientHeight;
    let heroH = hero.clientHeight;
    window.addEventListener('scroll', () => {
      let scrollH = window.scrollY;
      if (scrollH > heroH) {
        header.classList.add('is-active');
      } else {
        header.classList.remove('is-active');
        if (scrollH > headerH) {
          header.classList.add('is-hidden');
        } else {
          header.classList.remove('is-hidden');
        }
      }
    });
  }
}

// ============================================
// drawer ハンバーガー開閉処理
// ============================================
function drawer() {
  MicroModal.init();

  //mediaqueryでハンバーガー実装
  const hamburger = document.querySelector('.js-drawer-hamburger');
  const navigation = document.querySelector('.js-drawer-navigation');
  // const txt = document.querySelector('.js-drawer-hamburger__txt');
  if (!hamburger || !navigation) {
    return;
  }

  const menuWrap = navigation.querySelector('.l-drawer__nav');
  const menu = navigation.querySelector('.l-drawer__list');
  const wideHamburger = getComputedStyle(document.documentElement).getPropertyValue('--wide-hamburger');
  const hamburgerBreakPoint = getComputedStyle(document.documentElement).getPropertyValue('--hamburger-breakpoint');
  const mediaQuery = window.matchMedia(`(max-width: ${hamburgerBreakPoint})`);

  if (!menu || !menuWrap) return;

  if (wideHamburger === 'false') {
    switchMenu(mediaQuery);
    mediaQuery.addEventListener('change', switchMenu);

    function switchMenu(mq) {
      if (mq.matches) {
        hamburger.addEventListener('click', hamburgerClick);
        menuWrap.addEventListener('wheel', (e) => {
          e.stopPropagation();
        });
        menuWrap.addEventListener('touchmove', (e) => {
          e.stopPropagation();
        });
        navigation.setAttribute('aria-hidden', true);
      } else {
        navigation.querySelectorAll('a, button').forEach((el) => {
          el.blur();
        });
        navigation.setAttribute('aria-hidden', true);
        lenis.start();
        if (hamburger.classList.contains('is-open')) {
          hamburger.classList.remove('is-open');
          hamburger.ariaExpanded = 'false';
        }
        hamburger.removeEventListener('click', hamburgerClick);
      }
    }
  } else {
    hamburger.addEventListener('click', hamburgerClick);
    if (wideHamburger === 'true') {
      menuWrap.addEventListener('wheel', (e) => {
        e.stopPropagation();
      });
      menuWrap.addEventListener('touchmove', (e) => {
        e.stopPropagation();
      });
    }
    navigation.setAttribute('aria-hidden', true);
  }

  //ハンバーガークリック関数
  function hamburgerClick() {
    let hamburgerFlag = hamburger.ariaExpanded === 'true' || false;
    hamburger.ariaExpanded = !hamburgerFlag;

    if (navigation.getAttribute('aria-hidden') === 'false') {
      hamburger.classList.remove('is-open');
      lenis.start();
      MicroModal.close('navigation');
      // close(); // 追加
    } else {
      header.classList.add('is-open');
      hamburger.classList.add('is-open');
      lenis.stop();
      MicroModal.show('navigation', {
        onClose: () => {
          hamburger.classList.remove('is-open');
          lenis.start();
        },
      });
      // open(); // 追加
    }
  }

  //リンククリックでモーダル閉じる処理
  const links = navigation.querySelectorAll('.l-drawer__link');
  if (!links) return;

  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (navigation.getAttribute('aria-hidden') === 'false') {
        hamburger.classList.remove('is-open');
        MicroModal.close('navigation');
      }
    });
  });

  // 文字変更
  // function open(){
  //   txt.textContent = 'close';
  // }
  // function close(){
  //   txt.textContent = 'menu';
  // }
}
export { fixedHeader, drawer };
