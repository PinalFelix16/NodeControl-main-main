export default function Button(props) {
  const color = props.color ?? "light";
  return (
    <button
      {...props}
      className={
        "float-right bg-transparent border-2 border-solid hover:bg-blueGray-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none ease-linear transition-all duration-150" +
        (color === "light" ? " text-blueGray-200" : " text-blueGray-800")
      }
      style={{ borderColor: color === "light" ? "#e2e8f0" : "#1e293b" }}
    >
      {props.children}
    </button>
  );
}
