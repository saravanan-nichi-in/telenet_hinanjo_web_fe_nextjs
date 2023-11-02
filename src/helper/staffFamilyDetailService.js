/*eslint no-undef: 0*/

export const TemporaryFamilyRowExpansionService = {
    getTemporaryFamilyRowExpansionData() {
        return [
            {
                id: 1,
                representative: "代表者",
                name_phonetic: "タナカナ",
                name_kanji: "-",
                dob: "2023年08月28日",
                age: 0,
                age_m: 0,
                gender: "女",
                created_date: "2023年09月27日 (水) 21:24",
                updated_date: "2023年10月20日 (金) 15:15",
            },
            {
                id: 2,
                representative: "代表者",
                name_phonetic: "タナカナ",
                name_kanji: "-",
                dob: "2023年08月28日",
                age: 0,
                age_m: 0,
                gender: "女",
                created_date: "2023年09月27日 (水) 21:24",
                updated_date: "2023年10月20日 (金) 15:15",
            },
           
        ];
    },

    getTemporaryFamilyRowExpansionWithOrdersData() {
        return [
            {
                id: 1,
                representative: "代表者",
                name_phonetic: "タナカナ",
                name_kanji: "-",
                dob: "2023年08月28日",
                age: 0,
                age_m: 0,
                gender: "女",
                created_date: "2023年09月27日 (水) 21:24",
                updated_date: "2023年10月20日 (金) 15:15",
                orders: [{
                    id: '1-1',
                    street_address: '〒 100-0000 東京都 千代田区',
                    special_Care_type: '-',
                    connecting_code: '-',
                    remarks: '-',
                    current_place_of_stay:"避難所"
                },
                ]
            },
            {
                id: 2,
                representative: "代表者",
                name_phonetic: "タナカナ",
                name_kanji: "-",
                dob: "2023年08月28日",
                age: 0,
                age_m: 0,
                gender: "女",
                created_date: "2023年09月27日 (水) 21:24",
                updated_date: "2023年10月20日 (金) 15:15",
                orders: [{
                    id: '1-2',
                    street_address: '〒 100-0000 東京都 千代田区',
                    special_Care_type: '-',
                    connecting_code: '-',
                    remarks: '-',
                    current_place_of_stay:"避難所"
                }],
            },
        ];
    },

    getTemporaryFamilyRowExpansionMini() {
        return Promise.resolve(this.getTemporaryFamilyRowExpansionData().slice(0, 5));
    },

    getTemporaryFamilyRowExpansionSmall() {
        return Promise.resolve(this.getTemporaryFamilyRowExpansionData().slice(0, 10));
    },

    getTemporaryFamilyRowExpansion() {
        return Promise.resolve(this.getTemporaryFamilyRowExpansionData());
    },

    getTemporaryFamilyRowExpansionWithOrdersSmall() {
        return Promise.resolve(this.getTemporaryFamilyRowExpansionWithOrdersData().slice(0, 10));
    },

    getTemporaryFamilyRowExpansionWithOrders() {
        return Promise.resolve(this.getTemporaryFamilyRowExpansionWithOrdersData());
    }
};