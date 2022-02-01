"use strict";

window.addEventListener("DOMContentLoaded", () => {
  // helper functions
  const qs = (selector) => document.querySelector(selector);

  // DOM elements
  const imgChangingFlagDOM = qs(".background__circle-img-changing");
  const formDOM = qs("#form");
  const inputAmountDOM = qs("#amount");
  const spanSymbolDOM = qs("#symbol");
  const selectFromDOM = qs("#from");
  const paraResultToConvertDOM = qs("#resultToConvert");
  const paraResultConvertedDOM = qs("#resultConverted");
  const paraUnitRatesDOM = qs("#unitRates");

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
  fetch("https://api.nbp.pl/api/exchangerates/tables/a/?format=json")
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
            const symbolInArray = Object.entries(symbols).filter((table) =>
              nameAttritubeValue.includes(table[0])
            );
            const symbol = symbolInArray.flat()[1];
            return symbol;
          };
          spanSymbolDOM.innerHTML = findSymbol();
        });
      };
      changeFlagAndSymbol();

      const inflectCurrencyName = (currencyName, amountValue) => {
        const lastChar = amountValue.substr(-1,1);
    
        if (currencyName.includes("dolar")) {
          switch (true) {
            case (amountValue.includes(".")) : return "Dolara";
              break;
            case (amountValue == 1) : return "Dolar";
              break;
            case (amountValue >=2 && amountValue <=4 ) : return "Dolary";
              break;
            case (amountValue > 20 && (lastChar >= 2 && lastChar <= 4) ) : return "Dolary";
              break;
            default: return "Dolarów"
              break;
          }
        } else if (currencyName.includes("euro")) {
          return "Euro";
        } else if (currencyName.includes("frank")) {
          switch (true) {
            case (amountValue.includes(".")) : return "Franka";
              break;
            case (amountValue == 1) : return "Frank";
              break;
            case (amountValue >=2 && amountValue <=4 ) : return "Franki";
              break;
            case (amountValue > 20 && (lastChar >= 2 && lastChar <= 4) ) : return "Franki";
              break;
            default: return "Franków"
              break;
          }
        } else if (currencyName.includes("funt")) {
          switch (true) {
            case (amountValue.includes(".")) : return "Funta";
              break;
            case (amountValue == 1) : return "Funt";
              break;
            case (amountValue >=2 && amountValue <=4 ) : return "Funty";
              break;
            case (amountValue > 20 && (lastChar >= 2 && lastChar <= 4) ) : return "Funty";
              break;
            default: return "Funtów"
              break;
          }
        }
      };

      const inflectPLN = (resultPLN) => {
        console.log(resultPLN);
        
        const lastChar = resultPLN.toString().substr(-1,1);
      
        switch (true) {
          case (!Number.isInteger(resultPLN)) : return "Złotych";
            break;
          case (resultPLN === 1) : return "Złoty";
            break;
          case (resultPLN >=2 && resultPLN <=4 ) : return "Złote";
            break;
          case (resultPLN > 20 && (lastChar >= 2 && lastChar <= 4) ) : return "Złote";
            break;
          default: return "Złotych"
            break;
        }
      };

      const convert = () => {
        formDOM.addEventListener("submit", (e) => {
          e.preventDefault();

          const { amount, from } = e.currentTarget.elements;
          const amountValue = amount.value;
          const selectedOption = from.options[from.selectedIndex];
          const name = selectedOption.attributes.name.value;
          const code = selectedOption.attributes.code.value;
          const midRate = selectedOption.attributes.mid.value;
          const resultPLN = amountValue * midRate;
          paraResultToConvertDOM.innerHTML = `${amountValue} ${inflectCurrencyName(name, amountValue)} =   &nbsp`;
          paraResultConvertedDOM.textContent = `${resultPLN.toFixed(
            2
          )} ${inflectPLN(resultPLN)}`;
          paraUnitRatesDOM.textContent = `1 PLN = ${midRate} ${code}`;

          //reset amount
          inputAmountDOM.value = "";
        });
      };
      convert();
    })
    .catch((error) => console.error(error))
    .finally();
});
