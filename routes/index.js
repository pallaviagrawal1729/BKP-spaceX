var moment = require('moment');
module.exports = {
  getHomePage: (req, res) => {
    console.log('Request received For Home Page');
    res.render('pages/index.ejs', {
      title: 'SpaceX HomePage'
    });
  },


  getOrigin: (req, res) => {
    console.log('Request received for origins');
    //   res.writeHead(200, {'Content-Type': 'text/html'});
    // +.res.end('../combinepages/origin-tab.ejs');
    let query = "SELECT origin_city,origin_airport,origin_code FROM origin ORDER BY origin_id ASC"; // query database to get all the players
    //  execute query
    console.log(query);
    db.query(query, (err, result) => {
      //console.log( result);
      res.render('partition/origin.ejs', {
        title: 'SpaceX origin',
        origins: result
      });
    });
  },


  getDestination: (req, res) => {
    console.log('Request received for destination');
    let query = "SELECT destination_name,destination_desc FROM destination ORDER BY destination_id ASC";
    console.log(query);
    db.query(query, (err, result) => {
      // console.log( result);
      res.render('partition/destination.ejs', {
        title: 'welcome to node',
        desct: result
      });
    });
  },

  getDepart: (req, res) => {
    console.log('Request received for depart');
    var origin = req.query.o;
    var origindata = origin.split(" ");
    var originnewdata = origindata[0] + " " + origindata[1];
    var destination = req.query.d;
    var tDate = moment().format('YYYY-MM-DD');
    console.log('origin:: ' + originnewdata);
    console.log('destinationData:: ' + destination);
    let query = "SELECT DISTINCT date_format(date,'%Y-%m-%d') date,DAY(date) day, MONTHNAME(date) monthname, DAYNAME(date) dayname, MIN(economyclass_price) price , flight_id from flight_info where availability='true' and origin='" + originnewdata + "' and destination='" + destination + "' group by date_format(date,'%Y-%m-%d')  order by economyclass_price ";
    console.log('Query:: ' + query);
    db.query(query, (err, result) => {
      res.render('partition/depart.ejs', {
        title: 'SpaceX departure',
        heading: "Select Depart Date",
        data:tDate,
        depart: result
      });
    });
  },

  getPassenger: (req, res) => {
    console.log('Request received for passenger');
    var flightId = req.query.flightId;
    let query = "SELECT flight_id, total_firstclass_seats fcs,total_economy_seats ecs, total_business_seats bcs FROM flight_info where flight_id='" + flightId + "'";
    console.log(query);
    db.query(query, (err, result) => {
      console.log(result);
      res.render('partition/passenger.ejs', {
        title: 'Passenger Details',
        passenger: result
      });
    });
  },

  getflight: (req, res) => {
    console.log('Request received For flight Page');
    var origin = req.query.o;
    var destination = req.query.d;
    var depexactDate = req.query.depDate;
    var origindata = origin.split(" ");
    var originnewdata = origindata[0] + " " + origindata[1];
    console.log('originData:: ' + originnewdata);
    console.log('destinationData:: ' + destination);
    console.log('depDate:: ' + depexactDate);
    var query = "select total_firstclass_seats fcs ,total_economy_seats ecs, total_business_seats bcs, firstclass_price fp, economyclass_price ep, businessclass_price bp, origin, destination, origin_time, destination_time, CONCAT(TIMESTAMPDIFF(day,origin_time,destination_time) , ' d ', MOD( TIMESTAMPDIFF(hour,origin_time,destination_time), 24), ' h ', MOD( TIMESTAMPDIFF(minute,origin_time,destination_time), 60), ' m ') timeinterval, flight_id from flight_info where origin='" + originnewdata + "' and destination='" + destination + "' and date='" + depexactDate + "'";
    console.log('Query:: ' + query);
    db.query(query, (err, result) => {
      console.log(result);
      res.render('partition/selectvariant.ejs', {
        title: 'SpaceX flightPage',
        heading: "Select flights",
        flights: result
      });
    });
  },


  getcheckout: (req, res) => {
    console.log('Request received For checkout Page');
    var flightId = req.query.id;
    var price = req.query.price;
    var passenger = req.query.p;
    var destination = req.query.d;
    var depart = req.query.dp;
    var origin = req.query.o;
    var totalSeats = (parseInt(req.query.ecs) + parseInt(req.query.bcs) + parseInt(req.query.fcs)) / 6;
    var totalAmount = parseInt(price) * parseInt(passenger);
    var tax = (totalAmount * 10) / 100;
    var finalAmountToPay = totalAmount + tax;
    var query = "select seat_info from transaction_details where flight_id='" + flightId + "'";
  console.log(query);
    db.query(query, (err, result) => {
      console.log(result);
      var booked="";
      for(var i=0 ; i< result.length; i++){
      //console.log("Result Set :: " + result[i].seat_info);
      booked=booked + result[i].seat_info;
      }

      //console.log("All booked seats :: " + booked);
      res.render('partition/checkout_page.ejs', {
        title: 'SpaceX checkoutPage',
        seats: totalSeats,
        passenger: passenger,
        price: totalAmount,
        finalAmount: finalAmountToPay,
        destinations: destination,
        departs: depart,
        tax: tax,
        origins: origin,
        flightId: flightId,
        bookedSeats:booked
      });
    });
    //var query = "select "
    //db.query(query, (err, result) => {
    //console.log(result);

    //  });
    //   });
  },

  bookFlight: (req, res) => {
    console.log('Request received For booking Page');
    var hrTime = process.hrtime();
    var transactionId = "SPX" + hrTime[0] * 1000000 + hrTime[1] / 1000;
    var transactionDate = moment().format('YYYY-MM-DD hh:mm:ss');
    var transactionStatus = "SUCESS";
    var flightId = req.query.fi;
    var seatCount = req.query.sc;
    var seatInfo = req.query.seatInfo;
    //var seatInfo2 = seatInfo.slice(0,seatInfo.length);
    //alert(seatInfo2);
    var finalAmount = req.query.fa;
    var totalPrice = req.query.tp;
    var destination = req.query.d;
    var departureDate = req.query.dp;
    var origin = req.query.o;
    var passengerName = req.query.pa;
    var passengerNo = req.query.pn;
    //alert(passengerName+passengerNo);
    var query = "insert into transaction_details values( '" + transactionId + "','" + transactionDate + "' ,'" + transactionStatus + "', '" + flightId + "','" + seatCount + "' ,'" + seatInfo.trim() + "', '" + totalPrice + "' , '" + finalAmount + "' ,  '" + origin + "','" + departureDate + "','" + destination + "','" + passengerName + "'," + passengerNo + ")";
    console.log('Query:: ' + query);
    db.query(query, (err, result) => {
        });
     var query1 = "select origin_time ot,destination_time dt FROM flight_info where flight_id="+ flightId;
      console.log('Query:: ' + query1);
      db.query(query1, (err, result) => {
      console.log(result);
      res.render('partition/bookingpage.ejs', {
        title: 'Final Payment Page',
        destinations: destination,
        departs: departureDate,
        origins: origin,
        costs: finalAmount,
        id: transactionId,
        pa:passengerName,
        si:seatInfo,
        fi:flightId,
        time:result
      });
    });
  },
};
