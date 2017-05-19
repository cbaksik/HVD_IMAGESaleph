angular.module('viewCustom')
    .controller('prmSearchResultListAfterController', [ '$sce', 'angularLoad','$http','prmSearchService','$window', function ($sce, angularLoad, $http, prmSearchService, $window) {
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

    let sv=prmSearchService;
    this.searchInfo = sv.getPage(); // get page info object

    let vm = this;

    // set up page counter
    vm.pageCounter = {'min':0,'max':0};
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
    // numbers of row per page when a user select the drop down menu
    this.selectRows = [10,20,30];
    // when a user select numbers of row per page, it call the search function again
    this.changeRow = function () {
        this.searchInfo.currentPage=1; // reset the current page to 1
        sv.setPage(this.searchInfo); // keep track user select row from the drop down menu
        this.search();
        this.findPageCounter();
    };

    // when a user click on next page or select new row from the drop down, it call this search function to get new data
    this.search=function () {
       var params={'addfields':[],'offset':0,'limit':10,'lang':'en_US','inst':'HVD','getMore':0,'pcAvailability':true,'q':'','rtaLinks':true,
       'sortby':'rank','tab':'default_tab','vid':'HVD_IMAGES','scope':'default_scope','qExclude':'','qInclude':''};
       params.limit=this.searchInfo.pageSize;
       params.q=vm.parentCtrl.$stateParams.query;
       params.lang=vm.parentCtrl.$stateParams.lang;
       params.vid=vm.parentCtrl.$stateParams.vid;
       params.sortby=vm.parentCtrl.$stateParams.sortby;
       params.currentPage = this.searchInfo.currentPage;
       params.offset = (this.searchInfo.currentPage - 1) * this.searchInfo.pageSize;
       params.bulkSize = this.searchInfo.pageSize;
       params.to = this.searchInfo.pageSize * this.searchInfo.currentPage;
       params.newSearch = true;
       params.searchInProgress = true;
       //params.addfields='vertitle,title,collection,creator,contributor,subject,ispartof,description,relation,publisher,creationdate,format,language,identifier,citation,source';
        
       vm.parentCtrl.currentPage = params.currentPage;
       vm.parentCtrl.$stateParams.offset = params.offset;
       vm.parentCtrl.searchInfo.first = params.offset;
       vm.parentCtrl.searchInfo.last = this.searchInfo.currentPage * this.searchInfo.pageSize;
       // start ajax loader progress bar
       vm.parentCtrl.searchService.searchStateService.searchObject.newSearch=true;
       vm.parentCtrl.searchService.searchStateService.searchObject.searchInProgress=true;
        vm.parentCtrl.searchService.searchStateService.searchObject.offset=params.offset;


       // get the current search rest url
       let url = vm.parentCtrl.briefResultService.restBaseURLs.pnxBaseURL;

       sv.getAjax(url,params,'get')
           .then(function (data) {
                let mydata = data.data;
                vm.items = mydata.docs;
                console.log('*** data from ajax call ***');
                console.log(mydata);
                // stop the ajax loader progress bar
                vm.parentCtrl.searchService.searchStateService.searchObject.newSearch=false;
                vm.parentCtrl.searchService.searchStateService.searchObject.searchInProgress=false;
               },
            function (err) {
               console.log(err);
               vm.parentCtrl.searchService.searchStateService.searchObject.newSearch=false;
               vm.parentCtrl.searchService.searchStateService.searchObject.searchInProgress=false;
            }
           )
    };

    // when a user click on next page or prev page, it call this function.
    this.pageChanged=function (currentPage) {
        this.searchInfo.currentPage = currentPage;
        sv.setPage(this.searchInfo); // keep track a user click on each current page
        this.search();
        this.findPageCounter();
    };

    vm.items = [];


    vm.$onInit = function () {
        this.searchInfo = sv.getPage(); // get page info object
        vm.parentCtrl.$scope.$watch(()=>vm.parentCtrl.searchString,(newVal, oldVal)=>{
            if(vm.parentCtrl.searchString !== this.searchInfo.searchString){
                this.searchInfo.totalItems = 0;
                this.searchInfo.currentPage = 1;
            }
        });

        vm.parentCtrl.$scope.$watch(()=>vm.parentCtrl.searchResults, (newVal, oldVal)=>{
            if(oldVal !== newVal){

                this.searchInfo.totalItems = vm.parentCtrl.totalItems;

                if(vm.parentCtrl.currentPage===this.searchInfo.currentPage && vm.parentCtrl.itemsPerPage === this.searchInfo.pageSize && this.searchInfo.query==='' && newVal) {
                    vm.items = newVal;
                } else if(vm.parentCtrl.currentPage===this.searchInfo.currentPage && vm.parentCtrl.itemsPerPage === this.searchInfo.pageSize && this.searchInfo.query === vm.parentCtrl.$stateParams.query && newVal) {
                    vm.items = newVal;
                } else {
                    this.search();
                }

                this.findPageCounter();

                this.searchInfo.query = vm.parentCtrl.$stateParams.query;
                this.searchInfo.searchString = vm.parentCtrl.searchString;
                sv.setPage(this.searchInfo);

                console.log('*** searchObject ***');
                console.log(vm.parentCtrl.searchService.searchStateService.searchObject);

                console.log('*** searchInfo ***');
                console.log(this.searchInfo);

            }

        });
    };

    this.openDialog=function (item) {
        console.log(item);
        vm.parentCtrl.PAGE_SIZE=this.searchInfo.pageSize;
        vm.parentCtrl.currentPage=this.searchInfo.currentPage;
        vm.parentCtrl.searchInfo.maxTotal = this.searchInfo.pageSize;

        console.log('*** searchInfo ***');
        console.log(vm.parentCtrl);

        let offset = (this.searchInfo.currentPage - 1) * this.searchInfo.pageSize;
        let url='/primo-explore/fulldisplay?docid='+item.pnx.control.recordid[0]+'&adaptor='+
        item.adaptor+'&context='+item.context+'&lang='+vm.parentCtrl.$stateParams.lang+'&query='+vm.parentCtrl.$stateParams.query+
        '&sortby='+vm.parentCtrl.$stateParams.sortby+'&tab='+vm.parentCtrl.$stateParams.tab+'&search_scope='+vm.parentCtrl.$stateParams.search_scope+
        '&offset='+offset+'&vid='+vm.parentCtrl.$stateParams.vid +'&limit='+this.searchInfo.pageSize+'&currentPage='+this.searchInfo.currentPage +'&itemsPerPage='+this.searchInfo.pageSize;

        console.log(url);
        $window.location.href=url;
    }

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
            nums=nums.split(' ');
            if(nums.length > 0){
                nums=parseInt(nums[0]);
                if(isNaN(nums)) {
                    nums='';
                }
            }
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

