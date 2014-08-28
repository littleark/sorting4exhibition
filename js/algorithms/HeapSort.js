define(["../support"], function(support) {
	swap=support.swap;
	addStep=support.addStep;
	return {
		"name":"Heapsort",
		"complexity":"O(n log n)",
		"wiki":"http://en.wikipedia.org/wiki/Heapsort",
	    "code":function() {
			var steps=[];
			var comparisons=[];
			var index=[];
			var cmp=0;
			var first=true;


			function heapsort(a) {
			    heapify(a);
			    var end=a.length-1;
			    while(end>0) {
			        //swap(a[end],a[0]);

			        steps.push([]);

			        index.push([-1,end,0,-1,-1,-1])
			        comparisons.push({
	            		cmp:cmp,
	            		index:support.cloneArray(index)
	            	});
	            	index=[];

			        swap(steps,a,end,0,comparisons[comparisons.length-1]);
			        end--;
			        siftDown(a,0,end);
			    }
			}

			function heapify(a) {
			    var start=Math.floor((a.length-2)/2);
			    while(start>=0) {
			    	index.push([start,a.length-1,-1,-1,-1,-1])
			        comparisons.push({
	            		cmp:cmp,
	            		index:support.cloneArray(index)
	            	});
			        siftDown(a,start,a.length-1);
			        start--;
			    }
			}

			function siftDown(a,start,end) {
			    var root=start;
			    
			    //steps.push([]);
			    
			    while((root*2+1)<=end) {
			        var child=root*2+1;
			        var __swap=root;

			        index.push([start,end,-1,root,__swap,child])

			        if(a[__swap].value<a[child].value) {
			            __swap=child;
			        }
			        if(child+1<=end && a[__swap].value<a[child+1].value) {
			            __swap=child+1;
			        }
			        if(__swap!=root) {

			        	
				        comparisons.push({
		            		cmp:cmp,
		            		index:support.cloneArray(index)
		            	});
		            	index=[];

			        	steps.push([]);

			        	swap(steps,a,root,__swap,comparisons[comparisons.length-1]);
			            //swap(a[root],a[__swap]);
			            root=__swap;
			        } else {
			            return
			        }
			    }
			}

			
			return function(array) {
				steps=[];
				heapsort(array,0,array.length-1);
				
				//console.log("IS ARRAY SORTED?",array.map(function(d){
				//	return d.value;
				//}))

				steps=steps.filter(function(d){
					return d.length>0;
				});

				//console.log("STEP vs COMPLEXITY",steps.map(function(d){
					//return d[0].cmp.cmp;
				//}))
				//console.log("COMPARISONS",(comparisons))
				//console.log("COMPLEXITY",comparisons[comparisons.length-1],steps[steps.length-1][0].cmp)

				return steps;
			}
		}
	}
});