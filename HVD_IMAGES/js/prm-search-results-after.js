

app.controller('prmSearchResultListAfterController', [ '$sce', 'angularLoad', function ($sce, angularLoad) {
    let vm = this;
    vm.items = vm.parentCtrl.searchResults;

    vm.tiles = buildGridModel({
        icon : "prm-grid-image-",
        title: "",
        background: ""
    });

    function buildGridModel(tileTmpl){
        var it, results = [ ];

        var images = {
            0 : 'sports',
            1 : 'abstract',
            2 : 'animals',
            3 : 'nature',
            4 : 'transport',
            5 : 'cats'

        }
        for (var j=0; j<vm.items.length; j++) {

            it = angular.extend({},tileTmpl);
            it.icon  = it.icon + (images[j % 5 ] || 'food');
            console.log(vm.items);
            it.title = vm.items[j].pnx.display.title[0] || '';
            it.span  = { row : 1, col : 1 };

            switch(j+1) {
                case 1:
                    it.background = "red";
                    it.span.row = it.span.col = 2;
                    break;

                case 2: it.background = "green";         break;
                case 3: it.background = "darkBlue";      break;
                case 4:
                    it.background = "blue";
                    it.span.col = 2;
                    break;

                case 5:
                    it.background = "yellow";
                    it.span.row = it.span.col = 2;
                    break;

                case 6: it.background = "pink";          break;
                case 7: it.background = "darkBlue";      break;
                case 8: it.background = "purple";        break;
                case 9: it.background = "deepBlue";      break;
                case 10: it.background = "lightPurple";  break;
                case 11: it.background = "yellow";       break;
            }

            results.push(it);
        }
        return results;
    }
   /* vm.$onInit = function () {
        angularLoad.loadScript('custom/HVD/img/avatar-icons.svg').then(function () {
            console.log('1111');
        });
    }*/






}]);

/*http://dc03kg0084eu.hosted.exlibrisgroup.com:8991/pds*/

app.component('prmSearchResultListAfter', {
    bindings: {parentCtrl: '<'},
    controller: 'prmSearchResultListAfterController',
    template: `<div class="gridListdemoDynamicTiles" flex ng-cloak>
  <md-grid-list
        md-cols="1" md-cols-sm="2" md-cols-md="3" md-cols-gt-md="6"
        md-row-height-gt-md="1:1" md-row-height="4:3"
        md-gutter="8px" md-gutter-gt-sm="4px" >

    <md-grid-tile ng-repeat="tile in $ctrl.tiles"
                  md-rowspan="{{tile.span.row}}"
                  md-colspan="{{tile.span.col}}"
                  md-colspan-sm="1"
                  md-colspan-xs="1"
                  ng-class="tile.background" >
                  
      <div class="prm-grid-image {{tile.icon}}"></div>
      <md-grid-tile-footer><h3>{{tile.title}}</h3></md-grid-tile-footer>
    </md-grid-tile>
  </md-grid-list>
</div>`
});
