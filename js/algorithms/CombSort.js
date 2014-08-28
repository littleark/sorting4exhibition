define(["../support"], function(support) {
	swap=support.swap;
	addStep=support.addStep;
	return {
		"name":"Combsort",
		"complexity":"",
		"wiki":"http://en.wikipedia.org/wiki/Comb_sort",
	    "code":function() {
			var steps=[];
			var comparisons=[];
			var index=[];
			var cmp=0;

			function combsort(array) {
			    var gap = array.length;
			    var swaps = 0;

			    //just for tracking purpose, not part of the algorithm
			    gap = Math.floor(gap / 1.3);
		        if (gap < 1) {
		            gap = 1;
		        }
		        index.push([0,0+gap]);
		        //------------

			    do {
			        gap = Math.floor(gap / 1.3);
			        if (gap < 1) {
			            gap = 1;
			        }
			        var i = 0;
			        swaps = 0;

			        

			        do {

			            if(array[i].value > array[i+gap].value) {

			            	index.push([i,i+gap]);
							comparisons.push({
			            		cmp:cmp,
			            		index:support.cloneArray(index)
			            	});
			            	index=[];

			                swap(steps,array,i,i+gap,comparisons[comparisons.length-1]);
			                swaps = 1;
			            }

			            index.push([i,i+gap]);

			            i++;
			            cmp++;
			        } while (!(i + gap >= array.length));

			        cmp++;
			        index.push([i,i+gap]);
			        
			    } while (!(gap == 1 && swaps == 0));

			    return array;
			}


			return function(array) {
				steps=[];
				combsort(array);

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