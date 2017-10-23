/**
 * Created by samsan on 6/29/17.
 */

angular.module('viewCustom')
    .controller('prmTopbarAfterController', ['$element','prmSearchService', function ($element,prmSearchService) {

        let vm = this;
        let cs = prmSearchService;

        // get rest endpoint Url
        vm.getUrl=function () {
            cs.getAjax('/primo-explore/custom/HVD_IMAGES/html/config.html','','get')
                .then(function (res) {
                        vm.api=res.data;
                        cs.setApi(vm.api);
                    },
                    function (error) {
                        console.log(error);
                    }
                )
        };

        vm.$onChanges=function() {
            // get api url for cross site
            vm.getUrl();
        };

        vm.$onInit=function() {
            // hide primo tab menu
            vm.parentCtrl.showMainMenu=false;
            // create new div for the top white menu
            var el=$element[0].parentNode.parentNode.parentNode.parentNode.parentNode;
            var div=document.createElement('div');
            div.setAttribute('id','customTopMenu');
            div.setAttribute('class','topMenu');
            if(el.children[0].className !== 'topMenu') {
                el.prepend(div);
            }

        };

    }]);


angular.module('viewCustom')
    .component('prmTopbarAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmTopbarAfterController'
    });
