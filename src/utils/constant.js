const profiles = [
    {
        profile: 'admin',
        email: 'admin@gmail.com',
        password: 'admin@123'
    },
    {
        profile: 'staff',
        email: 'staff@gmail.com',
        password: 'staff@123'
    },
];

const evacuationStatusOptions = [
    {name:"Vacant Test", code:"VT"},
    {name:"Starting To get Crowded", code:"SGT"},
    {name:"InActiveClosedDateNotPresent", code:"ICDP"},
    {name:"Crowded", code:"CD"},
    {name:"Closed", code:"CLD"},
    {name:"Nara", code:"NR"}
];

const evacuationTableColumns = [
    { field: 'ID', header: 'ID', minWidth: "8rem", sortable: true, textAlign: 'center' },
    { field: '世帯人数', header: '世帯人数', minWidth: "15rem", sortable: true, textAlign: 'center' },
    { field: '世帯番号', header: '世帯番号', minWidth: "8rem", sortable: true, textAlign: 'center' },
    { field: '代表者', header: '代表者', minWidth: "12rem", sortable: true, textAlign: 'center' },
    { field: '氏名 (フリガナ)', header: '避難所名 (フリガナ)', minWidth: "12rem", sortable: true, textAlign: 'center' },
    { field: "氏名 (漢字)", header: "氏名 (漢字)", minWidth: "10rem", sortable: true, textAlign: 'center' },
    { field: "性別", header: "性別", minWidth: "10rem", sortable: true, textAlign: 'center' },
    { field: "生年月日", header: "生年月日", minWidth: "10rem", sortable: true, textAlign: 'center' },
    { field: "年齢", header: "年齢", minWidth: "8rem", sortable: true, textAlign: 'center' },
    { field: "年齢_月", header: "年齢_月", minWidth: "8rem", sortable: true, textAlign: 'center' },
    { field: "要配慮者番号", header: "要配慮者番号", minWidth: "10rem", sortable: true, textAlign: 'center' },
    { field: "紐付コード", header: "紐付コード", minWidth: "8rem", sortable: true, textAlign: 'center' },
    { field: "備考", header: "備考", minWidth: "7rem", sortable: true, textAlign: 'center' },
    { field: "避難所", header: "避難所", minWidth: "15rem", sortable: true, textAlign: 'center' },
    { field: "退所日時", header: "退所日時", minWidth: "15rem", sortable: true, textAlign: 'center' },
    { field: "現在の滞在場所", header: "現在の滞在場所", minWidth: "10rem", textAlign: 'center' },

];

const suppliesShortageData = [
    { "避難所": "Vacant Test", "Test1(2)": "505", "Test2(2)": "3"},
    { "避難所": "Starting to get Crowded", "Test1(2)": "201", "Test2(2)": "16" },
    { "避難所": "crowded", "Test1(2)": "2999993", "Test2(2)": "6" },
    { "避難所": "避難所B", "Test1(2)": "980766", "Test2(2)": "1"},
    { "避難所": "Nara", "Test1(2)": "3981574", "Test2(2)": "33"}
];

const suppliesShortageHeaderColumn = [
    { field: '避難所', header: '避難所', minWidth: '20rem' },
    { field: 'Test1(2)', header: 'Test1(2)', minWidth: '12rem' },
    { field: 'Test2(2)', header: 'Test2(2)', minWidth: '12rem' }
];

const historyPageCities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
];

const historyTableColumns = [
    { field: 'Sl No', header: 'No', minWidth: "8rem", sortable: true, textAlign: 'center' },
    { field: '報告日時', header: '報告日時', minWidth: "15rem", sortable: true },
    { field: '地区', header: '地区', minWidth: "6rem", sortable: true },
    { field: '避難所名', header: '避難所名', minWidth: "12rem", sortable: true },
    { field: '避難所名 (フリガナ)', header: '避難所名 (フリガナ)', minWidth: "12rem", sortable: true },
    { field: "所在地（経度）", header: "所在地（経度）", minWidth: "10rem", sortable: true },
    { field: "所在地（緯度）", header: "所在地（緯度）", minWidth: "10rem", sortable: true },
    { field: "所在地（経度1）", header: "所在地（経度）", minWidth: "10rem", sortable: true },
    { field: "外部公開", header: "外部公開", minWidth: "8rem", sortable: true },
    { field: "開設状況", header: "開設状況", minWidth: "8rem", sortable: true },
    { field: "避難者数", header: "避難者数", minWidth: "7rem", sortable: true },
    { field: "満空状況", header: "満空状況", minWidth: "7rem", sortable: true },
    { field: "開設日時", header: "開設日時", minWidth: "15rem", sortable: true },
    { field: "閉鎖日時", header: "閉鎖日時", minWidth: "15rem", sortable: true },
    { field: "備考", header: "備考", minWidth: "5rem" }
];

const dashboardTableColumns = [
    { field: '番号', header: '番号', minWidth: '6rem', headerClassName: "custom-header", sortable: true, textAlign: 'center' },
    { field: '避難所', header: '避難所', minWidth: '20rem', sortable: true, headerClassName: "custom-header" },
    { field: '避難可能人数', header: '避難可能人数', sortable: true, minWidth: '9rem', headerClassName: "custom-header" },
    { field: '現在の避難者数', header: '現在の避難者数', sortable: true, minWidth: '10rem', headerClassName: "custom-header" },
    { field: '避難者数', header: '避難者数', minWidth: '7rem', sortable: true, headerClassName: "custom-header" },
    { field: '避難中の世帯数', header: '避難中の世帯数', minWidth: '10rem', sortable: true, headerClassName: "custom-header" },
    { field: '個人情報なしの避難者数', header: '個人情報なしの避難者数', minWidth: '15rem', sortable: true, headerClassName: "custom-header" },
    { field: '男', header: '男', minWidth: '5rem', sortable: true, headerClassName: "custom-header" }
];

export {
    profiles, evacuationStatusOptions, evacuationTableColumns, suppliesShortageData, suppliesShortageHeaderColumn,
    historyTableColumns, historyPageCities, dashboardTableColumns
}