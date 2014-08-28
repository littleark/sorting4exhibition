var config = require("./config");
var express = require('express');
var fs      = require('fs');


/**
 *  Define the sample application.
 */
var SortingServer = function(options) {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = options.host;
        self.port      = options.port || 8080;

        if (typeof self.ipaddress === "undefined") {
            console.warn('No HOST ADDRESS var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = { };

        self.routes['/health'] = function(req, res) {
            res.send("1");
        };

        self.routes['/'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html') );
        };
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express();
       	self.server = require('http').Server(self.app);

       	initializeCORS();

        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }

        initializeSocket();
    };

    function initializeCORS() {
    	
    	var allowCrossDomain = function(req, res, next) {
		    res.header('Access-Control-Allow-Origin', '*');
		    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
		    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
		    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
		    res.setHeader('Access-Control-Allow-Credentials', 'true');

		    // intercept OPTIONS method
		    if ('OPTIONS' == req.method) {
		      res.send(200);
		    }
		    else {
		      next();
		    }
		};

		self.app.use(allowCrossDomain);
		
    }

    function initializeSocket() {
    	self.io = require('socket.io')(self.server);
    	self.io.set('origins', '*:*');


    	 self.io.on('connection', function(socket) {
    	 	
    	 	socket.emit('open', { status: 'connected' });
			
			socket.on('disconnect', function () {
				console.log("user disconnected")
			});
		    
		    socket.on('join', function(data) {
				console.log("joining",data)
				socket.join(data);
				socket.emit('joined',data);
				//self.io.to("sorting-room").send('someone joined sorting room');
			});

		    socket.on("change-chart",function(status) {
				console.log("change chart",status)
				self.io.to("sorting-room").emit("change-chart",status);
			});

			socket.on("change-confirmed",function(status){
				console.log("change-confirmed",status)
				self.io.to("control-room").emit("change-confirmed",status);
			})

			socket.on("control-chart",function(status){
				console.log("control-chart",status)
				self.io.to("sorting-room").emit("control-chart",status);
			})

    	 });

		//initControl();
		//initSorting();

    }


    function initSorting() {

		var room = self.io
  					.of('/sorting-room')
  					.on('connection', function(socket) {

  						console.log("joining sorting room");
  						socket.emit('open', { status: 'connected' });
  						socket.on('disconnect', function () {
							console.log("user disconnected")
						});
					    socket.on('join', function(data) {
							socket.join("sorting-room");
							socket.emit('joined', "you've joined sorting");
							self.io.to("sorting-room").send('someone joined sorting room');
						});
						socket.on('left-chart', function(data) {
							console.log("left-chart changed succesfully")
							//socket.broadcast.to("control-room").emit('left-chart',{status:"ok",id:1});
						});
						socket.on('right-chart', function(data) {
							console.log("right-chart changed succesfully")
							//socket.broadcast.to("control-room").emit('right-chart',{status:"ok",id:2});
						});
					});
    }

    function initControl() {
    	
    	var room = self.io
  					.of('/control-room')
  					.on('connection', function(socket) {
  						console.log("joining control room");
  						socket.emit('open', { status: 'connected' });
  						socket.on('disconnect', function () {
							console.log("user disconnected")
						});
					    socket.on('join', function(data) {
							socket.join("control-room");
							socket.emit('joined', "you've joined control");
							socket.broadcast.to("control-room").send('someone joined control room');
						});
					    
					    socket.on("left-chart",function(status) {
							console.log("change left-chart",status)
							//self.io.sockets.broadcast.to("sorting-room").emit('right-chart',{status:"ok",id:1});
							//self.io.sockets.in('sorting-room').send('someone joined control room');;//.emit('left-chart',{status:"ok",id:1});
							//socket.broadcast.to("sorting-room").send('MERDA');
							//self.io.sockets.in("control-room").send('MERDA');
							console.log(self.io.to("sorting-room"))
							//for(var id in self.io.sockets.adapter.rooms) {
							self.io.to("sorting-room").send('MERDA');
							socket.broadcast.to("sorting-room").send('someone joined sorting room');
							//}

							//self.io.sockets.in('control-room').emit('left-chart',{status:"ok",id:1});
						})

						socket.on("right-chart",function(status) {
							console.log("change right-chart",status)
							//socket.broadcast.to("sorting-room").emit('right-chart',{status:"ok",id:2});
						})

					});

		
    }

    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).

		self.server.listen(self.port);
		console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var sorting = new SortingServer({
	host:config.host,
	port:config.port
});
sorting.initialize();
sorting.start();