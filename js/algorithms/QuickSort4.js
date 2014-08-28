define(["../support"], function(support) {
	swap=support.swap;
	addStep=support.addStep;
	return {
		"name":"Quick Sort 3-way partition",
		"complexity":"O(n log n)",
		"wiki":"http://en.wikipedia.org/wiki/Quicksort",
	    "code":function() {
			var steps=[];
			var comparisons=[];
			var index=[];
			var cmp=0;




			

			function quicksort(A,lowIndex,highIndex) {
			    if (highIndex<=lowIndex) return;
			    
			    
			    var lt=lowIndex;
			    var gt=highIndex;
			    var i=lowIndex+1;
			    
			    var pivotIndex=lowIndex;
			    var pivotValue=A[pivotIndex];
			    
			    while (i<=gt){
			        
			        index.push([i,lt,gt]);

			    	comparisons.push({
	            		cmp:cmp,
	            		index:support.cloneArray(index)
	            	});

			        if(A[i].value<pivotValue.value) {
			            //swap(A, i++, lt++);
			            index=[];
			            swap(steps,A,i++,lt++,comparisons[comparisons.length-1]);
			        }
			        else if(pivotValue.value<A[i].value) {
			            //swap(A, i, gt--);
			            index=[];
			            swap(steps,A,i,gt--,comparisons[comparisons.length-1]);
			        }
			        else{
			            i++;
			        }
			        
			        cmp++
			    }
			    
			    quicksort(A, lowIndex, lt-1);
			    quicksort(A, gt+1, highIndex);
			    
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