import React, { createContext, useState } from "react";

const TableThemeContext = createContext();

const TableThemeProvider = ({ color = "light", children }) => {
  const [theme, setTheme] = useState(color);

  return (
    <TableThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </TableThemeContext.Provider>
  );
};

export { TableThemeContext, TableThemeProvider };
