/**
 * Created by samsan on 7/25/17.
 */

angular.module('viewCustom')
    .controller('customFavoriteListController', ['prmSearchService','$mdDialog','$element',function (prmSearchService,$mdDialog,$element) {

        var sv=prmSearchService;
        let vm = this;
        vm.searchdata={};
        vm.chooseAll=false;
        vm.itemList=[]; // store pin favorite list

        // unpin each item
        vm.unpin=function (index, recordid) {
            console.log(vm.parentCtrl);
            var url=vm.parentCtrl.favoritesService.restBaseURLs.favoritesBaseURL;
            var param={'delete':{'records':[{'recordId':''}]}};
            param.delete.records[0].recordId=recordid;
            sv.postAjax(url,param).
                then(function (result) {
                    if(result.status===200) {
                        vm.itemList.splice(index, 1);
                    } else {
                        console.log('*** It cannot unpin this item because it is problem with DB server ***');
                    }

            },
                function (err) {
                    console.log(err);
                }
            );
        };

        vm.unpinAll=function () {
            console.log(vm.parentCtrl);
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

            console.log('** param ***');
            console.log(param);

            sv.postAjax(url,param).
            then(function (result) {
                    if(result.status===200) {
                        // remove item from the list if the delete is successfully
                        for(var i=0; i < vm.itemList.length; i++) {
                            if(vm.itemList[i].checked) {
                               vm.itemList.splice(i,1);
                            }
                        }
                        vm.chooseAll=false;
                    } else {
                        console.log('*** It cannot unpin this item because it is problem with DB server ***');
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

        // get the data from parent favorite item
        vm.$doCheck=function() {
            vm.itemList=vm.parentCtrl.favoritesService.items;
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


            var position={'width':0,'height':0,'top':0,'left':0,index:index,'action':'none'};
            if(el) {
                position.width = el[0].clientWidth;
                position.height = el[0].clientHeight + 100;
                position.left = el[0].offsetLeft;
                if($event.clientY) {
                    position.top = $event.y - 38;
                } else if($event.y) {
                    position.top = $event.y - 38;
                }
            }
            position.action=action;

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
                fullscreen:true,
                hasBackdrop:true,
                multiple:false,
                disableParentScroll:true,
                openFrom:{'id':'#'+divid},
                locals: {
                    items:item,
                    position:position,
                },
                onComplete:function (scope, element) {

                },
                onRemoving:function (element,removePromise) {

                }
            });
            return false;
        };

        vm.$onChanges=function() {
            vm.unCheckAll();
            console.log('**** custom-favorite-list ****');
            console.log(vm);

        }


    }]);


angular.module('viewCustom')
    .component('customFavoriteList', {
        bindings: {parentCtrl:'<'},
        controller: 'customFavoriteListController',
        controllerAs:'vm',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/custom-favorite-list.html'
    });

