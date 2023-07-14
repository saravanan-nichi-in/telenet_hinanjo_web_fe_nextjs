"use client";

import "@/app/globals.css";
import TelnetLogo from "../../../public/telnetLogo.svg";
import PtalkLogo from "../../../public/ptalk-logo.svg";
import Image from "next/image";
import Linker from "@/components/Link/linker";
import { Noto_Sans_JP } from "next/font/google";
import { useState } from "react";
import * as Yup from "yup";
import intl from "@/utils/locales/jp/jp.json";
import { EMAIL_PATTERN, MAX_50_LENGTH_PATTERN } from "@/validation/validationPattern";
import { validateHandler } from "@/validation/helperFunction";

const natoSans = Noto_Sans_JP({ subsets: ["latin"] });

// Yup schema to validate the form
const schema = Yup.object().shape({
  email: Yup.string()
            .required(intl.validation_required)
            .matches(EMAIL_PATTERN.regex, EMAIL_PATTERN.message)
            .matches(MAX_50_LENGTH_PATTERN.regex,MAX_50_LENGTH_PATTERN.message),
});

export default function Reset() {

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = async(event) => {
    const { name, value } = event.target;
    const formValues = { email };

    if (name === "email") {
      setEmail(value);
    }

    await setTouched({ ...touched, [name]: true });
    await validateHandler(schema,formValues,setErrors);
  };

  

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formValues = { email };
    await validateHandler(schema,formValues,setErrors);
    
  };

  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </head>
      <body className={natoSans.className} style={natoSans.style}>
        <div className="container portrait:h-screen lg:landscape:h-screen mx-auto p-4 my-auto  w-full flex items-center">
          <div className="flex flex-col-reverse md:flex-row w-full min-h-max  md:max-w-[1044px] lg:mx-auto  gap-y-12">
            <div className="md:w-1/2 flex justify-center items-center">
              <Image
                src={TelnetLogo}
                width={200}
                alt="telnet logo"
                className="hidden md:block"
              />
              <Image
                src={TelnetLogo}
                width={100}
                alt="telnet logo"
                className="md:hidden"
              />
            </div>

            <div className="md:w-1/2">
              <div className="flex flex-col lg:block bg-customBlue h-full rounded-[40px] px-8   lg:w-[500px] md:mx-auto lg:ml-auto">
                <div className="md:mb-16">
                  <div className="ml-auto">
                    <Image
                      src={PtalkLogo}
                      width="200"
                      height={179}
                      className="mb-4 mx-auto py-4 md:py-6"
                      alt="ptalk logo"
                    />
                  </div>
                  <div className="text-xl md:text-2xl font-semibold text-center text-white mb-8">
                    {intl.login_forget_password_text}
                  </div>
                  <div className='md:mb-10'>
                    <input
                      type="email"
                      name="email" // Add the name attribute
                      value={email}
                      className={`w-full py-2 md:py-3 bg-[#0C4278] text-white placeholder-[#B8B7B7] pl-8 rounded-xl md:rounded-2xl ${(errors?.email && touched?.email)? '' : 'mb-16'} outline-none`}
                      placeholder={intl.login_email_placeholder}
                      onChange={handleChange}
                      autoComplete="off" // Add this attribute to disable autofilling
                    />
                    {errors?.email && touched?.email && <div className="mb-16 md:mb-16 pl-1 validation-font" style={{color:"red"}}>{errors?.email}</div>}
                  </div>

                  <div className="mb-8 md:mb-12">
                    <button
                      type="button"
                      className=" bg-white border border-gray-300 focus:outline-none font-medium rounded-xl md:rounded-2xl px-5 py-1 md:py-2 mr-2 mb-2 text-[#326394] text-xl w-full "
                    >
                     {intl.reset_submit_btn}
                    </button>
                  </div>
                </div>
                <div className="flex justify-center gap-x-8 md:gap-x-16  pb-4 md:pb-8 mb-2 mt-auto lg:mt-0 lg:pt-auto">
                  <Linker
                    text={intl.login_terms_of_service}
                    fontSize="text-xs md:text-base"
                    href="#"
                    color="text-link"
                  />
                  <Linker
                    text={intl.login_privacy_policy}
                    fontSize="text-xs md:text-base"
                    href="#"
                    color="text-link"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
