import React from "react";

const FormContext = React.createContext({
  theme: "dark",
  themeToggleFunction: () => {},
});

export default FormContext;