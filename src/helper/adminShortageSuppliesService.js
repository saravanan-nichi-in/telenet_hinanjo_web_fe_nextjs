/*eslint no-undef: 0*/

export const AdminShortageSuppliesService = {
    getData() {
        return [
            { "避難所": "日本の避難所", "Test1(2)": "505", "Test2(2)": "3", "test3(3)": "2", "test6(5)": "1" },
            { "避難所": "広島市中区東白島町", "Test1(2)": "201", "Test2(2)": "16", "test3(3)": "9", "test6(5)": "0" },

            { "避難所": "テスト", "Test1(2)": "2999993", "Test2(2)": "6", "test3(3)": "6", "test6(5)": "0" },
            { "避難所": "避難所B", "Test1(2)": "980766", "Test2(2)": "1", "test3(3)": "1", "test6(5)": "0" },
            { "避難所": "不足合計", "Test1(2)": "3981574", "Test2(2)": "33", "test3(3)": "32", "test6(5)": "5" },
        ]
    },
    getAdminsShortageSuppliesSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getAdminsShortageSuppliesMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getAdminsShortageSuppliesLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getAdminsShortageSuppliesXLarge() {
        return Promise.resolve(this.getData());
    },

}