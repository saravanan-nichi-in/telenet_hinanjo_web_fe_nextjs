/*eslint no-undef: 0*/

export const StaffFamilyAdmissionService = {
    getData() {
        return [
            {
                place_id: 1,
                shelter_place: "Vacant test Updated",
                admission_date_time: "2023/09/27 21:24",
                discharge_date_time: "-"
            }
        ]
    },
    getStaffFamilyAdmissionDetailSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getStaffFamilyAdmissionDetailMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getStaffFamilyAdmissionDetailLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getStaffFamilyAdmissionDetailXLarge() {
        return Promise.resolve(this.getData());
    },

}