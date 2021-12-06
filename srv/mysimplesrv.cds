using myCompany.hr.lms as lms from '../db/Students';

service mysrvdemo @(path:'/mysrvdemoService'){
    //Expose Students as an oData service
    entity Students as projection on lms.Students;

    @odata.draft.enabled
    @Capabilities: { 
        InsertRestrictions.Insertable: true,
        UpdateRestrictions.Updatable:  true,
        DeleteRestrictions.Deletable:  true  
    }    
    entity StudentCRUD as projection on lms.Students;

    //@readonly. if this is read only, the edittoggle button will not work
    entity StudentSrv as select from lms.Students {
        *,
        //null as full_name: String
        //https://www.sqlitetutorial.net/sqlite-string-functions/sqlite-concat/
        last_name || ', ' || first_name as full_name : String
    };


    //http://localhost:4004/mysrvdemoService/myfoobar()
    //myfoobar is a REST API service
    //http://localhost:4004/mysrvdemoService/myfoobar(msg='Hi World!')
    function myfoobar(msg : String) returns String;

    //http://localhost:4004/mysrvdemoService/getFullName(email='1@gmail.com')
    function getFullName(email: String) returns array of String;
}
