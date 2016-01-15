Competitions = new Mongo.Collection('competitions');

Schema.Group = new SimpleSchema({
    id: {
        type: String
    },
    parent: {
        type: String
    },
    text: {
        type: String
    },
    rounds: {
        type: [ Number ],
        optional: true
    }
});

Schema.Competition = new SimpleSchema({
    title: {
        type: String,
        max: 50
    },
    organizer: {
        type: String,
        max: 50,
        optional: true
    },
    phone: {
        type: Schema.Phone,
        optional: true
    },
    email: {
        type: String,
        max: 254,
        regEx: SimpleSchema.RegEx.Email,
        optional: true
    },
    time: {
        type: String,
        max: 5,
        optional: true
    },
    date: {
        type: Date,
        max: 10,
        optional: true
    },
    location: {
        type: Schema.Address,
        optional: true
    },
    hierarchy: {
        type: [ Schema.Group ],
        optional: true,
        defaultValue: [ {
            id: "RootModern",
            parent: "Root",
            text: "Modern"
        }, {
            id: "RootLatin",
            parent: "Root",
            text: "Latin"
        }, {
            id: "RootLatinAmateur",
            parent: "RootLatin",
            text: "Amateur"
        }, {
            id: "RootLatinProfession",
            parent: "RootLatin",
            text: "Profession"
        }]
    },
    createBy: {
        type: String,
        autoValue: function() {
            return this.userId;
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

Competitions.attachSchema(Schema.Competition);