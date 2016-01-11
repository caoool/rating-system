if (Meteor.isClient) {
    Template.home.events({
        'click button': function(event) {
            Meteor.users.update(Meteor.userId(), {$set: {'profile.firstName': "Lu" }});
            Meteor.users.update(Meteor.userId(), {$set: {'profile.lastName': "Cao" }});
            console.log(Meteor.user());
        }
    });
}