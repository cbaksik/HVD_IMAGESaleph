/**
 * Created by samsan on 7/17/17.
 */

angular.module('viewCustom')
    .controller('customViewAllComponentMetadataController', [ '$sce','$element','$location','prmSearchService','$window','$stateParams', function ($sce, $element,$location, prmSearchService, $window, $stateParams) {

        var vm = this;
        var sv=prmSearchService;
        vm.params=$location.search();
        // get ui-router parameters
        vm.context=$stateParams.context;
        vm.docid=$stateParams.docid;

        vm.xmldata=[];
        vm.items={};

        vm.getData=function () {
          var restUrl=vm.parentCtrl.searchService.cheetah.restUrl+'/'+vm.context+'/'+vm.docid;
          var params={'vid':'HVD_IMAGES','lang':'en_US','search_scope':'default_scope','adaptor':'Local Search Engine'}
          params.vid=vm.params.vid;
          params.lang=vm.params.lang;
          params.search_scope=vm.params.search_scope;
          params.adaptor=vm.params.adaptor;
          sv.getAjax(restUrl,params,'get')
              .then(function (result) {
                  vm.items=result.data;
                  vm.xmldata = sv.getXMLdata(vm.items.pnx.addata.mis1[0]);

                  console.log('**** vm.xmldata ****');
                  console.log(vm.xmldata);
                  console.log(vm.items)

              },function (err) {
                  console.log(err);
              })

        };

        // show the pop up image
        vm.gotoFullPhoto=function (index) {

            // go to full display page
            var url='/primo-explore/viewcomponent/'+vm.context+'/'+vm.docid+'/'+index+'?vid='+vm.params.vid+'&lang='+vm.params.lang;
            if(vm.params.adaptor) {
                url+='&adaptor='+vm.params.adaptor;
            }
            $window.open(url,'_blank');
        };

        vm.$onChanges=function() {
            // hide search box
            var el=$element[0].parentNode.parentNode.children[0].children[2];
            if(el) {
                el.style.display = 'none';
            }

            vm.getData();

        };



    }]);


angular.module('viewCustom')
    .component('customViewAllComponentMetadata', {
        bindings: {parentCtrl: '<'},
        controller: 'customViewAllComponentMetadataController',
        controllerAs:'vm',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/custom-view-all-component-metadata.html'
    });

