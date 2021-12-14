using myCompany.hr.lms as lms from '../db/Students';

service mysrvdemo @(path:'/mysrvdemoService'){
    //Expose Students as an oData service
    entity Students @(restrict : [
            {
                grant : [ 'READ' ],
                to : [ 'RiskViewer' ]
            },
            {
                grant : [ '*' ],
                to : [ 'RiskManager' ]
            }
        ]) as projection on lms.Students;
    @odata.draft.enabled
    @Capabilities: { 
        InsertRestrictions.Insertable: true,
        UpdateRestrictions.Updatable:  true,
        DeleteRestrictions.Deletable:  true  
    }    
    entity StudentCRUD as projection on lms.Students;

    //@readonly. if this is read only, the edittoggle button will not work
    // Basic authentication references to https://developers.sap.com/tutorials/btp-app-cap-roles.html
    //                             Github https://github.com/SAP-samples/cloud-cap-risk-management/blob/master/templates/cap-roles/.cdsrc.json
    entity StudentSrv @(restrict : [
            {
                grant : [ 'READ' ],
                to : [ 'RiskViewer' ]
            },
            {
                grant : [ '*' ],
                to : [ 'RiskManager' ]
            }
        ]) as select from lms.Students {
        *,
        //null as full_name: String
        //https://www.sqlitetutorial.net/sqlite-string-functions/sqlite-concat/
        last_name || ', ' || first_name as full_name : String
    } order by modifiedAt desc;


    //http://localhost:4004/mysrvdemoService/myfoobar()
    //myfoobar is a REST API service
    //http://localhost:4004/mysrvdemoService/myfoobar(msg='Hi World!')
    function myfoobar(msg : String) returns String;

    //http://localhost:4004/mysrvdemoService/getFullName(email='1@gmail.com')
    function getFullName(email: String) returns array of String;
}
