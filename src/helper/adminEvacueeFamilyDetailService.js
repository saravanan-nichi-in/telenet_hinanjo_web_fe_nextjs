/*eslint no-undef: 0*/

export const AdminEvacueeFamilyDetailService = {
    getData() {
        return [
            {
                "番号": 1,
                "代表者": 1,
                "氏名 (フリガナ)": "Test0199",
                "氏名 (漢字)": "-",
                "生年月日": "2023年09月14日",
                "年齢": 0,
                "年齢_月": 0,
                "性別": "男",
                "作成日": "2023/09/15 17:02",
                "更新日": "2023/09/15 17:02"
            },
            {
                "番号": 2,
                "代表者": 1,
                "氏名 (フリガナ)": "Test0199",
                "氏名 (漢字)": "-",
                "生年月日": "2023年09月14日",
                "年齢": 0,
                "年齢_月": 0,
                "性別": "男",
                "作成日": "2023/09/15 17:02",
                "更新日": "2023/09/15 17:02"
            },
        ]
    },
    getAdminsEvacueeFamilyDetailSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getAdminsEvacueeFamilyDetailMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getAdminsEvacueeFamilyDetailLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getAdminsEvacueeFamilyDetailXLarge() {
        return Promise.resolve(this.getData());
    },

}