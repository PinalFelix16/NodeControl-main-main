export default function Select(props) {
  return (
    <select
      {...props}
      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 min-w-140-px"
    >
      {props.children}
    </select>
  );
}
