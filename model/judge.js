Judges = new Mongo.Collection('judges');

Schema.Judge = new SimpleSchema({
    name: {
        type: String
    },
    phone: {
        type: String
    },
    gender: {
        type: String,
        allowedValues: ['male', 'female'],
        optional: true
    },
    birthday: {
        type: String,
        max: 10,
        optional: true
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        max: 254,
        optional: true
    },
    address: {
        type: Schema.Address,
        optional: true
    },
    competitionId: {
        type: String,
        optional: true
    },
    groupId: {
        type: String,
        optional: true
    },
    createBy: {
        type: String,
        autoValue: function() {
            if (this.userId) {
                return this.userId;
            } else {
                return "online registration";
            }
        }
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date()};
            } else {
                this.unset();
            }
        }
    },
    updatedAt: {
        type: Date,
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }
        },
        denyInsert: true,
        optional: true
    }
});

Judges.attachSchema(Schema.Judge);