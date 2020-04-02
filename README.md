# ssr-benchmarks

> Want to see the results? Go straight to [result.md](./result.md)

Read this for more context: https://github.com/jackyef/react-isomorphic-data/issues/52#issuecomment-607847150

## Setup
This project uses `pnpm`. If you do not have `pnpm` yet, install it globally.
```
# npm
npm install -g pnpm

# yarn (v1)
yarn global add pnpm
```

Then just install the dependencies using `pnpm`
```
pnpm install
```

## Running the benchmarks
```
pnpm run build:all
pnpm run bench:all
```

Result is outputted to `result.md`

## Running specific benchmark
```
pnpm run bench --filter <method-name>
```
Example:
```
pnpm run bench --filter react-ssr
```

## The benchmark
The benchmark tests various approaches to see how long it takes for each to render around 64000 `<div>`s on the server side. Basically it goes like this:
1. We warm up the v8 engine by rendering 20 times
2. We then run the actual benchmark by rendering 30 times
3. We collect the average time and the standard deviation
