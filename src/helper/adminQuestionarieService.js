/*eslint no-undef: 0*/

export const AdminQuestionarieService = {
    getData() {
        return [
            {
                "Name": "Master questionaries",
                "Description": "MasterQuestionaries",
            },
            {
                "Name": "Individual questionaries",
                "Description": "IndividualQuestionaries",
            }
        ]
    },
    getAdminsQuestionarieSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getAdminsQuestionarieMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getAdminsQuestionarieLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getAdminsQuestionarieXLarge() {
        return Promise.resolve(this.getData());
    },

}