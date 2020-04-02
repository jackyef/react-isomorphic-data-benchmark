const methodName = 'react-ssr-isodata';

import React from "react";
import { renderToStringWithData as renderToString } from 'react-isomorphic-data/ssr';
import { DataProvider, createDataClient } from "react-isomorphic-data";

global.fetch = require('node-fetch');

const RecursiveDivs = ({ depth = 1, breadth = 1 }) => {
  if (depth <= 0) {
    return <div>abcdefghij</div>;
  }
  let children = [];

  for (let i = 0; i < breadth; i++) {
    children.push(
      <RecursiveDivs key={i} depth={depth - 1} breadth={breadth - 1} />
    );
  }

  return (
    <div
      onClick={() => {
        console.log("clicked");
      }}
    >
      {children}
    </div>
  );
};

const warmUpV8 = async () => {
  console.info("Warming up...");

  for (let i = 0; i < 20; i += 1) {
    const dataClient = createDataClient();

    await renderToString(
      <DataProvider client={dataClient}>
        <RecursiveDivs depth={5} breadth={11} />
      </DataProvider>
    );
  }

  console.info("Finished warming up!");
};

const benchmark = async () => {
  let time = [];

  for (let i = 0; i < 30; i += 1) {
    const start = process.hrtime();

    const dataClient = createDataClient();
    
    // this renders around 64472 divs
    const markup = await renderToString(
      <DataProvider client={dataClient}>
        <RecursiveDivs depth={5} breadth={11} />
      </DataProvider>
    );
    
    time.push(process.hrtime(start));

    require('fs').writeFileSync('./dist/test.html', markup);

  }

  console.info("================ RESULT ================");
  const durations = time.map(t => (t[0] + t[1] / 1e9) * 1e3);

  durations.forEach((d, i) => {
    console.info(`Run ${i} took `, d, "ms");
  });
  
  console.info("================ SUMMARY ================");
  console.info(`[${methodName}]`);
  console.info(
    "Average is:",
    durations.reduce((a, b) => a + b) / durations.length,
    "ms"
  );
  console.info("Stdev is:", require("node-stdev").population(durations), "ms");

  require('fs').writeFileSync("./dist/result.json", JSON.stringify({
    name: methodName,
    average: durations.reduce((a, b) => a + b) / durations.length,
    stdev: require("node-stdev").population(durations),
  }));
};

(async () => {
  await warmUpV8();
  await benchmark();
})();
