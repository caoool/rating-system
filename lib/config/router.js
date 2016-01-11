Router.configure({
    layoutTemplate: 'blankLayout',
    notFoundTemplate: 'notFound'
});

Router.onBeforeAction(function () {
    if (!Meteor.userId()) {
        this.render('login');
    } else {
        this.next();
    }
}, {
    except: [
        'landing',
        'login',
        'register'
    ]
});

Router.route('/', function () {
    this.render('home');
    this.layout('mainLayout');
});

Router.route('/landing', function () {
    this.render('landing');
});

Router.route('/login', function() {
    this.render('login');
});

Router.route('/register', function() {
    this.render('register');
});

Router.route('/home', function () {
    this.render('home');
    this.layout('mainLayout');
});

Router.route('/myProfile', function () {
    this.render('my-profile');
});

Router.route('/competition', function () {
    this.render('competition');
    this.layout('mainLayout');
});

Router.route('/competitionDetail', function () {
    this.render('competitionDetail');
    this.layout('mainLayout');
});



