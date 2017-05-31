/**
 * Created by samsan on 5/30/17.
 */

angular.module('viewCustom')
    .controller('prmFacetAfterController', [ 'angularLoad','prmSearchService', function (angularLoad,prmSearchService) {
        let vm=this;
        // initialize custom service search
        let sv=prmSearchService;
        // get page object
        var pageObj=sv.getPage();



        vm.$doCheck=function() {

            var prmTag=document.getElementsByTagName('prm-facet-exact');

            for (var i=0; i < prmTag.length; i++) {
                var tag=prmTag[i];
                var strong = tag.getElementsByTagName('strong')[0];
                if(strong) {
                    strong.onclick=function (e) {
                      console.log('*** click event ***');
                      console.log(e);
                      // reset the current page of pagination
                      pageObj.currentPage=1;
                      vm.parentCtrl.currentPage=1;
                      sv.setPage(pageObj);
                    };

                }
            }

        }

    }]);



angular.module('viewCustom')
    .component('prmFacetAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmFacetAfterController'
    });

