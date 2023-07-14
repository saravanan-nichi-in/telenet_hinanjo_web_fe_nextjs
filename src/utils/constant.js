import intl from "../utils/locales/jp/jp.json";

export const EXAMPLE_SAGA_INCREMENT =
  "src/utils/constants/EXAMPLE_SAGA_INCREMENT";
export const SAMPLE_IMAGE =
  "https://pixabay.com/get/gc5bf8ed3d730532e5d23da537d51fdb73498c423df50c2f630c1bec5b66dc0cfa0c265a13b7c087fa1aec894394d5e67d4fe311210840fff2684de9ce4da4290_1280.png";
export const columns = [
  {
    title: "Name",
    dataIndex: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Age",
    dataIndex: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
];

export const tableDefaultPageSizeOption = [
  {
    value: 10,
    label: "10",
  },
  {
    value: 20,
    label: "20",
  },
  {
    value: 30,
    label: "30",
  },
  {
    value: 40,
    label: "40",
  },
  {
    value: 50,
    label: "50",
  },
];
export const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
  },
  {
    key: "4",
    name: "Disabled User",
    age: 99,
    address: "Sydney No. 1 Lake Park",
    disabled: true,
  },
  {
    key: "5",
    name: "Disabled User",
    age: 99,
    address: "Sydney No. 1 Lake Park",
    disabled: true,
  },
  {
    key: "6",
    name: "Disabled User",
    age: 99,
    address: "Sydney No. 1 Lake Park",
    disabled: true,
  },
  {
    key: "7",
    name: "Disabled User",
    age: 99,
    address: "Sydney No. 1 Lake Park",
  },
  {
    key: "8",
    name: "Disabled User",
    age: 99,
    address: "Sydney No. 1 Lake Park",
  }
];

export const sidebarSubLinks = [
  {
    title: "ユーザーの詳細",
    link: "/user/details",
  },
  {
    title: "サウンド・通知",
    link: "/user/sound-settings",
  },
  {
    title: "ワンタッチPTT",
    link: "/user/quick-ptt",
  },
  {
    title: "PTALKの利用",
    link: "/user/ptalk-service",
  },
  {
    title: "画面の設定",
    link: "/user/display-settings",
  },
  {
    title: "PTTボタンの設定",
    link: "/user/ptt-button-settings",
  },
  {
    title: "音声録音",
    link: "/user/voice-recording",
  },
  {
    title: "SOS",
    link: "/user/sos",
  },
  {
    title: "通信環境エラー音 ",
    link: "/user/network-failure-alarm",
  },
  {
    title: "PTTブースター",
    link: "/user/ptt-booster",
  },
  {
    title: "低品質の設定",
    link: "/user/band-settings",
  },
  {
    title: "リモートワイプ",
    link: "/user/remote-wipe",
  },
  {
    title: "ログを見る",
    link: "/user/view-log",
  },
];

/** SA-8A Table */
export const helpSettingsData = [
  {
    key: "1",
    section: "グループ",
    numberOfSubsections: 4,
  },
  {
    key: "2",
    section: "連絡先",
    numberOfSubsections: 5,
  },
  {
    key: "3",
    section: "PTTコール",
    numberOfSubsections: 5,
  },
  {
    key: "4",
    section: "お気に入り",
    numberOfSubsections: 3,
  },
  {
    key: "5",
    section: "設定",
    numberOfSubsections: 2,
  },
];

/**Company Links */
export const companyAddLinks = [
  { title: intl.company_details_company_management, link: "/company/list" },
  { title: intl.company_details_company_add, link: "/company/add" },
];

export const companyDetailLinks = [
  { title: intl.company_details_company_management, link: "/company/list" },
  { title: intl.company_details_company_details, link: "/company/details" },
];

export const companyEditLinks = [
  { title: "会社管理", link: "/company/list" },
  { title: "会社の詳細", link: "/company/details" },
  { title: "編集", link: "#" },
];

export const breadUserCrumbLinks = [
  { title: "ユーザー情報", link: "/user" },
  { title: "ユーザーの追加", link: "/user" },
];

/** SA-3A data*/
export const customerData = [
  {
    key: "1",
    radioNumber: "Company name",
    numberOfRadioNumber: "25",
    mangerId: "Cmpy@gmail.com",
    agencyName: "Agencyname",
    status: "1",
  },
  {
    key: "2",
    radioNumber: "Company name",
    numberOfRadioNumber: "20",
    mangerId: "Cmpy@gmail.com",
    agencyName: "Agencyname2",
    status: "2",
  },
  {
    key: "3",
    radioNumber: "Company name",
    numberOfRadioNumber: "20",
    mangerId: "Cmpy@gmail.com",
    agencyName: "Agencyname2",
    status: "2",
  },
  {
    key: "4",
    radioNumber: "Company name",
    numberOfRadioNumber: "20",
    mangerId: "Cmpy@gmail.com",
    agencyName: "Agencyname2",
    status: "2",
  },
  {
    key: "5",
    radioNumber: "Company name",
    numberOfRadioNumber: "20",
    mangerId: "Cmpy@gmail.com",
    agencyName: "Agencyname2",
    status: "1",
  },
  {
    key: "6",
    radioNumber: "Company name",
    numberOfRadioNumber: "20",
    mangerId: "Cmpy@gmail.com",
    agencyName: "Agencyname2",
    status: "2",
  },
];

export const fileName = "C:/Users/Public/Downloads";

/**SA-6A data */
export const groupData = [
  {
    key: "1",
    radioNumber: "000*000*0000",
    groupName: "#グルプ名 1",
    numberOfContacts: "5 人",
  },
  {
    key: "2",
    radioNumber: "000*000*0002",
    groupName: "#グルプ名 2",
    numberOfContacts: "2 人",
  },
  {
    key: "3",
    radioNumber: "000*000*0003",
    groupName: "#グルプ名 3",
    numberOfContacts: "2 人",
  },
  {
    key: "4",
    radioNumber: "000*000*0004",
    groupName: "#グルプ名 4",
    numberOfContacts: "5 人",
  },
  {
    key: "5",
    radioNumber: "000*000*0005",
    groupName: "#グルプ名 5",
    numberOfContacts: "5 人",
  },
  {
    key: "6",
    radioNumber: "000*000*0005",
    groupName: "#グルプ名 6",
    numberOfContacts: "6 人",
  },
  {
    key: "7",
    radioNumber: "000*000*0005",
    groupName: "#グルプ名 7",
    numberOfContacts: "7 人",
  }
];

/**SA-7A data */
export const contactData = [
  {
    key: "1",
    radioNumber: "000*000*0000",
    contactName: "#グルプ名 1",
  },
  {
    key: "2",
    radioNumber: "000*000*0002",
    contactName: "#グルプ名 2",
  },
  {
    key: "3",
    radioNumber: "000*000*0003",
    contactName: "#グルプ名 3",
  },
  {
    key: "4",
    radioNumber: "000*000*0004",
    contactName: "#グルプ名 4",
  },
  {
    key: "5",
    radioNumber: "000*000*0005",
    contactName: "#グルプ名 5",
  },
  {
    key: "6",
    radioNumber: "000*000*0006",
    contactName: "#グルプ名 6",
  },
  {
    key: "7",
    radioNumber: "000*000*0007",
    contactName: "#グルプ名 7",
  },
];

export const userSearchResult = [
  {
    key: "1",
    radioNumber: "Company name",
    numberOfRadioNumber: "25",
    mangerId: "Cmpy@gmail.com",
    agencyName: "Agencyname",
    status: "1",
    deviceStatus: "0",
  },
  {
    key: "2",
    radioNumber: "Company name",
    numberOfRadioNumber: "20",
    mangerId: "Cmpy@gmail.com",
    agencyName: "Agencyname2",
    status: "2",
    deviceStatus: "2",
  },
  {
    key: "3",
    radioNumber: "Company name",
    numberOfRadioNumber: "20",
    mangerId: "Cmpy@gmail.com",
    agencyName: "Agencyname2",
    status: "2",
    deviceStatus: "1",
  },
  {
    key: "4",
    radioNumber: "Company name",
    numberOfRadioNumber: "20",
    mangerId: "Cmpy@gmail.com",
    agencyName: "Agencyname2",
    status: "2",
    deviceStatus: "1",
  },
  {
    key: "5",
    radioNumber: "Company name",
    numberOfRadioNumber: "20",
    mangerId: "Cmpy@gmail.com",
    agencyName: "Agencyname2",
    status: "1",
    deviceStatus: "0",
  },
  {
    key: "6",
    radioNumber: "Company name",
    numberOfRadioNumber: "20",
    mangerId: "Cmpy@gmail.com",
    agencyName: "Agencyname2",
    status: "2",
    deviceStatus: "1",
  },
];

export const companySearchResult = [
  {
    companyName: "Comany name solutions Pvt Ltd",
    link: "#",
  },
  {
    companyName: "Comany name Pvt Ltd",
    link: "#",
  },
  {
    companyName: "Comany name solutions Pvt Ltd",
    link: "#",
  },
  {
    companyName: "Comany name Pvt Ltd",
    link: "#",
  },
  {
    companyName: "Comany name solutions Pvt Ltd",
    link: "#",
  },
  {
    companyName: "Comany name Pvt Ltd",
    link: "#",
  },
];

export const groupMember = [
  { id:1, name:"000*000*00011" },
  { id:2, name:"000*000*00012" },
  { id:3, name:"000*000*00013" },
  { id:4, name:"000*000*00014" },
  { id:5, name:"000*000*00015" },
  { id:6, name:"000*000*00016" },
  { id:7, name:"000*000*00017" },
  { id:8, name:"000*000*00018" },
  { id:9, name:"000*000*00019" },
  { id:10, name:"000*000*00020" },
  { id:11, name:"000*000*00021" },
  { id:12, name:"000*000*00022" },
  { id:13, name:"000*000*00023" },
  { id:14, name:"000*000*00024" },
  { id:15, name:"000*000*00025" },
];

export const logTable =[
  {
    "Date": "2023-06-06",
    "Time": "12:15:42,764",
    "Level": "FATAL",
    "Class": {
      "className": "MyClass",
      "classId": "25"
    },
    "Message": "-Fatal message"
  },
  {
    "Date": "2023-06-06",
    "Time": "12:15:42,764",
    "Level": "ERROR",
    "Class": {
      "className": "MyClass",
      "classId": "24"
    },
    "Message": "-Error message"
  },
  {
    "Date": "2023-06-06",
    "Time": "12:15:42,764",
    "Level": "WARN",
    "Class": {
      "className": "MyOtherClass",
      "classId": "62"
    },
    "Message": "-Warn message"
  },
  {
    "Date": "2023-06-06",
    "Time": "12:15:42,764",
    "Level": "INFO",
    "Class": {
      "className": "MyYetAnotherClass",
      "classId": "114"
    },
    "Message": "-Info message"
  },
  {
    "Date": "2023-06-06",
    "Time": "12:15:42,764",
    "Level": "DEBUG",
    "Class": {
      "className": "MyClass",
      "classId": "27"
    },
    "Message": "-Debug"
  }
]
