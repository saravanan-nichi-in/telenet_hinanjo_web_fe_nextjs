import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import {
  Button,
  NormalTable,
  Counter,
  Input
} from "@/components";
import { StaffRegisterServices } from "@/services/register_check_in.services";
import _ from "lodash";
import { useSelector } from "react-redux";
import { Formik } from "formik";

export default function RegisterCheckIn() {
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  const router = useRouter();
  const layoutReducer = useSelector((state) => state.layoutReducer);
  const [frozenArray, setFrozenArray] = useState([]);
  const initialValues = {};
  const columnsData = [
    {
      field: "slno",
      header: translate(localeJson, "supplies_slno"),
      className: "sno_class",
      textAlign: "center",
      headerAlign:"center"
    },
    {
      field: "name",
      header: translate(localeJson, "supplies_name"),
      minWidth: "15rem",
      maxWidth: "15rem",
    },
    {
      field: "count",
      header: translate(localeJson, "residence_with_information"),
      minWidth: "10rem",
      maxWidth: "10rem",
      body: (rowData) => (
        <div className="border-top-none">
          <Counter
            inputClass={"border-noround-bottom border-noround-top text-center"}
            onValueChange={(value) => {
              rowData.count = value + "";
            }}
            value={rowData?.count + ""}
            min={0}
            max={9999}
            style={{ fontWeight: "bold" }}
          />
        </div>
      ),
    },
    {
      field: "specialCarePersonsCount",
      header: translate(localeJson, "residence_with_out_information"),
      minWidth: "10rem",
      maxWidth: "10rem",
      body: (rowData) => (
        <div className="border-top-none">
          <Input inputProps={{
            inputClass: "col-12 p-inputtext-sm text-center",
            value: rowData.specialCarePersonsCount,
            disabled: true
          }} />
        </div>
      ),
    },
  ];

  const [getListPayload, setGetListPayload] = useState({
    place_id: layoutReducer?.user?.place?.id,
  });

  const [columns, setColumns] = useState([]);
  const [list, setList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);

  /* Services */
  const { getList, create } = StaffRegisterServices;

  useEffect(() => {
    setTableLoading(true);
    const fetchData = async () => {
      await onGetMaterialListOnMounting();
      setLoader(false);
    };
    fetchData();
  }, [locale, getListPayload]);

  /**
   * Get supplies list on mounting
   */
  const onGetMaterialListOnMounting = () => {
    // Get supplies list
    getList(getListPayload, (response) => {
      if (
        response.success &&
        !_.isEmpty(response.data) &&
        response.data.detail?.length > 0
      ) {
        const data = response.data.detail;
        let preparedList = [];
        let frozenData = []
        data.map((obj, i) => {
          let preparedObj = {
            slno: i > 0 ? i : "",
            special_care_id: obj.id ?? "",
            name: locale == 'ja' ? obj.name ?? "" : obj.name_en ?? "",
            count: obj.count ?? "",
            unit: obj.unit ?? "",
            number: obj.number ?? "",
            specialCarePersonsCount: obj.person_total || obj.specialCarePersonsCount
          };
          if (i == 0) {
            frozenData.push(preparedObj)
          }
          else {
            preparedList.push(preparedObj);
          }
        });

        setFrozenArray([frozenData[0]])
        setList(preparedList);
        setTableLoading(false);
      } else {
        setTableLoading(false);
        setList([]);
      }
    });
  };

  const isCreated = (res) => {
    setLoader(false)
    if (res) {
      onGetMaterialListOnMounting();
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          setLoader(true);
          let payload = {
            place_id: layoutReducer?.user?.place?.id,
            people_checkin: [],
          };

          if (list) {
            payload.people_checkin.push(
              ...list.map((item) => {
                return {
                  special_care_id: item.special_care_id,
                  count: item.count,
                };
              })
            );
          }

          if (frozenArray) {
            payload.people_checkin.push(
              ...frozenArray.map((item) => {
                return {
                  special_care_id: item.special_care_id,
                  count: item.count,
                };
              })
            );
          }
          create(payload, isCreated);
        }}

      >
        {({
          values,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <div className="grid">
            <div className="col-12">
              <div className="card">
                <h5 className="page-header1">
                  {translate(localeJson, "staff_check_in")}
                </h5>
                <hr />
                <form onSubmit={handleSubmit}>
                  <div>
                    <div className="mt-3 sub-heading">{translate(localeJson, "staff_support")}</div>
                    <div className="mt-3">
                      <NormalTable
                        lazy
                        totalRecords={totalCount}
                        loading={tableLoading}
                        stripedRows={true}
                        className={"custom-table-cell"}
                        showGridlines={"true"}
                        value={list}
                        frozenValue={_.size(list) > 0 && frozenArray}
                        columns={columnsData}
                        filterDisplay="menu"
                        emptyMessage={translate(localeJson, "data_not_found")}
                      />
                    </div>
                    <div className="text-center mt-3">
                      <Button
                        buttonProps={{
                          type: "button",
                          buttonClass: "w-8rem",
                          severity: "primary",
                          text: translate(localeJson, "back_to_top"),
                          onClick: () => router.push("/staff/dashboard"),
                        }}
                        parentClass={"inline"}
                      />
                      <Button
                        buttonProps={{
                          buttonClass: "text-600 w-8rem",
                          type: "submit",
                          bg: "bg-white",
                          hoverBg: "hover:surface-500 hover:text-white",
                          text: translate(localeJson, "registration"),
                        }}
                        parentClass={"inline pl-2"}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </>
  );
}