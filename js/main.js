if(typeof(console) === 'undefined') {
    var console = {}
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
}
console.log("Welcome to SORTING.");
console.log("Ver 0.1");
console.log("Thanks for playing with SORTING!");
console.log("carlo zapponi");
console.log("me@carlo.im");
require.config({
    urlArgs: "t=" + (new Date()).getTime(),
	paths: {
		d3: "vendors/d3.min",
		//d3: "//cdnjs.cloudflare.com/ajax/libs/d3/3.4.1/d3.min",
		io: "vendors/socket.io"
		//io: "//cdn.socket.io/socket.io-1.0.6"
	}
});
require(["d3","Sorting","support","io"], function(d3,Sorting,support,io) {

	;(function () {
	  function CustomEvent ( event, params ) {
	    params = params || { bubbles: false, cancelable: false, detail: undefined };
	    var evt = document.createEvent( 'CustomEvent' );
	    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
	    return evt;
	   };

	  CustomEvent.prototype = window.CustomEvent.prototype;

	  window.CustomEvent = CustomEvent;
	})();

	function shuffle(o){ //v1.0
		for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	};



	var data100=shuffle(d3.range(100));

	var data={};

	var random=[];
	var reversed=[];
	var few_uniques=[];
	var nearly_sorted=[];
	support.items.forEach(function(d){
		random[d]=shuffle(d3.range(d));
		reversed[d]=d3.range(d).reverse();
		nearly_sorted[d]=d3.range(d);
		few_uniques[d]=[];
	});
	
	support.items.forEach(function(d){
		var n=Math.ceil(d*0.4);
		n=(n%2)?n+1:n;
		var elements=shuffle(d3.range(d)).slice(0,n);

		for(var i=1;i<elements.length;i+=1) {
			support.swapItems(nearly_sorted[d],nearly_sorted[d].indexOf(elements[i-1]),nearly_sorted[d].indexOf(elements[i]));
		}

		
	});

	support.items.forEach(function(d){

		var unique=d3.range(Math.ceil(d/5));

		for(var i=0;i<d;i++) {
			few_uniques[d].push(unique[Math.ceil(Math.random()*unique.length-1)])
		}

	})




	data={
		"rnd":random,
		"nrl":nearly_sorted,
		"rvr":reversed,
		"few":few_uniques
	}
	
	//console.log(data)

	var sortingController;

	window.sorting=new Sorting({
		container:"#algorithms"
	});

	var algorithms=[
		{
			name:"Quick Sort",
			file:"QuickSort3",
			O:"O(n log n)",
			active:true
		},
		{
			name:"Quick Sort 3-way",
			file:"QuickSort4",
			O:"O(n log n)",
			active:false
		},
		{
			name:"Heap Sort",
			file:"HeapSort",
			O:"O(n log n)",
			active:true
		},
		{
			name:"Smooth Sort",
			file:"SmoothSort",
			O:"O(n log n)",
			active:false
		},
		{
			name:"Shell Sort",
			file:"ShellSortShell",
			O:"Shell, 1959",
			active:false
		},
		{
			name:"Shell Sort",
			file:"ShellSortKnuth2",
			O:"Knuth, 1973",
			active:false
		},
		{
			name:"Shell Sort",
			file:"ShellSortTokuda",
			O:"Tokuda, 1992",
			active:false
		},
		{
			name:"Shell Sort",
			file:"ShellSortCiura",
			O:"Ciura, 2001",
			active:false
		},
		{
			name:"Merge Sort (in-place)",
			file:"MergeSort",
			O:"O(n&sup2;)",
			active:false
		},
		{
			name:"Cycle Sort",
			file:"CycleSort",
			O:"O(n&sup2;)",
			active:false
		},
		{
			name:"Selection Sort",
			file:"SelectionSort",
			O:"O(n&sup2;)",
			active:false
		},
		{
			name:"Insertion Sort",
			file:"InsertionSort",
			O:"O(n&sup2;)",
			active:false
		},
		{
			name:"Gnome Sort",
			file:"GnomeSort",
			O:"O(n&sup2;)",
			active:false
		},
		{
			name:"Comb Sort",
			file:"CombSort",
			O:"&nbsp;",
			active:false
		},
		{
			name:"Bubble Sort",
			file:"BubbleSort",
			O:"O(n&sup2;)",
			active:false
		},
		{
			name:"Cocktail Sort",
			file:"CocktailSort",
			O:"O(n&sup2;)",
			active:false
		},
		{
			name:"OddEven Sort",
			file:"OddEvenSort",
			O:"O(n&sup2;)",
			active:false
		},
		{
			name:"Radix Sort",
			file:"RadixSort",
			O:"Worst Case: O(kN)",
			active:false
		}
	];

	var options={
		algorithm:algorithms[0].file,
		color:"gold",
		items:20,
		initial_condition:"rnd"
	};

	
	
	


	sorting.detectScrollTop();
	d3.select("#algorithms").style("min-height",(window.innerHeight-25)+"px")
	d3.select(window).on("scroll",sorting.detectScrollTop);
	d3.select(window).on("resize",function(){
		d3.select("#algorithms").style("min-height",(window.innerHeight-25)+"px")
	});

	function scrollTween(offset) {
	  return function() {
	    var i = 
	        d3.interpolateNumber(
	            window.pageYOffset || document.documentElement.scrollTop,
	            offset
	        );
	    return function(t) { 
	        scrollTo(0, i(t)); 
	    };
	  };
	}
	var touch=support.isTouchDevice();

	d3.select("body").classed("touch",touch).classed("no-touch",!touch)

	d3.select("#add a.plus").on("click",function(){
		d3.event.preventDefault();
		d3.select("#formContainer").classed("collapsed",false);
		
		var position=support.findPos(d3.select("#formContainer").node());

		
		d3.transition()
		    .delay(50)
		    .duration(1000)
		    .tween(
		        "scroll",
		        scrollTween(position[1]-10)
		    );
		
		
	});
	d3.select("#formContainer a.close").on("click",function(){
		d3.event.preventDefault();
		d3.select("#formContainer").classed("collapsed",!d3.select("#formContainer").classed("collapsed"))

		d3.transition()
		    .duration(1000)
		    .tween(
		        "scroll",
		        scrollTween(0)
		    );

	})	

	d3.select("ul#algs").selectAll("li")
		.data(algorithms)
		.enter()
		.append("li")
			.append("a")
				.attr("href","#")
				.html(function(d){
					return d.name+"<br/><i>"+d.O+"</i>";
				})
				.attr("class",function(d){
					return d.file;
				})
				.classed("selected",function(d,i){
					return d.file=="QuickSort";
				})
				.on("click",function(d,i){
					d3.event.preventDefault();

					//console.log(d);

					d3.selectAll("#formContainer ul#algs li a").classed("selected",false);
					d3.select(this).classed("selected",true)

					options.algorithm=d.file;
				})
				.append("span")

	d3.select("#formContainer ul#colors").selectAll("li")
		.data(d3.entries(support.colors))
		.enter()
		.append("li")
			.append("a")
				.attr("href","#")
				.attr("title",function(d){
					return d.key;
				})
				.classed("selected",function(d,i){
					return d.key=="blue";
				})
				.style("background-color",function(d){
					return d3.rgb("hsl("+d.value+")").toString();
				})
				.on("click",function(d,i){
					d3.event.preventDefault();

					//console.log(d);
					
					d3.selectAll("#formContainer ul#colors li a").classed("selected",false);
					d3.select(this).classed("selected",true)

					options.color=d.key;
				});

	d3.select("#formContainer ul#initial").selectAll("li")
			.data(d3.keys(data))
			.select("a")
			.on("click",function(d,i){
				d3.event.preventDefault();

				//console.log(d);
				
				d3.selectAll("#formContainer ul#initial li a").classed("selected",false);
				d3.select(this).classed("selected",true)

				options.initial_condition=d;
			});

	d3.select("#formContainer ul#items").selectAll("li")
		.data(support.items)
		.enter()
		.append("li")
			.append("a")
				.attr("href","#")
				.attr("title",function(d){
					return d+" items";
				})
				.classed("selected",function(d,i){
					return d==10;
				})
				.text(function(d){
					return d;
				})
				.on("click",function(d,i){
					d3.event.preventDefault();

					//console.log(d,this,this.parentNode);

					d3.selectAll("#formContainer ul#items li a").classed("selected",false);
					d3.select(this).classed("selected",true);

					options.items=d;
				});

	d3.select("#formContainer .generate")
		.on("click",function(d,i){
			d3.event.preventDefault();

			var position=support.findPos(d3.select("#add").node());

			console.log(
				options.algorithm,
				data[options.initial_condition][options.items],
				options.color,
				options.initial_condition
			);
			d3.transition()
			    .duration(1000)
			    .each("end",function(){
			    	sorting.addAlgorithm(
						options.algorithm,
						data[options.initial_condition][options.items],
						options.color,
						options.initial_condition
					)
			    })
			    .tween(
			        "scroll",
			        scrollTween(position[1]-10)
			    )
		

			
		});

	d3.select("body").on("keyup",function(){
		if(d3.event.keyCode==39) {
			sorting.nextStep();
		}
		if(d3.event.keyCode==37) {
			sorting.prevStep();
		}
	})

	document.addEventListener('paused', function start(e) {
		var running=sorting.getStatus();
		d3.select("#controls #play").classed("play",running);
		sorting.pause();

		sortingController.sendPause();

	});
	document.addEventListener('all-sorted', function start(e) {
		sortingController.sendEnd();
	});
	d3.select("#controls #back")
		.on("click",function(d,i){
			d3.event.preventDefault();

			sorting.prevStep();
			var running=sorting.getStatus();
			d3.select("#controls #play").classed("play",running);
			
		});
	d3.select("#controls #forward")
		.on("click",function(d,i){
			d3.event.preventDefault();

			sorting.nextStep();
			var running=sorting.getStatus();
			
			d3.select("#controls #play").classed("play",running);
			
		});
	d3.select("#controls #play")
		.on("click",function(d,i){
			d3.event.preventDefault();
			var running=sorting.getStatus();
			
			d3.select(this).classed("play",!running);
			if(!running) {
				sorting.pause();
				sorting.start();
			} else {
				sorting.pause();
			}
			
		});

	d3.select("#controls #fastback")
		.on("click",function(d,i){
			d3.event.preventDefault();

			sorting.pause(null,function(){
				sorting.goTo(0);
			});
			var running=sorting.getStatus();
			d3.select("#controls #play").classed("play",running);

			
			
		});

	d3.select("#controls #fastforward")
		.on("click",function(d,i){
			d3.event.preventDefault();

			sorting.pause(null,function(){
				sorting.goTo(sorting.getSteps()-1);
			});
			var running=sorting.getStatus();
			d3.select("#controls #play").classed("play",running);
			
			
		});

	d3.selectAll("#layout a.size")
		.on("click",function(d,i){
			d3.event.preventDefault();

			d3.selectAll("#layout a.size").classed("selected",function(l,j){
				return i==j;
			});
			
			sorting.resize(i);
			
		});
	d3.select("#layout a.items")
		.on("click",function(d,i){
			d3.event.preventDefault();

			d3.select(this).classed("selected",!d3.select(this).classed("selected"));
			sorting.toggleItems();
			
		});

	d3.select("#layout a.share")
		.on("click",function(d,i){
			d3.event.preventDefault();

			d3.select(this).classed("selected",!d3.select(this).classed("selected"));
			
			d3.select("#social").classed("visible",!d3.select("#social").classed("visible"));
			
		});

	d3.select("#overlay .close")
		.on("click",function(d,i){
			d3.event.preventDefault();

			d3.select("#overlay").classed("visible",false)
			
		});

	algorithms.forEach(function(d,i){
		if(d.active) {
			sorting.addAlgorithm(
				d.file,
				data[options.initial_condition][options.items],
				options.color,
				options.initial_condition,
				i,
				function callback(){d3.select("#header h1").classed("init",false);}
			);
		}
	})
	/*
	d3.json("http://carlo.im/support/sorting/getPlus.php",function(d){
		d3.selectAll(".fb").text(d.fb);
		d3.selectAll(".twt").text(d.t+d.t2);
		d3.selectAll(".gp").text(d.gp);		
	})
	*/
	function SortingController() {
				
		var self=this;
		var socket;
		this.sendPlay=function() {
			console.log("EMITTING PLAY FROM SORTING VIZ")
			socket.emit("sorting-chart",{action:"play"});
		}
		this.sendPause=function() {
			console.log("EMITTING PAUSE FROM SORTING VIZ")
			socket.emit("sorting-chart",{action:"pause"});
		}
		this.sendEnd=function() {
			console.log("EMITTING END FROM SORTING VIZ")
			socket.emit("sorting-chart",{action:"end"});
		}
		function initSocket() {
			//socket = io.connect('http://localhost:8080');
			socket = io.connect('http://sortingcontrol-littleark.rhcloud.com:8000');

			socket.on("open",function(data){
				console.log("open",data);
				if(data.status=="connected") {
					socket.emit("join","sorting-room");
				}
			});

			socket.on("close",function(data){
				console.log("close",data)
			});

			socket.on('error', function (reason){
				console.error('Unable to connect Socket.IO', reason);
			});

			socket.on('joined',function(message){
				console.log("joined",message);
				changeAlgorithm({
					position:0,
					algorithm:message.algorithms[0]
				});
				changeAlgorithm({
					position:1,
					algorithm:message.algorithms[1]
				});
			})

			socket.on('message',function(message){
				console.log("message",message);
			})

			socket.on('change-chart',function(status){
				console.log("change chart",status);
				socket.emit("change-confirmed",status);
			})

			function changeAlgorithm(status) {
				sorting.pause();

				var running=sorting.getStatus();
				d3.select("#controls #play").classed("play",!running);
				


				d3.select("#algorithms")
					.selectAll("div.algorithm."+(status.position?"right":"left"))
					.each(function(d){
						sorting.removeAlgorithm(d.name,function(){
							sorting.addAlgorithm(
								status.algorithm,
								data[options.initial_condition][options.items],
								options.color,
								options.initial_condition,
								status.position,
								function() {
									sorting.pause(null,function(){
										sorting.goTo(0,function(){
											sorting.start();
											self.sendPlay();
										});
									});
									//sorting.start();
								}
							)
						});

					})
			}

			socket.on("control-chart",function(status){

				switch(status.action) {
					case "change":
						console.log(status);
						
						changeAlgorithm(status);

					break;
					case "play":
						console.log(status)
						
						var running=sorting.getStatus();
			
						d3.select("#controls #play").classed("play",!running);

						
						if(!running) {
							sorting.pause();
							sorting.start();
							self.sendPlay();
						} else {
							sorting.pause();
							alert("###")
							self.sendPause();
						}
						
						
					break;
					case "pause":
						var running=sorting.getStatus();

						d3.select("#controls #play").classed("play",running);
						sorting.pause();
						self.sendPause();
					break;
					case "forward":
						sorting.nextStep();
						var running=sorting.getStatus();

						d3.select("#controls #play").classed("play",running);
					break;
					case "backward":
						sorting.prevStep();
						var running=sorting.getStatus();

						d3.select("#controls #play").classed("play",running);
					break;
					case "fastback":
						sorting.pause(null,function(){
							sorting.goTo(0);
						});
						var running=sorting.getStatus();

						d3.select("#controls #play").classed("play",running);
					break;
					case "fastforward":
						sorting.pause(null,function(){
							sorting.goTo(sorting.getSteps()-1);
						});
						var running=sorting.getStatus();

						d3.select("#controls #play").classed("play",running);
					default:
						console.log(status);
				}

			});

			socket.on("reset",function(){
				location.reload();
			})

		}
		initSocket();

	}

	sortingController=new SortingController();
	var logo=d3.select("#header h1");
	;(function changeLogo() {
		logo.classed("init",!logo.classed("init"))
		setTimeout(changeLogo,10000);
	}());

});
