/**
 * Created by samsan on 7/25/17.
 */

angular.module('viewCustom')
    .controller('customFavoriteListController', ['prmSearchService','$mdDialog','$mdMedia',function (prmSearchService,$mdDialog,$mdMedia) {

        var sv=prmSearchService;
        let vm = this;
        vm.searchdata={};
        vm.chooseAll=false;
        vm.itemList=[]; // store pin favorite list
        vm.flexSize={'col1':5,'col2':10,'col3':65,'col4':20};
        vm.records=[];

        // ajax call to get favorite data list
        vm.getData=function () {
            if(vm.parentCtrl.favoritesService) {
                var url = vm.parentCtrl.favoritesService.restBaseURLs.pnxBaseURL + '/U';
                var param = {'recordIds': ''};
                param.recordIds = vm.parentCtrl.favoritesService.recordsId.join();
                vm.records = vm.parentCtrl.favoritesService.records;
                sv.getAjax(url, param, 'get').then(function (result) {
                        if (result.status === 200) {
                            vm.itemList = sv.convertData(result.data);
                        } else {
                            console.log('*** It cannot get favorite item list data because it has problem with DB server ***');
                        }
                    },
                    function (err) {
                        console.log(err);
                    }
                );
            }
        };

        // check to see if user write label
        vm.isLabel=function (index,recordid) {
            var flag=false;
            for(var i=0; i < vm.records.length; i++) {
                if(recordid === vm.records[i].recordId) {
                    if(vm.records[i].labels.length > 0) {
                        flag=true;
                    }
                }
            }

            return flag;
        };

        // unpin each item
        vm.unpin=function (index, recordid) {
            var url=vm.parentCtrl.favoritesService.restBaseURLs.favoritesBaseURL;
            var param={'delete':{'records':[{'recordId':''}]}};
            param.delete.records[0].recordId=recordid;
            sv.postAjax(url,param).
                then(function (result) {
                    if(result.status===200) {
                        vm.itemList.splice(index, 1);
                    } else {
                        console.log('*** It cannot unpin this item because it has problem with DB server ***');
                    }

            },
                function (err) {
                    console.log(err);
                }
            );
        };

        vm.unpinAll=function () {
            var url=vm.parentCtrl.favoritesService.restBaseURLs.favoritesBaseURL;
            var param={'delete':{'records':[{'recordId':''}]}};
            var recordids=[];
            var k=0;
            // add all checked items into recordids so it can send all of them as post
            for(var i=0; i < vm.itemList.length; i++) {
                if(vm.itemList[i].checked) {
                    recordids[k]={'recordId':0};
                    if(vm.itemList[i].pnx.control) {
                        recordids[k].recordId = vm.itemList[i].pnx.control.recordid[0];
                        k++;
                    }
                }
            }
            param.delete.records=recordids;
            sv.postAjax(url,param).
            then(function (result) {
                    if(result.status===200) {
                        // remove item from the list if the delete is successfully
                        var unCheckItems=[];
                        for(var i=0; i < vm.itemList.length; i++) {
                            if(vm.itemList[i].checked===false) {
                               unCheckItems.push(vm.itemList[i]);
                            }
                        }
                        vm.itemList=unCheckItems;
                        vm.chooseAll=false;
                    } else {
                        console.log('*** It cannot unpin these items because it has problem with DB server ***');
                    }

                },
                function (err) {
                    console.log(err);
                }
            );
        };


        vm.checkAll=function () {
            if(vm.chooseAll===false) {
                for(var i=0; i < vm.itemList.length; i++) {
                    vm.itemList[i].checked=true;
                }
            } else {
                vm.unCheckAll();
            }
        };

        vm.unCheckAll=function () {
            for(var i=0; i < vm.itemList.length; i++) {
               vm.itemList[i].checked=false;
            }
        };


        // open modal dialog when click on thumbnail image
        vm.openDialog=function ($event,item) {
            // set data to build full display page
            var itemData={'item':'','searchData':''};
            itemData.item=item;
            itemData.searchData=vm.searchdata;
            sv.setItem(itemData);

            // modal dialog pop up here
            $mdDialog.show({
                title:'Full View Details',
                target:$event,
                clickOutsideToClose: true,
                focusOnOpen:true,
                escapeToClose: true,
                bindToController:true,
                templateUrl:'/primo-explore/custom/HVD_IMAGES/html/custom-full-view-dialog.html',
                controller:'customFullViewDialogController',
                controllerAs:'vm',
                fullscreen:true,
                multiple:false,
                openFrom:{left:0},
                locals: {
                    items:itemData
                },
                onComplete:function (scope, element) {
                    sv.setDialogFlag(true);
                },
                onRemoving:function (element,removePromise) {
                    sv.setDialogFlag(false);
                }
            });
            return false;
        };

        // When a user press enter by using tab key
        vm.openDialog2=function(e,item){
            if(e.which===13||e.which===1){
                vm.openDialog(e,item);
            }

        };

        vm.openActionDialog=function ($event,item,divid,index,action) {
            var el=angular.element(document.querySelector('#'+divid));
            vm.position={'width':0,'height':0,'top':0,'left':0,index:index,'action':'none','pin':false};
            if(el) {
                vm.position.width = el[0].clientWidth;
                vm.position.height = el[0].clientHeight + 100;
                vm.position.left = el[0].offsetLeft;
                vm.position.top=($event.y - 40) + 'px';

            }

            vm.position.action=action;

            $mdDialog.show({
                title:'Action dialog',
                target:$event,
                clickOutsideToClose: true,
                focusOnOpen:true,
                escapeToClose: true,
                bindToController:true,
                templateUrl:'/primo-explore/custom/HVD_IMAGES/html/custom-favorite-action-dialog.html',
                controller:'customFavoriteActionDialogController',
                controllerAs:'vm',
                fullscreen:false,
                hasBackdrop:false,
                multiple:false,
                disableParentScroll:true,
                openFrom:el,
                locals: {
                    items:item,
                    position:vm.position,
                    flexsize:vm.flexSize
                },
                onShowing:function (scope, element) {

                },
                onRemoving:function (element,removePromise) {
                    // unpin item if a user click on pin on modal dialog
                    if(vm.position.pin) {
                        vm.unpin(vm.position.index,vm.position.recordId);
                    }
                }
            });
            return false;
        };

        // get update records when a user add labels
        vm.$doCheck=function() {
            if(vm.parentCtrl.favoritesService) {
                vm.records=vm.parentCtrl.favoritesService.records;
            }
        };

        vm.$onChanges=function() {
            // format the size to fit smaller screen
            if($mdMedia('xs')) {
                vm.flexSize.col1=100;
                vm.flexSize.col2=100;
                vm.flexSize.col3=100;
                vm.flexSize.col4=100;
            } else if($mdMedia('sm')) {
                vm.flexSize.col1=5;
                vm.flexSize.col2=20;
                vm.flexSize.col3=50;
                vm.flexSize.col4=25;
            }
            vm.getData();
            vm.unCheckAll();
        }


    }]);


angular.module('viewCustom')
    .component('customFavoriteList', {
        bindings: {parentCtrl:'<'},
        controller: 'customFavoriteListController',
        controllerAs:'vm',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/custom-favorite-list.html'
    });

