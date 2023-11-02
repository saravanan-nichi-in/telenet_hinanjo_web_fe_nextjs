/*eslint no-undef: 0*/

export const StaffFamilyDetailQuestionsService = {
    getData() {
        return [
            {
                neighborhood_association_name:"test",
                test_payload:"test stop"
            }
        ]
    },
    getStaffFamilyDetailQuestionsDetailSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getStaffFamilyDetailQuestionsDetailMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getStaffFamilyDetailQuestionsDetailLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getStaffFamilyDetailQuestionsDetailXLarge() {
        return Promise.resolve(this.getData());
    },

}