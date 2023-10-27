/*eslint no-undef: 0*/

export const StaffStockpileDashboardService = {
    getData() {
        return [
            {
                id: 1,
                inventory_date: "2023-09-27",
                product_type: "食料",
                product_name: "栄養補助食品",
                quantity: 0,
                confirmer:"Qa",
                expiry_date:"2023-12-31",
                remarks:"remarks check update",
            },
            {
                id: 2,
                inventory_date: "-",
                product_type: "食料",
                product_name: "栄養補助食品",
                confirmer:"-",
                quantity: 0,
                expiry_date:"-",
                remarks:"-"
            },
            {
                id: 3,
                inventory_date: "2023-09-14	",
                product_type: "食料",
                product_name: "栄養補助食品",
                confirmer:"QA",
                quantity: 0,
                expiry_date:"2023-09-25",
                remarks:"test update"
            },
        ]
    },
    getStaffStockpileDashboardSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getStaffStockpileDashboardMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getStaffStockpileDashboardLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getStaffStockpileDashboardXLarge() {
        return Promise.resolve(this.getData());
    },

}