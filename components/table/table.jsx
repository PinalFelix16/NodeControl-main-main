import { TableThemeProvider } from "./tableContext";

export default function Table({ title, color = "light", Toolbar, children }) {
  return (
    <TableThemeProvider color={color}>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-blueGray-700 text-white")
        }
      >
        {title && (
          <h1
            className={
              "text-3xl font-bold m-2 mb-4" +
              (color === "light" ? "text-white" : "text-blueGray-700")
            }
          >
            {title}
          </h1>
        )}

        <div className="flex justify-start items-center p-2">
          {Toolbar && <Toolbar />}
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            {children}
          </table>
        </div>
      </div>
    </TableThemeProvider>
  );
}
