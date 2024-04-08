import React, { useState, useContext, useEffect } from 'react';
import _ from 'lodash';
import { useRouter } from 'next/router'

import { useAppDispatch } from '@/redux/hooks';
import {
  convertToSingleByte,
  getEnglishDateDisplayFormat,
  getJapaneseDateDisplayYYYYMMDDFormat,
  getValueByKeyRecursively as translate,
  getSpecialCareName
} from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, CustomHeader, DeleteModal, NormalTable } from '@/components';
import { AdminEvacueeTempServices } from '@/services';
import { setTempFamily } from '@/redux/family';
import { Input, InputDropdown } from '@/components/input';

export default function TempRegistration() {
  const { locale, localeJson } = useContext(LayoutContext);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [refugeeName, setRefugeeName] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState({
    id: 0,
    name: "--"
  });
  const [tempFamilyData, setTempFamilyData] = useState([])
  const [placeOptions, setPlaceOptions] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [familyCode, setFamilyCode] = useState(null);
  const [getListPayload, setGetListPayload] = useState({
    filters: {
      start: 0,
      limit: 10,
      sort_by: "",
      order_by: "desc",
      place_id: "",
      family_code: "",
      refugee_name: "",
    },
    search: "",
  });

  const columnNames = [
    { field: 'si_no', header: translate(localeJson, 'si_no'), sortable: false, textAlign: 'center', className: "sno_class" },
    {
      field: 'person_refugee_name', header: translate(localeJson, 'name_public_evacuee'), sortable: true, alignHeader: "left", maxWidth: '4rem',
      body: (rowData) => {
        return <div className="flex flex-column">
          <div className="custom-header">{rowData.person_name}</div>
          <div className="table-body-sub">{rowData.person_refugee_name}</div>
        </div>
      },
    },
    { field: 'place_name', header: translate(localeJson, 'place_name'), sortable: false, textAlign: "center", alignHeader: "center", minWidth: '3rem', maxWidth: '3rem' },
    { field: 'family_code', header: translate(localeJson, 'family_code'), sortable: true, textAlign: "center", alignHeader: "center", minWidth: '4rem', maxWidth: '4rem' },
    { field: 'person_dob', header: translate(localeJson, 'dob'), sortable: true, textAlign: "left", alignHeader: "left", minWidth: '4rem', maxWidth: '4rem' },
    { field: "person_age", header: translate(localeJson, 'age'), sortable: true, textAlign: 'center', alignHeader: "center", minWidth: '3rem', maxWidth: '3rem' },
    { field: "person_gender", header: translate(localeJson, 'gender'), sortable: true, textAlign: 'left', alignHeader: "left", minWidth: '4rem', maxWidth: '4rem' },
    { field: "special_care_name", header: translate(localeJson, 'c_special_care'), sortable: false, textAlign: 'left', alignHeader: "left", minWidth: '3rem', maxWidth: '3rem' },
    { field: "yapple_id", header: translate(localeJson, 'yapple_id'), sortable: true, textAlign: 'left', alignHeader: "left", minWidth: '4rem', maxWidth: '4rem' },
  ];
  const [checkedValue, setCheckedValue] = useState(false);
  useEffect(() => {
    setTableLoading(true);
    const fetchTempData = async () => {
      let payload = {
        filters: {
          start: getListPayload.filters.start,
          limit: getListPayload.filters.limit,
          sort_by: getListPayload.filters.sort_by,
          order_by: getListPayload.filters.order_by,
          place_id: getListPayload.filters.place_id,
          family_code: getListPayload.filters.family_code,
          refugee_name: getListPayload.filters.refugee_name,
        },
        search: getListPayload.search,
      }
      AdminEvacueeTempServices.getEvacueeTempList(payload, fetchData)
    };
    fetchTempData();
  }, [locale, getListPayload]);

  const fetchData = (responseData) => {
    var tempList = [];
    var placesList = [
      {
        name: "--",
        id: 0,
      },
    ];
    var listTotalCount = 0;
    if (responseData && responseData.data.list) {
      const data = responseData.data.list;
      const places = responseData.places;
      let placeIdObj = {};
      places.map((place) => {
        let placeData = {
          name:
            locale == "ja"
              ? place.name
              : place.name_en
                ? place.name_en
                : place.name,
          id: place.id,
        };
        placeIdObj[place.id] = locale == 'ja' ? place.name : (place.name_en ?? place.name),
          placesList.push(placeData);
      });
      setPlaceOptions(placesList);

      responseData.data.list.map((item, i) => {
        let evacuees = {
          si_no: i + getListPayload.filters.start + 1,
          id: item.f_id,
          place_name: placeIdObj[item.place_id] ?? "",
          family_count: responseData.data.total_family,
          family_code: item.family_code,
          person_is_owner:
            item.person_is_owner == 0
              ? translate(localeJson, "representative")
              : "",
          person_refugee_name: <div className={"clickable-row"}>{item.person_refugee_name}</div>,
          person_name: <div className={"text-highlighter-user-list clickable-row"}>{item.person_name}</div>,
          person_gender: getGenderValue(item.person_gender),
          person_age: item.person_age,
          age_month: item.person_month,
          special_care_name: item.person_special_cares
            ? getSpecialCareName(item.person_special_cares, locale)
            : "-",
          connecting_code: item.person_connecting_code,
          remarks: item.person_note,
          place: item.place_id,
          out_date: item.family_out_date,
          person_dob:
            locale == "ja"
              ? getJapaneseDateDisplayYYYYMMDDFormat(item.person_dob)
              : getEnglishDateDisplayFormat(item.person_dob),
          yapple_id: item.yapple_id
        };
        tempList.push(evacuees);
      });
      listTotalCount = responseData.data.total;
    }
    setTableLoading(false);
    setTotalCount(listTotalCount);
    setTempFamilyData(tempList);
  };

  const getGenderValue = (gender) => {
    if (gender == 1) {
      return translate(localeJson, 'male');
    } else if (gender == 2) {
      return translate(localeJson, 'female');
    } else if (gender == 3) {
      return translate(localeJson, 'others_count');
    }
  }

  /**
   * Pagination handler
   * @param {*} e 
   */
  const onPaginationChange = async (e) => {
    if (!_.isEmpty(e)) {
      const newStartValue = e.first; // Replace with your desired page value
      const newLimitValue = e.rows; // Replace with your desired limit value
      await setGetListPayload(prevState => ({
        ...prevState,
        filters: {
          ...prevState.filters,
          start: newStartValue,
          limit: newLimitValue
        }
      }));
    }
  }

  const searchListWithCriteria = async () => {
    await setGetListPayload(prevState => ({
      ...prevState,
      filters: {
        ...prevState.filters,
        "place_id": selectedPlace.id,
        "family_code": convertToSingleByte(familyCode),
        "refugee_name": refugeeName
      }
    }));
  }

  const handleFamilyCode = (e) => {
    const re = /^[0-9-]+$/;
    if(e.target.value.length<=0)
    {
      setFamilyCode("");
      return;
    }
    if(re.test(convertToSingleByte(e.target.value)))
    {
    if ((e.target.value).length == 4) {
      const newValue = e.target.value;
      if (newValue.indexOf("-") !== -1) {
        setFamilyCode(e.target.value);
      }
      else {
        setFamilyCode(newValue);
      }
    }
    else if ((e.target.value).length == 3) {
      const newValue = e.target.value;
      const formattedValue = newValue.substring(0, 3);
      setFamilyCode(formattedValue);
    }
    else {
      setFamilyCode(e.target.value)
    }
  }
  else {
    setFamilyCode("")
  }
  }

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <div className="flex gap-2 align-items-center ">
            <CustomHeader
              headerClass={"page-header1"}
              header={translate(localeJson, "list_of_temp_registrants_title")}
            />
            <div className='page-header1-sub mb-2'>{`(${totalCount}${translate(localeJson, "people")})`}</div>
          </div>
          <div>
            <div>
              <form>
                <div className="modal-field-top-space modal-field-bottom-space flex flex-wrap float-right justify-content-end gap-3 lg:gap-2 md:gap-2 sm:gap-2 mobile-input">
                  <InputDropdown
                    inputDropdownProps={{
                      inputDropdownParentClassName:
                        "w-full lg:w-14rem md:w-14rem sm:w-10rem",
                      labelProps: {
                        text: translate(localeJson, "place_name"),
                        inputDropdownLabelClassName: "block",
                      },
                      inputDropdownClassName:
                        "w-full lg:w-14rem md:w-14rem sm:w-10rem",
                      customPanelDropdownClassName: "w-10rem",
                      value: selectedPlace,
                      options: placeOptions,
                      optionLabel: "name",
                      onChange: (e) => setSelectedPlace(e.value),
                      emptyMessage: translate(localeJson, "data_not_found"),
                    }}
                  />
                  <Input
                    inputProps={{
                      inputParentClassName: "w-full lg:w-13rem md:w-14rem sm:w-10rem",
                      labelProps: {
                        text: translate(localeJson, 'household_number'),
                        inputLabelClassName: "block",
                      },
                      inputClassName: "w-full lg:w-13rem md:w-14rem sm:w-10rem",
                      value: familyCode,
                      onChange: (e) => handleFamilyCode(e)
                    }}
                  />
                  <Input
                    inputProps={{
                      inputParentClassName:
                        "w-full lg:w-13rem md:w-14rem sm:w-10rem",
                      labelProps: {
                        text: translate(localeJson, "name"),
                        inputLabelClassName: "block",
                      },
                      inputClassName:
                        "w-full lg:w-13rem md:w-14rem sm:w-10rem",
                      value: refugeeName,
                      onChange: (e) => setRefugeeName(e.target.value),
                    }}
                  />
                  <div className="flex align-items-end mt-3 lg:mt-0 md:mt-0 sm:mt-0">
                    <Button
                      buttonProps={{
                        buttonClass: "w-12 search-button mobile-input ",
                        text: translate(localeJson, "search_text"),
                        icon: "pi pi-search",
                        type: "button",
                        onClick: () => searchListWithCriteria(),
                      }}
                      parentClass={"search-button"}
                    />
                  </div>
                </div>
              </form>
            </div>
            {/* Development */}
            {/* <div style={{ display: "flex", justifyContent: "right" }}>
              <div
                className="flex pt-3"
                style={{ justifyContent: "flex-end", flexWrap: "wrap" }}
              >
                <Button
                  buttonProps={{
                    type: "submit",
                    rounded: "true",
                    buttonClass: "evacuation_button_height export-button",
                    export: true,
                    text: translate(localeJson, "export"),
                    onClick: () => {
                      alert("downloading");
                    },
                  }}
                  parentClass={"mb-3 export-button"}
                />
              </div>
            </div> */}
          </div>
          <NormalTable
            lazy
            totalRecords={totalCount}
            loading={tableLoading}
            id={"evacuation-list"}
            className="evacuation-list"
            size={"small"}
            stripedRows={true}
            showGridlines={"true"}
            value={tempFamilyData}
            columns={columnNames}
            emptyMessage={translate(localeJson, "data_not_found")}
            paginator={true}
            first={getListPayload.filters.start}
            rows={getListPayload.filters.limit}
            paginatorLeft={true}
            onPageHandler={(e) => onPaginationChange(e)}
            onSort={(data) => {
              setGetListPayload({
                ...getListPayload,
                filters: {
                  ...getListPayload.filters,
                  sort_by: data.sortField,
                  order_by: getListPayload.filters.order_by === 'desc' ? 'asc' : 'desc'
                }
              }
              )
            }}
            selectionMode="single"
            onSelectionChange={
              (e) => {
                dispatch(setTempFamily({ lgwan_family_id: e.value.id }));
                router.push({
                  pathname: '/admin/temp-registration/family-detail',
                });
              }
            }
          />
        </div>
      </div>
    </div>
  );
}
