import autoprefixer from "autoprefixer";
import postcssPresetEnv from "postcss-preset-env";
import pxtorem from "postcss-pxtorem";

export default {
  plugins: [
    autoprefixer(),
    postcssPresetEnv({ stage: 1 }),
    pxtorem({
      rootValue: 16,
      unitPrecision: 5,
      propList: ["*"],
      selectorBlackList: [],
      replace: true,
      mediaQuery: false,
      minPixelValue: 0,
    }),
  ],
};
