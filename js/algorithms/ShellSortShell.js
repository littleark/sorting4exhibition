define(["../support"], function(support) {
	swap=support.swap;
	addStep=support.addStep;
	return {
		"name":"Shell Sort (Shell, 1959)",
		"complexity":"Shell, 1959",
		"wiki":"http://en.wikipedia.org/wiki/Shellsort",
	    "code":function() {
			var steps=[];
			var comparisons=[];
			var index=[];
			var cmp=0;

			

			function shellsort(a) {
				var n=a.length;
		        
				var gaps=(function(a){
					var n=a.length,
						k=1,
						g=null,
						gaps=[];
					
					while((g=Math.floor(n/Math.pow(2,k)))>=1) {
					    gaps.push(g);
					    k++;
					}

					return gaps;
				}(a));
				

		        //# Start with the largest gap and work down to a gap of 1 
				for(var g=0;g<gaps.length;g++) {
					var gap=gaps[g];
				    // Do a gapped insertion sort for this gap size.
				    // The first gap elements a[0..gap-1] are already in gapped order
				    // keep adding one more element until the entire array is gap sorted 
				    for (var i = gap; i < n; i += 1) {
				        // add a[i] to the elements that have been gap sorted
				        // save a[i] in temp and make a hole at position i
				        var temp = a[i];
				        // shift earlier gap-sorted elements up until the correct location for a[i] is found
				        for (var j = i; j >= gap && a[j - gap].value > temp.value; j -= gap) {

				        	index.push([i,j,j-gap]);
				        	steps.push([]);
			            	comparisons.push({
			            		cmp:cmp,
			            		index:support.cloneArray(index)
			            	});
			            	index=[];
			            	addStep(steps,a[j - gap],j - gap,j,comparisons[comparisons.length-1],{
			            		value:temp.value,
				        		pos:i,
				        		id:temp.id
			            	})

				            a[j] = a[j - gap]
				        }
				        //# put temp (the original a[i]) in its correct location

				        steps.push([]);
			            index.push([i,j,j-gap]);
		            	comparisons.push({
		            		cmp:cmp,
		            		index:support.cloneArray(index)
		            	});
		            	index=[];
			            addStep(steps,temp,i,j,comparisons[comparisons.length-1]);

				        a[j] = temp
				    }

				}
		        
		    }

			return function(array) {
				steps=[];
				shellsort(array);

				steps=steps.filter(function(d){
					return d.length>0;
				});
				console.log("SHELLSORT 3")
				array.forEach(function(d){
					console.log(d);
				})

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