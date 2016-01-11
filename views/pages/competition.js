if (Meteor.isClient) {
    var competitionId = "";

    Template.competition.rendered = function(){

        var form = $("#new-competition");

        form.steps({
            bodyTag: "fieldset",
            titleTemplate: '#title#',
            transitionEffect: "fade",
            onStepChanging: function (event, currentIndex, newIndex) {
                return form.valid();
            },
            onFinishing: function (event, currentIndex) {
                return form.valid();
            },
            onFinished: function (event, currentIndex) {
                var title = event.target.title.value;
                var organizer = event.target.organizer.value;
                var business = event.target.business.value;
                var fax = event.target.fax.value;
                var email = event.target.email.value;
                var time = event.target.time.value;
                var date = event.target.date.value;
                var street = event.target.street.value;
                var city = event.target.city.value;
                var state = event.target.state.value;
                var zipCode = event.target.zipCode.value;
                var country = event.target.country.value;
                var phone = {
                    business: business,
                    fax: fax
                };
                var location = {
                    street: street,
                    city: city,
                    state: state,
                    zipCode: zipCode,
                    country: country
                };
                console.log(location);
                Competitions.insert({
                    title: title,
                    organizer: organizer,
                    phone: phone,
                    email: email,
                    time: time,
                    date: date,
                    location: location
                }, function(err, competition) {
                    if (err) {
                        toastr.error(err, 'Error!', {timeOut: 2000});
                    } else {
                        toastr.success('Campaign created.', 'Success!', {timeOut: 2000});
                        $('.modal').modal('hide');
                    }
                });
            },
            onCanceled: function(event) {
                $('.modal').modal('hide');
            },
            onInit: function (event, currentIndex) {
            }
        });

        $('#timePicker').clockpicker({
            placement: 'bottom',
            autoclose: true
        });

        $('#datePicker').datepicker({
            keyboardNavigation: false,
            forceParse: false,
            autoclose: true
        });

        var organization = Organizations.findOne({_id: Meteor.user().profile.organization_id});
        form.find('input[name="organizer"]').val(organization.title);
        form.find('input[name="business"]').val(organization.phone.business);
        form.find('input[name="fax"]').val(organization.phone.fax);
        form.find('input[name="email"]').val(organization.email);
    };

    Template.competition.events({
        // handle organization modal
        'submit #edit-competition': function (event) {
            event.preventDefault();

            var title = event.target.title.value;
            var organizer = event.target.organizer.value;
            var business = event.target.business.value;
            var fax = event.target.fax.value;
            var email = event.target.email.value;
            var time = event.target.time.value;
            var date = event.target.date.value;
            var street = event.target.street.value;
            var city = event.target.city.value;
            var state = event.target.state.value;
            var zipCode = event.target.zipCode.value;
            var country = event.target.country.value;
            var phone = {
                business: business,
                fax: fax
            };
            var location = {
                street: street,
                city: city,
                state: state,
                zipCode: zipCode,
                country: country
            };

            Competitions.update({_id: "fill"},{
                $set: {
                    title: title,
                    organizer: organizer,
                    phone: phone,
                    email: email,
                    time: time,
                    date: date,
                    location: location
                }
            }, function(err, competition) {
                if (err) {
                    toastr.error(err, 'Error!', {timeOut: 2000});
                } else {
                    toastr.success('Campaign updated.', 'Success!', {timeOut: 2000});
                    $('.modal').modal('hide');
                }
            });

            $('.modal').modal('hide');
        },

        'click .btn-id': function (event) {
            competitionId = this._id;
            Session.set('selectedCompetition', competitionId);
        }
    });

    Template.competition.helpers({
        competitions: function() {
            return Competitions.find({createBy: Meteor.userId()});
        },
        competition: function() {
            return Competitions.findOne({_id: Session.get('selectedCompetition')});
        }
    });
}