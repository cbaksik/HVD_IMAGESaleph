/**
 * Created by samsan on 6/9/17.
 * This component is for a single image full display when a user click on thumbnail from a full display page
 */

angular.module('viewCustom')
    .controller('customViewComponentController', [ '$sce','$mdMedia','prmSearchService','$location','$stateParams', '$element','$timeout','customMapXmlKeys','$window', function ($sce,$mdMedia,prmSearchService,$location,$stateParams, $element, $timeout, customMapXmlKeys,$window) {

        let vm = this;
        var sv=prmSearchService;
        var cMap=customMapXmlKeys;
        // get location parameter
        vm.params=$location.search();
        // get parameter from angular ui-router
        vm.context=$stateParams.context;
        vm.docid=$stateParams.docid;
        vm.filename = $stateParams.filename;
        vm.index='';
        vm.clientIp=sv.getClientIp();

        vm.photo={};
        vm.flexsize=80;
        vm.total=0;
        vm.itemData={};
        vm.imageNav=true;
        vm.xmldata={};
        vm.keys=[];
        vm.imageTitle='';
        vm.jp2=false;
        vm.componentData={}; // single component data
        vm.componentKey=[];

        vm.findFilenameIndex=function (arrList,filename) {
            var k= -1;
            for(var i=0; i < arrList.length; i++){
                var img=arrList[i];
                if(img.image) {
                    var url=img.image[0]._attr.href._value;
                    if(url.match(vm.filename)) {
                        k = i;
                        i = arrList.length;
                    }
                } else if(img._attr){
                    var componentID = img._attr.componentID._value;
                    if(componentID===vm.filename) {
                        k=i;
                        i=arrList.length;
                    }
                }
            }
            return k;
        };

        // ajax call to get data
        vm.getData=function () {
            var url=vm.parentCtrl.searchService.cheetah.restBaseURLs.pnxBaseURL+'/'+vm.context+'/'+vm.docid;
            var params={'vid':'','lang':'','search_scope':'','adaptor':''};
            params.vid=vm.params.vid;
            params.lang=vm.params.lang;
            params.search_scope=vm.params.search_scope;
            params.adaptor=vm.params.adaptor;
            sv.getAjax(url,params,'get')
                .then(function (result) {
                    vm.item=result.data;
                    // convert xml to json
                    if(vm.item.pnx) {
                        if(vm.item.pnx.addata) {
                            var result = sv.parseXml(vm.item.pnx.addata.mis1[0]);
                            if (result.work) {
                                vm.xmldata = result.work[0];
                                if (vm.xmldata.component) {
                                    vm.total = vm.xmldata.component.length;
                                }
                                if (vm.item.pnx.display) {
                                    vm.keys = Object.keys(vm.item.pnx.display);
                                    // remove unwanted key
                                    var removeList = cMap.getRemoveList();
                                    for (var i = 0; i < removeList.length; i++) {
                                        var key = removeList[i];
                                        var index = vm.keys.indexOf(key);
                                        if (index !== -1) {
                                            vm.keys.splice(index, 1);
                                        }
                                    }

                                    vm.keys = cMap.sort(vm.keys);

                                }

                            }
                        }
                    } else {
                        $window.location.href = '/primo-explore/search?vid=' + vm.params.vid;
                    }

                    // display photo
                    vm.displayPhoto();

                },function (error) {
                        console.log(error);
                    }

                );

        };

        vm.isArray=function (obj) {
            if(Array.isArray(obj)) {
                return true;
            } else {
                return false;
            }
        };

        // get json key and remove image from the key
        vm.getKeys=function (obj) {
            var keys=Object.keys(obj);
            var removeList = cMap.getRemoveList();
            for(var i=0; i < removeList.length; i++) {
                var key=removeList[i];
                var index = keys.indexOf(key);
                if (index !== -1) {
                    // remove image from the list
                    keys.splice(index, 1);
                }
            }
            return cMap.getOrderList(keys);
        };

        // get value base on json key
        vm.getValue=function(val,key){
            return sv.getValue(val,key);
        };

        // display each component value key
        vm.getComponentValue=function(key){
           var text='';
           if(vm.componentData && key) {
               var data=vm.componentData[key];
               text = sv.getValue(data,key);
           }
           return text;
        };


        // display each photo component
        vm.displayPhoto=function () {
            vm.isLoggedIn=sv.getLogInID();
            vm.clientIp=sv.getClientIp();
            if (vm.xmldata.component && !vm.xmldata.image) {
                if(!vm.index && vm.index !== 0) {
                    vm.index = vm.findFilenameIndex(vm.xmldata.component, vm.filename);
                }
                if(vm.index >= 0 && vm.index < vm.total) {
                    vm.componentData = vm.xmldata.component[vm.index];
                    if (vm.componentData.image) {
                        vm.photo = vm.componentData.image[0];
                        // find out if the image is jp2 or not
                        vm.jp2 = sv.findJP2(vm.photo);
                    }
                }

            } else if(vm.xmldata.image) {
                vm.photo=vm.xmldata.image[0];
                vm.jp2=sv.findJP2(vm.photo);
                vm.componentData=vm.xmldata.image[0];
            }

            if(vm.photo._attr && vm.photo._attr.restrictedImage) {
                if(vm.photo._attr.restrictedImage._value && vm.isLoggedIn===false && !vm.clientIp.status) {
                    vm.imageNav=false;
                }
            }

        };

        vm.$onInit=function() {
            // if the smaller screen size, make the flex size to 100.
            if($mdMedia('sm')) {
                vm.flexsize=100;
            } else if($mdMedia('xs')) {
                vm.flexsize=100;
            }
            // call ajax and display data
            vm.getData();
            // hide search bar
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
                    var textNode=document.createTextNode('FULL IMAGE DETAIL');
                    divNode.appendChild(textNode);
                    topbar.insertBefore(divNode,topbar.children[2]);
                    // remove pin and bookmark
                    if(topbar.children.length > 2) {
                        topbar.children[1].remove();
                        topbar.children[2].remove();
                    }

                }

            },1000);

        };

        // next photo
        vm.nextPhoto=function () {
            vm.index++;
            if(vm.index < vm.total && vm.index >=0) {
                vm.displayPhoto();
            } else {
                vm.index=0;
                vm.displayPhoto();
            }

        };
        // prev photo
        vm.prevPhoto=function () {
            vm.index--;
            if(vm.index >= 0 && vm.index < vm.total) {
                vm.displayPhoto();
            } else {
                vm.index=vm.total - 1;
                vm.displayPhoto();
            }
        };


    }]);

angular.module('viewCustom')
    .component('customViewComponent', {
        bindings: {item: '<',services:'<',params:'<',parentCtrl:'<'},
        controller: 'customViewComponentController',
        controllerAs:'vm',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/custom-view-component.html'
    });

// truncate word to limit 60 characters
angular.module('viewCustom').filter('mapXmlFilter',['customMapXmlKeys',function (customMapXmlKeys) {
    var cMap=customMapXmlKeys;
    return function (key) {
        var newKey=cMap.mapKey(key);
        return newKey.charAt(0).toUpperCase() + newKey.slice(1);
    }

}]);