"use strict";

window.addEventListener("DOMContentLoaded", () => {
  const qs = (selector) => document.querySelector(selector);

  fetch("http://api.nbp.pl/api/exchangerates/tables/a/?format=json")
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
    })
    .catch((error) => console.error(error));

  const changeFlag = () => {
    const imgDOM = qs(".background__circle-img-changing");
    const selectorDOM = qs("#from");

    selectorDOM.addEventListener("change", (e) => {
      const optionValue = e.target.value;
      imgDOM.src = `./images/${optionValue}.jpg`;
      console.log(e.target.options[e.target.selectedIndex]);
    });
  };
  changeFlag();
});
