export default function ActionButton({ title }) {
  return (
    <>
      <button
        type="button"
        data-testid="addUserSaveBtn"
        className=" bg-customBlue border border-gray-300 focus:outline-none font-medium rounded-lg px-4 py-2 mr-2 mb-2 text-white text-xl w-full "
      >
        {title}
      </button>
    </>
  );
}
