"use strict";

window.addEventListener("DOMContentLoaded", () => {
  // helper functions
  const qs = (selector) => document.querySelector(selector);

  // DOM elements
  const imgChangingFlagDOM = qs(".background__circle-img-changing");
  const inputAmoutDOM = qs("#amount");
  const spanSymbolDOM = qs("#symbol");
  const selectFromDOM = qs("#from");
  const paragraphResultToConvertDOM = qs("#resultToConvert");
  const paragraphResultConvertedDOM = qs("#resultConverted");

  // data
  const emoji = {
    USD: "&#x1F1FA&#x1F1F8",
    NZD: "&#x1F1F3&#x1F1FF",
    EUR: "&#x1F1EA&#x1F1FA",
    CHF: "&#x1F1E8&#x1F1ED",
    GBP: "&#x1F1EC&#x1F1E7",
  };
  const symbols = {
    euro: "&#x20AC",
    dolar: "&#x24",
    funt: "&#xA3",
    frank: "CHF",
  };

  // fetching data from the server
  fetch("http://api.nbp.pl/api/exchangerates/tables/a/?format=json")
    .then((response) => response.json())
    .then((response) => {
      const rates = response[0].rates;

      // cerate currency object
      const cerateCurrency = () => {
        rates.map((obj) => {
          if (
            obj.code === "USD" ||
            obj.code === "NZD" ||
            obj.code === "EUR" ||
            obj.code === "CHF" ||
            obj.code === "GBP"
          ) {
            const optionFromDOM = document.createElement("option");
            optionFromDOM.setAttribute("name", obj.currency);
            optionFromDOM.setAttribute("code", obj.code);
            optionFromDOM.setAttribute("mid", obj.mid);

            const findEmoji = () => {
              const emojiInArray = Object.entries(emoji).filter(
                (table) => table[0] === obj.code
              );
              const emojiString = emojiInArray.flat()[1];
              return emojiString;
            };

            const nameToUpperCase =
              obj.currency.charAt(0).toUpperCase() + obj.currency.slice(1);
            optionFromDOM.innerHTML = `${findEmoji()} &nbsp; &nbsp; &nbsp; ${
              obj.code
            } - ${nameToUpperCase}`;

            selectFromDOM.appendChild(optionFromDOM);
          }
        });
      };
      cerateCurrency();

      const changeFlagAndSymbol = () => {
        selectFromDOM.addEventListener("change", (e) => {
          const codeAttritubeValue =
            e.target.options[e.target.selectedIndex].attributes.code.value;
          const nameAttritubeValue =
            e.target.options[e.target.selectedIndex].attributes.name.value;
        
          imgChangingFlagDOM.src = `./images/${codeAttritubeValue}.jpg`;

          const findSymbol = () => {
            const symbolInArray = Object.entries(symbols).filter((table) => nameAttritubeValue.includes(table[0]));
            const symbol = symbolInArray.flat()[1];
            return symbol;
          };
          spanSymbolDOM.innerHTML = findSymbol();
        });
      };
      changeFlagAndSymbol();
    })
    .catch((error) => console.error(error))
    .finally();
});
