if (Meteor.isClient) {
    Template.navigation.rendered = function(){

        // Initialize metisMenu
        $('#side-menu').metisMenu();

        // date picker
        $('#birthdayPicker').datepicker({
            keyboardNavigation: false,
            forceParse: false,
            autoclose: true
        });
    };

    Template.navigation.events({

        'click .close-canvas-menu': function () {
            $('body').toggleClass("mini-navbar");
        },

        // handle profile modal
        'submit #form-profile': function (event) {
            event.preventDefault();

            var firstName = event.target.firstName.value;
            var lastName = event.target.lastName.value;
            var middleName = event.target.middleName.value;
            var gender = event.target.gender.value;
            var birthday = event.target.birthday.value;
            var mobile = event.target.mobile.value;
            var business = event.target.business.value;
            var email = event.target.email.value;
            var street = event.target.street.value;
            var city = event.target.city.value;
            var state = event.target.state.value;
            var zipCode = event.target.zipCode.value;
            var country = event.target.country.value;
            var name = {
                firstName: firstName,
                lastName: lastName,
                middleName: middleName
            };
            var phone = {
                mobile: mobile,
                business: business
            };
            var address = {
                street: street,
                city: city,
                state: state,
                zipCode: zipCode,
                country: country
            };
            Meteor.users.update(Meteor.userId(), {
                $set: {
                    'profile.name': name,
                    'profile.gender': gender,
                    'profile.birthday': birthday,
                    'profile.phone': phone,
                    'profile.email': email,
                    'profile.address': address
                }
            }, function(err) {
                if (err) {
                    toastr.error(err, 'Error!', {timeOut: 2000});
                    console.log(err);
                } else {
                    toastr.success('Profile updated.', 'Success!', {timeOut: 2000});
                }
            });

            $('.modal').modal('hide');
        },

        // handle organization modal
        'submit #form-organization': function (event) {
            event.preventDefault();

            var title = event.target.title.value;
            var business = event.target.business.value;
            var fax = event.target.fax.value;
            var email = event.target.email.value;
            var website = event.target.website.value;
            var street = event.target.street.value;
            var city = event.target.city.value;
            var state = event.target.state.value;
            var zipCode = event.target.zipCode.value;
            var country = event.target.country.value;
            var phone = {
                business: business,
                fax: fax
            };
            var address = {
                street: street,
                city: city,
                state: state,
                zipCode: zipCode,
                country: country
            };

            var organizationId = Meteor.user().profile.organization_id;
            if (organizationId) {
                Organizations.update({_id: organizationId}, {
                    $set: {
                        title: title,
                        phone: phone,
                        email: email,
                        website: website,
                        address: address
                    }
                }, function(err) {
                    if (err) {
                        toastr.error(err, 'Error!', {timeOut: 2000});
                    } else {
                        toastr.success('Organization updated.', 'Success!', {timeOut: 2000});
                    }
                })
            } else {
                Organizations.insert({
                    title: title,
                    phone: phone,
                    email: email,
                    website: website,
                    address: address
                }, function(err, organization_id) {
                    if (err) {
                        toastr.error(err, 'Error!', {timeOut: 2000});
                    } else {
                        Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.organization_id': organization_id}}, function(err) {
                            if (err) {
                                toastr.error(err, 'Error!', {timeOut: 2000});
                            } else {
                                toastr.success('Organization updated.', 'Success!', {timeOut: 2000});
                            }
                        });
                    }
                })
            }

            $('.modal').modal('hide');
        },

        // handle account modal
        'submit #form-account': function (event) {
            event.preventDefault();
            var oldPassword = event.target.oldPassword.value;
            console.log(oldPassword);
            var newPassword = event.target.newPassword.value;
            console.log(newPassword);
            var l = Ladda.create(document.querySelector('.ladda-button'));
            l.start();
            Accounts.changePassword(oldPassword, newPassword, function(err) {
                if (err) {
                    toastr.error(err.reason, 'Error!', {timeOut: 2000});
                    l.stop();
                    console.log(err);
                } else {
                    toastr.success('Password updated.', 'Success!', {timeOut: 2000});
                    l.stop();
                    $('.modal').modal('hide');
                }
            });
        }
    });

    Template.navigation.helpers({
        organization: function() {
            return Organizations.findOne({_id: Meteor.user().profile.organization_id});
        }
    });
}