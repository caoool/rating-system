Schema = {};
Schema.Name = new SimpleSchema({
    firstName: {
        type: String,
        max: 35,
        optional: true
    },
    lastName: {
        type: String,
        max: 35,
        optional: true
    },
    middleName: {
        type: String,
        max: 35,
        optional: true
    }
});

Schema.Address = new SimpleSchema({
    street: {
        type: String,
        max: 95,
        optional: true
    },
    city: {
        type: String,
        max: 30,
        optional: true
    },
    state: {
        type: String,
        max: 3,
        optional: true
    },
    zipCode: {
        type: String,
        max: 6,
        optional: true
    },
    country: {
        type: String,
        max: 2,
        optional: true
    }
});

Schema.Phone = new SimpleSchema({
    mobile: {
        type: String,
        max: 11,
        optional: true
    },
    business: {
        type: String,
        max: 11,
        optional: true
    },
    fax: {
        type: String,
        max: 11,
        optional: true
    }
});
