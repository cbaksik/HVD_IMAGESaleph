/**
 * Created by samsan on 7/17/17.
 */

angular.module('viewCustom')
    .controller('customViewAllComponentMetadataController', [ '$sce','$element','$location','prmSearchService', function ($sce, $element,$location, prmSearchService) {

        var vm = this;
        var sv=prmSearchService;
        vm.params=$location.search();
        vm.xmldata=[];
        vm.items={};

        vm.getData=function () {
          var restUrl=vm.parentCtrl.searchService.cheetah.restUrl+'/'+vm.params.context+'/'+vm.params.docid;
          var params={'vid':'HVD_IMAGES','lang':'en_US','search_scope':'default_scope','adaptor':'Local Search Engine'}
          params.vid=vm.params.vid;
          params.lang=vm.params.lang;
          params.search_scope=vm.params.search_scope;
          params.adaptor=vm.params.adaptor;
          sv.getAjax(restUrl,params,'get')
              .then(function (result) {
                  vm.items=result.data;
                  vm.xmldata = sv.parseXml(vm.items.pnx.addata.mis1[0]);
                  if(vm.xmldata.work) {
                      vm.xmldata=vm.xmldata.work[0];
                  } else if(vm.xmldata.group) {
                      vm.xmldata=vm.xmldata.group[0];
                      if(vm.xmldata.subwork) {
                          vm.xmldata.surrogate=vm.xmldata.subwork;
                      }

                  }

                  console.log('**** vm.xmldata ****');
                  console.log(vm.xmldata);

              },function (err) {
                  console.log(err);
              })

        };

        vm.$onChanges=function() {
            console.log('*** custom-view-all-component-metadata ***');
            console.log(vm);
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

