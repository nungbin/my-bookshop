using { managed, Country } from '@sap/cds/common';

namespace myCompany.hr.lms;

define type tyGrade: Integer;

// Master data can be found here: https://github.com/SAP-samples/cloud-cap-samples/tree/main/common/data
entity Students : managed {
    key email:    String(65);
    first_name:   String(20);
    last_name:    String(20);
    date_sign_up: Date;
    grade:        tyGrade;
    //country:      Association to one sap.common.Country;
    country :     Country; //> using reuse type
}


annotate Students with {
    email         @title : '{i18n>email}';
    first_name    @title : '{i18n>first_name}';
    last_name     @title : '{i18n>last_name}';
    date_sign_up  @title : '{i18n>date_sign_up}';
    grade         @title : '{i18n>grade}';
    country       @title : '{i18n>country}';
};
