/**
 * Created by samsan on 7/17/17.
 */

angular.module('viewCustom')
    .controller('customViewAllComponentMetadataController', [ '$sce','$element','$location','prmSearchService','$window','$stateParams','$timeout', function ($sce, $element,$location, prmSearchService, $window, $stateParams, $timeout) {

        var vm = this;
        var sv=prmSearchService;
        vm.params=$location.search();
        // get ui-router parameters
        vm.context=$stateParams.context;
        vm.docid=$stateParams.docid;

        vm.xmldata=[];
        vm.items={};
        // ajax call to get data
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
                  if(vm.items.pnx.addata) {
                      vm.xmldata = sv.getXMLdata(vm.items.pnx.addata.mis1[0]);
                  }

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

            // insert a header into black topbar
            $timeout(function (e) {
                var topbar = $element[0].parentNode.parentNode.children[0].children[0].children[1];
                if(topbar) {
                    var divNode=document.createElement('div');
                    divNode.setAttribute('class','metadataHeader');
                    var textNode=document.createTextNode('FULL COMPONENT METADATA');
                    divNode.appendChild(textNode);
                    topbar.insertBefore(divNode,topbar.children[2]);
                    // remove pin and bookmark
                    topbar.children[3].remove();
                    // remove user login message
                    topbar.children[3].remove();
                }
            },300);


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

