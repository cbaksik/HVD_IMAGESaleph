/**
 * Created by samsan on 6/29/17.
 * It insert in div tag to the top of the menu. Then it create a new component call custom-top-menu.
 */

angular.module('viewCustom')
    .component('prmExploreMainAfter', {
        bindings: {
            parentCtrl:'<',
        },
        template:`<custom-top-menu></custom-top-menu>`,
        controllerAs:'vm',
        controller:['$element','$sce',function ($element,$sce) {
            var vm=this;
            vm.$onChanges=function () {

                // insert div tag on top menu so it can create new menus
                var el=$element[0].parentNode.parentNode;
                var div=document.createElement('div');
                div.setAttribute('id','customTopMenu');
                div.setAttribute('class','topMenu');
                el.prepend(div);

            };



        }]
    });
