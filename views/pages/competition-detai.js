if (Meteor.isClient) {

    var dataDep = new Tracker.Dependency();
    var selectedNodeDep = new Tracker.Dependency();
    var hoverNode = null;
    var draggedCompetitor = null;
    var selectedCompetitor = null;
    var selectedCompetitorDep = new Tracker.Dependency();
    var selectedJudge = null;
    var selectedJudgeDep = new Tracker.Dependency();
    var selectedGroup = null;
    var selectedGroupDep = new Tracker.Dependency();

    Template.competitionDetail.rendered = function() {

        selectedNode = '';

        $('#jstree').jstree({
            'core' : {
                'check_callback' : true,
                'themes' : {
                    variant : 'large',
                    icons : false,
                    dots : false
                },
                'expand_selected_onload' : true,
                data: function (node, cb) {
                    dataDep.depend();
                    if(node.id === '#') {
                        var rootNode = [{
                            text : Router.current().data().title,
                            id : 'Root',
                            children : true
                        }];
                        cb(rootNode);
                    }
                    else {
                        selectedNode = '';
                        var nodes = Competitions.findOne({_id: Router.current().data()._id}).hierarchy;
                        cb(nodes);
                    }
                }
            },
            'plugins' : [ 'wholerow' ]
        });

        $('#jstree').on('loaded.jstree', function() {
            $('#jstree').jstree('open_all');
        });

        $('#jstree').on('select_node.jstree', function (e, data) {
            selectedNode = data.node.id;
            selectedNodeDep.changed();
            selectedCompetitor = null;
            selectedCompetitorDep.changed();
            selectedJudge = null;
            selectedJudgeDep.changed();
            selectedGroup = data.node.id;
            selectedGroupDep.changed();
        });

        $('#jstree').on('hover_node.jstree', function (e, data) {
            hoverNode = data.node.id;
        });

        $('#jstree').on('dehover_node.jstree', function (e, data) {
            hoverNode = null;
        });
    };

    Template.competitionDetail.events({
        'click #addNode' : function(e) {
            e.preventDefault();
            var name = $('#node').val();
            if (!name) { return; }
            if (selectedNode) {
                var found = false;
                var hierarchy = Competitions.findOne({_id: Router.current().data()._id}).hierarchy;
                for (var i = 0; i < hierarchy.length; i++) {
                    //console.log("name: " + name);
                    //console.log("text: " + hierarchy[i].text);
                    //console.log("selectedNode: " + selectedNode);
                    //console.log("id: " + hierarchy[i].parent);
                    if (name === hierarchy[i].text && selectedNode === hierarchy[i].parent) {
                        found = true;
                        break;
                    }
                }
                if (found) {
                    toastr.error('Name exists, please use a different name.', 'Error!', {timeOut: 2000});
                    $('#node').val('');
                } else {
                    Competitions.update(
                        {_id: Router.current().data()._id},
                        {
                            $push: {
                                hierarchy: {id: selectedNode+name, parent: selectedNode, text: name}
                            }
                        }, function (err) {
                            if (err) {
                                toastr.error(err, 'Error!', {timeOut: 2000});
                                $('#node').val('');
                            } else {
                                toastr.success('Group added.', 'Success!', {timeOut: 2000});
                                $('#node').val('');
                            }
                        });
                }
            }
        },

        'click #removeNode' : function() {
            if (selectedNode && selectedNode !== 'root') {
                var found = false;
                var hierarchy = Competitions.findOne({_id: Router.current().data()._id}).hierarchy;
                for (var i = 0; i < hierarchy.length; i++) {
                    //console.log("name: " + name);
                    //console.log("text: " + hierarchy[i].text);
                    //console.log("selectedNode: " + selectedNode);
                    //console.log("id: " + hierarchy[i].parent);
                    if (selectedNode === hierarchy[i].parent) {
                        found = true;
                        break;
                    }
                }
                if (found) {
                    toastr.error('You cannot remove a directory unless it is empty.', 'Error!', {timeOut: 2000});
                } else {
                    Competitions.update(
                        {_id: Router.current().data()._id},
                        {
                            $pull: {
                                hierarchy: {id: selectedNode}
                            }
                        }, function (err) {
                            if (err) {
                                toastr.error(err, 'Error!', {timeOut: 2000});
                            } else {
                                toastr.success('Group removed.', 'Success!', {timeOut: 2000});
                            }
                        });
                }
            }
            $('#jstree').jstree('open_all');
        },

        'click #renameNode' : function(e) {
            e.preventDefault();
            $('#jstree').jstree('open_all');
            //var name = $('#node').val();
            //if (selectedNode && selectedNode !== 'root') {
            //    Competitions.update({
            //        _id: Router.current().data()._id,
            //        'hierarchy.id': selectedNode
            //    }, {
            //        $set: {
            //                'hierarchy.$.text': name
            //            }
            //        }, function (err) {
            //            if (err) {
            //                toastr.error(err, 'Error!', {timeOut: 2000});
            //            } else {
            //                toastr.success('Group updated.', 'Success!', {timeOut: 2000});
            //            }
            //        });
            //}
        },

        'click #addCompetitor' : function() {
            if ($('#competitor1').val() || $('#competitor2').val()) {
                var competitor1 = {
                    name: $('#competitor1').val(),
                    gender: 'male'
                }
                var competitor2 = {
                    name: $('#competitor2').val(),
                    gender: 'female'
                }
                Competitors.insert({
                    competitor1 : competitor1,
                    competitor2 : competitor2,
                    'competitionId' : Router.current().data()._id,
                    'groupId': selectedNode
                }, function(err) {
                    if (err) {
                        toastr.error(err, 'Error!', {timeOut: 2000});
                    } else {
                        toastr.success('Competitor added.', 'Success!', {timeOut: 2000});
                    }
                });
            }

            //var type = 0; // 0 for no input, 1 for male, 2 for female, 3 for couple
            //var competitor1, competitor2;
            //if ($('#competitor1').val()) {
            //    type = 1;
            //    competitor1 = {
            //        name: $('#competitor1').val(),
            //        gender: 'male'
            //    }
            //} else if ($('#competitor2').val()) {
            //    type = 2;
            //    competitor2 = {
            //        name: $('#competitor2').val(),
            //        gender: 'female'
            //    }
            //}
            //if ($('#competitor1').val() && $('#competitor2').val()) {
            //    type = 3;
            //    competitor1 = {
            //        name: $('#competitor1').val(),
            //        gender: 'male'
            //    }
            //    competitor2 = {
            //        name: $('#competitor2').val(),
            //        gender: 'female'
            //    }
            //}
            //
            //switch (type) {
            //    case 0:
            //        break;
            //    case 1:
            //        Competitors.insert({
            //            competitor1 : competitor1,
            //            'competitionId' : Router.current().data()._id,
            //            'groupId': selectedNode
            //        });
            //        break;
            //    case 2:
            //        Competitors.insert({
            //            competitor2 : competitor2,
            //            'competitionId' : Router.current().data()._id,
            //            'groupId': selectedNode
            //        });
            //        break;
            //    case 3:
            //        Competitors.insert({
            //            competitor1 : competitor1,
            //            competitor2 : competitor2,
            //            'competitionId' : Router.current().data()._id,
            //            'groupId': selectedNode
            //        });
            //        break;
            //}
            $('#competitor1').val('');
            $('#competitor2').val('');
        },

        'click .removeCompetitor' : function(e) {
            Competitors.remove(e.target.id);
        },

        'click #addJudge' : function() {
            if ($('#judgeName').val() && $('#judgePhone').val()) {
                Judges.insert({
                    name : $('#judgeName').val(),
                    phone : $('#judgePhone').val(),
                    'competitionId' : Router.current().data()._id,
                    'groupId': selectedNode
                }, function(err) {
                    if (err) {
                        toastr.error(err, 'Error!', {timeOut: 2000});
                    } else {
                        toastr.success('Judge added.', 'Success!', {timeOut: 2000});
                    }
                });
            }
            $('#judgeName').val('');
            $('#judgePhone').val('');
        },

        'click .removeJudge' : function(e) {
            Judges.remove(e.target.id);
        },

        'click .comp' : function(e) {
            selectedJudge = null;
            selectedJudgeDep.changed();
            selectedGroup = null;
            selectedGroupDep.changed();
            selectedCompetitor = e.target.id;
            selectedCompetitorDep.changed();
        },

        'click .judge' : function(e) {
            selectedCompetitor = null;
            selectedCompetitorDep.changed();
            selectedGroup = null;
            selectedGroupDep.changed();
            selectedJudge = e.target.id;
            selectedJudgeDep.changed();
        },

        'submit .updateCompetitor' : function(e) {
            e.preventDefault();
            var name1 = e.target.name1.value;
            var phone1 = e.target.phone1.value;
            var city1 = e.target.city1.value;
            var country1 = e.target.country1.value;
            var name2 = e.target.name2.value;
            var phone2 = e.target.phone2.value;
            var city2 = e.target.city2.value;
            var country2 = e.target.country2.value;
            var org = e.target.org.value;
            Competitors.update({_id: e.target.id}, {
                $set: {
                    'competitor1.name': name1,
                    'competitor1.phone': phone1,
                    'competitor1.address.city': city1,
                    'competitor1.address.country': country1,
                    'competitor2.name': name2,
                    'competitor2.phone': phone2,
                    'competitor2.address.city': city2,
                    'competitor2.address.country': country2,
                    'organization': org
                }
            }, function(err) {
                if (err) {
                    toastr.error(err, 'Error!', {timeOut: 2000});
                } else {
                    toastr.success('Competitor updated.', 'Success!', {timeOut: 2000});
                }
            })
        },

        'submit .updateJudge' : function(e) {
            e.preventDefault();
            var name = e.target.name.value;
            var phone = e.target.phone.value;
            var city = e.target.city.value;
            var country = e.target.country.value;
            var org = e.target.org.value;
            Judges.update({_id: e.target.id}, {
                $set: {
                    'name': name,
                    'phone': phone,
                    'address.city': city,
                    'address.country': country,
                    'organization': org
                }
            }, function(err) {
                if (err) {
                    toastr.error(err, 'Error!', {timeOut: 2000});
                } else {
                    toastr.success('Judge updated.', 'Success!', {timeOut: 2000});
                }
            })
        },

        'submit .populateRounds' : function(e) {
            e.preventDefault();
            Meteor.call('updateRounds', Router.current().data()._id, selectedNode, $('#promote').val());
        },

        'click .removeRounds' : function(e) {
            e.preventDefault();
            Meteor.call('removeRounds', Router.current().data()._id, selectedNode, e.target.id);
        },

        'dragstart .ui-draggable' : function(e, t) {
            $('body').css('cursor', 'progress');
            draggedCompetitor = e.target.id;
            e.preventDefault();
        },

        'mouseup': function() {
            $('body').css('cursor', 'default');
            Competitors.update({_id: draggedCompetitor}, {
                $set: {
                    groupId: hoverNode
                }
            }, function(err) {
                if (err) {
                    toastr.error(err, 'Error!', {timeOut: 2000});
                } else {
                    toastr.success('Competitor moved.', 'Success!', {timeOut: 2000});
                }
            });
            draggedCompetitor = null;
        }
    });

    Template.competitionDetail.helpers({
        competitors : function() {
            selectedNodeDep.depend();
            if (selectedNode === 'Root' || !selectedNode) {
                return Competitors.find({
                    'competitionId': Router.current().data()._id
                });
            } else {
                return Competitors.find({
                    'competitionId': Router.current().data()._id,
                    'groupId': selectedNode
                });
            }
        },

        judges : function() {
            selectedNodeDep.depend();
            if (selectedNode === 'Root' || !selectedNode) {
                return Judges.find({
                    'competitionId': Router.current().data()._id
                });
            } else {
                return Judges.find({
                    'competitionId': Router.current().data()._id,
                    'groupId': selectedNode
                });
            }
        },

        competitor : function() {
            selectedCompetitorDep.depend();
            return Competitors.findOne({_id: selectedCompetitor});
        },
        judge: function() {
            selectedJudgeDep.depend();
            return Judges.findOne({_id: selectedJudge});
        },
        group: function() {
            selectedGroupDep.depend();
            var hierarchy = Competitions.findOne({_id: Router.current().data()._id}).hierarchy;
            for (var i = 0, len = hierarchy.length; i < len; i++) {
                if (hierarchy[i].id === selectedGroup) {
                    return hierarchy[i];
                }
            }
        }
    });

    Template.registerHelper('getNumberOfCompetitorsInGroup', function (id) {
        return Competitors.find({
            'competitionId': Router.current().data()._id,
            'groupId': id
        }).fetch().length;;
    });
    Template.registerHelper('getNumberOfJudgesInGroup', function (id) {
        return Judges.find({
            'competitionId': Router.current().data()._id,
            'groupId': id
        }).fetch().length;;
    });
}

Meteor.methods({
    updateRounds: function(competitionId, groupId, value) {
        Competitions.update(
            {
                _id: competitionId,
                'hierarchy.id': groupId
            }, {
                $push: {
                    'hierarchy.$.rounds': value
                }
            });
    },
    removeRounds: function(competitionId, groupId, value) {
        var roundsIndex = 'hierarchy.$.rounds.'+value;
        var query = {};
        query[roundsIndex] = 1;
        Competitions.update(
            {
                _id: competitionId,
                'hierarchy.id': groupId
            }, {
                $unset: query
            });
        Competitions.update(
            {
                _id: competitionId,
                'hierarchy.id': groupId
            }, {
                $pull: {
                    'hierarchy.$.rounds': null
                }
            });
    }
})