(function () {
  const DESCRIPTIONS = {
    totalValue: {
      description: "Total value of your shares",
      type: "currency",
    },
    costToExercise: {
      description: "Your cost to exercise options",
      type: "currency",
    },
    return: {
      description: "Your return",
      type: "currency",
    },
    preferredPrice: {
      description: "Preferred Price",
      subDescription: "Strike Price derived from valuation",
      type: "currency",
    },
    revenueMultiple: {
      description: "Revenue Multiple",
      subDescription: "Is this a good bet?",
      type: "number",
      explanation: `Generally:
      <br>
      <br>1) An acquisition is more realistic when the Revenue Multiple is low; a smaller difference between revenue and value means the purchaser is more likely to make a return on their investment
      <br>2) A 10+ multiplier indicates a bet on a major growth company
      <br><br>
      Benchmark this multiple against companies in the same industry/business and at the same stage of growth.`,
    },
  };

  const inputIds = [
    "valuation",
    "num-diluted-shares",
    "revenue",
    "num-shares",
    "strike-price",
  ];

  function saveValue(inputId, value) {
    localStorage.setItem(`share-math-${inputId}`, value);
  }

  function loadValue(inputId) {
    return localStorage.getItem(`share-math-${inputId}`) || "";
  }

  function getNumericValue(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
      const cleanedValue = input.value.replace(/[$,]/g, "");
      return parseFloat(cleanedValue);
    }
    return 0;
  }

  function formatCurrency(value) {
    const numValue = parseFloat(value);
    return (
      "$" +
      numValue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  function formatResultValue(value, config) {
    if (config.type === "currency") {
      return `${formatCurrency(value)}`;
    } else if (config.type === "number") {
      return value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return value;
  }

  function calculate() {
    const valuation = getNumericValue("valuation");
    const numDilutedShares = getNumericValue("num-diluted-shares");
    const revenue = getNumericValue("revenue");
    const numShares = getNumericValue("num-shares");
    const strikePrice = getNumericValue("strike-price");
    if (
      !valuation ||
      !numDilutedShares ||
      !revenue ||
      !numShares ||
      !strikePrice
    ) {
      results.innerHTML = "";
      return;
    }
    totalValue = (valuation / numDilutedShares - strikePrice) * numShares;
    revenueMultiple = valuation / revenue;
    preferredPrice = valuation / numDilutedShares;
    const resultData = {
      totalValue: {
        value: totalValue,
        config: DESCRIPTIONS.totalValue,
      },
      costToExercise: {
        value: strikePrice * numShares,
        config: DESCRIPTIONS.costToExercise,
      },
      return: {
        value: totalValue - strikePrice * numShares,
        config: DESCRIPTIONS.return,
      },
      preferredPrice: {
        value: preferredPrice,
        config: DESCRIPTIONS.preferredPrice,
      },
      revenueMultiple: {
        value: revenueMultiple,
        config: DESCRIPTIONS.revenueMultiple,
      },
    };
    let resultsHtml = "<table>";
    Object.keys(resultData).forEach((key, index) => {
      const bgColor = index % 2 === 0 ? "#f5f5f5" : "#ffffff";
      resultsHtml += `
            <tr style="background-color: ${bgColor};">
                <td style="min-width: 300px; vertical-align: top; padding: 0.25rem;">
                    <strong>${resultData[key].config.description}</strong>
                    ${
                      resultData[key].config.subDescription
                        ? `<br>(${resultData[key].config.subDescription})`
                        : ""
                    }
                </td>
                <td style="vertical-align: top; padding: 0.25rem;">
                    ${formatResultValue(
                      resultData[key].value,
                      resultData[key].config
                    )}
                    ${
                      resultData[key].config.explanation
                        ? `<p>${resultData[key].config.explanation}</p>`
                        : ""
                    }
                </td>
            </tr>`;
    });
    resultsHtml += "</table>";
    results.innerHTML = resultsHtml;
  }

  function prepopulateInputs() {
    inputIds.forEach((inputId) => {
      const input = document.getElementById(inputId);
      if (input) {
        const savedValue = loadValue(inputId);
        if (savedValue) {
          input.value = savedValue;
        }
        input.addEventListener("input", function () {
          saveValue(inputId, this.value);
        });
      }
    });
  }

  function init() {
    prepopulateInputs();
    const calculateButton = document.getElementById("calculate");
    calculateButton.addEventListener("click", calculate);
    calculate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
