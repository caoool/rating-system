if (Meteor.isClient) {
    Template.registerHelper('formatDate', function(date) {
        var curr_date = date.getDate();
        var curr_month = date.getMonth() + 1; //Months are zero based
        var curr_year = date.getFullYear();
        return curr_month + "/" + curr_date + "/" + curr_year;
    });

    Template.registerHelper('toDate', function(date) {
        return moment(date).fromNow();
    })
}
