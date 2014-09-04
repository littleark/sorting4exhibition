define(["d3","./support","./DistanceChart"],function(d3,support,DistanceChart) {
	
	

	function AlgorithmView(options){

		var OWIDTH=options.width,
			OHEIGHT=options.height,
			WIDTH=Math.floor(options.width/options.size_factor),
			HEIGHT=Math.floor(options.width/options.size_factor)*0.45;

		var name=options.name;

		var RADIUS={
			min:0,
			max:35
		};

		var margins={
			left:Math.ceil(RADIUS.max/options.size_factor+RADIUS.max/2),
			right:Math.ceil(RADIUS.max/options.size_factor+RADIUS.max/2),
			top:0,
			bottom:0
		};

		var self=this;
		var DURATION=500;
		var animating=false;
		var status=0;

		

		var steps=options.steps || [],
			current_steps=0,
			current_step=Math.round((steps.length)*options.step);

		//console.log("STEPS",name,steps)

		var callback=options.callback || function(){};

		var items=options.items || [];

		function setStatuses() {
			steps.forEach(function(substeps,i){

				//console.log("NOW SUBSTEP",substeps)
				//var new_items=support.cloneArray(items[items.length-1]);
				var new_items=items[items.length-1].map(function(item){
					var new_item={};
					new_item.value=item.value;
					new_item.id=item.id;
					new_item.tmp=null;//item.tmp;
					new_item.moved=false;
					return new_item;
				});
				


				//console.log("STEP",i,support.cloneArray(items[items.length-1]).map(function(e){return e.index||e.value}).toString());
				

				substeps.forEach(function(d){
					//console.log("INSIDE THE SUBSTEP")
					//console.log("SETTING",d.index,"from",d.from,"to",d.to)
					
					new_items[d.to]=d;//.index;
					new_items[d.to].value=new_items[d.to].index;
					//items[items.length-1][d.from].value=d.index+"X";
					//console.log("step",i,"putting element",d.id,"to",d.to,"full",d);

					for(var j=0;j<new_items.length;j++) {
						if(new_items[j].id==d.id && d.tmp && !new_items[j].tmp) {
							new_items[j].moved=true;
						}
					}
				});

				items.push(new_items);

			})
			steps=([[]]).concat(steps);
		}
		setStatuses();

		//console.log("ITEMS",items.length,"STEPS",steps.length);
		//console.log(items)
		//return;

		var xscale=d3.scale.linear().domain([0,items[0].length-1]).range([0,WIDTH-margins.left-margins.right]);
		
		

		var	code=options.code,
			container=options.container;

		

		var div=d3.select(container)
					.attr("class","algorithm i"+items[0].length)
					.classed("left",!!(!options.position))
					.classed("right",!!options.position)
					.style("width",WIDTH+"px")
					.classed("hidden",!options.items_visible)
					.append("div")
						.style("width",WIDTH+"px");

		

		var svg=div
				.append("svg")
					.attr("width",WIDTH)
					.attr("height",HEIGHT)
					//.append("g");

		var loading=div
				.append("div")
				.attr("class","loading");

		var distanceChart=new DistanceChart(items,{
			steps:steps,
			container:div,
			width:WIDTH,
			margins:margins,
			distance:options.distance,
			onclick:function(d){
				self.goTo(d);
			}
		});

		if(options.distanceCallback) {

			options.distanceCallback(distanceChart.getOperations(),distanceChart.getInversions());
		}

		//return;
		var to=null;

		var traces_container=svg.append("g")
						.attr("id","traces2")
						.attr("transform","translate("+margins.left+","+margins.top+")");
		
		var circles_container=svg.append("g")
							.attr("id","circles")
							.attr("transform","translate("+margins.left+","+margins.top+")");
		var circles=null;
		var traces=null;

		var temp_container=svg.append("g")
							.attr("id","temp")
							.attr("transform","translate("+margins.left+","+(margins.top+(HEIGHT/2))+")");

		var indicator_container=svg.append("g")
							.attr("id","indicators")
							.attr("transform","translate("+margins.left+","+(margins.top+(HEIGHT/2))+")");
		var circles=null;

		var max_value=d3.max(items[0],function(d){
			return d.value;
		});
		var value_extents=d3.extent(items[0],function(d){
			return d.value;
		})

		var color = d3.scale.linear()
	    				//.domain([0, items[0].length-1])
	    				.domain(value_extents)
						//.range(["hsl(42,95%,54%)", "hsl(202,100%,41%)"])
						//199,86%,53% blue
						//202,100%,41% blue2
						//333,100%,50% red
						//24,87%,50% orange
						//87,100%,50% limegreen
						.range(["hsl(0,0%,100%)", "hsl("+(support.colors[options.color])+")"])
						.interpolate(d3.interpolateLab);

		var radius=d3.scale.sqrt()
						.domain([0, max_value])
						.range([RADIUS.min, Math.ceil(RADIUS.max/options.size_factor)])

		var radius1=d3.scale.sqrt()
						//.domain([0,9])
						//.range([5,14])
						.domain([0, max_value])
						.range([RADIUS.min, Math.ceil(RADIUS.max/1.5)])


		

		
		var howto=d3.select("#howtoread")
						.selectAll("svg")
						.data(["legend"])
						.enter()
						.append("svg")
							.attr("id","legend")
							.attr("width",110)
							.attr("height",100)
							.append("g")
							.attr("transform","translate("+(radius1(10)+1)+",95)");

		howto.append("circle")
				.attr("cx",0)
				.attr("cy",-radius1(10))
				.attr("r",radius1(10))
				.style("fill",color(10))
		

		howto.append("circle")
				.attr("cx",0)
				.attr("cy",-radius1(5))
				.attr("r",radius1(5))
				.style("fill",color(5))

		
		howto.append("circle")
				.attr("cx",0)
				.attr("cy",-radius1(1))
				.attr("r",radius1(1))
				.style("fill",color(1))

		howto.append("text")
				.attr("x",radius1(10)+55)
				.attr("y",-radius1(10)*2-2)
				.text("last item")

		howto.append("text")
				.attr("x",radius1(10)+55)
				.attr("y",-radius1(5)*2-2)
				.text("mid item")

		howto.append("text")
				.attr("x",radius1(10)+55)
				.attr("y",-radius1(1)*2-2)
				.text("first item")

		howto.append("line")
				.attr("x1",0)
				.attr("y1",-radius1(10)*2)
				.attr("x2",radius1(10)+55)
				.attr("y2",-radius1(10)*2)

		howto.append("line")
				.attr("x1",0)
				.attr("y1",-radius1(5)*2)
				.attr("x2",radius1(10)+55)
				.attr("y2",-radius1(5)*2)

		howto.append("line")
				.attr("x1",0)
				.attr("y1",-radius1(1)*2)
				.attr("x2",radius1(10)+55)
				.attr("y2",-radius1(1)*2)
		

		function updateCircles() {

			circles=circles_container.selectAll("g.circle")
						.data(items[0],function(d,i){
							return d.id;
						});

			circles.exit().remove();
			
			var new_circles=circles.enter()
				.append("g")
						.attr("class","circle")
						.attr("transform",function(d,i){
							
							var x=xscale(i),
								y=HEIGHT/2;

							return "translate("+0+","+y+")";
						});


			new_circles.append("circle")
						.attr("cx",0)
						.attr("cy",0)
						.attr("r",function(d){
							return radius(d.value+1);
						})
						.style("fill",function(d){
							return color(d.value);
						})

			new_circles.append("text")
						.attr("x",0)
						.attr("y",function(d){
							return radius(d.value+1)+1;
						})
						.attr("dy","1em")
						.text(function(d){
							return d.value;
						})

			circles=circles_container.selectAll("g.circle");
			circles
				.attr("transform",function(d,i){
							
					var x=xscale(i),
						y=HEIGHT/2;

					return "translate("+x+","+y+")";
				})


		}
		
		var tmp_svg=document.createElement("svg");

		


		
		function updateTraces() {
				traces=traces_container
								.selectAll("g.step")
								.data(steps);

				traces.exit().remove();

				var new_traces=traces.enter()
									.append("g")
										.attr("class","step")
										/*
										.attr("rel",function(d,i){
											return "step_"+i;
										});
										*/

				new_traces.selectAll("path")
						.data(function(d){
							return d;
						})
						.enter()
							.append("path")
							

				traces=traces_container.selectAll("g.step");
				
				var total=traces.data().length,
					count=0,
					delta=100;
				
				d3.timer(function(_elapsed){
					//console.log("timer",_elapsed,count,total)
				//setTimeout(function(){
					traces
						.filter(function(d,i){
							return i>=count && i<=count+delta;
						})
						.selectAll("path")
							.attr("d",function(d,i){
								//console.log("adding",i,d);
							
								var	x1=xscale(d.from),
								   	x2=xscale(d.to),
								   	y=HEIGHT/2,
								   	c1x=x1+(x2-x1)/2,
								   	c1y=HEIGHT/2-(x2-x1)/2;
								//console.log(i,d)
								return "M"+x1+","+y+"Q"+c1x+","+c1y+","+x2+","+y;
								
							})
							.style("stroke",function(d){
								return color(d.index);
							})
							.attr("stroke-dashoffset",function(d){
								return d3.select(this).node().getTotalLength();
							})
							.attr("stroke-dasharray",function(d){
								var len=d3.select(this).node().getTotalLength();
								return len+" "+len;
							});
					count+=delta;
					if(count>=total) {
						var evt = new CustomEvent("ready"+name);
						document.dispatchEvent(evt);
					}
					return count>=total;
				})
				
		}

		function removeLoading() {
			loading.remove();
		}
		

		this.updateData=function(__steps,__items) {

			steps=__steps;
			items=__items;

			setStatuses();
			//console.log("ITEMS",items.length,"STEPS",steps.length);
			//console.log(items)

			xscale.domain([0,items[0].length-1]);
			//color.domain([0, items[0].length-1]);
			max_value=d3.max(items[0],function(d){
				return d.value;
			});
			radius.domain([0, max_value]);
			value_extents=d3.extent(items[0],function(d){
				return d.value;
			})
			color.domain(value_extents);
			//color.domain([0, max_value]);

			//slider.setSteps(steps.length);

			updateCircles();
			updateTraces();
			this.goTo(current_step)
			return;

		}
		this.updateDistances=function(distance) {
			//alert(name+"->"+distanceChart.getOperations()+"!="+distance.operations);
			//if(distanceChart.getOperations()!=distance.operations) {
				distanceChart.updateScale(distance.operations,distance.inversions);
			//}
		}
		this.getDistances=function() {
			return {
				operations:distanceChart.getOperations(),
				inversions:distanceChart.getInversions()
			}
		}
		this.getOperations=function() {
			return distanceChart.getOperations();
		}
		this.getItemsLength=function() {
			return items[0].length;
		}
		this.setColor=function(c) {
			

			var c=c||"blue";
			color.range(["hsl(0,0%,100%)", "hsl("+(support.colors[c])+")"]);

			traces
				.selectAll("path")
					.style("stroke",function(d){
						return color(d.index);
					});

			circles.selectAll("circle")
				.style("fill",function(d){
					//console.log(d,color(d.value))
					return color(d.value);
				});

		}
		this.resize=function(factor) {
			WIDTH=Math.floor(OWIDTH/factor);
			HEIGHT=Math.floor(OHEIGHT/factor);

			d3.select(container)
				.select("div")
					.style("width",WIDTH+"px")

			//slider.reflow();

			distanceChart.resize({
				width:WIDTH
			})

			svg
				.attr("width",WIDTH)
				.attr("height",HEIGHT)

			xscale.range([0,WIDTH-margins.left-margins.right]);

			traces.selectAll("path")
					.attr("d",function(d,i){
						//console.log("adding",i,d);
					
						var	x1=xscale(d.from),
						   	x2=xscale(d.to),
						   	y=HEIGHT/2,
						   	c1x=x1+(x2-x1)/2,
						   	c1y=HEIGHT/2-(x2-x1)/2;
						//console.log(i,d)
						return "M"+x1+","+y+"Q"+c1x+","+c1y+","+x2+","+y;
						
					})
					.attr("stroke-dashoffset",function(d){
						return d3.select(this).node().getTotalLength();
					})
					.attr("stroke-dasharray",function(d){
						var len=d3.select(this).node().getTotalLength();
						return len+" "+len;
					});
			traces
				.filter(function(d,i){
					return i<=current_step;
				})
				.selectAll("path")
					.attr("stroke-dashoffset",function(d){
						return 0;
					})
			
			radius.range([RADIUS.min, Math.ceil(RADIUS.max/factor)]);
			//console.log("items",items)
			circles
				//.transition()
				//.duration(1000)
				.attr("transform",function(d,i){
					
					//console.log("----------->",d,i)

					var pos=support.indexOf(items[current_step],d.id,"id"),
						x=xscale(d.position || pos),
						y=HEIGHT/2;

					//console.log(i,x,xscale.range(),xscale.domain())

					return "translate("+x+","+y+")";
				})
				.selectAll("circle")
					.attr("r",function(d){
						return radius(d.value+1);
					})

			circles
				.selectAll("text")
					.attr("y",function(d){
						return radius(d.value+1)+1;
					})

			indicator_container
				.attr("transform","translate("+margins.left+","+(margins.top+(HEIGHT/2))+")");
			indicator
				.attr("transform",function(d,i){
							
					var x=xscale(d),
						y=0;

					return "translate("+x+","+y+")";
				});

			temp_container.attr("transform","translate("+margins.left+","+(margins.top+(HEIGHT/2))+")");
			temp_indicator
					.attr("transform",function(d){

						//console.log("MOVING TEMP INDICATOR",d,"TO",xscale(d.pos))

						return "translate("+xscale(d.pos)+","+0+")";
					})
		}

		
		var indicator=indicator_container
							.selectAll("g.indicator")
							.data(steps.length>1?steps[1][0].cmp.index[0]:[{}],function(d,i){
								return i;
							})
							.enter()
							.append("g")
							.attr("class","indicator")
		indicator
			.attr("transform",function(d,i){
						
				var x=xscale(d),
					y=0;

				return "translate("+x+","+y+")";
			})
			.append("path")
				.attr("d","M0,0L3,-7L-3,-7,Z")
				.attr("transform",function(d,i){
					if(i>0) {
						return "rotate(0)translate(0,-5)";
					} else {
						return "rotate(0)translate(0,-5)";
					}
				})
				.style("fill",function(d,i){
					return "#ffffff";
					var colors=["#ffffff","#ff0000","#339933","#ffffff"];
					return colors[i];
				})
				.style({
					stroke:"none"
				})

		function slideIndicator(index,animate,back){
			//console.log("slide to",current_step,index,back)
			//var indexes=steps[current_step][0].cmp.index;

			//indicator_container.classed("hidden",current_step<steps.length-1);

			var indexes=(steps[current_step].length
							?
							steps[current_step][0].cmp.index
							:
							[d3.range(indicator.data().length).map(function(d){return -1})]
						);

			if(back) {
				index=indexes.length-1;
			}

			
			indicator
				.data(indexes[index],function(d,i){
					return i;
				})
				.classed("visible",function(d){
					return d>-1;
				})
				.transition()
				.duration(DURATION)
				.attr("transform",function(d,i){
					//console.log("index",index,"element",i,"go to",d)
					var x=xscale(d),
						y=0;
					return "translate("+x+","+y+")";
				})
				.each("end",function(d,i){
					if(i==indexes[index].length-1) {
						index++;

						if(index<indexes.length) {
							slideIndicator(index,animate,back);
						} else {
							self.swap(current_step,animate,back);
						}	
					}
				});
			
		}

		this.isSorted=function() {
			return current_step == steps.length-1;
		}

		var temp_indicator=temp_container.append("g");

		temp_indicator.append("circle")
				.attr("cx",0)
				.attr("cy",0)
				.attr("r",5);
		
		temp_indicator.append("text")
				.attr("x",0)
				.attr("y",0);
		

		function showTemp() {
			
			var tmp={
				value:0,
				pos:-1
			};
			if(steps[current_step][0]) {
				tmp=steps[current_step][0].tmp || tmp;
			}
			
			
			//console.log("###################");
			//console.log(tmp);//,current_step,steps)
			//console.log("###################");



			temp_indicator
				.datum(tmp)
				.classed("visible",(tmp.pos>-1))

			if(tmp.pos>-1) {
				temp_indicator
						.attr("transform","translate("+xscale(tmp.pos)+","+0+")")
			}

			var r=radius(tmp.value+1);
			
			temp_indicator
				.select("circle")
					//.attr("cy",0)
					.attr("r",r)
					//.transition()
					//	.duration(DURATION/2)
						.attr("cy",-r*3);
			
			temp_indicator
				.select("text")
					.attr("y",-r*4)
					.attr("dy","-1em")
					.text(tmp.value)

			//return;

			if(tmp.pos>-1) {
				circles
					.filter(function(d){
						//console.log("MEMORYYYYYYYY",d,tmp)
						return d.id==tmp.id;
						//return d.value==tmp.value || d.index==tmp.value;
					})
					.attr("transform","translate("+xscale(tmp.pos)+","+(HEIGHT/2)+")")
					.classed("memory",function(d){
						//console.log("-------->",d,tmp.value)
						return true;
					})
					
			} else {
				
				//console.log("tmp.pos",tmp.pos)
				circles
					.classed("memory",false)
					
			}
			
		}

		this.show=function(n,animate) {
			if(animating) {
				//console.log("already animating")
				return;
			}
			var n=(typeof n == "undefined")?steps.length-1:n;

			var back=0;
			if(current_step>n) {
				back=1;
			}

			
			
			if(n+back<=0 || n>steps.length-1){

				if(n>steps.length-1 && animate) {
					if(options.sortedCallback) {
						options.sortedCallback();
					}	
				}
				return;
			}

			animating=true;
			current_step=n;

			
			//console.log("CURRENT STEP",current_step,steps[current_step])

			
			showTemp();

			slideIndicator(0,animate,back);

		}

		this.swap=function(n,animate,back){

			var this_traces=traces
				.filter(function(d,i){
					return i==current_step+back;
				});

			this_traces
				.selectAll("path")
					.transition()
					.duration(DURATION)
					.attrTween("stroke-dashoffset",function(d,i){
						var len = this.getTotalLength();
						return function(t) {
							return back?(len-len*(1-t)):len*(1-t);
						}
					})

			//console.log("BACK IS ",back,steps[current_step+back])

			circles
				.data(steps[current_step+back].map(function(d){
					d.position=d.to;
					return d;
				}),function(d){
					return d.id;
				})
				.classed("swap",true)
				.transition()
				.duration(DURATION)
					.attrTween("transform",function(d){
						return function(t){
							//console.log("---->",d);
							
							var path=this_traces
								.selectAll("path")
								.filter(function(p){
									//console.log(";;;;;;",p)
									//return p.index==d;
									return p.id==d.id;
								})
								.node();

							//console.log("path",path)


							
							var len = path.getTotalLength();
							var p = path.getPointAtLength((back)?(len-len*t):(len*t));

							return "translate("+[(p.x),(back)?(HEIGHT/2 - (HEIGHT/2 - p.y)):p.y]+")"
							
						}
					})
					.each("end",function(d,i){
						d3.select(this).classed("swap",false)
						
						//options.step_callback(current_step);
						
						//slider.setStep(current_step+1);
						//self.setSlider(current_step+1);

						animating=false;

						indicator_container.classed("hidden",current_step==steps.length-1);
						
						distanceChart.highlightStep(current_step);

						if(i==steps[current_step+back].length-1 && animate) {
							//console.log("----")
							if(status) {
								self.stepNext(animate);	
							}
						} else {
							//console.log(current_step,d)
							//do nothing ciao
						}
					})
						

		}




		
		this.goToPerc=function(p,callback) {
			//console.log("goToPerc",p,Math.round((steps.length-1)*p));
			//this.goTo(slider_scale(p),callback);
			this.goTo(Math.round((steps.length-1)*p),callback)
		}
		/*
		this.setSlider=function(p) {
			//console.log("----->",name,p);
			slider.setStep(p,0);
		}
		*/
		this.toggleItems=function() {
			d3.select(container).classed("hidden",!d3.select(container).classed("hidden"));
		}
		function slideIndicatorGoTo(n,callback) {
			//console.log(n,steps[n],steps)

			var indexes=(steps[n].length
								?
								steps[n][0].cmp.index
								:
								[d3.range(indicator.data().length).map(function(d){return -1})]
							);

			//console.log("indexes",indexes);

			indicator
				.data(indexes[indexes.length-1],function(d,i){
					return i;
				})
				.classed("visible",function(d){
					return d>-1;
				})
				.transition()
				.duration(DURATION)
				.attr("transform",function(d,i){
					//console.log("index",index,"element",i,"go to",d)
					var x=xscale(d),
						y=0;
					return "translate("+x+","+y+")";
				})
			
			if(callback) {
				callback();
			}
			
		}
		this.goTo=function(n,callback) {
			if(animating) {
				return;
			}

			if(typeof n == "undefined") {
				n=steps.length-1;
			}

			if((current_step==0 && n<0)||(current_step==steps.length-1 && n>steps.length-1)) {
				return;
			}

			if(n<0){
				n=0;
			}

			if(n>steps.length-1){
				//console.log(n,">",steps.length-1)
				n=steps.length-1;
			}

			current_step=n;

			//console.log("GO TO STEP",steps[n]);
			//console.log("GO TO ITEMS",items[n]);

			slideIndicatorGoTo(current_step,function(){
				self.goTo2(n,callback);
			})

		}

		this.goTo2=function(n,callback) {
			if(animating) {
				return;
			}

			if(typeof n == "undefined") {
				n=steps.length-1;
			}



			if((current_step==0 && n<0)||(current_step==steps.length-1 && n>steps.length-1)) {
				return;
			}

			if(n<0){
				n=0;
			}
			if(n>steps.length-1){
				//console.log(n,">",steps.length-1)
				n=steps.length-1;
			}

			if(Math.abs(current_step-n)===1) {
				//this.show(n,callback);
				//return;
			}

			//animating=true;
			current_step=n;



			

			//options.step_callback(current_step);

			//if(slider.getStep()[0]-1!=current_step) {
				//self.setSlider(current_step+1);
			//}

			traces
				.selectAll("path")
					.attr("stroke-dashoffset",function(d){
						return d3.select(this).node().getTotalLength();
					})

			traces
				.filter(function(d,i){
					return i<=current_step;
				})
				.selectAll("path")
					.attr("stroke-dashoffset",function(d){
						return 0;//d3.select(this).node().getTotalLength();
					})
			//console.log("!!!!!!!!!!!",items,current_step)
			
			circles
				.data(items[current_step].filter(function(d){
					return d!=null;
				}),function(d,i){
					return d.id;
				})
				.classed("memory",false)
				.transition()
				.duration(DURATION)
				/*
				.attr("transform",function(d,i){
					var x=xscale(i),
						y=HEIGHT/2;
					//console.log("move",d,"to",i)
					return "translate("+x+","+y+")";
				})
				*/
				.attr("transform",function(d,i){
					
					//console.log("----------->",d,i)

					var pos=support.indexOf(items[current_step],d.id,"id"),
						x=xscale(pos),
						y=HEIGHT/2;/// + (d.moved?-20:0);

					//console.log(i,x,xscale.range(),xscale.domain())

					return "translate("+x+","+y+")";
				})
				.each("end",function(d,i){
					if(i==items[current_step].length-1) {
						//animating=false;

						distanceChart.highlightStep(current_step);

						indicator_container.classed("hidden",current_step==steps.length-1);

						if(callback) {
							callback();
						}
					}
				})

			showTemp();

		}

		

		this.stepNext=function(animate) {
			if(animating) {
				//console.log("already animating")
				return;
			}
			this.show(current_step+1,animate);
			
		}
		this.stepPrev=function() {
			if(animating) {
				//console.log("already animating")
				return;
			}
			this.show(current_step-1);
		}

		this.getCurrentStep=function() {
			return current_step;
		}
		this.getStepsLength=function() {
			return steps.length;
		}
		this.getSteps=function() {
			return steps;
		}


		this.start=function() {
			
			if(steps.length===1) {
				status=0;
				options.sortedCallback();
				return;
			}

			if(!status) {
				status=1;
				 
				if(current_step==steps.length-1) {
					this.goTo(0,function(){
						self.pause();
						self.start();
					})
				} else {
					this.stepNext(true);
				}
				
			} else {
				//console.log(name,"not starting because",status)
			}
		}
		this.pause=function() {
			if(status)
				status=0; //status=0 means it's not playing
		}
		this.getStatus=function() {
			return status;
		}
		this.isAnimating=function() {
			return animating;
		}
		this.getName=function() {
			return name;
		}

		;(function init(){
			updateCircles();
			updateTraces();

			document.addEventListener('ready'+name, function start(e) {
				removeLoading();
				if(current_step>0) {
					self.goTo(current_step,options.callback);
				} else {
					if(options.callback) {
						options.callback();
					}
				}
				document.removeEventListener("ready"+name,start)
			}, false);
			
		}());

	}

	return AlgorithmView;

});