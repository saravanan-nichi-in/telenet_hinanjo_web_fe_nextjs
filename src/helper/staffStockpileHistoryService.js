/*eslint no-undef: 0*/

export const StaffStockpileHistoryService = {
    getData() {
        return [
            {
                id: 1,
                working_date: "2023-10-17 (Tue) 22:16:36",
                inventory_date: "2023-09-27",
                product_type: "食料",
                product_name: "栄養補助食品",
                quantity_before: 0,
                quantity_after: 0,
                confirmer:"Qa",
                expiry_date:"2023-12-31",
                remarks:"remarks check update"
            },
            {
                id: 2,
                working_date: "2023-10-17 (Tue) 22:16:36",
                inventory_date: "-",
                product_type: "食料",
                product_name: "栄養補助食品",
                quantity_before: 0,
                quantity_after: 0,
                confirmer:"-",
                expiry_date:"-",
                remarks:"-"
            },
            {
                id: 3,
                working_date: "2023-09-14 (Thu) 23:38:18",
                inventory_date: "2023-09-14	",
                product_type: "食料",
                product_name: "栄養補助食品",
                quantity_before: 0,
                quantity_after: 0,
                confirmer:"QA",
                expiry_date:"2023-09-25",
                remarks:"test update"
            },
        ]
    },
    getStaffStockpileHistorySmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getStaffStockpileHistoryMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getStaffStockpileHistoryLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getStaffStockpileHistoryXLarge() {
        return Promise.resolve(this.getData());
    },

}