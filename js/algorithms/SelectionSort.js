define(["../support"], function(support) {
	swap=support.swap;
	addStep=support.addStep;
	return {
		"name":"SelectionSort",
		"complexity":"O(n&sup2;)",
		"wiki":"http://en.wikipedia.org/wiki/Selection_sort",
	    "code":function() {
			var steps=[];
			var comparisons=[];
			var index=[];
			var cmp=0;

			function selectionsort(nums) {

				var i;
				var iMin;
				/* advance the position through the entire array */
				/*   (could do j < n-1 because single element is also min element) */
				for(var j=0;j<nums.length-1;j++) {

					

					/* find the min element in the unsorted a[j .. n-1] */
					/* assume the min is the first element */
					iMin=j;
					/* test against elements after j to find the smallest */
					for(var i=j+1;i<nums.length;i++) {
						/* if this element is less, then it is the new minimum */
						if(nums[i].value < nums[iMin].value) {
							/* found new minimum; remember its index */
							iMin=i;
						}
						cmp++;
						index.push([j,i,iMin]);
					}
					/* iMin is the index of the minimum element. Swap it with the current position */
					if(iMin != j) {
						

						/*
						steps.push([]);

						var tmp=nums[iMin];

						addStep(steps,nums[j],j,iMin)
						addStep(steps,nums[iMin],iMin,j)
						
						nums[iMin]=nums[j];
						nums[j]=tmp;
						*/
						

						comparisons.push({
		            		cmp:cmp,
		            		index:support.cloneArray(index)
		            	});

						index=[];

						swap(steps,nums,j,iMin,comparisons[comparisons.length-1])

					}
				}
			}

			return function(array) {
				steps=[];
				selectionsort(array);

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