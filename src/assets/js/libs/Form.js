// ============================================
// フォーム
// ============================================

//住所自動入力
// ==========================
function addAutoFunc() {
  const formTag = document.querySelector('form');
  const zipInput = document.querySelector('[name="zip"]');
  const addInput = document.querySelector('[name="address"]');
  if (zipInput && addInput) {
    formTag.classList.add('h-adr');
    formTag.insertAdjacentHTML('afterbegin', '<input type="hidden" class="p-country-name" value="Japan">');
    zipInput.classList.add('p-postal-code');
    addInput.classList.add('p-region', 'p-locality', 'p-street-address', 'p-extended-address');

    new YubinBango.MicroformatDom();
  }
}

//数字キーボード
// ==========================
function numKeyFunc() {
  const numKeyAry = document.querySelectorAll('.js-num-input');
  if (numKeyAry) {
    numKeyAry.forEach((el) => {
      el.setAttribute('inputmode', 'tel');
    });
  }
}

export { addAutoFunc, numKeyFunc };
