/**
 * Created by samsan on 6/29/17.
 */

angular.module('viewCustom')
    .component('customTopMenu', {
        templateUrl:'/primo-explore/custom/HVD_IMAGES/html/custom-top-menu.html',
        bindings: {
            parentCtrl:'<',
        },
        controllerAs:'vm',
        controller:[function() {
            var vm=this;

            vm.topRightMenus=[{'title':'HOLLIS +','url':'http://nrs.harvard.edu/urn-3:hul.ois:bannerhollis+','label':'Go to Hollis plus'},
                {'title':'Libraries / Hours','url':'http://nrs.harvard.edu/urn-3:hul.ois:bannerfindlib','label':'Go to Library hours'},
                {'title':'All My Accounts','url':'http://nrs.harvard.edu/urn-3:hul.ois:banneraccounts','label':'Go to all my accounts'},
                {'title':'Feedback','url':'http://nrs.harvard.edu/urn-3:HUL.ois:hollisImages','label':'Go to Feedback'}
            ];

        }]
    });
