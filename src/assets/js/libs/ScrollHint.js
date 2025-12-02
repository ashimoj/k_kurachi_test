// ============================================
// ScrollHint
// ============================================
import ScrollHint from 'scroll-hint';
import 'scroll-hint/css/scroll-hint.css';

function ScrollHintFunc() {
  new ScrollHint('.js-scrollable', {
    i18n: {
      scrollable: 'スクロールできます',
    },
  });
}

function articleTable() {
  const tableAry = document.querySelectorAll('.c-single01__contents table');
  if (tableAry) {
    tableAry.forEach((element) => {
      element.outerHTML = `<div class="js-scrollable">${element.outerHTML}</div>`;
    });
  }
}

export { ScrollHintFunc, articleTable };
