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

        vm.toggleData={'icon':'ic_remove_black_24px.svg','flag':false};
        vm.xmldata=[];
        vm.keys=[];
        vm.items={};

        vm.toggle=function () {
          if(vm.toggleData.flag) {
              vm.toggleData.icon='ic_remove_black_24px.svg';
              vm.toggleData.flag=false;
          } else {
              vm.toggleData.icon='ic_add_black_24px.svg';
              vm.toggleData.flag=true;
          }
        };

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
                      var result = sv.parseXml(vm.items.pnx.addata.mis1[0]);
                      if(result.work) {
                          vm.xmldata = result.work[0];
                          vm.keys=Object.keys(vm.items.pnx.display);
                      }

                  }

                  console.log('**** custom-view-all-component-metadata ***');
                  console.log(vm.items.pnx.display);

              },function (err) {
                  console.log(err);
              })

        };

        // get json key
        vm.getKeys=function (obj) {
            var keys=Object.keys(obj);
            var index=keys.indexOf('image');
            if(index !== -1) {
                // remove image from the list
                keys.splice(index,1);
            }

            return keys;
        };

        // get json value base on dynamic key
        vm.getValue=function (obj,key) {
            return sv.getValue(obj,key);
        };

        vm.isArray=function (obj) {
          if(Array.isArray(obj)) {
              return true;
          } else {
              return false;
          }
        };

        // show the pop up image
        vm.gotoFullPhoto=function (index) {
            // go to full display page
            var url='/primo-explore/viewcomponent/'+vm.context+'/'+vm.docid+'/'+index+'?vid='+vm.params.vid;
            if(vm.params.adaptor) {
                url+='&adaptor='+vm.params.adaptor;
            }
            $window.open(url,'_blank');
        };

        vm.$onInit=function() {
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
                    if(topbar.children.length > 2) {
                        topbar.children[1].remove();
                        topbar.children[2].remove();
                    }

                }
            },1000);


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

