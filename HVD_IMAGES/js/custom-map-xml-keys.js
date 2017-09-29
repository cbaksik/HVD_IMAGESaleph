/**
 * Created by samsan on 9/28/17.
 */

angular.module('viewCustom')
    .service('customMapXmlKeys',[function () {
        var serviceObj={};

        // filter the xml key node
        serviceObj.keys=[{'_attr':'Component ID'},
            {'_text':'TEXT'},
            {'associatedName':'Associated Name'},
            {'freeDate':'Free Date'},
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
            {'structuredDate':'Structured Date'},
            {'workType':'Work Type'},
            {'useRestrictions':'Use Restrictions'}
        ];

        // remove hvd_ from the key
        serviceObj.mapKey=function (key) {
            var myKey=key;
            var pattern = /^(HVD_)/i;
            if(pattern.test(key)) {
                var listKey=key.split('_');
                if(listKey.length > 0) {
                    myKey=listKey[1];
                }
            } else {
                for(var i=0; i < serviceObj.keys.length; i++) {
                    var obj=serviceObj.keys[i];
                    if(Object.keys(obj)[0]===key) {
                        myKey=serviceObj.keys[i][key];
                    }
                }
            }

            return myKey;
        };

        // do not show these items
        serviceObj.removeList=['lds03','lds20','lds37'];
        serviceObj.getRemoveList=function () {
            return serviceObj.removeList;
        };


        return serviceObj;
    }]);
