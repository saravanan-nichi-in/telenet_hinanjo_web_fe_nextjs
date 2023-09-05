/*eslint no-undef: 0*/
export const AdminMaterialService = {
    getData() {
        return [
            { "ID": 1, 
            "物資":<a href="#">Test1</a>,
            "単位":"2"},
            { "ID": 2, 
            "物資":<a href="#">Test2</a>,
            "単位":"2"},
            { "ID": 3, 
            "物資":<a href="#">Test3</a>,
            "単位":"3"},
            { "ID": 4, 
            "物資":<a href="#">Test6</a>,
            "単位":"5"},
        ]
    },
    getAdminsMaterialSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getAdminsMaterialMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getAdminsMaterialLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getAdminsMaterialXLarge() {
        return Promise.resolve(this.getData());
    },

}