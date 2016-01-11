if (Meteor.isClient) {
    Template.login.rendered = function() {
        //$("#form").validate({
        //    rules: {
        //        username: {
        //            required: true,
        //            rangelength: [6, 20],
        //            lettersAndNumbersOnly: true
        //        },
        //        password: {
        //            required: true,
        //            rangelength: [6, 20],
        //            lettersAndNumbersOnly: true
        //        }
        //    }
        //});
    };

    Template.login.events({
        'submit form': function(event) {
            event.preventDefault();
            var username = event.target.username.value;
            var password = event.target.password.value;
            Meteor.loginWithPassword(username, password, function(error) {
                if (Meteor.user()) {
                    Router.go('home');
                } else {
                    $('#loginError').show();
                }
            });
        },

        'focus input': function(event) {
            $('#loginError').hide();
        }
    });
}