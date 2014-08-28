define(["../support"], function(support) {
	swap=support.swap;
	addStep=support.addStep;
	return {
		"name":"Quicksort with Partition",
		"complexity":"O(n log n)",
		"wiki":"http://en.wikipedia.org/wiki/Quicksort",
	    "code":function() {
			var steps=[];
			var comparisons=[];
			var index=[];
			var cmp=0;

			function partition(array, begin, end, pivot) {
				//console.log(array.length,begin,end,pivot)
				var piv=array[pivot];

				index.push([begin,-1,end-1,pivot]);
				comparisons.push({
            		cmp:cmp,
            		index:support.cloneArray(index)
            	});
            	index=[];

				swap(steps,array,pivot, end-1 ,comparisons[comparisons.length-1]);


				var store=begin;
				var ix;
				for(ix=begin; ix<end-1; ++ix) {
					
					index.push([store,ix,end-1,pivot]);

					if(array[ix].value<=piv.value) {

						comparisons.push({
		            		cmp:cmp,
		            		index:support.cloneArray(index)
		            	});
		            	index=[];

						swap(steps,array,store, ix,comparisons[comparisons.length-1]);
						++store;
					}
					cmp++;
				}

				index.push([store,ix,end-1,pivot]);
				comparisons.push({
            		cmp:cmp,
            		index:support.cloneArray(index)
            	});
            	index=[];
				swap(steps,array,end-1, store,comparisons[comparisons.length-1]);

				return store;
			}
			function quicksort(array, begin, end) {
				if(end-1>begin) {
					var pivot=begin+Math.floor(Math.random()*(end-begin));

					pivot=partition(array, begin, end, pivot);

					quicksort(array, begin, pivot);
					quicksort(array, pivot+1, end);
				}
			}

			return function(array) {
				steps=[];
				quicksort(array,0,array.length);
				
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