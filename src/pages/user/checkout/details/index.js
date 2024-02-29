import React, { useContext, useState } from "react";
import FamilyListComponent from "@/components/familySearchResult";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { useSelector } from "react-redux";
import { ButtonRounded } from "@/components";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/redux/hooks";
import { reset } from "@/redux/checkout";
import { CheckInOutServices } from "@/services";
import toast from 'react-hot-toast';

const CheckOutDetails = () => {
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  const checkOutReducer = useSelector((state) => state.checkOutReducer);
  const { checkOut } = CheckInOutServices;
  const router = useRouter();
  let data = checkOutReducer?.checkOutData || [];
  let family_id = data.length > 0 ? data[0].family_id : "";
  const [familyCode, setFamilyCode] = useState(family_id);

  const dispatch = useAppDispatch();

  const isCheckedOut = (res) => {
    setLoader(false)
    if (res.success) {
      router.push('/user/dashboard');
    }
  }

  const doCheckout = (placeID) => {
    let payload = {
      "lgwan_family_id": familyCode,
      "place_id": placeID
    }
    if (placeID) {
      setLoader(true)
      checkOut(payload, isCheckedOut)
    }
    else {
      toast.error(translate(localeJson, 'already_checked_out'), {
        position: "top-right",
      });
    }
  }

  return (
    <div className="flex justify-content-center">
      <div className="m-2 w-12 xlScreenMaxWidth mdScreenMaxWidth">
        {data?.length > 0 && (
          <>
            <FamilyListComponent data={data} />
            <div className="flex flex-column justify-content-center align-items-center">
              <div className="w-12 lg:w-6">
                <ButtonRounded
                  buttonProps={{
                    buttonClass: "w-full h-3rem primary-button ",
                    type: "submit",
                    rounded: "true",
                    text: translate(localeJson, "exit_Button"),
                    onClick: () => {
                      doCheckout(data[0].place_id)
                    }
                  }}
                  parentClass={"w-full primary-button"}
                />
                <ButtonRounded
                  buttonProps={{
                    type: "button",
                    rounded: "true",
                    custom: "",
                    buttonClass:
                      "back-button w-full custom-icon-button h-3rem justify-content-center",
                    text: translate(localeJson, "return"),
                    onClick: (() => {
                      router.push('/user/checkout')
                      dispatch(reset())
                    })
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

export default CheckOutDetails;