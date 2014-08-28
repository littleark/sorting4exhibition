define(["d3","./support"],function(d3,support,DistanceChart) {



	function DistanceChart(items,options) {

		var container=options.container;
		var width=options.width-options.margins.left-options.margins.right,
			height=100;
		var goal=items[items.length-1].map(function(d){
			if(typeof d.index != 'undefined') {
				d.value=d.index;
			}
			return d;
		});
		//console.log("GOAL",goal)
		var steps=[];
		
		options.margins.left=35;
		options.margins.right=35;

		items.forEach(function(d,i){
			steps[i]=0;
			d.forEach(function(item,index){
				if(item) {
					//console.log(item)
					var value=item.value || item.index;
					//console.log(value,"==",goal[index].value)
					if(value==goal[index].value) {
						steps[i]++;
						//console.log("OK")
					}
				}
				
			})
		});
		
		//console.log("ALL ITEMS",items)

		var inversions=[];
		items.forEach(function(d,index){
		    inversions[index]=0;//[];
		    for(var i=0;i<d.length;i++) {

		    	var i_val=0;
		    	if(!d[i].tmp) {
		    		i_val=(typeof d[i].value !='undefined')?d[i].value:d[i].index;
		    	} else {
		    		i_val=d[i].tmp.value;
		    	}	

		        for(var j=i+1;j<d.length;j++) {

		        	//var i_val=(typeof d[i].value !='undefined')?d[i].value:d[i].index;
		        	//var j_val=(typeof d[j].value !='undefined')?d[j].value:d[j].index;

		        	var j_val=0;
			    	if(!d[j].tmp) {
			    		j_val=(typeof d[j].value !='undefined')?d[j].value:d[j].index;
			    	} else {
			    		j_val=d[j].tmp.value;
			    	}	

		            if(i<j && i_val>j_val) {
		                inversions[index]++;
		            }
		        }
		    }

		    //console.log("INVERSIONS",inversions[index])
		})
		//console.log("INVERSIONS",inversions)

		//console.log("DISTANCE STEPS",steps)

		//console.log("REAL STEPS",options.steps)

		var operations=[];

		options.steps.forEach(function(step,i){
			if(step.length>0) {
				var s=step[0];
				//console.log("::",s.cmp.index.length)
				
				

				s.cmp.index.forEach(function(cmp){
					operations.push({
						t:0,
						i:operations.length,
						inversions:inversions[i-1],
						s:i
					})
				})
				
			}

			operations.push({
				t:1,
				i:operations.length,
				inversions:inversions[i],
				s:i
			});
		});

		//console.log("ALL OPERATIONS",operations)

		steps=inversions;

		//console.log(options)
		//alert(options.distance.operations)
		//console.log("OPTIONS.DISTANCE",options.distance)
		var maxOperations=(options.distance.operations > operations.length-1)?options.distance.operations:operations.length-1;

		var xscale=d3.scale.linear().domain([0,maxOperations]).rangeRound([0,width]),
			//yscale=d3.scale.linear().domain([0,d3.max(inversions)]).range([0,50])
			yscale=d3.scale.linear().domain([0,items[0].length*(items[0].length-1)/2]).rangeRound([0,50])

		var svg=container.append("div")
					.attr("class","distance-chart")
					.classed("over",steps.length>options.width/2)
					.append("svg")
						.attr("width",options.width)
						.attr("height",height);

		var chart=svg.append("g")
						.attr("transform","translate("+options.margins.left+","+(height-30)+")")

		
		var bars=chart.selectAll("g.bar")
				.data(operations.filter(function(d){
					return d.t===1;
				}))
				.enter()
				.append("g")
					.attr("class","bar")
					.classed("last",function(d,i){
						return i==steps.length-1;
					})
					.classed("first",function(d,i){
						return i===0;
					})
					.attr("transform",function(d,i){
						return "translate("+xscale(d.i)+","+(-yscale(d.inversions))+")";
					});
				
		/*bars.append("rect")
				.attr("x",0)
				.attr("y",0)
				.attr("width",1)
				.attr("height",function(d){
					return yscale(d);
				})*/
		bars.append("line")
				.attr("x0",0)
				.attr("y0",0)
				.attr("x1",0)
				.attr("y1",function(d){
					return yscale(d.inversions);
				});
		/*bars.append("circle")
				.attr("cx",0)
				.attr("cy",0)
				.attr("r",1)
		*/
		var line = d3.svg.line()
			    .x(function(d,i) { return xscale(d.i); })
			    .y(function(d,i) { return -yscale(d.inversions); })
			    .interpolate("step-after");

		var area=d3.svg.area()
				.x(function(d,i) { return xscale(d.i); })
			    .y0(function(d,i){return 0;})
			    .y1(function(d,i) { return -yscale(d.inversions); })
			    .interpolate("step-after");

		chart
			.append("path")
			.attr("class","area")
			.attr("d",area(operations));

		chart
			.append("path")
			.attr("class","line")
			.attr("d",line(operations));

		

		var delta=steps.length/width;

		var xAxis = d3.svg.axis()
					    .scale(xscale)
					    .orient("bottom")
					    .tickFormat(d3.format(",.0f"))
					    .ticks(10)
					    //.tickFormat(function(d){
					    //	return d3.format(",.0f")(operations[d].i);
					    //})
					    //.tickValues([0,operations[operations.length-1].i])
					    /*
					    .tickValues(operations.filter(function(d){
							return d.t===1;
						}).map(function(d){
							return d.i;
						}));
						*/




		var xaxis=chart.append("g")
			    .attr("class", "xaxis")
			    .attr("transform", "translate(0," + 0 + ")");

		/*var w=width/steps.length;
		
		var ixd=chart.append("g")
				.attr("id","ixd")
				.attr("transform", "translate(0," + 0 + ")");

		ixd.selectAll("g")
			.data(operations.filter(function(d){
				return d.t===1;
			}))
			.enter()
			.append("g")
				.attr("class","hover")
				.attr("transform",function(d,i){
					return "translate("+xscale(d.i)+","+0+")";
				})
				.on("click",function(d){

				})
				.append("rect")
					.attr("x",-5)
					.attr("y",-height)
					.attr("width",2)
					.attr("height",height)
					.style({
						fill:"#ff0000"
					})*/

		chart.append("text")
					.attr("class","title")
					.attr("x",0)//-options.margins.left)//width/2)
					.attr("y",-yscale(items[0].length*(items[0].length-1)/2)-10)
					//.attr("dy","-0.4em")
					//.style("text-anchor","middle")
					.text("INVERSIONS");

		chart.append("text")
					.attr("class","title x")
					.attr("x",width/2)
					.attr("y",30)
					.text("OPERATIONS");

		var max_inversions=items[0].length*(items[0].length-1)/2,
			start_inversions=operations[0].inversions;

		var max_inversions_bar=xaxis.append("g")
				.datum(-yscale(max_inversions))
				.attr("class","inversions-bar")
					.attr("transform",function(d){
						return "translate("+0+","+d+")"
					});
		//alert(xscale(maxOperations)+" vs "+width)
		max_inversions_bar.append("line")
					.attr("x2",width)
					
		max_inversions_bar.append("text")
					.attr("x",-2)
					.attr("dy","0.4em")
					.text(((max_inversions/100>1)?"":"MAX ")+max_inversions);

		var starting_inversions_bar=xaxis.append("g")
				.datum(-yscale(start_inversions))
				.attr("class","inversions-bar")
					.attr("transform",function(d){
						return "translate("+0+","+d+")"
					});

		starting_inversions_bar.append("line")
					.attr("x2",width)

		starting_inversions_bar.append("text")
					.attr("x",-2)
					.attr("y",0)
					.attr("y",function(){
						var y=(yscale(start_inversions)),
							y_max=(yscale(max_inversions)),
							delta=0;

						if(y_max-y<15) {
							delta=10;//16;
						}

						return delta;
					})
					.attr("dy","0.4em")
					.text((start_inversions!=max_inversions && start_inversions>0)?start_inversions:"");

		
		var zero_inversions_bar=xaxis.append("g")
				.attr("class","inversions-bar")
					.attr("transform","translate("+0+","+(-yscale(0))+")");

		zero_inversions_bar.append("text")
					.attr("x",-2)
					.text(0);
		
		xaxis
			.call(xAxis)
			.selectAll(".tick")
			    .filter(function(d){
			    	//console.log("------->",d)
			    	return d%1 !== 0;
			    })
			    	.remove();
		    	//.classed("minor", true);

		var current=xaxis.append("g")
				.datum(0)
				.attr("class","current")
				.attr("transform", "translate(0," + 0 + ")");

		current
			.append("line")
				.attr("x0",0)
				.attr("x1",0)
				.attr("y0",0)
				.attr("y1",6);

		current
			.append("rect")
				.attr("x",-10)
				.attr("y",5)
				.attr("width",20)
				.attr("height",15)
				.attr("rx",3)
				.attr("ry",3)
				.attr("fill","#333")
				.attr("fill-opacity","0.75")

		current
			.append("text")
			.attr("y",16);
		
		function update() {


			bars.attr("transform",function(d,i){
				return "translate("+xscale(d.i)+","+(-yscale(d.inversions))+")";
			});
			
			chart.select("path.line")
				.attr("d",line(operations))

			chart.select("path.area")
				.attr("d",area(operations))
			
			xaxis
				.call(xAxis)

			current
				.attr("transform", function(d){
					if(d==0) {
						d={i:0};
					}
					return "translate("+xscale(d.i)+"," + 0 + ")"
				})
				.select("text")
					.text(function(d){
						return d3.format(",.0f")(d.i)
					})
		}

		this.updateScale=function(max_operations,max_inversions) {
			maxOperations=max_operations;

			//alert(maxOperations)

			xscale.domain([0,maxOperations]);
			update();
		}

		this.getInversions=function() {
			return d3.max(inversions);
		}

		this.getOperations=function() {
			return operations.length-1;
		}
		
		this.resize=function(__options) {

			options.width=__options.width;
			
			var width=options.width-options.margins.left-options.margins.right;

			svg.attr("width",options.width);

			xscale.rangeRound([0,width]);

			bars.attr("transform",function(d,i){
				return "translate("+xscale(d.i)+","+(-yscale(d.inversions))+")";
			});
			
			chart.select("path.line")
				.attr("d",line(operations))

			chart.select("path.area")
				.attr("d",area(operations))
			
			xaxis
				.call(xAxis)


			max_inversions_bar
				/*.attr("transform",function(d){
					return "translate("+width+","+d+")"
				})*/
				.select("line")
					.attr("x2",width)

			starting_inversions_bar
				/*.attr("transform",function(d){
					return "translate("+width+","+d+")"
				})*/
				.select("line")
					.attr("x2",width)

			chart.select("text.x")
					.attr("x",width/2);

			current
				.attr("transform", function(d){
					return "translate("+xscale(d.i)+"," + 0 + ")"
				})
				.select("text")
					.text(function(d){
						return d3.format(",.0f")(d.i)
					})
			
		};

		this.highlightStep=function(n) {
			
			chart.selectAll("g.bar.highlight")
				.classed("highlight",false);
			bars
				.classed("highlight",function(d,i){
					return i==n;
				})
			
			/*xaxis
				.selectAll(".tick.highlight")
				.classed("highlight",false);
			xaxis
				.selectAll(".tick")
				.classed("highlight",function(d){
					return d==n;
				})*/
			
			var step=operations.filter(function(d){
				return d.t===1 && d.s==n;
			})[0];
			

			current
				.datum(step)
				.attr("transform", function(d){
					return "translate("+xscale(d.i)+"," + 0 + ")"
				})
					.select("text")
					.text(function(d){
						return d3.format(",.0f")(d.i)
					})
			
		}

		//this.highlightStep(0);
	}

	return DistanceChart;
});