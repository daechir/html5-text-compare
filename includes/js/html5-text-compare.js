/***********************************************
html5-text-compare.js
Diffing text in 150 lines or less.

Author: Daechir
Author URL: https://github.com/daechir
Modified Date: 07/02/20
Version: v1
***********************************************/

$(function(){	
	function ComparePad(a1,a2) {
		var arr1 = [];
		var ars1,ars2;
		
		for (var i = 0; i < a1.length; i++) {
			ars1 = a1[i].replace("/","\/");
			
			if (a2[i]) {
				ars2 = a2[i].replace("/","\/");
			}
			
			// First we check if the lines are similar or diff
			if(ars1.indexOf(ars2) !== -1) {
				if(ars1 === ars2) {
					arr1.push(a1[i]);
				} else {
					arr1.push(a2[i]);
				}
			} else {
				// Then we check if this line is present in the other array, else put a space
				if(a2.indexOf(ars1) !== -1) {
					arr1.push(a1[i]);
				} else { 
					arr1.push("			");
				}
			}
		}
		
		return arr1;
	}
	
	function CompareClean(a1) {
		for (var i = 0; i < a1.length; i++) {
			if (!a1[i]) {
				a1[i] = "			";
			}
		}
		
		return a1;
	}
	
	function Compare(a1,a2) {
		for (var i = 0; i < a1.length; i++) {
			if(a1[i] == a2[i]) {
				continue;
			} else {
				a1[i] = "<span class='right'>" + a1[i] + "</span>";
				a2[i] = "<span class='right'>" + a2[i] + "</span>";
			}
		}
			   
		return a1,a2;
	}
	
	function CompareOut(a1,a2,a3) {
		var compareoutleft = "<p>";
		var compareoutright = "<p>";
		
		for (var i = 0; i < a1.length; i++) {
			compareoutleft = compareoutleft + "<span class='left'>" + i + "</span>" + a1[i] + "\n";
		}
		
		for (var i = 0; i < a2.length; i++) {
			compareoutright = compareoutright + "<span class='left'>" + i + "</span>" + a2[i] + "\n";
		}
		
		compareoutleft = compareoutleft + "</p>";
		compareoutright = compareoutright + "</p>";
		
		a3.find("p").remove();
		
		a3.find("ul li").eq(0).append(compareoutleft);
		a3.find("ul li").eq(1).append(compareoutright);
		
		a3.find("span.left").addClass("number");
		a3.find("span.right").addClass("highlight");
		a3.find("p").animate({opacity: "100"}, 2000);
	}
	
	/* Global Variables */
	var formele = $("form");
	var compareleft,compareright;
	var comparedele = $("div");
	
	formele.submit(function(e){
		e.preventDefault();

		/* If textareas aren't empty execute */
		if (formele.find("textarea").val().length) {
			/* Next parse the textareas, put them into an array and split them into lines */
			compareleft = formele.find("textarea").eq(0).val().split("\n");
			compareright = formele.find("textarea").eq(1).val().split("\n");
						
			/* First passthrough, use the larger array as a baseline to regenerate the smaller 
			array to share its length */
			if (compareleft.length < compareright.length) {
				compareleft = ComparePad(compareright,compareleft);
			} else {
				compareright = ComparePad(compareleft,compareright);
			}
			
			/* Second passthrough, we must now sanitize empty lines, undefined or null values */
			compareleft = CompareClean(compareleft);
			compareright = CompareClean(compareright);
			
			/* Third passthrough, parse the array values for diff */
			Compare(compareleft,compareright);
			
			/* Fourth passthrough, output the results to DOM */
			CompareOut(compareleft,compareright,comparedele);
		}
	});
});