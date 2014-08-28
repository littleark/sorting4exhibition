define(["../support"], function(support) {
	swap=support.swap;
	addStep=support.addStep;
	return {
		"name":"Merge sort (in-place)",
		"complexity":"O(n&sup2;)",
		"wiki":"http://en.wikipedia.org/wiki/Merge_sort",
	    "code":function() {
			var steps=[];
			var comparisons=[];
			var index=[];
			var cmp=0;
			var first=true;

			function mergeSort(a, low, high) {

			    var l = low;
			    var h = high;

			    //console.log(l,">=",h)

			    

			    if (l >= h) {
			        return a;
			    }

			    var mid = Math.floor((l + h) / 2);

			    var end_lo = mid;
			    var start_hi = mid + 1;
			    
			    if(first) {
			    	index.push([l,start_hi,-1,-1]);
			    	first=false;
			    }

			    mergeSort(a, l, mid);
			    mergeSort(a, mid + 1, h);



			    while ((l <= end_lo) && (start_hi <= h)) {
			    	//index.push([l,start_hi]);
			    	
		        	//console.log("p",p,"l",l,"r",r);

		        	

			        if (a[l].value<=a[start_hi].value) {
			            l++;
			        } else {
			            var temp = a[start_hi];
			            //steps.push([]);
			            for (var k = start_hi - 1; k >= l; k--) {
			            	

			            	index.push([l,start_hi,k,k+1]); //here the index k decrease until it goes on l, then it takes element l+1 and move it to k
			            	
			            	comparisons.push({
			            		cmp:cmp,
			            		index:support.cloneArray(index)
			            	});
							
			            	//console.log("SWAAAAAAAAAAAAAAAAAAAAP");
			            	index=[];
							
			            	steps.push([])
			            	
			            	//delete a[k].tmp;
			            	
			                addStep(steps,a[k],k,k+1,comparisons[comparisons.length-1],{
			                	value:temp.value,
				        		pos:start_hi,
				        		id:temp.id				        	
			                })
			                a[k + 1] = a[k];

			                cmp++;
			            }
			            index=[];

			            index.push([l,start_hi,-1,-1]);
				    	comparisons.push({
		            		cmp:cmp,
		            		index:support.cloneArray(index)
		            	});
			            index=[];
		            	//console.log("SWAAAAAAAAAAAAAAAAAAAAP");
			            steps.push([]);
			            addStep(steps,temp,start_hi,l,comparisons[comparisons.length-1])
			            a[l] = temp;

			            l++;
			            end_lo++;
			            start_hi++;

			           
			        }
			        cmp++;
			        index.push([l,start_hi,-1,-1]);
			    	/*
			    	comparisons.push({
	            		cmp:cmp,
	            		index:support.cloneArray(index)
	            	});
					*/
			        //index=[];
		        	
			    }
			    //index=[];
			    //console.log(a)
			    return a;
			}

			return function(array) {
				steps=[];
				mergeSort(array,0,array.length-1);

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