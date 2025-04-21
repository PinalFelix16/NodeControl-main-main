export default function Input(props) {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <label
        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
        htmlFor={props.id}
      >
        {props.label}
      </label>
      <input
        {...props}
        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
      />
    </div>
  );
}
