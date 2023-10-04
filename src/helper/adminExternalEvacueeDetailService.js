
export const AdminExternalEvacueesDetail = {
    getData() {
        return [
            {
                "Sl No": 1,
                "氏名 (フリガナ)": 'test',
                "生年月日": "1980年05月05日",
                "年齢": 43,
                "性別": "男"
            },
            {
                "Sl No": 2,
                "氏名 (フリガナ)": 'test',
                "生年月日": "1980年05月05日",
                "年齢": 43,
                "性別": "男"
            },
            
        ]
    },
    getAdminsExternalEvacueesDetailSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getAdminsExternalEvacueesDetailMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getAdminsExternalEvacueesDetailLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getAdminsExternalEvacueesDetailXLarge() {
        return Promise.resolve(this.getData());
    },

}