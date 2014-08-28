define(["../support"], function(support) {
	swap=support.swap;
	addStep=support.addStep;
	return {
		"name":"Cocktailsort",
		"complexity":"O(n&sup2;)",
		"wiki":"http://en.wikipedia.org/wiki/Cocktail_sort",
	    "code":function() {
			var steps=[];
			var comparisons=[];
			var index=[];
 			var cmp=0;

			function cocktailsort(array)  {
			    var limit = array.length;
			    var st = -1;
			    var swapped = false;
			    do {
			        swapped = false;
			        st++;
			        limit--;
			                
			        for (var j = st; j < limit; j++) {
			        	
			        	index.push([j,st,limit,j+1]);

			            if(array[j].value > array[j+1].value) {
			            	comparisons.push({
			            		cmp:cmp,
			            		index:support.cloneArray(index)
			            	});
			            	index=[];
			            	swap(steps,array,j,j+1,comparisons[comparisons.length-1]);
			            	swapped=true;
			            }
			            cmp++;
			        }

			        for (var j = limit - 1; j >= st; j--) {
			        	
			        	index.push([j,st,limit,j+1]);

			            if(array[j].value > array[j+1].value) {
			            	comparisons.push({
			            		cmp:cmp,
			            		index:support.cloneArray(index)
			            	});
			            	index=[];
			            	swap(steps,array,j,j+1,comparisons[comparisons.length-1]);
			            	swapped=true;
			            }
			            cmp++;
			        }
			        cmp++;
			    } while (st < limit && swapped);

			    return array;
			}


			


			return function(array) {
				steps=[];
				cocktailsort(array);

				//console.log("STEP vs COMPLEXITY",steps.map(function(d){
					//return d[0].cmp.cmp;
				//}))
				//console.log("COMPARISONS",(comparisons))
				//console.log("COMPLEXITY",comparisons[comparisons.length-1],steps[steps.length-1][0].cmp)
				return steps.filter(function(d){
					return d.length>0;
				});
			}

		}
	}
});