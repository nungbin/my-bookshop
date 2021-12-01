namespace myCompany.hr.lms;

entity Students {
    key email:    String(65);
    first_name:   String(20);
    last_name:    String(20);
    date_sign_up: Date;
}


annotate Students with {
    email         @title : '{i18n>email}';
    first_name    @title : '{i18n>first_name}';
    last_name     @title : '{i18n>last_name}';
    date_sign_up  @title : '{i18n>date_sign_up}';
};
