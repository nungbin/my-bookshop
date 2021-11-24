using myCompany.hr.lms as lms from '../db/Students';

service mysrvdemo @(path:'/mysrvdemoService'){

    //Expose Students as an oData service
    @readonly
    entity StudentSrv as projection on lms.Students;

    //http://localhost:4004/mysrvdemo/myfoobar()
    //myfoobar is a REST API service
    //http://localhost:4004/mysrvdemo/myfoobar(msg='Hi World!')
    function myfoobar(msg : String) returns String;

}

annotate lms.Students with @(
    UI: {
        SelectionFields  : [
            email,
            first_name            
        ],

        LineItem: [
            {
                Value : email,
                Label : 'email'
            },
            {
                Value : first_name,
                Label : 'first_name'
            },
            {
                Value : last_name,
                Label : 'last_name'
            },
            {
                Value : date_sign_up,
                Label : 'date_sign_up'
            }            
        ],
    }
);
