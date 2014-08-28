define(["../support"], function(support) {
	swap=support.swap;
	addStep=support.addStep;
	return {
		"name":"Gnomesort",
		"complexity":"O(n&sup2;)",
		"wiki":"http://en.wikipedia.org/wiki/Gnome_sort",
	    "code":function() {
			var steps=[];
			var comparisons=[];
			var index=[];
 			var cmp=0;

			function gnomesort(array) {
			    var pos = 1;
			    index.push([pos,pos-1]);

			    while (pos < array.length) {
			    	if (array[pos].value>=array[pos - 1].value) {
			            pos++;
			        } else {

			        	comparisons.push({
		            		cmp:cmp,
		            		index:support.cloneArray(index)
		            	});
		            	index=[];

			            swap(steps,array,pos,pos-1,comparisons[comparisons.length-1]);

			            if (pos > 1) {
			                pos--;
			            }
			        }
			        index.push([pos,pos-1]);
			        cmp++;
			    }
			    return array;
			}

			return function(array) {
				steps=[];
				gnomesort(array);

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