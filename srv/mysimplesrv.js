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


// learned from https://www.javascripttutorial.net/javascript-array-sort/
function _sortStudents(students, req)  {
  switch(req.query.SELECT.orderBy[0].ref[0]) {
    case "full_name":
      if (req.query.SELECT.orderBy[0].sort === 'asc') {
        students.sort(function (a, b) {
          let x = a.full_name.toUpperCase(),
              y = b.full_name.toUpperCase();
          return x == y ? 0 : x > y ? 1 : -1;
        });    
      }
      if (req.query.SELECT.orderBy[0].sort === 'desc') {
        students.sort(function (a, b) {
          let x = a.full_name.toUpperCase(),
              y = b.full_name.toUpperCase();
          return x == y ? 0 : x > y ? -1 : 1;
        });    
      }
      break;
  }
}


function _myFoobar(req, res) {
  //return "Hello World!";
  return req.data.msg;
}

// const mysrvdemo = function(srv) {
//     //Below method(.on) is to override the default Service implementation
//      srv.on('READ', 'StudentSrv', _readStudentSrv)
// }

const mysrvdemo = function (srv) {
// http://localhost:4004/mysrvdemoService/myfoobar(msg='Hi')
  srv.on("myfoobar", _myFoobar)

  srv.after("READ", "StudentSrv", (students, req) => {
    //console.log("Read students");
    // if (each.stock > 111)  each.title += ' -- 11% discount!'

    //reference to https://blogs.sap.com/2019/08/21/computed-field-example-in-cap/
    let oStudents;
    if (req.query.SELECT.columns[0].func != 'count') {
      if (Array.isArray(students) &&
          students.length >= 1) {
        //oStudents = students.map(async student => {
        //  student.full_name = student.last_name + ', ' + student.first_name;
        //});

        //  11/30/2021: i DO NOT understand why this has to be called for each single record!!!
        for (let each of students) {
          each.full_name = each.last_name + ', ' + each.first_name;
        }

        _sortStudents(students, req);

        //for (var i = 0; i < students.length; i++) {
        //  students[i].full_name = students[i].last_name + ', ' + students[i].first_name;
        //}
        //return oStudents;
      }
      //if (typeof students === 'object') {
      else {
        //Single read
        if (typeof students.last_name  !== "undefined" &&
            typeof students.first_name !== "undefined") {
            students.full_name = students.last_name + ', ' + students.first_name;
        }
        
      }
    }
  });
};

module.exports = mysrvdemo;
