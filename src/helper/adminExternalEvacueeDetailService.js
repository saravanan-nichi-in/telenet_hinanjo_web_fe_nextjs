/*eslint no-undef: 0*/
export const AdminExternalEvacueeDetailService = {
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

    getAdminsExternalEvacueeDetailSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getAdminsExternalEvacueeDetailMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getAdminsExternalEvacueeDetailLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getAdminsExternalEvacueeDetailXLarge() {
        return Promise.resolve(this.getData());
    }
}