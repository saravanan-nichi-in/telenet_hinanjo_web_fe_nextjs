import React, { useContext, useEffect, useState } from "react";
import FamilyListComponent from "@/components";
import { showOverFlow, getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { useSelector } from "react-redux";
import { ButtonRounded } from "@/components";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/redux/hooks";
import { reset } from "@/redux/qr_app";
import { UserQrService } from "@/services";
const SearchDetails = () => {
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  const qrAppReducer = useSelector((state) => state.qrAppReducer);
  const layoutReducer = useSelector((state) => state.layoutReducer);
  const { create } = UserQrService;
  const router = useRouter();
  let data = qrAppReducer?.checkInData || [];
  let family_id = data.length > 0 ? data[0].family_id : "";
  const [familyCode, setFamilyCode] = useState(family_id);
  const dispatch = useAppDispatch();
  const isCheckedIn = (res) => {
    setLoader(false);
    res && router.push("/user/qr/app/dashboard");
  };
  useEffect(() => {
    showOverFlow();
  }, [locale]);
  return (
    <div className="flex justify-content-center">
      <div className="m-2 w-full xlScreenMaxWidth mdScreenMaxWidth">
        {data?.length > 0 && (
          <>
            <FamilyListComponent
              data={data}
              header={translate(localeJson, "reg_confirm")}
            />
            <div className="flex flex-column justify-content-center align-items-center">
              <div className="w-12 lg:w-6">
                <ButtonRounded
                  buttonProps={{
                    buttonClass: "w-full h-3rem primary-button",
                    type: "submit",
                    rounded: "true",
                    text: translate(localeJson, "admission_button"),
                    onClick: () => {
                      let payload = {
                        family_id: familyCode,
                        place_id: layoutReducer?.user?.place?.id,
                      };
                      setLoader(true);
                      create(payload, isCheckedIn);
                    },
                  }}
                  parentClass={"w-full  primary-button"}
                />
                <ButtonRounded
                  buttonProps={{
                    type: "button",
                    rounded: "true",
                    custom: "",
                    buttonClass:
                      "back-button w-full custom-icon-button h-3rem flex justify-content-center",
                    text: translate(localeJson, "return"),
                    onClick: () => {
                      router.push("/user/qr/app");
                      dispatch(reset());
                    },
                  }}
                  parentClass={
                    "back-button w-full flex justify-content-center mt-3  mb-3 lg:mb-0"
                  }
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchDetails;
