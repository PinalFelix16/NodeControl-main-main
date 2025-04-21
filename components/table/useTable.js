import { useContext } from "react";
import { TableThemeContext } from "./tableContext";

const useTable = () => {
  const context = useContext(TableThemeContext);

  if (!context) {
    throw new Error("useTable must be used within a TableProvider");
  }

  return context;
};

export default useTable;
