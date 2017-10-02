/**
 * Created by samsan on 9/28/17.
 */

angular.module('viewCustom')
    .service('customMapXmlKeys',[function () {
        var serviceObj={};

        // filter the xml key node
        serviceObj.keys=[
            {'freeDate':'Date'},
            {'lds01':'HOLLIS Number'},
            {'lds04':'Variant Title'},
            {'lds07':'Publication Info'},
            {'lds08':'Permalink'},
            {'lds13':'Notes'},
            {'lds22':'Style / Period'},
            {'lds23':'Culture'},
            {'lds24':'Related Work'},
            {'lds25':'Related Information'},
            {'lds26':'Repository'},
            {'lds27':'Use Restrictions'},
            {'lds30':'Form / Genre'},
            {'lds31':'Place'},
            {'lds44':'Associated Name'},
            {'creationdate':'Creation Date'},
            {'creator':'Author / Creator'},
            {'format':'Description'},
            {'rights':'Copyright'},
            {'relatedWork':'Related Work'},
            {'workType':'Work Type'},
            {'useRestrictions':'Use Restrictions'},
            {'hvd_title':'Component Title'},
            {'hvd_itemIdentifier':'Harvard Identifier'},
            {'hvd_classification':'Havard Classification'},
            {'hvd_workType':'Component Form'},
            {'hvd_creator':'Component Creator'},
            {'hvd_production':'Component Pub Info'},
            {'hvd_freeDate':'Component Date'},
            {'hvd_copyright':'Harvard Copyright'},
            {'hvd_useRestrictions':'Harvard Use Restrictions'},
            {'hvd_repository':'Harvard Repository'},
            {'hvd_dimensions':'Component Dimensions'},
            {'hvd_topic':'Harvard Topic'},
            {'hvd_notes':'Harvard Notes'},
            {'hvd_materials':'Component Materials'},
            {'hvd_associatedName':'Harvard Associated Name'},
            {'associatedName':'Associated Name'},
            {'_attr':'Component ID'},
            {'_text':'TEXT'}
        ];

        // remove hvd_ from the key
        serviceObj.mapKey=function (key) {
            var myKey=key;

            for(var i=0; i < serviceObj.keys.length; i++) {
                var obj=serviceObj.keys[i];
                if(Object.keys(obj)[0]===key) {
                    myKey=serviceObj.keys[i][key];
                }
            }

            return myKey;
        };

        // do not show these items
        serviceObj.removeList=['lds03','lds08','lds20','lds37','structuredDate','image','source','altComponentID'];
        serviceObj.getRemoveList=function () {
            return serviceObj.removeList;
        };

        //re-arrange sorting order
        serviceObj.order=['title','lds04','creator','edition','lds07','format','lds13','subject','lds31','lds23','lds22',
        'lds30','identifier','lds44','lds24','lds25','lds27','rights','lds26','creationdate','lds01'];

        serviceObj.sort=function (listKey) {
           var keys=[];
           for(var i=0; i < serviceObj.order.length; i++) {
               var key=serviceObj.order[i];
               var index=listKey.indexOf(key);
               if(index!== -1) {
                   keys.push(key);
               }
           }

           return keys;
        };

        // re-arrange sorting component order
        serviceObj.orderList=['_attr','title','creator','state','production','description','physicalDescription','materials','dimensions',
        'notes','note','topic','placeName','location','culture','style','workType','classification','itemIdentifier',
            'associatedName','relatedWork','relatedInformation','useRestrictions','copyright','freeDate','repository'];
        serviceObj.getOrderList=function (listKey) {
            var keys=[];
            var hvdKeys=[];
            var key='';
            var pattern = /^(hvd_)/i;
            // find hvd key
            for(var j=0; j < listKey.length; j++) {
               key=listKey[j];
               if(pattern.test(key)) {
                   hvdKeys.push(key);
               }
            }

            for(var i=0; i < serviceObj.orderList.length; i++) {
                key=serviceObj.orderList[i];
                var index=listKey.indexOf(key);
                if(index!== -1) {
                    keys.push(key);
                }
            }

            if(hvdKeys.length > 0) {
                for(var i=0; i < serviceObj.orderList.length; i++) {
                    var keyMap=serviceObj.orderList[i];
                    key = 'hvd_'+keyMap;
                    var index = hvdKeys.indexOf(key);
                    if(index !== -1) {
                        keys.push(key);
                    }
                }
            }

            return keys;
        };

        return serviceObj;
    }]);
