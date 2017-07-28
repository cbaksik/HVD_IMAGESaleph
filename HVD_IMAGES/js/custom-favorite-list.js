/**
 * Created by samsan on 7/25/17.
 */

angular.module('viewCustom')
    .controller('customFavoriteListController', ['prmSearchService','$mdDialog','$mdMedia','$location',function (prmSearchService,$mdDialog,$mdMedia,$location) {

        var sv=prmSearchService;
        let vm = this;
        vm.searchdata={};
        vm.chooseAll=false;
        vm.itemList=[]; // store pin favorite list
        vm.pinItems=[]; // origin pin items
        vm.rightLabelClick=false;
        vm.flexSize={'col1':5,'col2':15,'col3':55,'col4':25};
        vm.records=[];
        vm.params=$location.search();


        // ajax call to get favorite data list
        vm.getData=function () {
            if(vm.parentCtrl.favoritesService) {
                var url = vm.parentCtrl.favoritesService.restBaseURLs.pnxBaseURL + '/U';
                var param = {'recordIds': ''};
                param.recordIds = vm.parentCtrl.favoritesService.recordsId.join();
                vm.records = vm.parentCtrl.favoritesService.records;
                if(vm.records.length > 0) {
                    sv.getAjax(url, param, 'get').then(function (result) {
                            if (result.status === 200) {
                                if(result.data.length > 0) {
                                    vm.itemList = sv.convertData(result.data);
                                    vm.pinItems = angular.copy(vm.itemList); // make copy data to avoid using binding data
                                    vm.unCheckAll();
                                }
                            } else {
                                console.log('**** It cannot get favorite item list data because it has problem with DB server ***');
                            }
                        },
                        function (err) {
                            console.log(err);
                        }
                    );
                }
            }
        };


        //check if there is a label base on the records
        vm.isLabel=function (recordid) {
          var flag=false;
          for(var i=0; i < vm.records.length; i++) {
            if(vm.records[i].recordId===recordid) {
                flag=true;
                i=vm.records.length;
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
                    console.log('*** unpin ****');
                    console.log(result);

                    if(result.status===200) {
                        vm.itemList.splice(index, 1);
                        vm.pinItems.splice(index,1);
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
                        vm.pinItems=angular.copy(unCheckItems);
                        vm.chooseAll=false;
                    } else {
                        console.log('**** It cannot unpin these items because it has problem with DB server ***');
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
                vm.position.width = (el[0].clientWidth + 40) + 'px';
                vm.position.height = el[0].clientHeight + 100;
                vm.position.left = el[0].offsetLeft;
                vm.position.top=(el[0].offsetTop - 40) + 'px';

            }

            vm.position.action=action;

            $mdDialog.show({
                parent: document.querySelector('#'+divid),
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
                multiple:true,
                disableParentScroll:false,
                openFrom:{left:'100px'},
                closeTo:{width:'100%'},
                locals: {
                    items:item,
                    position:vm.position,
                    flexsize:vm.flexSize,
                    record:vm.records[index]
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
                if(vm.parentCtrl.favoritesService.selectedLabels.length > 0) {
                    vm.itemList=sv.convertData(vm.parentCtrl.favoritesService.items);
                    vm.rightLabelClick=true;
                } else if(vm.itemList.length < vm.pinItems.length && vm.rightLabelClick) {
                    vm.itemList=angular.copy(vm.pinItems);
                    vm.rightLabelClick=false;
                }

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

        }


    }]);


angular.module('viewCustom')
    .component('customFavoriteList', {
        bindings: {parentCtrl:'<'},
        controller: 'customFavoriteListController',
        controllerAs:'vm',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/custom-favorite-list.html'
    });

