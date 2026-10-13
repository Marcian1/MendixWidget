const base = require("@mendix/pluggable-widgets-tools/configs/eslint.ts.base.json");

module.exports = {
    ...base,
    rules: {
        ...base.rules,
        "react-hooks/refs": "off",
        "react-hooks/set-state-in-effect": "off",
        "react-hooks/use-memo": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "react-hooks/exhaustive-deps": "warn"
    }
};
