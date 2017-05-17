angular.module('viewCustom')
    .controller('prmSearchResultListAfterController', [ '$sce', 'angularLoad','$http','prmSearchService','$window', function ($sce, angularLoad, $http, prmSearchService, $window) {
    // local variables
    this.tooltip = {'flag':[]};
    this.showTooltip=function (index) {
        this.tooltip.flag[index]=true;
    };
    this.hideTooltip=function () {
      for(let i=0; i < this.searchInfo.pageSize; i++) {
          this.tooltip.flag[i] = false;
      }
    };

    this.searchInfo ={'pageSize':10,'totalItems':0,'currentPage':1};
    let sv=prmSearchService;

    let vm = this;
    vm.progress = {'flag':false,'val':30};

    this.selectRows = [10,20,30];
    this.changeRow = function () {
        console.log(this.searchInfo.pageSize);
        this.searchInfo.currentPage=1;
        vm.parentCtrl.searchInfo.maxTotal = this.searchInfo.pageSize;
        this.search();
    };

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
       params.addfields='vertitle,title,collection,creator,contributor,subject,ispartof,description,relation,publisher,creationdate,format,language,identifier,citation,source';

       vm.parentCtrl.currentPage = params.currentPage;
       vm.parentCtrl.$stateParams.offset = params.offset;
       vm.parentCtrl.searchInfo.first = params.offset;
       vm.parentCtrl.searchInfo.last = this.searchInfo.currentPage * this.searchInfo.pageSize;

        let url = vm.parentCtrl.briefResultService.restBaseURLs.pnxBaseURL;

       sv.getAjax(url,params,'get')
           .then(function (data) {
                let mydata = data.data;
                vm.items = mydata.docs;
                console.log(data.data);
           },
            function (err) {
               console.log(err);
            }
           )
    };

    this.pageChanged=function () {
        this.search();

    };

    vm.items = vm.parentCtrl.searchResults;


    vm.$onInit = function () {
        vm.parentCtrl.$scope.$watch(()=>vm.parentCtrl.searchResults, (newVal, oldVal)=>{
            if(oldVal !== newVal){
                this.searchInfo.pageSize = vm.parentCtrl.itemsPerPage;
                if(vm.parentCtrl.searchInfo) {
                    this.searchInfo.currentPage = parseInt(vm.parentCtrl.searchInfo.last / this.searchInfo.pageSize);
                }
                this.searchInfo.totalItems = vm.parentCtrl.totalItems;

                console.log('*** searchInfo ***');
                console.log(vm.parentCtrl);

                vm.items = newVal;


                console.log('*** vm.items ***');
                console.log(vm.items);

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

// custom filter
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

/*http://dc03kg0084eu.hosted.exlibrisgroup.com:8991/pds*/

angular.module('viewCustom')
    .component('prmSearchResultListAfter', {
    bindings: {parentCtrl: '<'},
    controller: 'prmSearchResultListAfterController',
    templateUrl: '/primo-explore/custom/HVD_IMAGES/html/prm-search-results.html'
});

