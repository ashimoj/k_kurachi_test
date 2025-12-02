// ====================
//  375px以下でviewportを固定にする
// ====================

function viewport() {
  const viewport = document.querySelector('meta[name="viewport"]');

  switchFunc();
  window.addEventListener('resize', () => {
    switchFunc();
  });

  function switchFunc() {
    const value = window.outerWidth > 375 ? 'width=device-width,initial-scale=1' : 'width=375';
    if (viewport.getAttribute('content') !== value) {
      viewport.setAttribute('content', value);
    }
  }
}

export { viewport };
