const cds = require("@sap/cds");

// async here is to make it synchronous, to avoid a mess of callbacks and promises
async function _readStudentSrv(req) {
  //const { StudentSrv } = srv.entities
  const { StudentSrv } = this.entities;
  const ltabStudents = await cds.transaction(req).run(SELECT.from(StudentSrv));
  if (ltabStudents.length > 0) {
    //grey out the blow line for now in order to avoid confusion on the result
    //ltabStudents[0].email = '2@gmail.com'
    // $count has to be assigned or returned result will not dipslay. 'result.js' shows why.
    // https://answers.sap.com/questions/13084938/how-can-i-implement-counttrue-support-with-an-exte.html
    ltabStudents.$count = ltabStudents.length;
  }
  return ltabStudents;
}

function _myFoobar(req, res) {
  //return "Hello World!";
  return req.data.msg;
}

// const mysrvdemo = function(srv) {
//     srv.on("myfoobar", _myFoobar)

//     //http://localhost:4004/mysrvdemoService/myfoobar(msg='Hi')
//     //Below method(.on) is to override the default Service implementation
//      srv.on('READ', 'StudentSrv', _readStudentSrv)
// }

const mysrvdemo = function (srv) {
//  srv.after("READ", "StudentSrv", (each) => {
//    //console.log("Read students");
//    // if (each.stock > 111)  each.title += ' -- 11% discount!'
//  });
};

module.exports = mysrvdemo;
