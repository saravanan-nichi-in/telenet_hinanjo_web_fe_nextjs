/*eslint no-undef: 0*/
export const AdminSpecialCareService = {
    getData() {
        return [
            { "ID": 1, 
            "要配慮者事項":<a href="#">妊産婦</a>,
            "要配慮者事項（英語)":"Pregnant woman"},
            { "ID": 2, 
            "要配慮者事項":<a href="#">乳幼児</a>,
            "要配慮者事項（英語)":"Infant"},
            { "ID": 3, 
            "要配慮者事項":<a href="#">障がい者</a>,
            "要配慮者事項（英語)":"Persons with disabilities"},
            { "ID": 4, 
            "要配慮者事項":<a href="#">要介護者</a>,
            "要配慮者事項（英語)":"Nursing care recipient"},
            { "ID": 5, 
            "要配慮者事項":<a href="#">医療機器利用者</a>,
            "要配慮者事項（英語)":"Medical device users"},
            { "ID": 6, 
            "要配慮者事項":<a href="#">アレルギー</a>,
            "要配慮者事項（英語)":"Allergies"},
            { "ID": 7, 
            "要配慮者事項":<a href="#">外国籍</a>,
            "要配慮者事項（英語)":"Foreign nationality"},
            { "ID": 9, 
            "要配慮者事項":<a href="#">その他</a>,
            "要配慮者事項（英語)":"Other"},
            { "ID": 13, 
            "要配慮者事項":<a href="#">テーブル</a>,
            "要配慮者事項（英語)":"Tables"},
        ]
    },
    getAdminsSpecialCareSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getAdminsSpecialCareMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getAdminsSpecialCareLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getAdminsSpecialCareXLarge() {
        return Promise.resolve(this.getData());
    },

}