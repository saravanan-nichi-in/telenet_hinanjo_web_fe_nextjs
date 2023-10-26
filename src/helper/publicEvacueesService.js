/*eslint no-undef: 0*/

export const PublicEvacueesService = {
    getData() {
        return [
            {
                id: 1,
                name:"日比谷公園避難所",
                address_place:"100-0012 東京都 千代田区日比谷公園",
                total_capacity:"4/100",
                percent:4,
                full_status:1
            },
            {
                id: 2,
                name:"日比谷公園避難所",
                address_place:"100-0012 東京都 千代田区日比谷公園",
                total_capacity:"4/100",
                percent:4,
                full_status:1
            },
            {
                id: 3,
                name:"日比谷公園避難所",
                address_place:"100-0012 東京都 千代田区日比谷公園",
                total_capacity:"4/100",
                percent:4,
                full_status:0
            },
           
        ]
    },
    getPublicEvacueesListSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getPublicEvacueesListMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getPublicEvacueesListLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getPublicEvacueesListXLarge() {
        return Promise.resolve(this.getData());
    },

}