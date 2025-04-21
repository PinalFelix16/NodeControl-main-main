export default function Modal({ title, show, onClose, children }) {
  if (!show) return null;
  return (
    <div className="absolute left-0 top-0 z-10 inset-0 overflow-y-auto w-10/12">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 ">
        <div className="inline-block align-bottom bg-blueGray-200  rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full w-6/12 max-w-lg px-10 py-4">
          <div className="bg-blueGray-200 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 mb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex justify-between items-start">
                <h3 className="text-lg leading-6 text-gray-900 mb-4 font-bold">
                  {title}
                </h3>
                <button onClick={onClose}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-black"
                    style={{ width: "1.5rem", height: "1.5rem" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
