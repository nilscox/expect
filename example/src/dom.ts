export const renderButton = (onClick: () => void) => {
  const btn = document.createElement('button');

  btn.innerText = 'click me';
  btn.addEventListener('click', onClick);

  document.body.appendChild(btn);
};
