"use client";
import { BsTrash3 } from "react-icons/bs";
import useToggle from "@/utils/hooks/useToggle";
import intl from "../../utils/locales/jp/jp.json";
export default function Pttbar({ setShowModal, setShowImportModel, setExportModal, setDeleteModal }) {
  const [on, toggle] = useToggle(false);

  return (
    <div className=" flex w-full justify-between items-center bg-white rounded-lg py-2 px-4 overflow-x-auto">
      <div className="text-header-blue font-bold bg-header-blue bg-opacity-10 my-auto px-2 lg:px-4 py-2 rounded-lg">
        <span className="hidden lg:block" style={{fontSize:"16px", fontWeight:"700"}}>
          {intl.layout_pttBar_push_settings_to_terminal_ppt}
        </span>
        <span className="lg:hidden">PTT</span>
      </div>
      <div className="text-header-blue text-xl lg:text-[24px]">000*0000*0001</div>
      <div className="flex gap-2">
        <div className="flex flex-col justify-center">
          <div className="md:pl-[10px]">
            <span className="cursor-pointer flex lg:gap-2 items-center border-2 border-header-blue rounded-md px-1 py-2 lg:p-0 lg:border-none">
              <svg
                width="20"
                height="20"
                viewBox="0 0 19 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M-7.44916e-07 17.5417L4.4797 17.5417C4.66443 17.5417 4.81691 17.3923 4.82685 17.2012C4.82903 17.159 5.06757 12.9391 7.08085 8.78543C9.58675 3.61537 13.5928 0.832522 19 0.500001C16.4071 2.54289 9.3454 8.87081 9.3454 17.1819C9.3454 17.3805 9.50103 17.5415 9.69303 17.5415L14.1727 17.5415L9.76552 23.1135L7.08654 26.5L4.97651 23.8324L4.40779 23.1135L-7.44916e-07 17.5417Z"
                  fill="#346595"
                />
              </svg>

              <span className="cursor-pointer" onClick={() => toggle(!on)}>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 13 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.08923 5.57028C6.73814 5.82633 6.26186 5.82633 5.91077 5.57028L0.751848 1.80796C-0.0301079 1.23769 0.373271 -6.43795e-08 1.34108 -1.48988e-07L11.6589 -1.051e-06C12.6267 -1.13561e-06 13.0301 1.23769 12.2482 1.80796L7.08923 5.57028Z"
                    fill="#346595"
                  />
                </svg>
              </span>
            </span>
          </div>
          <div className="hidden lg:block" style={{fontSize:"12px", color:"#346595", fontWeight:"500"}}>インポート</div>
        </div>
        <div className="flex flex-col justify-center" onClick={()=>{
          setExportModal(()=>true)
        }}>
          <div className="cursor-pointer md:ml-[15px] border-2 border-header-blue rounded-md p-2 lg:p-0 lg:border-none">
            <svg
              width="20"
              height="20"
              viewBox="0 0 26 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.0417 0V4.4797C17.0417 4.66443 16.8923 4.81691 16.7012 4.82685C16.659 4.82903 12.4391 5.06757 8.28543 7.08085C3.11537 9.58675 0.332521 13.5928 0 19C2.04289 16.4071 8.37081 9.3454 16.6819 9.3454C16.8805 9.3454 17.0415 9.50104 17.0415 9.69304V14.1727L22.6135 9.76552L26 7.08654L23.3324 4.97651L22.6135 4.40779L17.0417 0Z"
                fill="#346595"
                fillOpacity="0.38"
              />
            </svg>
          </div>
          <div className="hidden lg:block" style={{fontSize:"12px", color:"#346595", fontWeight:"500"}}>エクスポート</div>
        </div>
        <div className="flex flex-col justify-center">
          <div className=" border-2 border-header-blue rounded-md p-2 lg:p-0 lg:border-none">
            <BsTrash3 className="text-header-blue text-xl cursor-pointer" onClick={()=>{
              setDeleteModal(()=>true)
            }}/>
          </div>
          <div className="hidden lg:block" style={{fontSize:"12px", color:"#346595", fontWeight:"500"}}>削除</div>
        </div>
        {on && (
          <>
            <div
              id="dropdownPtt"
              className="z-10 absolute right-[8rem] md:right-[12rem]  divide-y divide-gray-100 rounded-xl shadow bg-[#F9F9F9] text-[#656565]"
              style={{
                width: "155px",
                top: "9rem",
              }}
            >
              <ul
                className="py-2  pl-2 font-bold text-base"
                aria-labelledby="dropdownPttButton"
              >
                <li onClick={setShowImportModel}>
                  <a href="#" className="block px-4 py-2">
                    {intl.layout_pttBar_file_label}
                  </a>
                </li>
                <li onClick={()=>{
                  setShowModal();
                  toggle(!on);
                }}>  
                  <a href="#" className="block px-4 py-2 ">
                    {intl.company_list_company_radioNumber}
                  </a>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
