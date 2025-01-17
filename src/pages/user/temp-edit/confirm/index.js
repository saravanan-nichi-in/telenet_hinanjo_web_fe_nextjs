/* eslint-disable react/no-unescaped-entities */
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { LayoutContext } from "@/layout/context/layoutcontext";
import {
  getEnglishDateDisplayFormat,
  getJapaneseDateDisplayYYYYMMDDFormat,
  getValueByKeyRecursively as translate,
} from "@/helper";
import { TempRegisterServices } from "@/services";
import { Button, CustomHeader } from "@/components";
import { prefectures } from "@/utils/constant";
import { reset } from "@/redux/userTempEdit";
import { clearExceptPlaceId,setSuccessData } from "@/redux/tempRegister";
import RegisterConfirmDialog from "@/components/modal/registerConfirmModal";

const TempRegisterConfirm = () => {
  const { localeJson, locale, setLoader } = useContext(LayoutContext);
  const router = useRouter();
  const registerReducer = useAppSelector((state) => state.userTempEditReducer);
  const dispatch = useAppDispatch();

  const [basicFamilyDetail, setBasicFamilyDetail] = useState([]);
  const [neighbourData, setNeighbourData] = useState(null);
  const [familyDetailData, setFamilyDetailData] = useState(null);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [duplicatePersons, setDuplicatePersons] = useState([]);

  let confirmData = registerReducer?.registerData;

  const { staffTempEditUser,tempRegister } = TempRegisterServices

  useEffect(() => {
    console.log(registerReducer?.registerData)
    fetchConfirmData();
    fetchMasterQuestionConfirmData();
  }, [locale]);


  const getSpecialCareName = (nameList) => {
    let specialCareName = "";
    nameList && nameList.map((item) => {
      specialCareName = specialCareName ? specialCareName + ", " + item : item;
    });
    return specialCareName;
  };

  const getGenderValue = (gender) => {
    if (gender == 1) {
      return translate(localeJson, "c_male");
    } else if (gender == 2) {
      return translate(localeJson, "c_female");
    } else {
      return translate(localeJson, "c_others_count");
    }
  };
  const getPrefectureName = (id) => {
    if (id) {
      let p_name = prefectures.find((item) => item.value === id);
      return p_name?.name;
    }
    return "";
  };

  const fetchConfirmData = () => {
    const data = confirmData;
    let basicDetailList = [];
    const ownerPerson = confirmData?.person?.find(person => person.id === confirmData.is_owner);

    let basicData = {
      evacuation_date_time: locale == "ja" ? getJapaneseDateDisplayYYYYMMDDFormat(data.join_date) : getEnglishDateDisplayFormat(data.join_date),
      address: (
        <div
          dangerouslySetInnerHTML={{
            __html:
              ((data.zip_code !== null && data.zip_code !== undefined) ? (translate(localeJson, "post_letter") + data.zip_code + "<br />") : "") +
              getPrefectureName(parseInt(data?.prefecture_id)) +
              (data.address || "") +
              (data.address_default || ""),
          }}
        />
      ),
      tel: data.tel != "00000000000"? data.tel:"-",
      password: data.password,
      rep_kanji: ownerPerson?.name || "", // Assuming 'name' is the rep_kanji field
      rep_furigana: ownerPerson?.refugee_name || "", // Assuming 'refugee_name' is the rep_furigana field
    };
    basicDetailList.push(basicData);
    setBasicFamilyDetail(basicDetailList);
    const personList = confirmData?.person;
    const familyDataList = [];
    personList?.map((person, index) => {
      let familyData = {
        id: index + 1,
        is_owner:
          person.id == confirmData.is_owner ? "（" + translate(localeJson, "c_representative") + "）" : "",
        refugee_name: person.refugee_name || "-",
        name: person.name || "-",
        dob:
          locale == "ja"
            ? getJapaneseDateDisplayYYYYMMDDFormat(person.dob)
            : getEnglishDateDisplayFormat(person.dob),
        age: person.age + "" || "-",
        age_month: person.month + "" || "-",
        gender: getGenderValue(person.gender) || "-",
        created_date: person.createdDate || "-",
        tel: person.tel != "00000000000"? person.tel:"-",
        orders: [
          {
            address: (
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    (person.zip_code ? (translate(localeJson, "post_letter") + person.zip_code + "<br />") : "") +
                    (person.prefecture_id ? getPrefectureName(parseInt(person.prefecture_id)) : "") +
                    (person.address || "") +
                    (person.address_default || ""),
                }}
              />
            ),
            special_care_name: person.specialCareName
              ? getSpecialCareName(locale == "ja" ? person.specialCareName : person.specialCareName2)
              : "",
            connecting_code: person.connecting_code || "-",
            remarks: person.note || "-",
          },
        ],
      };

      let question = person.question;
      if (question?.length > 0) {
        question.map((ques, index) => {
          familyData.orders[0][`question_${index}`] = ques.answer
            ? getAnswerData(locale == "ja" ? ques.answer : ques.answer_en)
            : "";
          familyData.orders[0][`question_${index}_title`] =
            locale == "ja" ? ques.title : ques.title_en;
        });
      }
      familyDataList.push(familyData);
    });
    setFamilyDetailData(familyDataList);
  };

  const fetchMasterQuestionConfirmData = () => {
    let masterQuestion = confirmData.master_question;
    let neighbourDataList = [];
    let neighbourData = {};
    masterQuestion?.map((ques, index) => {
      neighbourData[`question_${index}`] = ques.answer
        ? getAnswerData(locale == "ja" ? ques.answer : ques.answer_en)
        : "";
      neighbourData[`question_${index}_title`] =
        locale == "ja" ? ques.title : ques.title_en;
    });
    neighbourDataList.push(neighbourData);
    setNeighbourData(neighbourDataList);
  };

  const getAnswerData = (answer) => {
    let answerData = null;
    answer.map((item) => {
      answerData = answerData ? answerData + ", " + item : item;
    });
    return answerData;
  };

  const PersonCard = ({ person }) => {
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => {
      setShowDetails(!showDetails);
    };

    return (
      <div className="">
        <div className="flex flex-column bg-gray-300 border-round-2xl p-3 pl-3 mb-3 pt-2  justify-content-center">
          <div className="">
            <div className="">
              <div className=" flex_row_space_between">
                <label className="page-header1">
                  {person.id}{translate(localeJson, "per_information")}{person.is_owner}
                </label>
              </div>
            </div>
            <div className=" mt-3">
              <div className=" flex_row_space_between">
                <label className="header_table">
                  {translate(localeJson, "name_kanji")}
                </label>
              </div>
              <div className="body_table">{person.name}</div>
            </div>
            <div className=" mt-3">
              <div className=" flex_row_space_between">
                <label className="header_table">
                  {translate(localeJson, "c_refugee_name")}
                </label>
              </div>
              <div className="body_table">{person.refugee_name}</div>
            </div>

            <div className=" mt-3">
              <div className=" flex_row_space_between">
                <label className="header_table">
                  {translate(localeJson, "c_dob")}
                </label>
              </div>
              <div className="body_table">{person.dob}</div>
            </div>
            <div className=" mt-3">
              <div className=" flex_row_space_between">
                <label className="header_table">
                  {translate(localeJson, "phone_number")}
                </label>
              </div>
              <div className=" mt-1 body_table" id="phone-number">
                {person.tel || "-"}
              </div>
            </div>
            <div className=" mt-3">
              <div className=" flex_row_space_between">
                <label className="header_table">
                  {translate(localeJson, "c_age")}
                </label>
              </div>
              <div className="body_table">{person.age}</div>
            </div>
            <div className=" mt-3">
              <div className=" flex_row_space_between">
                <label className="header_table">
                  {translate(localeJson, "age_m")}
                </label>
              </div>
              <div className="body_table">{person.age_month}</div>
            </div>

            <div className=" mt-3">
              <div className=" flex_row_space_between">
                <label className="header_table">
                  {translate(localeJson, "c_gender")}
                </label>
              </div>
              <div className="body_table">{person.gender}</div>
            </div>
          </div>
          {showDetails &&
            <PersonQuestions questions={person.orders} />
          }
          <div className=" flex justify-content-center align-items-center text-custom-color font-bold">
            <div
              onClick={() => toggleDetails()}
              className="cursor-pointer flex align-items-center"
            >
              <i
                className={`pi mr-2 font-bold ${showDetails ? "pi-chevron-up" : "pi-chevron-down"
                  }`}
              ></i>

              {showDetails ? translate(localeJson, "see_details")
                : translate(localeJson, "see_details")}
            </div>
          </div>
          {/* Add other details as needed */}

        </div>
      </div>
    );
  };

  const PersonQuestions = ({ questions }) => {
    const result = questions.map((questionSet, setIndex) => {
      return (
        <div key={setIndex} className="mt-3">
          {Object.keys(questionSet).map((key, index) => {
            // Assuming each key is in the format "question_N_title"
            const match = key.match(/^question_(\d+)_title$/);

            if (match) {
              const questionNumber = match[1];
              const questionTitle = questionSet[key];
              const answerKey = `question_${questionNumber}`;
              const answer = questionSet[answerKey];

              return (
                <div key={index} className="mt-3">
                  <div className="flex_row_space_between">
                    <label className="header_table">{questionTitle}</label>
                  </div>
                  <div className="mt-1 body_table" id="date-create">
                    {answer || "-"}
                  </div>
                </div>
              );
            }
            return null; // Skip non-question keys
          })}
        </div>
      );
    });
    return (
      <div>
        {questions.map((question, index) => (
          <div key={index}>
            <div className="">
              <div className=" mt-3">
                <div className=" flex_row_space_between">
                  <label className="header_table">
                    {translate(localeJson, "c_address")}
                  </label>
                </div>
                <div className="body_table">{question.address}</div>
              </div>
              <div className=" mt-3">
                <div className=" flex_row_space_between">
                  <label className="header_table">
                    {translate(localeJson, "c_special_care_type")}
                  </label>
                </div>
                <div className="body_table">{question.special_care_name}</div>
              </div>
              <div className=" mt-3 hidden">
                <div className=" flex_row_space_between">
                  <label className="header_table">
                    {translate(localeJson, "c_connecting_code")}
                  </label>
                </div>
                <div className="body_table">{question.connecting_code}</div>
              </div>

              <div className=" mt-3">
                <div className=" flex_row_space_between">
                  <label className="header_table">
                    {translate(localeJson, "c_remarks")}
                  </label>
                </div>
                <div className="body_table">{question.remarks}</div>
              </div>
            </div>
          </div>
        ))}
        <div className=" mt-3">
          {result}
        </div>
      </div>
    );
  };

  const MasterQuestions = ({ questions }) => {
    return (
      <div>
        {questions?.map((question, index) => (
          <div key={index}>
            {(() => {
              const result = [];
              for (let i = 0; i < Object.keys(question).length / 2; i++) {
                const questionKey = `question_${i}`;
                const titleKey = `question_${i}_title`;

                const questionValue =
                  question[questionKey] || "-";
                const titleValue = question[titleKey] || "";

                result.push(
                  <div className="" key={i}>
                    <div className=" mt-3">
                      <div className=" flex_row_space_between">
                        <label className="header_table">{titleValue}</label>
                      </div>
                      <div className=" mt-1 body_table" id="date-create">
                        {questionValue}
                      </div>
                    </div>
                  </div>
                );
              }
              return result;
            })()}
          </div>
        ))}
      </div>
    );
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleMouseOver = () => {
    setShowPassword(true);
  };

  const handleMouseLeave = () => {
    setShowPassword(false);
  };

      const handleRegister = () => {
        // Clone the confirmData object to avoid direct mutation
    const data = JSON.parse(JSON.stringify(confirmData));
    
    const duplicatePersonIds = duplicatePersons.map(person => person.id);
    // Assuming `data.persons` is the array that holds the person data
    // and `duplicatePersonIds` holds the IDs of persons to be removed
    const filteredPersons = data.person.filter(person => 
             !duplicatePersonIds.includes(person.id)
    );
    
    // Now update the data with the filtered persons
    data.person = filteredPersons;
    confirmData = data;
    setDialogVisible(false);
    registerUsers();
    };
    
    function registerUsers() {
    // Parse the JSON data
    const data = JSON.parse(JSON.stringify(confirmData));
    // Remove "title" and "title_en" fields from each "question" object
    // Function to remove "title" and "title_en" fields
    
    const isOwnerId = data.is_owner; // Get the current `is_owner` value
    const personArray = data.person; // Assuming this refers to the person array in your case
    
    // Function to show a toast error (assumed you have a toast system)
    
    
    // Find if there is a match for `is_owner` in the person array
    const matchingPerson = personArray.find(person => person.id === isOwnerId);
    
    if (!matchingPerson) {
    // No match found, update `is_owner` to the first person's id (or your desired logic)
    data.is_owner = personArray[0].id;
    }
    const removeTitles = (questions) => {
      questions?.forEach((question) => {
        delete question.title;
        delete question.title_en;
      });
    };
    // Remove "title" and "title_en" fields from each "question" object in "person" array
    data.person.forEach((person) => {
    
    
      removeTitles(person.question);
    
      delete person.specialCareName;
      delete person.specialCareName2;
      if(!person.dob) {
        person['dob'] = "1900/01/01";
        person['age'] = "124";
        person['month'] = "6";
      }
    });
    
    
    removeTitles(data.master_question);
    
    // Convert the modified data back to JSON
    const modifiedJson = data;
    
    console.log(modifiedJson);
    setLoader(true);
    tempRegister(modifiedJson, (res) => {
      if (res) {
        if(res?.data?.duplicatePersons)
          {
            setLoader(false)
            setDuplicatePersons(res?.data?.duplicatePersons);
            setTimeout(() => {
              setDialogVisible(true);
            }, 1000);
            return;
          }
        dispatch(setSuccessData(res));
        dispatch(setSuccessData({ placeId: registerReducer?.placeId }))
        localStorage.setItem("tempDataDeleted","false");
        localStorage.setItem("isSuccess","true");
        localStorage.setItem('deletedFromStaff',"false");
        localStorage.setItem("showDelete","false");
        localStorage.setItem('refreshing', "false");
        localStorage.setItem("familyCode",null);
        setLoader(false);
        router.push("/user/temp-register/success");
      } else {
        setLoader(false);
      }
    });
    }

  return (
    <> 
    <RegisterConfirmDialog
    visible={isDialogVisible}
    setVisible={setDialogVisible}
    duplicatePersons={duplicatePersons} // Data passed to child
    register={handleRegister} // Function passed to child
    return={() => 
      {
        setDialogVisible(false)
        router.push("/user/temp-register")
  
      }}
    confirmData={registerReducer?.registerData}
/>
    <div className="grid justify-content-center bg-white">
      <div className="col-12  sm:col-12 md:col-10 lg:col-12 xl:col-12 xlScreenMaxWidth mdScreenMaxWidth">
        <div className="card bg-white h-full">
          <div className="flex justify-content-start font-bold text-5xl">
            {translate(localeJson, "reg_confirm")}
          </div>
          <div className="mb-3 mt-3">
            <CustomHeader
              header={translate(localeJson, "house_hold_information")}
              headerClass={"page-header2"}
            />
          </div>
          <div>
            <div className="block">
              <div className="reg_tbl">
                <div className=" mt-3">
                  <div className=" flex_row_space_between">
                    <label className="header_table">
                      {translate(localeJson, "rep_kanji")}
                    </label>
                  </div>
                  <div className=" mt-1 body_table" id="address">
                    {basicFamilyDetail[0]?.rep_kanji}
                  </div>
                </div>
                <div className=" mt-3">
                  <div className=" flex_row_space_between">
                    <label className="header_table">
                      {translate(localeJson, "rep_furigana")}
                    </label>
                  </div>
                  <div className=" mt-1 body_table" id="address">
                    {basicFamilyDetail[0]?.rep_furigana}
                  </div>
                </div>
                <div className=" mt-3">
                  <div className=" flex_row_space_between">
                    <label className="header_table">
                      {translate(localeJson, "c_address")}
                    </label>
                  </div>
                  <div className=" mt-1 body_table" id="address">
                    {basicFamilyDetail[0]?.address}
                  </div>
                </div>
                <div className=" mt-3">
                  <div className=" flex_row_space_between">
                    <label className="header_table">
                      {translate(localeJson, "phone_number")}
                    </label>
                  </div>
                  <div className=" mt-1 body_table" id="phone-number">
                    {basicFamilyDetail[0]?.tel}
                  </div>
                </div>
                <div className="mt-3 hidden">
                  <div className=" flex_row_space_between">
                    <label className="header_table">
                      {translate(localeJson, "password")}
                    </label>
                  </div>
                  {basicFamilyDetail[0]?.password ? (
                    <div
                      className="body_table"
                      onMouseOver={handleMouseOver}
                      onMouseLeave={handleMouseLeave}
                    >
                      {showPassword ? (
                        <span> {basicFamilyDetail[0]?.password}</span>
                      ) : (
                        <span>****</span>
                      )}
                    </div>
                  ) :
                    <div
                      className="body_table"
                    >
                      <span>-</span>
                    </div>}
                </div>
              </div>
            </div>
          </div>
          <div className="household-register">
            <div className="mb-3">
              <CustomHeader
                header={translate(localeJson, "evacuee")}
                headerClass={"page-header2"}
              />
            </div>
            <div className="block">
              {familyDetailData?.map((person, index) => (
                <PersonCard key={index} person={person} />
              ))}
            </div>
          </div>
          <div className="household-register">
            <div className="mb-3">
              <CustomHeader
                header={translate(localeJson, "evacuee_damage_info")}
                headerClass={"page-header2"}
              />
            </div>
            <div className="block">
              <MasterQuestions questions={neighbourData} />
              <div className="mb-3 mt-3">
                <CustomHeader
                  headerClass={"page-header1"}
                  header={translate(localeJson, "individual_agree_note")}
                />
              </div>
              <div className=" mt-3">
                <div className=" flex_row_space_between">
                  <label htmlFor="evacuation_place" className='pb-1 font-bold block'>
                    {translate(localeJson, 'agree_label')}
                  </label>
                </div>
                <div className=" mt-1 body_table" id="phone-number">
                  {confirmData?.is_public == 0 ? translate(localeJson, 'agree') : translate(localeJson, 'disagree')}
                </div>
              </div>
              <div className=" mt-3">
                <div className=" flex_row_space_between">
                  <label htmlFor="evacuation_place" className='pb-1 font-bold block'>
                    {translate(localeJson, 'publish_label')}
                  </label>
                </div>
                <div className=" mt-1 body_table" id="phone-number">
                  {confirmData.public_info == 0 ? translate(localeJson, 'to_publish') : translate(localeJson, 'not_to_publish')}
                </div>
              </div>
            </div>
          </div>
          <div className="pt-5 text-center">
            <Button
              buttonProps={{
                rounded: true,
                buttonClass: "w-10rem primary-button",
                type: "submit",
                text: translate(localeJson, "update"),
                severity: "primary",
                onClick: () => {
                  registerUsers();
                },
              }}
              parentClass="block w-full  mb-3 primary-button"
            />
            <Button
              buttonProps={{
                rounded: true,
                buttonClass: "w-10rem back-button",
                text: translate(localeJson, "return"),
                onClick: () => {
                  router.push("/user/temp-edit");
                },
              }}
              parentClass="block w-full back-button"
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default TempRegisterConfirm;
