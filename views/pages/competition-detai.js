if (Meteor.isClient) {

    var dataDep = new Tracker.Dependency();
    var selectedNodeDep = new Tracker.Dependency();
    var hoverNode = null;

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

        //$('#jstree').on('loaded.jstree', function() {
        //    $('#jstree').jstree('open_all');
        //});
        //$('#jstree').on('close_node.jstree', function (e, data) {
        //    $('#jstree').jstree('open_all');
        //});

        $('#jstree').on('select_node.jstree', function (e, data) {
            selectedNode = data.node.id;
            selectedNodeDep.changed();
        });

        $('#jstree').on('hover_node.jstree', function (e, data) {
            hoverNode = data.node.id;
        });

        $('#jstree').on('dehover_node.jstree', function (e, data) {
            hoverNode = null;
        });
    };

    Template.competitionDetail.events({
        'click #addNode' : function() {
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

        'click #renameNode' : function() {
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
                });
            }
            $('#judgeName').val('');
            $('#judgePhone').val('');
        },

        'click .removeJudge' : function(e) {
            Judges.remove(e.target.id);
        },

        'dragstart .ui-draggable' : function(e, t) {
        },

        'dragend .ui-draggable' : function(e, t) {
            e.preventDefault();
            console.log(e.target.id);
            console.log(hoverNode);
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
        }
    });
}