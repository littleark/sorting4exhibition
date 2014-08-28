define(["../support"], function(support) {
	swap=support.swap;
	addStep=support.addStep;
	return {
		"name":"Quick Sort",
		"complexity":"O(n log n)",
		"wiki":"http://en.wikipedia.org/wiki/Quicksort",
	    "code":function() {
			var steps=[];
			var comparisons=[];
			var index=[];
			var cmp=0;

			//http://en.wikibooks.org/wiki/Algorithm_Implementation/Sorting/Quicksort
			//without in-line partition ==> function name: quick
			function quicksort(array, start, end){
				//steps.push([]);
			    if(start < end){
			    	

			        var l=start+1, r=end, p = array[start];
			        //index.push([start,end]);
			        while(l<r) {
			        	
			        	cmp++;
			        	index.push([l,start,r]);
			        	//console.log("p",p,"l",l,"r",r);

			            if(array[l].value <= p.value)
			                l++;
			            else if(array[r].value >= p.value)
			                r--;
			            else {
			            	comparisons.push({
			            		cmp:cmp,
			            		index:support.cloneArray(index)
			            	});
			            	//console.log("SWAAAAAAAAAAAAAAAAAAAAP");
			            	index=[];
			            	swap(steps,array,l,r,comparisons[comparisons.length-1]);
			            }

			            
			        }
			        index.push([l,start,r]);
			        if(array[l].value < p.value){
			        	comparisons.push({
		            		cmp:cmp,
		            		index:support.cloneArray(index)
		            	});
		            	//console.log("SWAAAAAAAAAAAAAAAAAAAAP");
		            	index=[];
			            swap(steps,array,l,start,comparisons[comparisons.length-1]);
			            l--;
			            index.push([l,start,r]);
			        } else{
			            l--;
			            index.push([l,start,r]);
			            comparisons.push({
		            		cmp:cmp,
		            		index:support.cloneArray(index)
		            	});
		            	//console.log("SWAAAAAAAAAAAAAAAAAAAAP");
		            	index=[];
			            swap(steps,array,l,start,comparisons[comparisons.length-1]);
			        }
			        

			        quicksort(array, start, l);
			        quicksort(array, r, end);
			    }
			}

			return function(array) {
				steps=[];
				
				quicksort(array,0,array.length-1);

				steps=steps.filter(function(d){
					return d.length>0;
				});

				//console.log("SWAPS",steps)
				//console.log("COMPARISONS",(comparisons))
				//console.log("COMPLEXITY",comparisons[comparisons.length-1],steps[steps.length-1][0].cmp)

				//console.log("STEP vs COMPLEXITY",steps.map(function(d){
					//return d[0].cmp.cmp;
				//}))

				return steps;
			}

		}
	}
});