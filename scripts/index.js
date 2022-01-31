"use strict";

window.addEventListener("DOMContentLoaded", () => {
   // helper functions
   const qs = (selector) => document.querySelector(selector);

   // DOM elements
   const imgChangingFlagDOM = qs(".background__circle-img-changing");
   const inputAmoutDOM = qs("#amount");
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

  // fetching data from the server
  fetch("http://api.nbp.pl/api/exchangerates/tables/a/?format=json")
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      console.log(response[0].rates);
      const rates = response[0].rates;
      // cerate currency object

      const cerateCurrency = () => {
        rates.map((obj, id, arr) => {
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
            optionFromDOM.setAttribute("midRate", obj.mid);

            const findEmoji = () => {
              const m = Object.entries(emoji).forEach((table) => {
                if (table[0] === obj.code) {
                  const emoji = table[1];
                  return emoji;
                }
              })

              return m;
            };
console.log(findEmoji());
            optionFromDOM.textContent = `${findEmoji()} &nbsp; ${obj.code} - ${obj.currency}`;
            selectFromDOM.appendChild(optionFromDOM);
          }
        });
      };
      cerateCurrency();
    })
    .catch((error) => console.error(error));

 

  // data cd
  const currencies = [];
  const symbols = {
    euro: "&#x20AC",
    dollar: "&#x24",
    pound: "&#xA3",
    swissFranc: "CHF",
  };

  // data update
  const addNewCurrency = (oldData, newCurrency) => {
    return [...oldData, newCurrency];
  };

  const changeFlagAndSymbol = () => {
    selectFromDOM.addEventListener("change", (e) => {
      const optionValue = e.target.value;
      imgChangingFlagDOM.src = `./images/${optionValue}.jpg`;
      console.log(e.target.options[e.target.selectedIndex]);
    });
  };
  changeFlagAndSymbol();
});
