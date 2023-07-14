"use client";

export default function CardIcon({
  children,
  icon,
  title,
  value,
  borderVarient,
  iconBackgroud,
}) {
  return (
    <>
      <div className="relative  w-full pb-2 pt-2 pl-4 pr-12 bg-white border border-gray-200 rounded-2xl md:rounded-xl shadow ">
        <div className={`border-l-2 ${borderVarient} mb-6 pl-2`}>
          <div className="w-32 ">
            <div className="mb-2 text-xs md:text-sm font-bold tracking-tight text-gray-900">
              {title}
            </div>
            <p className=" font-bold text-gray-700 text-xl  md:text-2xl">
              {value}
            </p>
          </div>
        </div>
        <div
          className={`flex justify-end absolute bottom-2 right-2 ${iconBackgroud} mt-12`}
        >
          {children}
        </div>
      </div>
    </>
  );
}
