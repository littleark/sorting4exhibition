define(["../support"], function(support) {
	swap=support.swap;
	addStep=support.addStep;
	return {
		"name":"RadixSort",
		"complexity":"Worst Case: O(kN)",
		"wiki":"http://en.wikipedia.org/wiki/Radix_sort",
	    "code":function() {
			var steps=[];
			var comparisons=[];
			var index=[];
			var cmp=0;
			
			// Figure out the number of binary digits we're dealing with
			
			function radixsort(a) {
				for (var div = 1, radix = 16; div < 65536 * 65536; div *= radix) {
				  var piles = [];

				  for (var i = 0; i < a.length; ++i) {
				    var p = Math.floor(a[i].value / div) % radix;
				    (piles[p] || (piles[p] = [])).push(a[i]);
				    index.push([i,-1,-1]);
				  }

				  //console.log(div,piles)
				  var tmpA=support.cloneArray(a);
				  for (var i = 0, ai = 0; i < piles.length; ++i) {
				    if (!piles[i]) continue;
				    

				    for (var pi = 0; pi < piles[i].length; ++pi) {

				    	var ii=support.indexOf(tmpA,piles[i][pi].id,"id");

				    	index.push([-1,ai,ii]);
				    	comparisons.push({
		            		cmp:cmp,
		            		index:support.cloneArray(index)
		            	});
				    	index=[];

				    	steps.push([]);
				    	
				    	//console.log("-------->",ii,tmpA)
				        addStep(steps,tmpA[ii],ii,ai,comparisons[comparisons.length-1])

				      	a[ai++] = piles[i][pi];
				    }

				    index.push([-1,-1,-1])
				  }
				}
				//console.log(a)
			}

			return function(array) {
				steps=[];
				radixsort(array);

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