/* Author: Sam San
 This custom component is used for search result list which display all the images in thumbnail.
 */
angular.module('viewCustom')
    .controller('prmSearchResultListAfterController', [ '$sce', 'angularLoad','prmSearchService','$window','$timeout','$mdDialog', function ($sce, angularLoad, prmSearchService, $window, $timeout, $mdDialog) {
    // local variables
    this.tooltip = {'flag':[]};
    // show tooltip function when mouse over
    this.showTooltip=function (index) {
        this.tooltip.flag[index]=true;
    };
    // hide tooltip function when mouse out
    this.hideTooltip=function () {
      for(let i=0; i < this.searchInfo.pageSize; i++) {
          this.tooltip.flag[i] = false;
      }
    };
    // call custom service from the injection
    let sv=prmSearchService;
    this.searchInfo = sv.getPage(); // get page info object

    let vm = this;
    vm.searchInProgress=true;
    vm.modalDialogFlag=false;
    vm.currentPage=1;
    vm.flag=false;
    // set search result set per page, default 50 items per page

    // set up page counter
    vm.pageCounter = {'min':0,'max':0};
    // calculate the page counter such as 1-50 of 1,232
    this.findPageCounter=function () {
      vm.pageCounter.min = ((this.searchInfo.currentPage - 1) * this.searchInfo.pageSize) + 1;

      if(vm.pageCounter.min > this.searchInfo.totalItems) {
          vm.pageCounter.min = this.searchInfo.totalItems;
      }
      vm.pageCounter.max = this.searchInfo.currentPage * this.searchInfo.pageSize;
      if(vm.pageCounter.max > this.searchInfo.totalItems) {
          vm.pageCounter.max = this.searchInfo.totalItems;
      }

    };


    // when a user click on next page or select new row from the drop down, it call this search function to get new data
    vm.ajaxSearch=function () {
       var facets = sv.getFacets();
       var facetsParam='';
       this.searchInfo=sv.getPage();
       var limit=this.searchInfo.pageSize;
       var remainder = parseInt(this.searchInfo.totalItems) - (parseInt(this.searchInfo.currentPage - 1) * parseInt(this.searchInfo.pageSize));

       if(remainder < this.searchInfo.pageSize) {
           limit=remainder;
       }

       var params={'addfields':[],'offset':0,'limit':10,'lang':'en_US','inst':'HVD','getMore':0,'pcAvailability':true,'q':'','rtaLinks':true,
       'sort':'rank','tab':'default_tab','vid':'HVD_IMAGES','scope':'default_scope','qExclude':'','qInclude':'','searchString':''};
       params.addfields=vm.parentCtrl.searchService.cheetah.searchData.addfields;
       params.qExclude=vm.parentCtrl.searchService.cheetah.searchData.qExclude;
       params.getMore=vm.parentCtrl.searchService.cheetah.searchData.getMore;
       params.pcAvailability=vm.parentCtrl.searchService.cheetah.searchData.pcAvailability;
       params.limit=limit;
       params.q=vm.parentCtrl.$stateParams.query;
       params.lang=vm.parentCtrl.$stateParams.lang;
       params.vid=vm.parentCtrl.$stateParams.vid;
       params.sort=vm.parentCtrl.$stateParams.sortby;
       params.offset = (this.searchInfo.currentPage - 1) * this.searchInfo.pageSize;
       params.searchString=vm.parentCtrl.searchString;

       for(var i=0; i < facets.length; i++){
           facetsParam+='facet_'+facets[i].name+','+facets[i].displayedType+','+facets[i].value+'|,|';
       }
       if(facetsParam.length > 5) {
           facetsParam=facetsParam.substring(0,facetsParam.length - 3);
       }
       params.qInclude=facetsParam;

       // start ajax loader progress bar
       vm.parentCtrl.searchService.searchStateService.searchObject.newSearch=true;
       vm.parentCtrl.searchService.searchStateService.searchObject.searchInProgress=true;
       vm.parentCtrl.searchService.searchStateService.searchObject.offset=params.offset;

       // get the current search rest url
       let url = vm.parentCtrl.briefResultService.restBaseURLs.pnxBaseURL;

       sv.getAjax(url,params,'get')
           .then(function (data) {
                let mydata = data.data;
                vm.items=sv.convertData( mydata.docs);
                // stop the ajax loader progress bar
                vm.parentCtrl.searchService.searchStateService.searchObject.newSearch=false;
                vm.parentCtrl.searchService.searchStateService.searchObject.searchInProgress=false;
                vm.searchInProgress=false;
               },
            function (err) {
               console.log(err);
               vm.parentCtrl.searchService.searchStateService.searchObject.newSearch=false;
               vm.parentCtrl.searchService.searchStateService.searchObject.searchInProgress=false;
               vm.searchInProgress=false;
            }
           )

    };

    // when a user click on next page or prev page, it call this function.
    this.pageChanged=function (currentPage) {
        // prevent calling ajax twice during refresh the page or click on facets
        if(!vm.flag) {
            this.searchInfo.currentPage = currentPage;
            this.searchInfo.userClick=true;
            this.searchInfo.offset=parseInt(currentPage - 1) * this.searchInfo.pageSize;
            this.searchInfo.searchString=vm.parentCtrl.searchString;
            this.searchInfo.query=vm.parentCtrl.$stateParams.query;
            sv.setPage(this.searchInfo); // keep track a user click on each current page
            // ajax call function
            vm.ajaxSearch();
            // calculate the min and max of items
            this.findPageCounter();
        }
        vm.flag=false;
    };

    vm.items=[];

    vm.$onInit = function () {
        this.searchInfo = sv.getPage(); // get page info object
        // watch for new data change when a user search
        vm.parentCtrl.$scope.$watch(()=>vm.parentCtrl.searchResults,(newVal, oldVal)=>{

            console.log('*** prm search result after ***');
            console.log(vm.parentCtrl);
            if(vm.parentCtrl.$stateParams.offset > 0) {
                vm.currentPage = parseInt(vm.parentCtrl.$stateParams.offset / this.searchInfo.pageSize) + 1;
                this.searchInfo.currentPage=parseInt(vm.parentCtrl.$stateParams.offset / this.searchInfo.pageSize) + 1;
            } else {
                vm.currentPage = 1;
                this.searchInfo.currentPage = 1;
            }
            vm.flag=true;
            // convert xml data into json data so it knows which image is a restricted image
            vm.items = sv.convertData(vm.parentCtrl.searchResults);

            // set up pagination
            this.searchInfo.totalItems = vm.parentCtrl.totalItems;
            this.searchInfo.totalPages = parseInt(vm.parentCtrl.totalItems / this.searchInfo.pageSize);
            if((this.searchInfo.pageSize * this.searchInfo.totalPages) < this.searchInfo.totalItems) {
                this.searchInfo.totalPages++;
            }

            this.findPageCounter();

            this.searchInfo.query = vm.parentCtrl.$stateParams.query;
            this.searchInfo.searchString = vm.parentCtrl.searchString;
            sv.setPage(this.searchInfo);
            vm.searchInProgress=vm.parentCtrl.searchInProgress;


        });

    };


    // open modal dialog when click on thumbnail image
    this.openDialog=function ($event,item) {
        // get user login status, true for login, false for not login
        let logID=sv.getLogInID();
        vm.parentCtrl.searchService.searchStateService.resultsBulkSize=this.searchInfo.pageSize;

        // set data to build full display page
        var itemData={'item':'','searchData':''};
        itemData.item=item;
        itemData.searchData=vm.parentCtrl.searchService.cheetah.searchData;
        itemData.searchData.searchString=vm.parentCtrl.searchString;
        sv.setItem(itemData);

        // modal dialog pop up here
        $mdDialog.show({
            title:'Full View Details',
            target:$event,
            clickOutsideToClose: true,
            escapeToClose: true,
            bindToController:true,
            templateUrl:'/primo-explore/custom/HVD_IMAGES/html/custom-full-view-dialog.html',
            controller:'customFullViewDialogController',
            controllerAs:'vm',
            fullscreen:true,
            multiple:true,
            openFrom:{left:0},
            locals: {
                items:itemData
            },
            onComplete:function (scope, element) {
                vm.modalDialogFlag=true;
            },
            onRemoving:function (element,removePromise) {
                vm.modalDialogFlag=false;
            }
        });

    };

    // When a user press enter by using tab key
    this.openDialog2=function(e,item){
        if(e.which===13){
            this.openDialog(e,item);
        }
    };
    // close modal dialog of view full display
    this.closeDialog=function () {
        vm.modalDialogFlag=false;
        $mdDialog.hide();
    };


}]);

// custom filter to remove $$U infront of url in pnx.links
angular.module('viewCustom').filter('urlFilter',function () {
    return function (url) {
        var newUrl='';
        var pattern=/^(\$\$U)/;
        if(url){
            newUrl=url[0];
            if(pattern.test(newUrl)){
                newUrl = newUrl.substring(3,newUrl.length);
            }
        }

        return newUrl;
    }

});

// extract [6 images] from pnx.display.lds28 field
angular.module('viewCustom').filter('countFilter',function () {
    return function (qty) {
        var nums='';
        var pattern=/[\[\]]+/g;
        if(qty){
            nums=qty.replace(pattern,'');
        }

        return nums;
    }

});

/*http://dc03kg0084eu.hosted.exlibrisgroup.com:8991/pds*/

angular.module('viewCustom')
    .component('prmSearchResultListAfter', {
    bindings: {parentCtrl: '<'},
    controller: 'prmSearchResultListAfterController',
    templateUrl: '/primo-explore/custom/HVD_IMAGES/html/prm-search-results.html'
});

