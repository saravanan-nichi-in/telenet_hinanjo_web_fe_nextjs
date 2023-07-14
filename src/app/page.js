"use client";

import "./globals.css";
import TelnetLogo from "../../public/telnetLogo.svg";
import PtalkLogo from "../../public/ptalk-logo.svg";
import Image from "next/image";
import Linker from "../components/Link/linker";
import { IoEyeOff, IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Noto_Sans_JP } from "next/font/google";
import { useState } from "react";
import * as Yup from "yup";
import intl from "@/utils/locales/jp/jp.json";
import { EMAIL_PATTERN, PASSWORD_LENGTH_PATTERN } from "@/validation/validationPattern";
import { validateHandler } from "@/validation/helperFunction";
import { useRouter } from "next/navigation";

const natoSans = Noto_Sans_JP({ subsets: ["latin"] });

// Yup schema to validate the form
const schema = Yup.object().shape({
  email: Yup.string()
            .required(intl.validation_required)
            .matches(EMAIL_PATTERN.regex, EMAIL_PATTERN.message),
  password: Yup.string()
            .required(intl.validation_required)
            .matches(PASSWORD_LENGTH_PATTERN.regex,PASSWORD_LENGTH_PATTERN.message),
});

export default function Login() {
  const routerPath = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = async(event) => {
    const { name, value } = event.target;
    const formValues = { email, password };

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }

    await setTouched({ ...touched, [name]: true });
    await validateHandler(schema,formValues,setErrors);
  };

  

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formValues = { email, password };
    await validateHandler(schema,formValues,setErrors);
    const urlOrPath = `/dashboard`;
    window.location.href= urlOrPath;
  };

  let [type, setType] = useState('password');
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </head>
      <body className={`${natoSans.className} `} style={natoSans.style}>
      <div className="container portrait:h-screen lg:landscape:h-screen mx-auto p-4 my-auto  w-full flex items-center">
          <div className="flex flex-col-reverse md:flex-row w-full min-h-max  md:max-w-[1044px] lg:mx-auto  gap-y-12">
            <div className="md:w-1/2 flex justify-center items-center">
              <Image
                src={TelnetLogo}
                width={200}
                alt="telnet logo"
                className="hidden lg:block "
              />
              <Image
                src={TelnetLogo}
                width={100}
                alt="telnet logo"
                className="lg:hidden"
              />
            </div>

            <div className="md:w-1/2">
              <div className="flex flex-col lg:block bg-customBlue h-full rounded-[40px] px-8   lg:w-[500px] md:mx-auto lg:ml-auto">
                <div className="lg:ml-auto">
                  <Image
                    src={PtalkLogo}
                    width="200"
                    height={100}
                    className="mb-4 mx-auto py-4 lg:py-6"
                    alt="ptalk logo"
                  />
                </div>
                <div className="text-xl lg:text-2xl font-semibold text-center text-white mb-8">
                  {intl.login_btn_label}
                </div>
                <form onSubmit={handleSubmit} method="POST">
                  <div>
                    <input
                      type="email"
                      name="email" // Add the name attribute
                      className={`w-full py-2 lg:py-3 bg-auth-input text-white  placeholder-[#B8B7B7] pl-8 rounded-xl lg:rounded-2xl ${(errors?.email && touched?.email)? '' : 'mb-8'} outline-none`}
                      placeholder={intl.login_email_placeholder}
                      value={email}
                      onChange={handleChange}
                      autoComplete="off" // Add this attribute to disable autofilling
                    />
                    {errors?.email && touched?.email && <div className="mb-8 pl-1 validation-font" style={{color:"red"}}>{errors?.email}</div>}
                  </div>
                  <div className={`flex items-center ${(errors?.password && touched?.password)? '' : 'mb-4'}`}>
                    <input
                      id="password"
                      name="password" // Add the name attribute
                      type={type}
                      className="w-full pl-8 py-2 lg:py-3 bg-auth-input text-white placeholder-[#B8B7B7] rounded-xl lg:rounded-2xl outline-none"
                      placeholder={intl.login_password_placeholder}
                      value={password}
                      onChange={handleChange}
                      autoComplete={"off"} // Add this attribute to disable autofilling
                    />
                    <button
                      className="-ml-12"
                      onClick={() => { type == 'password' ? setType('text') : setType('password') }}
                    >
                      {type == 'password' ? <IoEyeOffOutline className="text-2xl text-[#A3A3A3]" /> : <IoEyeOutline className="text-2xl text-[#A3A3A3]" />}
                    </button>
                  </div>
                  {errors?.password && touched?.password && <div className="mb-4 pl-1 validation-font" style={{color:"red"}}>{errors?.password}</div>}
                  <div className="flex justify-end mb-9 lg:mb-16">
                    <Linker
                      text={intl.forgot_screen_label}
                      fontSize="text-xs lg:text-base"
                      href="/forgot"
                    />
                  </div>
                  <div className="mb-8 lg:mb-12">
                    <button
                      type="submit"
                      className=" bg-white border border-gray-300 focus:outline-none  font-medium rounded-2xl px-5 py-1 lg:py-2 mr-2 mb-2 text-auth-button-text text-xl w-full"
                    >
                      {intl.login_btn_label}
                    </button>
                  </div>
                </form>
                <div className="flex justify-center gap-x-8 lg:gap-x-16  pb-4  mb-2 mt-auto">
                  <Linker
                    text={intl.login_terms_of_service}
                    fontSize="text-xs lg:text-base"
                    href="#"
                    color="text-link"
                  />
                  <Linker
                    text={intl.login_privacy_policy}
                    fontSize="text-xs lg:text-base"
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
