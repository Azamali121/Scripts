/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       19 Oct 2017     Aazam Ali
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function scheduled(type) {
	nlapiLogExecution('DEBUG', 'Starting.....','Started');
	var search = GetAllResult(); //  Calling the search function
	try {
		if (search!= null && search.length > 0) // process only if search has the data 
		{
			var limit = 5;
				for (var int = 0; int < limit; int++)  
				{ 
					var result = search[int];  // Getting search result  
					var columns = search[int].getAllColumns(); 
					var firstName = result.getValue(columns[1]);
					var lastName = result.getValue(columns[2]);
					nlapiLogExecution('DEBUG', 'First Name : ', firstName);
					nlapiLogExecution('DEBUG', 'Last Name : ', lastName);
					if (lastName) {
						lastName = lastName.trim();
						var lastNameArray = lastName.split(' ');
						if (lastNameArray != null && lastNameArray.length >= 2) {
							nlapiSubmitField(result.getRecordType(), result.getId(), 'firstname', lastNameArray[0]);
							nlapiSubmitField(result.getRecordType(), result.getId(), 'lastname', lastNameArray[1]);
							nlapiLogExecution('DEBUG', 'Internal ID of customer record processed', result.getId());
						}
						else{
							nlapiSubmitField(result.getRecordType(), result.getId(), 'firstname', '-');
							nlapiSubmitField(result.getRecordType(), result.getId(), 'lastname', lastName);
							nlapiLogExecution('DEBUG', 'Internal ID of customer record processed', result.getId());
						}
						
					}
					else if (firstName) {
						firstName = firstName.trim();
						var firstNameArray = firstName.split(' ');
						if (firstNameArray != null && firstNameArray.length >= 2 ) {
							nlapiSubmitField(result.getRecordType(), result.getId(), 'firstname', firstNameArray[0]);
							nlapiSubmitField(result.getRecordType(), result.getId(), 'lastname', firstNameArray[1]);
							nlapiLogExecution('DEBUG', 'Internal ID of customer record processed', result.getId());
						} else {
							nlapiSubmitField(result.getRecordType(), result.getId(), 'firstname', firstName);
							nlapiSubmitField(result.getRecordType(), result.getId(), 'lastname', '-');
							nlapiLogExecution('DEBUG', 'Internal ID of customer record processed', result.getId());
						}
						}
					else{
						nlapiLogExecution('DEBUG', 'First Name and Last Name are empty');
					}
				}
		}
		nlapiLogExecution('DEBUG', 'Ending.....','Ended');
	} catch (e) {
		// TODO: handle exception
		nlapiLogExecution('DEBUG', 'Error Script...',e);
		
	}

}

function GetAllResult() {
	startTime = new Date();
	var search = nlapiLoadSearch(null, 'customsearch_test_search'); // update with internal ID  
	var searchResults = search.runSearch();
	var final = [];

	if (searchResults != null) {
		var SearchfromIndex = 0;
		var SearchtoIndex = 1000;
		var resultSet;
		do {
			CheckMetering();
			// fetch one result set
			resultSet = searchResults.getResults(SearchfromIndex, SearchfromIndex + SearchtoIndex); //(0+1000),(1000+1000)......
			// increase pointer
			SearchfromIndex = SearchfromIndex + SearchtoIndex;
			for (var i = 0; i < resultSet.length; i++) {
				final.push(resultSet[i]);
			}
			// once no records are returned we already got all of them
		} while (resultSet.length > 0)
	}
	return final;
}
function CheckMetering() {
	var CTX = nlapiGetContext();
	var START_TIME = new Date().getTime();
	// want to try to only check metering every 15 seconds
	var remainingUsage = CTX.getRemainingUsage();
	var currentTime = new Date().getTime();
	var timeDifference = currentTime - START_TIME;
	// changing to 15 minutes, should cause little if any impact, but will make runaway scripts faster to kill
	if (remainingUsage < 800 || timeDifference > 900000) {
		START_TIME = new Date().getTime();
		var status = nlapiYieldScript();
		nlapiLogExecution('AUDIT', 'STATUS = ', JSON.stringify(status));
	}
}
