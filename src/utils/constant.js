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
    { name: 'なし' , value: 0},
    { name: '1時間毎', value: 1 },
    { name: '2時間毎', value: 2},
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

const summaryShelterOptions = [
    { name: "--" },
    { name: "Vacant test" },
    { name: "Starting to get crowded" },
    { name: "Crowded" },
    { name: "Nara" }
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
    { name: "--" },
    { name: "1" },
    { name: "2" },
    { name: "3" },
    { name: "4" },
    { name: "5" },
    { name: "6" },
    { name: "7" },
    { name: "8" },
    { name: "9" },
    { name: "10" },
    { name: "11" },
    { name: "12" },
    { name: "13" },
    { name: "14" },
    { name: "15" },
    { name: "16" },
    { name: "17" },
    { name: "18" },
    { name: "19" },
    { name: "20" },
    { name: "21" },
    { name: "22" },
    { name: "23" },
    { name: "24" },
    { name: "25" },
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
    summaryShelterOptions,
    loginHistory,
    staffDetailData,
    evacueesShelterOptions,
    currentEvacueesCountData,
    evacuationCenterCrowdingRateData,
    considerationEvacueesCountData,
    currentEvacueesCountOptions,
    evacuationCenterCrowdingRateOptions,
    considerationEvacueesCountOptions,
    mapScaleRateOptions
}

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
