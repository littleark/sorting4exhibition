define(["../support"], function(support) {
	swap=support.swap;
	addStep=support.addStep;
	return {
		"name":"Mergesort",
		"complexity":"O(n log n)",
	    "code":function() {
			var steps=[];
			var comparisons=[];
			var index=[];
			var cmp=0;


			function mergeSort(list,low,high) {
				if(low<height) {
					var mid=Math.floor((low+high)/2);

					mergeSort(list,low,mid);
					mergeSort(list,mid+1,high);

					merge(list,low,high);

				}
			}

			function merge(list,low,high) {
				var temp=[];

				var mid=Math.floor((low+high)/2),
					i=0,
					j=0;


				while(i<)

				while i<lenA and j<lenB:
			        if A[i]<=B[j]:
			            C.append(A[i])
			            i=i+1
			        else:
			            c=c+len(A)-i #the maggic happens here
			            C.append(B[j])
			            j=j+1
			    if i==lenA:#A get to the end
			        C.extend(B[j:])
			    else:
			        C.extend(A[i:])
			    return C
			}

			/*
			function mergeSort(a, low, height) {

			    var l = low;
			    var h = height;

			    //console.log(l,">=",h)

			    if (l >= h) {
			    	
			        return a;
			    }

			    var mid = Math.floor((l + h) / 2);

			    
			    //console.log(l,mid);
			    //console.log(mid+1,h);
			    
			    //index.push([low,height]);

			    mergeSort(a, l, mid);
			    mergeSort(a, mid + 1, h);

			    var end_lo = mid;
			    var start_hi = mid + 1;

			    

			    while ((l <= end_lo) && (start_hi <= h)) {
			    	//index.push([l,start_hi]);
			    	
		        	//console.log("p",p,"l",l,"r",r);

		        	index.push([l,start_hi]);
			    	

			        if (a[l].value<a[start_hi].value) {
			            l++;
			        } else {
			            var temp = a[start_hi];
			            steps.push([]);
			            for (var k = start_hi - 1; k >= l; k--) {
			            	cmp++;
			            	index.push([l,k+1]);
			            	comparisons.push({
			            		cmp:cmp,
			            		index:support.cloneArray(index)
			            	});
			            	//console.log("SWAAAAAAAAAAAAAAAAAAAAP");
			            	//index=[];

			            	steps.push([])
			                addStep(steps,a[k],k,k+1,comparisons[comparisons.length-1])
			                a[k + 1] = a[k];


			            }
			            steps.push([]);
			            
			            comparisons.push({
		            		cmp:cmp,
		            		index:support.cloneArray(index)
		            	});
		            	//console.log("SWAAAAAAAAAAAAAAAAAAAAP");
			            addStep(steps,temp,start_hi,l,comparisons[comparisons.length-1])
			            a[l] = temp;

			            l++;
			            end_lo++;
			            start_hi++;

			           
			        }
			        cmp++;
			        index=[];
		        	
			    }
			    //console.log(a)
			    return a;
			}
			*/
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