/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       02 Nov 2017     Aazam Ali
 *
 */
/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function CreateBatchCustomerSanitization(type) {
    try {
    	var search = GetAllResult();
       
    		for (var int = 0; int < search.length; int++) {
    			CheckMetering();
				var result = search[int];  // Getting search result  
				var columns = search[int].getAllColumns(); 
				var firstName = result.getValue(columns[1]);
				var lastName = result.getValue(columns[2]);
              
              if (firstName != null){
                if (firstName.length<= 4) {
                    nlapiLogExecution('DEBUG', 'Number: ', '1'+"=="+int );
                    var firstNameResult = firstName.replace(firstName.substring(0, firstName.length), 'XXXXX');
                    nlapiLogExecution('DEBUG', 'After string operation: ', firstNameResult );
                    nlapiSubmitField(recType, recId, 'firstname', firstNameResult+int+firstName.substring(5, (firstName.length-1)));
                    nlapiLogExecution('DEBUG','String after processing', details);
                    nlapiLogExecution('DEBUG', 'Internal ID of customer record processed', int);
                } else {
                                      nlapiLogExecution('DEBUG', 'Number: ', '2'+"=="+int );
                    var firstNameResult = firstName.replace(firstName.substring(0, 4), 'XXXXX');
                    nlapiLogExecution('DEBUG', 'After string operation: ', firstNameResult );
                    nlapiSubmitField(recType, recId, 'firstname', firstNameResult+int+firstName.substring(5, (firstName.length-1)));
                    nlapiLogExecution('DEBUG','String after processing', details);
                    nlapiLogExecution('DEBUG', 'Internal ID of customer record processed', int);
                }
              
            }
              if (lastName != null ) {
              
                if (lastName != null && lastName.length <= 4 ) {
                                      nlapiLogExecution('DEBUG', 'Number: ', '3'+"=="+int );
                    var lastNameResult = lastName.replace(lastName.substring(0, lastName.length), 'YYYYY');
                    nlapiLogExecution('DEBUG', 'After string operation: ', lastNameResult );
                    var strLen = lasttName.length - 1 ;
                    nlapiSubmitField(recType, recId, 'firstname', lastNameResult+int+lastName.substring(5,strLen));
                    nlapiLogExecution('DEBUG','String after processing', details);
                    nlapiLogExecution('DEBUG', 'Internal ID of customer record processed', int);
                } else {
                                      nlapiLogExecution('DEBUG', 'Number: ', '4'+"=="+int );
                    var lastNameResult = lastName.replace(lastName.substring(0,4), 'YYYYY');
                    nlapiLogExecution('DEBUG', 'After string operation: ', lastNameResult );
                    var strLen = lasttName.length - 1 ;
                    //nlapiSubmitField(recType, recId, 'firstname', lastNameResult+int+lastName.substring(5,strLen));
                    nlapiSubmitField(recType, recId, 'firstname', lastNameResult+int+lastName.substring(5, strLen));
                    nlapiLogExecution('DEBUG','String after processing', details);
                    nlapiLogExecution('DEBUG', 'Internal ID of customer record processed', int);
                }
              }
            }
        // For Sales Order
            /*for (var int = 'firstrecord'; int < 'lastrecord'; int++) { // List the sales order in UI and get the first and last ID of sales order
                CheckMetering();
                var curRec = nlapiLoadRecord('salesorder', int);
                var billAddLine1 = curRec.getFieldText('billaddr1'); // Billing Address line 1
                var billAddLine2 = curRec.getFieldText('billaddr2');  // Billing Address Line 2`
                if (billAddLine != null &&  billAddLine1.length< 4) {
                    
                    var firstNameResult = firstName.replace(firstName.substring(0, firstName.length), 'XXXXX');
                    nlapiLogExecution('DEBUG', 'After string operation: ', firstNameResult );
                    nlapiSubmitField(recType, recId, 'firstname', firstNameResult+int+firstName.substring(5, (firstName.length-1)));
                    nlapiLogExecution('DEBUG','String after processing', details);
                    nlapiLogExecution('DEBUG', 'Internal ID of customer record processed', result.getId());
                } else {
                    var firstNameResult = firstName.replace(firstName.substring(0, 4), 'XXXXX');
                    nlapiLogExecution('DEBUG', 'After string operation: ', firstNameResult );
                    nlapiSubmitField(recType, recId, 'firstname', firstNameResult+int+firstName.substring(5, (firstName.length-1)));
                    nlapiLogExecution('DEBUG','String after processing', details);
                    nlapiLogExecution('DEBUG', 'Internal ID of customer record processed', result.getId());
                }
                
            }*/
            
        }
     catch (e) {
        nlapiLogExecution('DEBUG', 'Error: Customer Sanitization', e);
       
    }
    
        
}
function GetAllResult() {
    startTime = new Date();
    var search = nlapiLoadSearch(null, 'customsearchsanitisationcustomersearch'); // update with internal ID  
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
