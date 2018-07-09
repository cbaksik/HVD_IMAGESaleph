/**
 * Created by samsan on 9/28/17.
 */

angular.module('viewCustom')
    .service('customMapXmlKeys',[function () {
        var serviceObj={};

        // filter the xml key node
        serviceObj.keys=[
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
            {'associatedName':'Associated Name'},
            {'creationdate':'Creation Date'},
            {'creator':'Author / Creator'},
            {'format':'Description'},
            {'freeDate':'Date'},
            {'itemIdentifier':'Identifier'},
            {'placeName':'Place'},
            {'production':'Publication info'},
            {'relatedWork':'Related Work'},
            {'relatedInformation':'Related Information'},
            {'rights':'Copyright'},
            {'state':'Edition'},
            {'topic':'Subject'},
            {'workType':'Form / Genre'},
            {'useRestrictions':'Use Restrictions'},
            {'hvd_associatedName':'Image Associated Name'},
            {'hvd_classification':'Image Classification'},
            {'hvd_copyright':'Image Copyright'},
            {'hvd_creator':'Image Creator'},
            {'hvd_culture':'Image Culture'},
            {'hvd_description':'Image Description'},
            {'hvd_dimensions':'Image Dimensions'},
            {'hvd_freeDate':'Image Date'},
            {'hvd_itemIdentifier':'Image Identifier'},
            {'hvd_materials':'Image Materials'},
            {'hvd_notes':'Image Notes'},
            {'hvd_note':'Image Notes'},
            {'hvd_placeName':'Image Place'},
            {'hvd_production':'Image Publication info'},
            {'hvd_relatedInformation':'Image Related info'},
            {'hvd_relatedWork':'Image Related Work'},
            {'hvd_repository':'Harvard Repository'},
            {'hvd_state':'Image Edition'},
            {'hvd_style':'Image Style'},
            {'hvd_title':'Image Title'},
            {'hvd_topic':'Image Subject'},
            {'hvd_useRestrictions':'Image Use Restrictions'},
            {'hvd_workType':'Image Type'},
            {'_attr':'Image ID'},
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
        serviceObj.order=['title','lds04','creator','creationdate','edition','lds07','format','lds13','subject','lds31','lds23','lds22',
        'lds30','identifier','lds44','lds24','lds25','lds27','rights','lds26','lds01'];

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
        serviceObj.orderList=['title','creator','freeDate','state','production','description','physicalDescription','materials','dimensions',
        'notes','note','topic','placeName','location','culture','style','workType','classification','itemIdentifier',
            'associatedName','relatedWork','relatedInformation','useRestrictions','copyright','repository'];
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
            if(listKey.length > 0) {
                var index = listKey.indexOf('_attr');
                if (index !== -1) {
                    keys.push('_attr');
                }
            }

            return keys;
        };

        return serviceObj;
    }]);
