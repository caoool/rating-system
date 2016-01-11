if (Meteor.isClient) {
    Template.register.rendered = function() {
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
        //        },
        //        confirm: {
        //            required: true,
        //            equalTo: "#password"
        //        }
        //    }
        //});
    };

    Template.register.events({
        'submit form': function(event){
        event.preventDefault();
        var username = event.target.username.value;
        var password = event.target.password.value;
        var confirm = event.target.confirm.value;
        Accounts.createUser({
            username: username,
            password: password
        }, function(err) {
            if (err) {
                $('#errMsg').text(err.reason);
                $('#errMsg').show();
            } else {
                Router.go('/home');
            }
        });
    },

    'focus input': function(event){
        $('#errMsg').hide();
    }
});
}
