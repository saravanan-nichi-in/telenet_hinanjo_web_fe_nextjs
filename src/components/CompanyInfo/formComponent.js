import React, { useState } from "react";
import TextPlain from "../Input/textPlain";
import TextareaMedium from "../Input/textareaMedium";
import IconLeftBtn from "../Button/iconLeftBtn";
import * as Yup from "yup";
import intl from "../../utils/locales/jp/jp.json";
import { MAX_50_LENGTH_PATTERN, EMAIL_PATTERN } from "../../validation/validationPattern";
import { validateHandler } from "../../validation/helperFunction";

// Yup schema to validate the form
const schema = Yup.object().shape({
  companyName: Yup.string()
            .required(intl.validation_required)
            .matches(MAX_50_LENGTH_PATTERN.regex, MAX_50_LENGTH_PATTERN.message),
  mailId: Yup.string()
            .required(intl.validation_required)
            .matches(EMAIL_PATTERN.regex,EMAIL_PATTERN.message)
            .matches(MAX_50_LENGTH_PATTERN.regex, MAX_50_LENGTH_PATTERN.message),
  address: Yup.string()
            .required(intl.validation_required)
            .matches(MAX_50_LENGTH_PATTERN.regex, MAX_50_LENGTH_PATTERN.message),
  userCount: Yup.string()
            .required(intl.validation_required)
            .matches(MAX_50_LENGTH_PATTERN.regex, MAX_50_LENGTH_PATTERN.message),
  salesChannel:Yup.string(),
  description: Yup.string(),
});

const CompanyForm = (props) => {
  const {
    initialCompanyName,
    initialMailId,
    initialAddress,
    initialUserCount,
    initialSalesChannel,
    initialDescription,
    disabled,
    isForm,
    isRequired,
  } = props;

  const [companyName, setCompanyName] = useState(initialCompanyName || "");
  const [mailId, setMailId] = useState(initialMailId || "");
  const [address, setAddress] = useState(initialAddress || "");
  const [userCount, setUserCount] = useState(initialUserCount || "");
  const [salesChannel, setSalesChannel]= useState(initialSalesChannel || "");
  const [description, setDescription] = useState(initialDescription || "");
  // ---------------------- FOR VALIDATIONS ----------------------------- //
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  // ---------------------- FOR VALIDATIONS ENDS------------------------- //
  const handleChange = async(event) => {
    const { name, value } = event.target;
    const formValues = { companyName, mailId, address, userCount, salesChannel, description };
    switch (name) {
      case "companyName":
        setCompanyName(()=>value);
        break;
      case "mailId":
        setMailId(()=>value);
        break;
      case "address":
        setAddress(()=>value);
        break;
      case "userCount":
        setUserCount(()=>value);
        break;
      case "description":
        setDescription(()=>value);
        break;
      case "salesChannel":
        setSalesChannel(()=>value);
        break;
      default:
        break;
    }
    await setTouched({ ...touched, [name]: true });
    await validateHandler(schema,formValues,setErrors);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formValues = { companyName, mailId, address, userCount, description };
    await validateHandler(schema,formValues,setErrors);
    const urlOrPath = `/company/list`;
    props?.routerPath.push(urlOrPath);
  };

  return (
    <form className="grid grid-cols-1 lg:grid-cols-2 gap-y-4 gap-x-12 lg:gap-y-3 lg:gap-x-24">
      <FormField
        label={intl.form_component_company_name_label}
        id="companyName"
        placeholder={intl.form_component_company_name_label}
        value={companyName}
        onChange={handleChange}
        disabled={disabled}
        isRequired={isRequired}
        errors={errors}
        touched={touched}
      />
      <FormField
        label={intl.form_component_mailid_label}
        id="mailId"
        placeholder={intl.form_component_mailid_label}
        value={mailId}
        onChange={handleChange}
        disabled={disabled}
        isRequired={isRequired}
        errors={errors}
        touched={touched}
      />
      <FormField
        label={intl.form_component_address_label}
        id="address"
        placeholder={intl.form_component_address_label}
        isTextarea={true}
        value={address}
        onChange={handleChange}
        disabled={disabled}
        isRequired={isRequired}
        errors={errors}
        touched={touched}
      />
      <FormField
        label={intl.form_component_usercount_label}
        id="userCount"
        placeholder={intl.form_component_usercount_label}
        value={userCount}
        onChange={handleChange}
        disabled={disabled}
        isRequired={isRequired}
        errors={errors}
        touched={touched}
      />
      <FormField
        label={intl.help_settings_addition_explanation}
        id="description"
        placeholder={intl.help_settings_addition_explanation}
        isTextarea={true}
        value={description}
        onChange={handleChange}
        disabled={disabled}
        isRequired={false}
        errors={errors}
        touched={touched}
      />
      <FormField
        label="販売経路"
        id="salesChannel"
        placeholder="販売経路"
        value={salesChannel}
        onChange={handleChange}
        disabled={disabled}
        isRequired={false}
        errors={errors}
        touched={touched}
      />
      <FormField
        label="フリート番号"
        id="fleetNumber"
        placeholder="フリート番号"
        value={""}
        onChange={handleChange}
        disabled={true}
        isRequired={false}
        disabledBg={"bg-[#EAEAEA] cursor-not-allowed"}
        errors={errors}
        touched={touched}
        extraCol
      />
      {isForm && (
        <>
          <div className="flex flex-col"></div>
          <div className="flex flex-col"></div>
          <div className="flex flex-col"></div>
          <div className="flex justify-end mt-2">
            <IconLeftBtn
              text={intl.help_settings_addition_keep}
              textColor={"text-white font-semibold text-sm w-full "}
              py={"py-3.5"}
              bgColor={"bg-customBlue"}
              textBold={true}
              icon={() => {
                return null;
              }}
              onClick={(event)=>{handleSubmit(event)}}
            />
          </div>
        </>
      )}
    </form>
  );
};

const FormField = ({
  label,
  id,
  placeholder,
  isTextarea = false,
  value,
  onChange,
  disabled,
  isRequired,
  errors,
  touched,
  extraCol,
}) => {
  const FieldComponent = isTextarea ? TextareaMedium : TextPlain;

  const handleChange = (event) => {
    onChange(event);
  };

  return (
    <>
      {extraCol && <div className="flex flex-col"></div>}
      <div className="flex flex-col">
        <FieldComponent
          type="text"
          for={id}
          placeholder={placeholder}
          borderRound="rounded-xl"
          padding="p-[10px]"
          focus="focus:outline-none focus:ring-2 focus:ring-customBlue"
          border="border border-gray-300"
          bg="bg-white"
          additionalClass="block w-full pl-5 text-base pr-[30px]"
          label={label}
          labelColor="#7B7B7B"
          id={id}
          name={id}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          isRequired={isRequired}
        />
        {touched && errors && errors[id] && touched[id] && <div className="pl-1 validation-font" style={{color:"red"}}>{errors[id]}</div>}
      </div>
    </>
  );
};

export default CompanyForm;
