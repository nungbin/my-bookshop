const cds = require("@sap/cds");

const mysrvdemo = function(srv) {
    srv.on("myfoobar", function(req,res) {
        //return "Hello World!";
        return req.data.msg;
    })

    //Below method(.on) is to override the default Service implementation
     srv.on('READ', 'StudentSrv', async (req)=> {
         //const { StudentSrv } = srv.entities
         const { StudentSrv } = this.entities
         const ltabStudents = await cds.transaction(req).run(SELECT .from(StudentSrv))
         if (ltabStudents.length > 0 ) {
             ltabStudents[0].email = '2@gmail.com'
             // $count has to be assigned or returned result will not dipslay. 'result.js' shows why.
             // https://answers.sap.com/questions/13084938/how-can-i-implement-counttrue-support-with-an-exte.html
             ltabStudents.$count = ltabStudents.length
         }
         return ltabStudents
     })
}

module.exports = mysrvdemo;