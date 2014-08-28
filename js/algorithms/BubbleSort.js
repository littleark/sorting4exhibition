define(["../support"], function(support) {
	swap=support.swap;
	addStep=support.addStep;
	return {
		"name":"Bubble Sort",
		"complexity":"O(n&sup2;)",
		"wiki":"http://en.wikipedia.org/wiki/Bubble_sort",
	    "code":function() {
			var steps=[];
			var comparisons=[];
			var index=[];
 			var cmp=0;

			function bubblesort(array) {
			    var i, j;

			    var swapped = false;
			    for(i=1; i<array.length; i++) {
			      for(j=0; j<array.length - i; j++) {
			        index.push([j,j+1]);
			        if (array[j+1].value < array[j].value) {
			          comparisons.push({
						cmp:cmp,
						index:support.cloneArray(index)
					  });
					  index=[];
			          swap(steps,array,j,j+1,comparisons[comparisons.length-1]);
			          swapped=true;
			        }
			      }
			      if (!swapped) break;
			    }
			    return array;
			}

			


			return function(array) {
				steps=[];
				bubblesort(array);

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