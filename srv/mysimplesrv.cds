using myCompany.hr.lms as lms from '../db/Students';

service mysrvdemo @(path:'/mysrvdemoService'){

    //Expose Students as an oData service
    //@readonly
    //entity StudentSrv as projection on lms.Students;
    @readonly
    entity StudentSrv as select from lms.Students {
        *,
        null as full_name: String
    };

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
                Label : '{i18n>email}'
            },
            {
                Value : first_name,
                Label : '{i18n>first_name}'
            },
            {
                Value : last_name,
                Label : '{i18n>last_name}'
            },
            {
                Value : date_sign_up,
                Label : '{i18n>date_sign_up}'
            },
            {
                Value : full_name,
                Label : '{i18n>full_name}'
            }
        ],
    }
);