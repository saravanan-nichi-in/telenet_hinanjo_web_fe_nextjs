import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import {
  Button,
  DividerComponent,
  NormalTable,
  Counter,
  TextAreaFloatLabel,
  ValidationError
} from "@/components";
import { StaffSuppliesServices } from "@/services/supplies.services";
import _ from "lodash";
import { useSelector } from "react-redux";
import { Formik } from "formik";

export default function Supplies() {
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  const schema = Yup.object().shape({
    comment: Yup.string().max(
      200,
      translate(localeJson, "comment") + translate(localeJson, "max_length_200")
    ),
    remarks: Yup.string().max(
      200,
      translate(localeJson, "remarks") + translate(localeJson, "max_length_200")
    ),
  });

  const router = useRouter();
  const layoutReducer = useSelector((state) => state.layoutReducer);
  const initialValues = {
    comment: "",
    remarks: "",
  };
  const columnsData = [
    {
      field: "slno",
      header: translate(localeJson, "supplies_slno"),
      className: "sno_class",
      textAlign: "center",
      alignHeader:"center"
    },
    {
      field: "name",
      header: translate(localeJson, "supplies_name"),
      minWidth: "15rem",
      maxWidth: "15rem",
      
    },
    {
      field: "unit",
      header: translate(localeJson, "supplies_unit"),
      minWidth: "10rem",
      maxWidth: "10rem",
      alignHeader:"center",
      body: (rowData) => (
        <div className="border-top-none">
          <Counter
            inputClass={"border-noround-bottom border-noround-top text-center"}
            onValueChange={(value) => {
              rowData.number = value + "";
            }}
            value={rowData?.number + ""}
            min={0}
            max={999999999}
          />
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
  const { getList, create } = StaffSuppliesServices;

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
        response.data.supplies?.length > 0
      ) {
        const data = response.data.supplies;
        const supplies_notes = response.data.supplyNotes;
        if (supplies_notes) {
          initialValues.comment = supplies_notes.comment;
          initialValues.remarks = supplies_notes.note;
        }
        let preparedList = [];
        data.map((obj, i) => {
          let preparedObj = {
            slno: i + 1,
            id: obj.id ?? "",
            name: obj.name ?? "",
            unit: obj.unit ?? "",
            number: obj.number ?? "",
          };
          preparedList.push(preparedObj);
        });
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
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={(values) => {
          setLoader(true)
          let payload = {
            place_id: layoutReducer?.user?.place?.id,
            supply: list?.map((item) => {
              return {
                m_supply_id: item.id,
                number: item.number,
              };
            }),
            comment: values.comment,
            note: values.remarks,
          };
          create(payload, isCreated);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <div className="grid">
            <div className="col-12">
              <div className="card">
                <h5 className="page-header1">
                  {translate(localeJson, "staff_supplies")}
                </h5>
                <hr />
                <form onSubmit={handleSubmit}>
                  <div>
                    <h5 className="sub-header">
                      {translate(localeJson, "supplies_registration")}
                    </h5>
                    <div className="mt-3">
                      <NormalTable
                        lazy
                        totalRecords={totalCount}
                        loading={tableLoading}
                        stripedRows={true}
                        className={"custom-table-cell"}
                        showGridlines={"true"}
                        value={list}
                        columns={columnsData}
                        filterDisplay="menu"
                        emptyMessage={translate(localeJson, "data_not_found")}
                      />
                    </div>
                    <div className="grid col-12 m-0 pl-0 pr-0">
                      <div className="mt-3 col-6 pl-0">
                        <TextAreaFloatLabel
                          textAreaFloatLabelProps={{
                            textAreaClass:
                              "w-full lg:w-full md:w-23rem sm:w-21rem ",
                            row: 5,
                            cols: 30,
                            name: "comment",
                            placeholder: translate(
                              localeJson,
                              "comment_placeholder"
                            ),
                            text: translate(localeJson, "comment"),
                            value: values.comment,
                            onChange: handleChange,
                            onBlur: handleBlur
                          }}
                          parentClass={`${errors.comment && touched.comment && 'p-invalid w-full'}`} />
                        <ValidationError errorBlock={errors.comment && touched.comment && errors.comment} />
                      </div>
                      <div className="mt-3 col-6 pr-0">
                        <TextAreaFloatLabel
                          textAreaFloatLabelProps={{
                            textAreaClass:
                              "w-full lg:w-full md:w-23rem sm:w-21rem ",
                            row: 5,
                            cols: 50,
                            name: "remarks",
                            text: translate(localeJson, "remarks"),
                            value: values.remarks,
                            placeholder: translate(
                              localeJson,
                              "remark_placeholder"
                            ),
                            onChange: handleChange,
                            onBlur: handleBlur
                          }}
                          parentClass={`${errors.comment && touched.comment && 'p-invalid w-full'}`} />
                        <ValidationError errorBlock={errors.remarks && touched.remarks && errors.remarks} />
                      </div>
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