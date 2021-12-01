const cds = require("@sap/cds");

// async here is to make it synchronous, to avoid a mess of callbacks and promises
async function _readStudentSrv(req, next) {
  //const { StudentSrv } = srv.entities
  let bCallNext = true;

  if (req.query.SELECT.where) {
    switch (req.query.SELECT.where[0].args[0].ref[0]) {
      case "full_name":
        const conn = await cds.connect.to ('mysrvdemo')
        const { StudentSrv } = this.entities;
        let students = await conn.run (SELECT `*` .from `StudentSrv`)

        //const students = await cds.transaction(req).run(SELECT.from(StudentSrv));
  //   // $count has to be assigned or returned result will not dipslay. 'result.js' shows why.
  //   // https://answers.sap.com/questions/13084938/how-can-i-implement-counttrue-support-with-an-exte.html
        _filterStudents(students, req);
        students.$count = students.length;
        bCallNext = false;
    }
  }
  if (bCallNext) {
    //call next() is needed. Reference: https://cap.cloud.sap/docs/node.js/services#srv-on
    return next();
  }
}


// learned from https://www.javascripttutorial.net/javascript-array-sort/
function _sortStudents(students, req)  {
  switch (req.query.SELECT.orderBy[0].ref[0]) {
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


function _filterStudents(students, req)  {
  switch (req.query.SELECT.where[0].func) {
    case "contains":
      let resultStudents = [];
      let val = req.query.SELECT.where[0].args[1].val;
      val = val.toUpperCase();
      for (let each of students) {
        if (each.full_name.toUpperCase().indexOf(val) !== -1) {
          resultStudents.push(each);
        }
      }
      students = resultStudents;
      // students = students.filter( student => {
      //   student.full_name.toUpperCase().indexOf(val) !== -1;
      // });
      break;
  }
}


function _myFoobar(req, res) {
  //return "Hello World!";
  return req.data.msg;
}


const mysrvdemo = function (srv) {
// http://localhost:4004/mysrvdemoService/myfoobar(msg='Hi')
  srv.on("myfoobar", _myFoobar)


  //Below method(.on) is to override the default Service implementation
  //srv.on("READ", "StudentSrv", _readStudentSrv);
  

  // srv.after("READ", "StudentSrv", (students, req) => {
  //   //console.log("Read students");
  //   // if (each.stock > 111)  each.title += ' -- 11% discount!'

  //   //reference to https://blogs.sap.com/2019/08/21/computed-field-example-in-cap/
  //   let oStudents;
  //   if (typeof req.query.SELECT.columns !== "undefined") {
  //     if (req.query.SELECT.columns[0].func != 'count') {
  //       if (Array.isArray(students) &&
  //           students.length >= 1) {
  //         //oStudents = students.map(async student => {
  //         //  student.full_name = student.last_name + ', ' + student.first_name;
  //         //});

  //         //  11/30/2021: i DO NOT understand why this has to be called for each single record!!!
  //         for (let each of students) {
  //           each.full_name = each.last_name + ', ' + each.first_name;
  //         }

  //         if (typeof req.query.SELECT.orderBy !== "undefined") {
  //           if (req.query.SELECT.orderBy[0].sort) {
  //             _sortStudents(students, req);
  //           }  
  //         }
  //         //return oStudents;
  //       }
  //       //if (typeof students === 'object') {
  //       else {
  //         //Single read
  //         if (typeof students.last_name  !== "undefined" &&
  //             typeof students.first_name !== "undefined") {
  //             students.full_name = students.last_name + ', ' + students.first_name;
  //         }
  //       }
  //     }
  //   }
  // });
};

module.exports = mysrvdemo;
