"use client";

import { useState, useEffect } from "react";
import IconLeftBtn from "@/components/Button/iconLeftBtn";
import { usePathname, useRouter } from "next/navigation";
import SearchInput from "@/components/Layout/search";

export default function DashboardLayout({ children }) {
  const router = usePathname();
  const routerPath = useRouter();
  const [tabResetProp, setTabResetProp] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    !isSidebarVisible && setIsSidebarVisible(true);
  }, [tabResetProp]);

  function clickHere(v) {
    setIsSidebarVisible(v);
  }
  function getIconWithClass(cls) {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10.0161 9.1667C10.6485 8.29789 11.0218 7.22781 11.0218 6.07129C11.0218 3.16365 8.66481 0.806641 5.75733 0.806641C2.84967 0.806641 0.492676 3.16359 0.492676 6.07129C0.492676 8.97873 2.84963 11.3357 5.75733 11.3357C6.91399 11.3357 7.98413 10.9624 8.85288 10.33L11.9607 13.4378C12.2821 13.7592 12.8032 13.7605 13.1249 13.4388C13.4486 13.1151 13.4447 12.5952 13.124 12.2746C13.124 12.2746 13.1239 12.2745 13.124 12.2746L10.0161 9.1667ZM9.61808 9.19293C9.61811 9.19289 9.61805 9.19298 9.61808 9.19293C9.68154 9.11453 9.74253 9.03403 9.8012 8.95179C10.3808 8.13946 10.7218 7.14517 10.7218 6.07129C10.7218 3.32932 8.49912 1.10664 5.75733 1.10664C3.01536 1.10664 0.792676 3.32928 0.792676 6.07129C0.792676 8.81304 3.01531 11.0357 5.75733 11.0357C6.94009 11.0357 8.02624 10.6222 8.87896 9.93182L12.1728 13.2257C12.3776 13.4304 12.7087 13.4307 12.9128 13.2266C13.1183 13.0211 13.1165 12.6912 12.9118 12.4867L9.61808 9.19293ZM5.75724 9.69069C7.75614 9.69069 9.37664 8.07019 9.37664 6.07129C9.37664 4.07231 7.75614 2.45189 5.75724 2.45189C3.75825 2.45189 2.13784 4.0723 2.13784 6.07129C2.13784 8.0702 3.75825 9.69069 5.75724 9.69069ZM9.67664 6.07129C9.67664 8.23588 7.92182 9.99069 5.75724 9.99069C3.59256 9.99069 1.83784 8.23588 1.83784 6.07129C1.83784 3.90662 3.59256 2.15189 5.75724 2.15189C7.92182 2.15189 9.67664 3.90662 9.67664 6.07129Z"
          fill="white"
          stroke="#ffffff"
        />
      </svg>
    );
  }

  return (
    <>
      <div className="w-full bg-white hidden lg:flex gap-2 flex-wrap flex-shrink-0 flex-grow-0 py-2 px-2 rounded-xl mb-2 md:mx-auto md:justify-center lg:justify-normal">
        <div className={`w-full md:w-[calc(50%-10px)] lg:flex lg:flex-1 `}>
          <SearchInput placeholder={"お客様名"} />
        </div>
        <div className={`w-full md:w-[calc(50%-10px)] lg:flex lg:flex-1 `}>
          <SearchInput placeholder={"お客様ID"} />
        </div>

        <div className={`w-full md:w-[calc(50%-10px)] lg:flex lg:flex-1 `}>
          <SearchInput placeholder={"無線番号"} />
        </div>

        <div className={`w-full md:w-[calc(50%-10px)] lg:flex lg:flex-1 `}>
          <SearchInput placeholder={"シリアルナンバー"} />
        </div>

        <div className={`w-full md:w-[calc(50%-10px)] lg:flex lg:flex-1 `}>
          <SearchInput placeholder={"代理店名"} />
        </div>

        <div className={`w-full md:w-[calc(50%-10px)] lg:flex lg:flex-1 `}>
          <SearchInput placeholder={"タイプ（ライセンス）"} />
        </div>
        <div className="w-full md:w-[calc(100%-10px)]  lg:w-[144px]   xl:flex xl:flex-1">
          <IconLeftBtn
            text={"検索"}
            textColor={
              "w-full text-white font-medium text-sm w-full px-6 rounded-lg"
            }
            py={"py-2"}
            px={""}
            bgColor={"bg-customBlue"}
            textBold={true}
            icon={() => getIconWithClass("")}
            onClick={() => {routerPath.push("/dashboard/search-result")}}
          />
        </div>
      </div>
      <div className="m-w-[1400] ">{children}</div>
    </>
  );
}
