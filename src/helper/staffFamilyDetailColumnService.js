/*eslint no-undef: 0*/

export const StaffDetailColumnService = {
    getData() {
        return [
            {
                evacuation_date_time: "2023年09月14日 (木) 22:17 ",
                address: "〒100-0001 東京都 千代田区千代田",
                representative_number: "0994872377",
                registered_lang_environment: "日本語"
            }
        ]
    },
    getStaffDetailColumnDetailSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getStaffDetailColumnDetailMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getStaffDetailColumnDetailLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getStaffDetailColumnDetailXLarge() {
        return Promise.resolve(this.getData());
    },

}