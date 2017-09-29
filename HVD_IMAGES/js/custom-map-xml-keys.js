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
            {'hvd_associatedName':'Harvard Associated Name'}
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
        serviceObj.removeList=['lds03','lds20','lds37','structuredDate','image'];
        serviceObj.getRemoveList=function () {
            return serviceObj.removeList;
        };


        return serviceObj;
    }]);
