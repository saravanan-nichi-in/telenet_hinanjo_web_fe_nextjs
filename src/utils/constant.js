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
    { name: "Vacant Test", code: "VT" },
    { name: "Starting To get Crowded", code: "SGT" },
    { name: "InActiveClosedDateNotPresent", code: "ICDP" },
    { name: "Crowded", code: "CD" },
    { name: "Closed", code: "CLD" },
    { name: "Nara", code: "NR" }
];

const evacuationTableColumns = [
    { field: 'ID', header: 'No', sortable: false, textAlign: 'left', minWidth: "5rem" },
    { field: '世帯人数', header: '世帯人数', sortable: false, textAlign: 'left', minWidth: "7rem" },
    { field: '世帯番号', header: '世帯番号', minWidth: "8rem", sortable: false, textAlign: 'left' },
    { field: '代表者', header: '代表者', sortable: false, textAlign: 'left', minWidth: '7rem' },
    { field: '氏名 (フリガナ)', header: '氏名 (フリガナ)', minWidth: "12rem", sortable: false, textAlign: 'left' },
    { field: "氏名 (漢字)", header: "氏名 (漢字)", sortable: false, textAlign: 'left', minWidth: "8rem" },
    { field: "性別", header: "性別", sortable: false, textAlign: 'left', minWidth: "5rem" },
    { field: "生年月日", header: "生年月日", minWidth: "10rem", sortable: false, textAlign: 'left' },
    { field: "年齢", header: "年齢", sortable: false, textAlign: 'left', minWidth: "5rem" },
    { field: "年齢_月", header: "年齢_月", sortable: false, textAlign: 'left', minWidth: "7rem" },
    { field: "要配慮者番号", header: "要配慮者番号", minWidth: "10rem", sortable: false, textAlign: 'left' },
    { field: "紐付コード", header: "紐付コード", minWidth: "8rem", sortable: false, textAlign: 'left' },
    { field: "備考", header: "備考", sortable: false, textAlign: 'left', minWidth: "5rem" },
    { field: "避難所", header: "避難所", sortable: false, textAlign: 'left', minWidth: "8rem" },
    { field: "退所日時", header: "退所日時", sortable: false, textAlign: 'left', minWidth: "9rem" },
    { field: "現在の滞在場所", header: "現在の滞在場所", sortable: false, minWidth: "10rem", textAlign: 'left' },

];

const externalEvacueesDetailColumns = [
    { field: "Sl No", header: "Sl No", minWidth: "7rem", sortable: true },
    { field: "氏名 (フリガナ)", header: "氏名 (フリガナ)", minWidth: "10rem", sortable: true },
    { field: "生年月日", header: "生年月日", minWidth: "7rem", sortable: true },
    { field: "年齢", header: "年齢", minWidth: "10rem", sortable: true },
    { field: "性別", header: "性別", minWidth: "5rem", sortable: true }
];

const familyDetailData = [
    {
        "避難日時": "2023年09月14日 (木) 22:17",
        "住所": "〒100-0001 東京都 千代田区千代田",
        "電話番号(代表者)": "0994872377",
        "登録言語環境": "日本語"
    }
];

const familyDetailData1 = [
    {
        "避難所": "Vacant test",
        "入所日時": "2023/09/14 22:17",
        "退所日時": "2023/09/15 17:02"
    }
];

const townAssociationData = [
    {
        "町内会名 *": "----",
    }
];


const suppliesShortageData = [
    { "避難所": "Vacant Test", "Test1(2)": "505", "Test2(2)": "3" },
    { "避難所": "Starting to get Crowded", "Test1(2)": "201", "Test2(2)": "16" },
    { "避難所": "crowded", "Test1(2)": "2999993", "Test2(2)": "6" },
    { "避難所": "避難所B", "Test1(2)": "980766", "Test2(2)": "1" },
    { "避難所": "Nara", "Test1(2)": "3981574", "Test2(2)": "33" }
];

const suppliesShortageHeaderColumn = [
    { field: '避難所', header: '避難所', minWidth: '10rem', textAlign: "left" },
    { field: 'Test1(2)', header: 'Test1(2)', minWidth: '10rem', textAlign: "left" },
    { field: 'Test2(2)', header: 'Test2(2)', minWidth: '10rem', textAlign: "left" }
];

const historyPageCities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
];

const dashboardTableColumns = [
    { field: 'id', header: '番号', minWidth: '5rem', headerClassName: "custom-header", sortable: true, textAlign: 'left' },
    { field: '避難所', header: '避難所', minWidth: '20rem', sortable: true, headerClassName: "custom-header" },
    { field: '避難可能人数', header: '避難可能人数', sortable: true, minWidth: '9rem', headerClassName: "custom-header" },
    { field: '現在の避難者数', header: '現在の避難者数', sortable: true, minWidth: '10rem', headerClassName: "custom-header" },
    { field: '避難者数', header: '避難者数', minWidth: '7rem', sortable: true, headerClassName: "custom-header" },
    { field: '避難中の世帯数', header: '避難中の世帯数', minWidth: '10rem', sortable: true, headerClassName: "custom-header" },
    { field: '個人情報なしの避難者数', header: '個人情報なしの避難者数', minWidth: '15rem', sortable: true, headerClassName: "custom-header" },
    { field: '男', header: '男', minWidth: '5rem', sortable: true, headerClassName: "custom-header" },
    { field: 'actions', header: '満員切替', minWidth: "7rem", headerClassName: "custom-header", textAlign: 'center', sortable: true }
];

const MailSettingsOption1 = [
    { name: 'なし', value: 0 },
    { name: '1時間毎', value: 1 },
    { name: '2時間毎', value: 2 },
    { name: '3時間毎', value: 3 },
    { name: '4時間毎', value: 4 },
    { name: '6時間毎', value: 6 },
    { name: '毎日', value: 8 },
    { name: '毎日2回', value: 16 },
];

const MailSettingsOption2 = [
    { name: '--', value: null },
    { name: '北海道', value: 1 },
    { name: '福島県', value: 2 },
    { name: '千葉県', value: 3 },
    { name: '東京都', value: 4 },
    { name: '大阪府', value: 5 }
];

const loginHistory = [
    { field: 'No', header: 'No.', minWidth: "3rem" },
    { field: '避難所', header: '避難所', minWidth: "5rem" },
    { field: "ログイン日時", header: "ログイン日時", minWidth: "5rem" }
];

const staffDetailData = [
    {
        field: '氏名',
        header: '氏名',
        minWidth: "5rem"
    },
    { field: '電話番号', header: '電話番号', minWidth: "5rem" },
];

const evacueesShelterOptions = [
    { name: '現在の避難者数', value: 'NY' },
    { name: '避難所の混雑率', value: 'RM' },
    { name: '要配慮者の避難者数', value: 'LDN' },
];

const currentEvacueesCountData = {
    labels: ['Vacant Test', 'Starting to get Crowded', 'crowded', 'Nara', 'テスト確認', 'Manual Register'],
    datasets: [
        {
            type: 'bar',
            label: '男',
            backgroundColor: 'rgb(31, 119, 180)',
            data: [65, 59, 80, 81, 56, 55]
        },
        {
            type: 'bar',
            label: '女',
            backgroundColor: 'rgb(44, 160, 44)',
            data: [28, 48, 40, 19, 86, 27]
        },
        {
            type: 'bar',
            label: '答えくない',
            backgroundColor: 'rgb(255, 127, 14)',
            data: [28, 48, 40, 19]
        }
    ]
};

const evacuationCenterCrowdingRateData = {
    labels: ['Vacant Test', 'Starting to get Crowded', 'crowded', 'Nara', 'テスト確認', 'Manual Register'],
    datasets: [
        {
            type: 'bar',
            backgroundColor: 'rgb(31, 119, 180)',
            data: [65, 45, 36, 67, 0, 23]
        }
    ]
};

const considerationEvacueesCountData = {
    labels: ['Vacant Test', 'Starting to get Crowded', 'crowded', 'Nara', 'テスト確認', 'Manual Register'],
    datasets: [
        {
            type: 'bar',
            label: '妊産婦',
            backgroundColor: 'rgb(31, 119, 180)',
            data: [15, 22, 28, 35, 0, 25]
        },
        {
            type: 'bar',
            label: '乳幼児',
            backgroundColor: 'rgb(255, 127, 14)',
            data: [28, 35, 80]
        },
        {
            type: 'bar',
            label: '障がい者',
            backgroundColor: 'rgb(44, 160, 44)',
            data: [28, 48, 40, 19]
        },
        {
            type: 'bar',
            label: '要介護者',
            backgroundColor: 'rgb(214, 39, 40)',
            data: [65, 59]
        },
        {
            type: 'bar',
            label: '医療機器利用者',
            backgroundColor: 'rgb(148, 103, 189)',
            data: [28, 48, 40]
        },
        {
            type: 'bar',
            label: 'アレルギー',
            backgroundColor: 'rgb(140, 86, 75)',
            data: [28, 48, 40, 19]
        },
        {
            type: 'bar',
            label: '外国籍',
            backgroundColor: 'rgb(227, 119, 194)',
            data: []
        },
        {
            type: 'bar',
            label: '新生児',
            backgroundColor: 'rgb(127, 127, 127)',
            data: []
        },
        {
            type: 'bar',
            label: 'その他',
            backgroundColor: 'rgb(188, 189, 34)',
            data: []
        }
    ]
};

const currentEvacueesCountOptions = {
    maintainAspectRatio: false,
    indexAxis: 'y',
    aspectRatio: 0.8,
    plugins: {
        tooltip: {
            callbacks: {
                label: function (context) {
                    const dataset = context.dataset;
                    const index = context.dataIndex;
                    const value = dataset.data[index];
                    return dataset.label + " : " + value + "人";
                },
            }
        },
        legend: {
            position: "bottom",
            align: "center",
            labels: {
                usePointStyle: true,
                pointStyle: "rect",
                color: '#495057'
            }
        }
    },
    scales: {
        x: {
            min: 0,
            max: 300,
            stacked: true,
            grid: {
                display: false
            }
        },
        y: {
            stacked: true,
            grid: {
                display: false
            }
        }
    }
};

const evacuationCenterCrowdingRateOptions = {
    maintainAspectRatio: false,
    indexAxis: 'y',
    aspectRatio: 0.8,
    plugins: {
        tooltip: {
            displayColors: false,
            callbacks: {
                title: () => null,
                label: function (context) {
                    const dataset = context.dataset;
                    const index = context.dataIndex;
                    const value = dataset.data[index];
                    const percentage = value + '%';
                    return " " + percentage;
                },
            }
        },
        legend: {
            display: false
        }
    },
    scales: {
        x: {
            min: 0,
            max: 500,
            stacked: true,
            ticks: {
                callback: function (val) {
                    return val + "%";
                },
            },
            grid: {
                display: false
            }
        },
        y: {
            stacked: true,
            grid: {
                display: false
            }
        }
    }
}

const considerationEvacueesCountOptions = {
    maintainAspectRatio: false,
    indexAxis: 'y',
    aspectRatio: 0.8,
    plugins: {
        tooltip: {
            callbacks: {
                label: function (context) {
                    const dataset = context.dataset;
                    const index = context.dataIndex;
                    const value = dataset.data[index];
                    return dataset.label + " : " + value + "人";
                },
            }
        },
        legend: {
            position: "bottom",
            align: "center",
            labels: {
                usePointStyle: true,
                pointStyle: "rect",
                color: '#495057'
            }
        }
    },
    scales: {
        x: {
            min: 0,
            max: 300,
            stacked: true,
            grid: {
                display: false
            }
        },
        y: {
            stacked: true,
            grid: {
                display: false
            }
        }
    }
};

const mapScaleRateOptions = [
    { value:"",name: "--"},
    { value: "1", name: "1" },
    { value: "2", name: "2" },
    { value: "3", name: "3" },
    { value: "4", name: "4" },
    { value: "5", name: "5" },
    { value: "6", name: "6" },
    { value: "7", name: "7" },
    { value: "8", name: "8" },
    { value: "9", name: "9" },
    { value: "10", name: "10" },
    { value: "11", name: "11" },
    { value: "12", name: "12" },
    { value: "13", name: "13" },
    { value: "14", name: "14" },
    { value: "15", name: "15" },
    { value: "16", name: "16" },
    { value: "17", name: "17" },
    { value: "18", name: "18" },
    { value: "19", name: "19" },
    { value: "20", name: "20" },
    { value: "21", name: "21" },
    { value: "22", name: "22" },
    { value: "23", name: "23" },
    { value: "24", name: "24" },
    { value: "25", name: "25" },
];



export {
    profiles,
    evacuationStatusOptions,
    evacuationTableColumns,
    externalEvacueesDetailColumns,
    familyDetailData1,
    familyDetailData,
    townAssociationData,
    suppliesShortageData,
    suppliesShortageHeaderColumn,
    historyPageCities,
    dashboardTableColumns,
    MailSettingsOption1,
    MailSettingsOption2,
    loginHistory,
    staffDetailData,
    evacueesShelterOptions,
    currentEvacueesCountData,
    evacuationCenterCrowdingRateData,
    considerationEvacueesCountData,
    currentEvacueesCountOptions,
    evacuationCenterCrowdingRateOptions,
    considerationEvacueesCountOptions,
    mapScaleRateOptions,
    productName_options,
    productType_options
}

export const urlRegister = [
    'pre-register',
    'pre-register-list',
    'privacy'
]

export const prefectures = [
    { value: "", name: '--' },
    { value: 1, name: '北海道' },
    { value: 2, name: '青森県' },
    { value: 3, name: '岩手県' },
    { value: 4, name: '宮城県' },
    { value: 5, name: '秋田県' },
    { value: 6, name: '山形県' },
    { value: 7, name: '福島県' },
    { value: 8, name: '茨城県' },
    { value: 9, name: '栃木県' },
    { value: 10, name: '群馬県' },
    { value: 11, name: '埼玉県' },
    { value: 12, name: '千葉県' },
    { value: 13, name: '東京都' },
    { value: 14, name: '神奈川県' },
    { value: 15, name: '新潟県' },
    { value: 16, name: '富山県' },
    { value: 17, name: '石川県' },
    { value: 18, name: '福井県' },
    { value: 19, name: '山梨県' },
    { value: 20, name: '長野県' },
    { value: 21, name: '岐阜県' },
    { value: 22, name: '静岡県' },
    { value: 23, name: '愛知県' },
    { value: 24, name: '三重県' },
    { value: 25, name: '滋賀県' },
    { value: 26, name: '京都府' },
    { value: 27, name: '大阪府' },
    { value: 28, name: '兵庫県' },
    { value: 29, name: '奈良県' },
    { value: 30, name: '和歌山県' },
    { value: 31, name: '鳥取県' },
    { value: 32, name: '島根県' },
    { value: 33, name: '岡山県' },
    { value: 34, name: '広島県' },
    { value: 35, name: '山口県' },
    { value: 36, name: '徳島県' },
    { value: 37, name: '香川県' },
    { value: 38, name: '愛媛県' },
    { value: 39, name: '高知県' },
    { value: 40, name: '福岡県' },
    { value: 41, name: '佐賀県' },
    { value: 42, name: '長崎県' },
    { value: 43, name: '熊本県' },
    { value: 44, name: '大分県' },
    { value: 45, name: '宮崎県' },
    { value: 46, name: '鹿児島県' },
    { value: 47, name: '沖縄県' },
];

export const prefectures_en = [
    { value: "", name: '--' },
    { value: 1, name: 'Hokkaido' },
    { value: 2, name: 'Aomori' },
    { value: 3, name: 'Iwate' },
    { value: 4, name: 'Miyagi' },
    { value: 5, name: 'Akita' },
    { value: 6, name: 'Yamagata' },
    { value: 7, name: 'Fukushima' },
    { value: 8, name: 'Ibaraki' },
    { value: 9, name: 'Tochigi' },
    { value: 10, name: 'Gunma' },
    { value: 11, name: 'Saitama' },
    { value: 12, name: 'Chiba' },
    { value: 13, name: 'Tokyo' },
    { value: 14, name: 'Kanagawa' },
    { value: 15, name: 'Niigata' },
    { value: 16, name: 'Toyama' },
    { value: 17, name: 'Ishikawa' },
    { value: 18, name: 'Fukui' },
    { value: 19, name: 'Yamanashi' },
    { value: 20, name: 'Nagano' },
    { value: 21, name: 'Gifu' },
    { value: 22, name: 'Shizuoka' },
    { value: 23, name: 'Aichi' },
    { value: 24, name: 'Mie' },
    { value: 25, name: 'Shiga' },
    { value: 26, name: 'Kyoto' },
    { value: 27, name: 'Osaka' },
    { value: 28, name: 'Hyogo' },
    { value: 29, name: 'Nara' },
    { value: 30, name: 'Wakayama' },
    { value: 31, name: 'Tottori' },
    { value: 32, name: 'Shimane' },
    { value: 33, name: 'Okayama' },
    { value: 34, name: 'Hiroshima' },
    { value: 35, name: 'Yamaguchi' },
    { value: 36, name: 'Tokushima' },
    { value: 37, name: 'Kagawa' },
    { value: 38, name: 'Ehime' },
    { value: 39, name: 'Kochi' },
    { value: 40, name: 'Fukuoka' },
    { value: 41, name: 'Saga' },
    { value: 42, name: 'Nagasaki' },
    { value: 43, name: 'Kumamoto' },
    { value: 44, name: 'Oita' },
    { value: 45, name: 'Miyazaki' },
    { value: 46, name: 'Kagoshima' },
    { value: 47, name: 'Okinawa' },
];

const productType_options= [
    { name: '--'},
    { name: '食料'},
    { name: '備蓄品'},
];
const productName_options = [
    { name: '--'},
    { name: 'こめ'},
    { name: "アルファ米（50食箱）五目ごはん"},
    { name: "栄養補助食品"}
];

export const staff_dashboard_status_en = ['Maximum Capacity', 'Total Family', 'Blank'];

export const staff_dashboard_status_jp = ['避難可能人数', '現在の避難者数', '追加受入可能人数'];


export const gender_jp = [
    { value: "", name: '--' },
    { value: "1", name: '男' },
    { value: "2", name: '女' },
    { value: "3", name: '答えたくない' },
  ];
  
export const gender_en = [
    { value: "", name: '--' },
    { value: "1", name: 'Male' },
    { value: "2", name: 'Female' },
    { value: "3", name: 'Other' },
];

export const prefecturesCombined = {
    0: { en: '', ja: '' }, 
    1: { en: 'Hokkaido', ja: '北海道' },
    2: { en: 'Aomori', ja: '青森県' },
    3: { en: 'Iwate', ja: '岩手県' },
    4: { en: 'Miyagi', ja: '宮城県' },
    5: { en: 'Akita', ja: '秋田県' },
    6: { en: 'Yamagata', ja: '山形県' },
    7: { en: 'Fukushima', ja: '福島県' },
    8: { en: 'Ibaraki', ja: '茨城県' },
    9: { en: 'Tochigi', ja: '栃木県' },
    10: { en: 'Gunma', ja: '群馬県' },
    11: { en: 'Saitama', ja: '埼玉県' },
    12: { en: 'Chiba', ja: '千葉県' },
    13: { en: 'Tokyo', ja: '東京都' },
    14: { en: 'Kanagawa', ja: '神奈川県' },
    15: { en: 'Niigata', ja: '新潟県' },
    16: { en: 'Toyama', ja: '富山県' },
    17: { en: 'Ishikawa', ja: '石川県' },
    18: { en: 'Fukui', ja: '福井県' },
    19: { en: 'Yamanashi', ja: '山梨県' },
    20: { en: 'Nagano', ja: '長野県' },
    21: { en: 'Gifu', ja: '岐阜県' },
    22: { en: 'Shizuoka', ja: '静岡県' },
    23: { en: 'Aichi', ja: '愛知県' },
    24: { en: 'Mie', ja: '三重県' },
    25: { en: 'Shiga', ja: '滋賀県' },
    26: { en: 'Kyoto', ja: '京都府' },
    27: { en: 'Osaka', ja: '大阪府' },
    28: { en: 'Hyogo', ja: '兵庫県' },
    29: { en: 'Nara', ja: '奈良県' },
    30: { en: 'Wakayama', ja: '和歌山県' },
    31: { en: 'Tottori', ja: '鳥取県' },
    32: { en: 'Shimane', ja: '島根県' },
    33: { en: 'Okayama', ja: '岡山県' },
    34: { en: 'Hiroshima', ja: '広島県' },
    35: { en: 'Yamaguchi', ja: '山口県' },
    36: { en: 'Tokushima', ja: '徳島県' },
    37: { en: 'Kagawa', ja: '香川県' },
    38: { en: 'Ehime', ja: '愛媛県' },
    39: { en: 'Kochi', ja: '高知県' },
    40: { en: 'Fukuoka', ja: '福岡県' },
    41: { en: 'Saga', ja: '佐賀県' },
    42: { en: 'Nagasaki', ja: '長崎県' },
    43: { en: 'Kumamoto', ja: '熊本県' },
    44: { en: 'Oita', ja: '大分県' },
    45: { en: 'Miyazaki', ja: '宮崎県' },
    46: { en: 'Kagoshima', ja: '鹿児島県' },
    47: { en: 'Okinawa', ja: '沖縄県' },
};

export const default_place_id = [1,2,3,4];

export const family_dummy_data = [
    {
        "f_id": 331,
        "family_code": "042331",
        "place_id": 42,
        "yapple_id": null,
        "ppid": null,
        "event_id": 1,
        "family_address": "千代田区皇居外苑",
        "family_address_default": "",
        "family_zip_code": "100-0002",
        "family_prefecture_id": 13,
        "family_language_register": "ja",
        "family_tel": "03883838333",
        "family_password": "$2y$10$H.Ng6KoDqF2rwSG5HZTb1.U7LpplT6W9Wyzov7Ag1Z1hwqIv6NFfa",
        "family_join_date": "2024-04-01T17:50:38",
        "family_out_date": null,
        "family_is_public": 0,
        "family_is_registered": 1,
        "family_public_info": 0,
        "family_answers": [
            {
                "id": 9,
                "event_id": 1,
                "type": 2,
                "title": "応急仮設住宅",
                "title_en": "Emergency temporary housing",
                "options": [
                    "入居を希望する",
                    "入居を希望しない"
                ],
                "options_en": [
                    "I would like to move in",
                    "I dont want to move in"
                ],
                "display_order": 7,
                "isRequired": 1,
                "isVoiceRequired": 0,
                "isVisible": 1,
                "created_at": "2024-03-17T09:03:23.000000Z",
                "updated_at": "2024-04-01T12:20:39.000000Z",
                "deleted_at": null,
                "question_id": 9,
                "answer": [
                    "入居を希望する"
                ],
                "answer_en": [
                    "I would like to move in"
                ]
            },
            {
                "id": 10,
                "event_id": 1,
                "type": 2,
                "title": "家屋の状況",
                "title_en": "House situation",
                "options": [
                    "被害なし",
                    "全壊",
                    "半壊",
                    "一部損壊",
                    "床上浸水",
                    "床下浸水",
                    "断水",
                    "停電",
                    "ガス停止"
                ],
                "options_en": [
                    "No damage",
                    "Completely destroyed",
                    "Half destroyed",
                    "Partially damaged",
                    "Flooding above the floor",
                    "Underfloor flooding",
                    "water outage",
                    "power outage",
                    "gas outage"
                ],
                "display_order": 1,
                "isRequired": 1,
                "isVoiceRequired": 0,
                "isVisible": 1,
                "created_at": "2024-03-17T09:06:35.000000Z",
                "updated_at": "2024-04-01T12:20:39.000000Z",
                "deleted_at": null,
                "question_id": 10,
                "answer": [
                    "被害なし"
                ],
                "answer_en": [
                    "No damage"
                ]
            },
            {
                "id": 11,
                "event_id": 1,
                "type": 2,
                "title": "自宅の種類",
                "title_en": "type of home",
                "options": [
                    "持ち家",
                    "集合住宅",
                    "賃貸アパート",
                    "その他"
                ],
                "options_en": [
                    "owning a house",
                    "housing complex",
                    "rental apartment",
                    "others"
                ],
                "display_order": 2,
                "isRequired": 1,
                "isVoiceRequired": 0,
                "isVisible": 1,
                "created_at": "2024-03-17T09:09:10.000000Z",
                "updated_at": "2024-04-01T12:27:32.000000Z",
                "deleted_at": null,
                "question_id": 11,
                "answer": [
                    "持ち家"
                ],
                "answer_en": [
                    "owning a house"
                ]
            },
            {
                "id": 12,
                "event_id": 1,
                "type": 3,
                "title": "自宅の種類でその他を選択された場合は、その他の情報をご記入ください。",
                "title_en": "If you selected Other for home type, please fill in the other information.",
                "options": [],
                "options_en": [],
                "display_order": 3,
                "isRequired": 0,
                "isVoiceRequired": 0,
                "isVisible": 1,
                "created_at": "2024-03-17T09:10:25.000000Z",
                "updated_at": "2024-03-17T09:10:43.000000Z",
                "deleted_at": null,
                "question_id": 12,
                "answer": [],
                "answer_en": []
            },
            {
                "id": 13,
                "event_id": 1,
                "type": 2,
                "title": "車で避難されますか",
                "title_en": "Will you be evacuating by car?",
                "options": [
                    "車で避難をする",
                    "車で避難をしない",
                    "入居を希望しない"
                ],
                "options_en": [
                    "evacuate by car",
                    "Do not evacuate by car",
                    "I dont want to move in"
                ],
                "display_order": 4,
                "isRequired": 0,
                "isVoiceRequired": 0,
                "isVisible": 1,
                "created_at": "2024-03-17T09:11:30.000000Z",
                "updated_at": "2024-04-01T09:55:34.000000Z",
                "deleted_at": null,
                "question_id": 13,
                "answer": [],
                "answer_en": []
            },
            {
                "id": 14,
                "event_id": 1,
                "type": 3,
                "title": "車で避難される場合は、車種・ナンバーを記入してください。",
                "title_en": "If you are evacuating by car, please write the model and number of your car.",
                "options": [],
                "options_en": [],
                "display_order": 5,
                "isRequired": 0,
                "isVoiceRequired": 0,
                "isVisible": 1,
                "created_at": "2024-03-17T09:12:34.000000Z",
                "updated_at": "2024-03-17T09:13:01.000000Z",
                "deleted_at": null,
                "question_id": 14,
                "answer": [],
                "answer_en": []
            }
        ],
        "family_register_from": 1,
        "person_id": 290,
        "family_id": 331,
        "person_refugee_name": "バンゴウ ハナコ",
        "person_name": "test_time",
        "person_postal_code": "100-0002",
        "person_prefecture_id": 13,
        "person_address": "千代田区皇居外苑",
        "person_tel": "03883838333",
        "person_dob": "1998-01-08T00:00:00",
        "person_address_default": null,
        "person_age": 26,
        "person_month": 2,
        "person_gender": 1,
        "person_special_cares": [
            {
                "name": "ペット",
                "name_en": "pet"
            }
        ],
        "person_note": null,
        "person_is_owner": 0,
        "person_connecting_code": null,
        "person_answers": [
            {
                "id": 3,
                "event_id": 1,
                "type": 2,
                "title": "食事",
                "title_en": "meal",
                "options": [
                    "普通食",
                    "お粥",
                    "離乳食",
                    "ミルク",
                    "その他"
                ],
                "options_en": [
                    "normal food",
                    "Porridge",
                    "Baby Food",
                    "milk",
                    "others"
                ],
                "display_order": 1,
                "isRequired": 1,
                "isVoiceRequired": 0,
                "isVisible": 1,
                "created_at": "2024-03-17T09:15:12.000000Z",
                "updated_at": "2024-03-17T09:15:12.000000Z",
                "deleted_at": null,
                "question_id": 3,
                "answer": [
                    "普通食"
                ],
                "answer_en": [
                    "normal food"
                ]
            },
            {
                "id": 4,
                "event_id": 1,
                "type": 3,
                "title": "食事でその他を選択した場合、詳細を記入してください",
                "title_en": "If you selected other for your meal, please fill in the details.",
                "options": [],
                "options_en": [],
                "display_order": 2,
                "isRequired": 0,
                "isVoiceRequired": 0,
                "isVisible": 1,
                "created_at": "2024-03-17T09:16:37.000000Z",
                "updated_at": "2024-03-17T09:16:47.000000Z",
                "deleted_at": null,
                "question_id": 4,
                "answer": [],
                "answer_en": []
            },
            {
                "id": 5,
                "event_id": 1,
                "type": 2,
                "title": "発熱や具合が悪いなどはありますか？",
                "title_en": "Do you have a fever or feel unwell?",
                "options": [
                    "ない",
                    "発熱がある",
                    "具合が悪い"
                ],
                "options_en": [
                    "no problem",
                    "I have a fever",
                    "Bad condition"
                ],
                "display_order": 3,
                "isRequired": 1,
                "isVoiceRequired": 0,
                "isVisible": 1,
                "created_at": "2024-03-17T09:17:50.000000Z",
                "updated_at": "2024-03-17T09:18:12.000000Z",
                "deleted_at": null,
                "question_id": 5,
                "answer": [
                    "ない"
                ],
                "answer_en": [
                    "no problem"
                ]
            },
            {
                "id": 6,
                "event_id": 1,
                "type": 3,
                "title": "上記で発熱・具合が悪いと回答した場合、詳細を記入してください。",
                "title_en": "If you answered above that you have a fever or feel unwell, please fill in the details.",
                "options": [],
                "options_en": [],
                "display_order": 4,
                "isRequired": 0,
                "isVoiceRequired": 0,
                "isVisible": 1,
                "created_at": "2024-03-17T09:18:34.000000Z",
                "updated_at": "2024-03-17T09:18:34.000000Z",
                "deleted_at": null,
                "question_id": 6,
                "answer": [],
                "answer_en": []
            }
        ],
        "person_created_at": "2024-04-01T21:20:42",
        "person_updated_at": "2024-04-01T22:20:19",
        "person_deleted_at": null,
        "family_created_at": "2024-04-01T21:20:41",
        "family_updated_at": "2024-04-01T22:20:18",
        "family_deleted_at": null,
        "createdDate": "2024-04-01 (Mon) 21:20",
        "prefecture_name": "東京都"
    }
]