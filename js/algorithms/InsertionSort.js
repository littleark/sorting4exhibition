define(["../support"], function(support) {
	swap=support.swap;
	addStep=support.addStep;
	return {
		"name":"InsertionSort",
		"complexity":"O(n&sup2;)",
		"wiki":"http://en.wikipedia.org/wiki/Insertion_sort",
	    "code":function() {
			var steps=[];
			var comparisons=[];
			var index=[];
			var cmp=0;

			function insertionsort(a) {

				for(var j=1;j<a.length;j++) {
					var key=a[j];
					var i=j-1;
			        //console.log(j,key);
			        //console.log(key+"<"+a[i].index+" && "+i+">0");
					while(i>=0 && key.value<a[i].value) {
						cmp++;
						index.push([i,i+1]);
						comparisons.push({
		            		cmp:cmp,
		            		index:support.cloneArray(index)
		            	});
		            	//console.log("SWAAAAAAAAAAAAAAAAAAAAP");
		            	index=[];
						/*
						steps.push([]);
						addStep(steps,a[i+1],i+1,i);
						addStep(steps,a[i],i,i+1);

			            a=moveFromTo(i+1,i,a);
			            */
			            swap(steps,a,i,i+1,comparisons[comparisons.length-1])

						i--;
					}
				}
			    
			}

			function moveFromTo(from,to,a) {
			    var value=a[from],
			        tmp=a.slice(0,from).concat(a.slice(from+1,a.length));
			    return tmp.slice(0,to).concat([value],tmp.slice(to,a.length))
			}

			return function(array) {
				steps=[];
				insertionsort(array);
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