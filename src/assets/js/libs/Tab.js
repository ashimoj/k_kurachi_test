// ============================================
// タブ
// ============================================

function tabFunc() {
  const tabList = document.querySelector('.js-tab__trigger');
  const tabs = document.querySelectorAll('.js-tab__trigger-item');
  const contents = document.querySelectorAll('.js-tab__content-item');

  //タブを切り替える関数
  // ===========================
  function switchTabs() {
    // タブクリック
    tabs.forEach((target) => {
      target.addEventListener('click', () => {
        if (target.ariaSelected === 'false') {
          //タブ選択解除
          tabs.forEach((tab) => {
            tab.ariaSelected = false;
            tab.setAttribute('tabindex', -1);
          });

          toggleContent(target);

          //タブをアクティブに
          target.ariaSelected = true;
          target.setAttribute('tabindex', 0);
          target.focus();
        }
      });
    });
  }
  //コンテンツ表示・非表示
  // ==========================
  function toggleContent(target) {
    contents.forEach((item) => {
      if (item.id !== target.getAttribute('aria-controls')) {
        item.style.display = 'none';
      } else {
        item.style.display = 'revert';
      }
    });
  }

  // タブ矢印キーでの操作
  // ==========================
  function changeTabs() {
    let tabFocus = 0;
    tabList.addEventListener('keydown', (e) => {
      if (e.keyCode === 37 || e.keyCode === 39) {
        tabs[tabFocus].ariaSelected = false;
        tabs[tabFocus].setAttribute('tabindex', -1);

        //戻るボタン
        if (e.keyCode === 37) {
          tabFocus--;
          if (tabFocus < 0) {
            tabFocus = tabs.length - 1;
          }
        } else if (e.keyCode === 39) {
          // 進むボタン
          tabFocus++;
          if (tabFocus >= tabs.length) {
            tabFocus = 0;
          }
        }

        tabs[tabFocus].ariaSelected = true;
        tabs[tabFocus].setAttribute('tabindex', 0);
        toggleContent(tabs[tabFocus]);
        tabs[tabFocus].focus();
      }
    });
  }

  //関数の実行
  if (tabList && tabs && contents) {
    switchTabs();
    changeTabs();
  }
}

export { tabFunc };
