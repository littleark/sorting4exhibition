define(["../support"], function(support) {
	swap=support.swap;
	addStep=support.addStep;
	return {
		"name":"Shell Sort",
		"complexity":"Ciura, 2001",
		"wiki":"http://en.wikipedia.org/wiki/Shellsort",
	    "code":function() {
			var steps=[];
			var comparisons=[];
			var index=[];
			var cmp=0;

			function shellsort(nums) {

			    var tempoSS = new Date();
			    var n = nums.length;
			    //console.log("n = ",n);

			    // HERE:
			    var h = Math.floor(n / 2);

			    

			    //console.log("h = ",h);
			    var c, j;

			    //gaps => Math.floor(n/(2**k)) --> original gaps by Shell 1959
			    //h=n/2, then gaps are h/2,h/4,h/8,h/16
			    //n=100 => 50,25,12,6,3,1,0

			    var gaps=[701, 301, 132, 57, 23, 10, 4, 1];

			    while (gaps.length) {
			        for (var i = h; i < n; i++) {

			        	

			            c = nums[i];
			            j = i;
			            while (j >= h && nums[j - h].value > c.value) {
			            	steps.push([]);
			            	cmp++;
			            	index.push([i,j,j-h]);
			            	comparisons.push({
			            		cmp:cmp,
			            		index:support.cloneArray(index)
			            	});
			            	index=[];
			            	addStep(steps,nums[j - h],j-h,j,comparisons[comparisons.length-1],{
			            		value:c.value,
				        		pos:i,
				        		id:c.id
			            	})


			                nums[j] = nums[j - h];
			                j = j - h;
			    			
			            }
			            nums[j] = c;

			            steps.push([]);
			            index.push([i,j,j-h]);
		            	comparisons.push({
		            		cmp:cmp,
		            		index:support.cloneArray(index)
		            	});
		            	index=[];
			            addStep(steps,c,i,j,comparisons[comparisons.length-1]);

			            cmp++;
			        }

			        // AND HERE:
			        //h = Math.floor(h / 2);
			        h=gaps.pop();
			    //console.log("h = ",h);
			    }
			}

			return function(array) {
				steps=[];
				shellsort(array);

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