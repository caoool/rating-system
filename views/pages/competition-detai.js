if (Meteor.isClient) {

    globalDep = new Tracker.Dependency();

    var selctedNode;
    var selectedNodeParent;

    Template.competitionDetail.rendered = function() {
        console.log(Router.current().data());
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
                    globalDep.depend();
                    if(node.id === '#') {
                        var rootNode = [{
                            text : Router.current().data().title,
                            id : 'Root',
                            children : true
                        }];
                        cb(rootNode);
                    }
                    else {
                        var nodes = Competitions.findOne({_id: Router.current().data()._id}).hierarchy;
                        cb(nodes);
                    }
                }
            },
            'plugins' : [ ]
        });

        //$('#jstree').on('loaded.jstree', function() {
        //    $('#jstree').jstree('open_all');
        //});
        //$('#jstree').on('close_node.jstree', function (e, data) {
        //    $('#jstree').jstree('open_all');
        //});

        $('#jstree').on('select_node.jstree', function (e, data) {
            selectedNode = data.node.id;
            selectedNodeParent = data.node.parent;
        });


    };

    Template.competitionDetail.events({
        'click #addNode' : function() {
            var name = $('#node').val();
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
                            } else {
                                toastr.success('Group added.', 'Success!', {timeOut: 2000});
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
        }

    });
}