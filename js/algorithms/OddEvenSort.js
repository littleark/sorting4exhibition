define(["../support"], function(support) {
	swap=support.swap;
	addStep=support.addStep;
	return {
		"name":"OddEvensort",
		"complexity":"O(n&sup2;)",
		"wiki":"http://en.wikipedia.org/wiki/Odd–even_sort",
	    "code":function() {
			var steps=[];
			var comparisons=[];
			var index=[];
 			var cmp=0;

			function oddevensort(array) {
			    var sorted = false;
			    while (!sorted) {
			        sorted = true;
			        for (var i = 1; i < array.length - 1; i += 2) {
			        	index.push([i,i+1]);
			            if(array[i].value>array[i+1].value) {

			            	

			            	comparisons.push({
			            		cmp:cmp,
			            		index:support.cloneArray(index)
			            	});
			            	index=[];

			                swap(steps,array,i,i+1,comparisons[comparisons.length-1]);
			                sorted = false;
			            }
			            cmp++;
			        }

			        for (var i = 0; i < array.length - 1; i += 2) {
			        	index.push([i,i+1]);
			            if(array[i].value>array[i+1].value) {
			            	

			            	comparisons.push({
			            		cmp:cmp,
			            		index:support.cloneArray(index)
			            	});
			            	index=[];

			                swap(steps,array,i,i+1,comparisons[comparisons.length-1]);
			                sorted = false;
			            }
			            cmp++;
			        }
			    }
			    return array;
			}

			return function(array) {
				steps=[];
				oddevensort(array);

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