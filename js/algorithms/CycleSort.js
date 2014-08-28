define(["../support"], function(support) {
	swap=support.swap;
	addStep=support.addStep;
	return {
		"name":"CycleSort",
		"complexity":"O(n&sup2;)",
		"wiki":"http://en.wikipedia.org/wiki/Cycle_sort",
	    "code":function() {
			var steps=[];
			var comparisons=[];
			var index=[];
			var cmp=0;

			function cyclesort(arrayToSort) {
		    	var writes = 0;
			    for (var cycleStart = 0; cycleStart < arrayToSort.length; cycleStart++) {

			        var item = arrayToSort[cycleStart];
			        var pos = cycleStart;

			        do {
			        	steps.push([]);
			            var to = 0;
			            for (var i = 0; i < arrayToSort.length; i++) {

			                if (i != cycleStart && (arrayToSort[i].value<item.value)) {
			                	index.push([cycleStart,to]);
			                    to++;
			                }
			                cmp++;
			            }
			            if (pos != to) {
			                while (pos != to && item.value==arrayToSort[to].value) {
			                	index.push([cycleStart,to]);
			                    to++;
			                }


			                
			                var temp = arrayToSort[to];

			                index.push([cycleStart,to]);
			                comparisons.push({
			            		cmp:cmp,
			            		index:support.cloneArray(index)
			            	});
			            	index=[];

			               	addStep(steps,item,cycleStart,to,comparisons[comparisons.length-1])
			                addStep(steps,temp,to,cycleStart,comparisons[comparisons.length-1])

			                arrayToSort[to] = item;
			                
			                item = temp;
			                

			                writes++;
			                pos = to;

			                

			            }
			            cmp++;
			        } while (cycleStart != pos);

			    }
		    	return arrayToSort;
			}

			

			return function(array) {
				steps=[];
				cyclesort(array);

				//console.log(array)

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