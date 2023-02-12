const fs = require("fs");

const names = ["histogram", "scatterXY", "polar", "radar", "static", "cross"];

names.forEach((element) => {
  injectCode(element);
});

function injectCode(filename) {
  fs.readFile(filename + ".html", "utf-8", function (err, data) {
    if (err) {
      console.error(err);
      return;
    }

    let newData = data;

    fs.readFile("jpsm.json", "utf-8", function (err, jsonData) {
      if (err) {
        console.error(err);
        return;
      }

      // Convert the JSON data to a JavaScript object
      const parsedData = JSON.parse(jsonData);

      const moduleScript = `
    <script
      async
      src="https://ga.jspm.io/npm:es-module-shims@1.5.1/dist/es-module-shims.js"
      crossorigin="anonymous"
    ></script>

    <script id="jpsm" type="module">
      import * as WebComponentsButton from "@spectrum-web-components/button";
      import * as WebComponentsButtonSpButton from "@spectrum-web-components/button/sp-button.js";
      import * as WebComponentsSlider from "@spectrum-web-components/slider";
      import * as WebComponentsSliderSpSliderHandle from "@spectrum-web-components/slider/sp-slider-handle.js";
      import * as WebComponentsSliderSpSlider from "@spectrum-web-components/slider/sp-slider.js";
      import * as WebComponentsTheme from "@spectrum-web-components/theme";
      import * as WebComponentsThemeScaleLarge from "@spectrum-web-components/theme/scale-large.js";
      import * as WebComponentsThemeSpTheme from "@spectrum-web-components/theme/sp-theme.js";
      import * as WebComponentsThemeThemeDark from "@spectrum-web-components/theme/theme-dark.js";
      import * as webglPlot from "webgl-plot";
    </script>
    `;

      // Insert your code here
      const codeToInsert =
        '<script type="importmap">' +
        JSON.stringify(parsedData) +
        "</script>" +
        "\n" +
        moduleScript;
      const tagLocation = "<!-- insert jpsm here -->";

      // Remove the previous injected code
      newData = newData.replace(/<script type="importmap">(.*?)<\/script>/gs, tagLocation);

      newData = newData.replace(/<script\s+async\s+src=".*es-module-shims.* ><\/script>/gs, "");

      newData = newData.replace(/<script id="jpsm" type="module">(.*?)<\/script>/gs, "");

      // Insert the updated code
      newData = newData.replace(tagLocation, codeToInsert);

      fs.writeFile(filename + ".html", newData, "utf-8", function (err) {
        if (err) {
          console.error(err);
          return;
        }

        console.log("Code injected successfully!");
      });
    });
  });
}
