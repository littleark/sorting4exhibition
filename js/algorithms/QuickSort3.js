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




			

			function quicksort(A,lowIndex,highIndex) {
			    if(highIndex<=lowIndex) {
			        return;
			    }
			    
			    var partIndex=partition(A,lowIndex,highIndex);
			    
			    quicksort(A,lowIndex,partIndex-1);
			    quicksort(A,partIndex+1,highIndex);
			}
			function partition(A,lowIndex,highIndex) {
			    var i=lowIndex,
			        pivotIndex=lowIndex,
			        j=highIndex+1;
			    
			    

			    while(true) {

			    	

			        while(A[++i].value<A[pivotIndex].value) {

			        	

			        	index.push([i,j,pivotIndex]);
			            comparisons.push({
		            		cmp:cmp,
		            		index:support.cloneArray(index)
		            	});

		            	

			            cmp++;

			            if(i==highIndex) break;
			        }
			        while(A[pivotIndex].value<A[--j].value) {

			        	 

			        	index.push([i,j,pivotIndex]);
			        	comparisons.push({
		            		cmp:cmp,
		            		index:support.cloneArray(index)
		            	});

			           
			            cmp++

			            if(j==lowIndex) break;
			        }
			        if(i>=j) break;
			        
			        index.push([i,j,pivotIndex]);
			        
			        comparisons.push({
	            		cmp:cmp,
	            		index:support.cloneArray(index)
	            	});

			        //swap(A,i,j)
			        index=[];
			        swap(steps,A,i,j,comparisons[comparisons.length-1]);
			        cmp++;
			    }
			    
			    index.push([i,j,pivotIndex]);
			    comparisons.push({
            		cmp:cmp,
            		index:support.cloneArray(index)
            	});

			    //swap(A,pivotIndex,j)
			    index=[];
			    swap(steps,A,pivotIndex,j,comparisons[comparisons.length-1]);
			    
			    return j;
			}



			

			return function(array) {
				steps=[];
				
				quicksort(array,0,array.length-1);

				steps=steps.filter(function(d){
					return d.length>0;
				});

				//console.log("SWAPS",steps)
				//console.log("COMPARISONS",(comparisons))
				////console.log("COMPLEXITY",comparisons[comparisons.length-1],steps[steps.length-1][0].cmp)

				//console.log("STEP vs COMPLEXITY",steps.map(function(d){
					//return d[0].cmp.cmp;
				//}))

				return steps;
			}

		}
	}
});