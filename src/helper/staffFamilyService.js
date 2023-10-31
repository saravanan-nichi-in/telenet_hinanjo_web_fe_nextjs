/*eslint no-undef: 0*/

export const StaffFamilyService = {
    getData() {
        return [
            {
                id: 1,
                number_of_households:1,
                family_code: "001-012",
                household_representative: "Representative",
                name_phonetic: "タナカナ",
                name_kanji: "-",
                gender: "Female",
                dob: "2023-08-28",
                age:0,
                age_m:0,
                special_care_type:"-",
                connecting_code:"-",
                remarks:"-",
                date_created:"2023/09/27 21:24",
                evacuation_days:33
            },
            {
                id: 2,
                number_of_households:2,
                family_code: "001-012",
                household_representative: "Representative",
                name_phonetic: "タナカナ",
                name_kanji: "-",
                gender: "Female",
                dob: "2023-08-28",
                age:0,
                age_m:0,
                special_care_type:"-",
                connecting_code:"-",
                remarks:"-",
                date_created:"2023/09/27 21:24",
                evacuation_days:33
            },
            {
                id: 3,
                number_of_households:3,
                family_code: "001-012",
                household_representative: "Representative",
                name_phonetic: "タナカナ",
                name_kanji: "-",
                gender: "Female",
                dob: "2023-08-28",
                age:0,
                age_m:0,
                special_care_type:"-",
                connecting_code:"-",
                remarks:"-",
                date_created:"2023/09/27 21:24",
                evacuation_days:33
            },
        ]
    },
    getStaffFamilySmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getStaffFamilyMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getStaffFamilyLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getStaffFamilyXLarge() {
        return Promise.resolve(this.getData());
    },

}