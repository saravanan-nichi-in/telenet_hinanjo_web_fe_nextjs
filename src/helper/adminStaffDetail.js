/*eslint no-undef: 0*/

export const AdminStaffDetailService = {
    getData() {
        return [
            {
                No: 1,
                避難所: "日本の避難所",
                ログイン日時: "2023/09/07 14:09"
            },
            {
                No: 2,
                避難所: "日本の避難所",
                ログイン日時: "2023/09/07 14:09"
            },
            {
                No: 3,
                避難所: "日本の避難所",
                ログイン日時: "2023/09/07 14:09"
            },
            {
                No: 4,
                避難所: "日本の避難所",
                ログイン日時: "2023/09/07 14:09"
            },
            {
                No: 5,
                避難所: "日本の避難所",
                ログイン日時: "2023/09/07 14:09"
            },
            {
                No: 6,
                避難所: "日本の避難所",
                ログイン日時: "2023/09/07 14:09"
            },
            {
                No: 7,
                避難所: "日本の避難所",
                ログイン日時: "2023/09/07 14:09"
            },
            {
                No: 8,
                避難所: "日本の避難所",
                ログイン日時: "2023/09/07 14:09"
            },
            {
                No: 9,
                避難所: "日本の避難所",
                ログイン日時: "2023/09/07 14:09",
            },
            {
                No: 10,
                避難所: "日本の避難所",
                ログイン日時: "2023/09/07 14:09",
            },
            {
                No: 11,
                避難所: "日本の避難所",
                ログイン日時: "2023/09/07 14:09",
            },
            {
                No: 12,
                避難所: "日本の避難所",
                ログイン日時: "2023/09/07 14:09",
            },
        ]
    },
    getAdminsStaffDetailSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getAdminsStaffDetailMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getAdminsStaffDetailLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getAdminsStaffDetailXLarge() {
        return Promise.resolve(this.getData());
    },

}