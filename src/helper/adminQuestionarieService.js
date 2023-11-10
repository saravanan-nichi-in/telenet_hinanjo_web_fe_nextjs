// /*eslint no-undef: 0*/
export const AdminQuestionarieService = {
    getAdminQuestionarieRowExpansionData() {
        return [
            {
                id: 1,
                "Name": "Flood",
                "Description": "FloodQuestionnaires",
            },
            {
                id: 2,
                "Name": "Flood2",
                "Description": "FloodQuestionnaires2",
            },

        ];
    },

    getAdminQuestionarieRowExpansionWithOrdersData() {
        return [
            {
                id: 1,
                "Name": "Flood",
                "Description": "FloodQuestionnaires",
                orders: [{
                    "Name": "Master questionnaires"
                }, 
                {
                    "Name": "Individual questionnaires",
                    "actions":"",
                }
            ],
            },
            {
                id: 2,
                "Name": "Flood2",
                "Description": "FloodQuestionnaires2",
                orders: [{
                    "Name": "Master questionnaires"
                }, 
                {
                    "Name": "Individual questionnaires"
                }
            ]
            },
        ];
    },

    getAdminQuestionarieRowExpansionMini() {
        return Promise.resolve(this.getAdminQuestionarieRowExpansionData().slice(0, 5));
    },

    getAdminQuestionarieRowExpansionSmall() {
        return Promise.resolve(this.getAdminQuestionarieRowExpansionData().slice(0, 10));
    },

    getAdminQuestionarieRowExpansion() {
        return Promise.resolve(this.getAdminQuestionarieRowExpansionData());
    },

    getAdminQuestionarieRowExpansionWithOrdersSmall() {
        return Promise.resolve(this.getAdminQuestionarieRowExpansionWithOrdersData().slice(0, 10));
    },

    getAdminQuestionarieRowExpansionWithOrders() {
        return Promise.resolve(this.getAdminQuestionarieRowExpansionWithOrdersData());
    }
};