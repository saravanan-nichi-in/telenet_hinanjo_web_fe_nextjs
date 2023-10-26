/*eslint no-undef: 0*/

export const PublicEvacueeService = {
    getData() {
        return [
            {
                id: 1,
                place_name: "Vacant test",
                name_phonetic: "Test91811",
                name_kanji: "-",
                age: 24,
                gender: "Female",
                Address: "千代田区皇居外苑"
            },
            {
                id: 2,
                place_name: "Vacant test",
                name_phonetic: "Test9181",
                name_kanji: "-",
                age: 22,
                gender: "Male",
                Address: "福島市"
            },
            {
                id: 3,
                place_name: "Vacant test",
                name_phonetic: "Test9181",
                name_kanji: "-",
                age: 23,
                gender: "Male",
                Address: "千代田区"
            },
        ]
    },
    getPublicEvacueeListSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getPublicEvacueeListMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getPublicEvacueeListLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getPublicEvacueeListXLarge() {
        return Promise.resolve(this.getData());
    },

}